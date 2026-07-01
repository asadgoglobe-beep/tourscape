-- ============================================================
-- PAYMENTS + EMAIL QUEUE + ATOMIC BOOKING (availability lock)
-- ============================================================

-- ---------- payment + email status enums ----------
DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid', 'refunded', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.email_status AS ENUM ('queued', 'sent', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- extend bookings with payment columns ----------
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status public.payment_status NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'AED',
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS bookings_stripe_session_idx ON public.bookings(stripe_session_id);

-- ---------- email notification queue ----------
CREATE TABLE IF NOT EXISTS public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  kind TEXT NOT NULL,                      -- 'guest_confirmation' | 'admin_notification'
  subject TEXT NOT NULL,
  status public.email_status NOT NULL DEFAULT 'queued',
  error TEXT,
  attempts INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent_at TIMESTAMPTZ
);
GRANT SELECT ON public.email_notifications TO authenticated;
GRANT ALL ON public.email_notifications TO service_role;
ALTER TABLE public.email_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "email_admin_read" ON public.email_notifications;
CREATE POLICY "email_admin_read" ON public.email_notifications FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS email_notifications_status_idx ON public.email_notifications(status);
CREATE INDEX IF NOT EXISTS email_notifications_booking_idx ON public.email_notifications(booking_id);

-- ============================================================
-- ATOMIC BOOKING CREATION
-- Server-authoritative: recomputes price from the tours table,
-- locks the availability row (FOR UPDATE) to prevent overbooking,
-- and creates the availability row on the fly if absent.
-- SECURITY DEFINER so anon/authenticated can call it without
-- direct INSERT rights being abused for price tampering.
-- ============================================================
CREATE OR REPLACE FUNCTION public.create_booking(
  p_tour_id   UUID,
  p_guest_name  TEXT,
  p_guest_email TEXT,
  p_guest_phone TEXT,
  p_date      DATE,
  p_adults    INT,
  p_children  INT,
  p_notes     TEXT DEFAULT NULL,
  p_user_id   UUID DEFAULT NULL
) RETURNS public.bookings
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_tour    public.tours;
  v_avail   public.tour_availability;
  v_seats   INT;
  v_unit_adult NUMERIC(10,2);
  v_total   NUMERIC(10,2);
  v_booking public.bookings;
BEGIN
  -- ---- input validation ----
  IF p_guest_name IS NULL OR length(btrim(p_guest_name)) < 2 THEN
    RAISE EXCEPTION 'A valid guest name is required';
  END IF;
  IF p_guest_email IS NULL OR p_guest_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'A valid email address is required';
  END IF;
  IF p_guest_phone IS NULL OR length(btrim(p_guest_phone)) < 5 THEN
    RAISE EXCEPTION 'A valid phone number is required';
  END IF;
  IF p_adults IS NULL OR p_adults < 1 THEN
    RAISE EXCEPTION 'At least one adult is required';
  END IF;
  IF p_children IS NULL OR p_children < 0 THEN
    RAISE EXCEPTION 'Invalid number of children';
  END IF;
  IF p_adults + p_children > 40 THEN
    RAISE EXCEPTION 'For groups over 40 please contact us directly';
  END IF;
  IF p_date IS NULL OR p_date < current_date THEN
    RAISE EXCEPTION 'Booking date must be today or later';
  END IF;

  -- ---- tour must exist and be published ----
  SELECT * INTO v_tour FROM public.tours WHERE id = p_tour_id AND is_published = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'This tour is not available for booking';
  END IF;

  v_seats := p_adults + p_children;

  -- ---- ensure an availability row exists, then lock it ----
  INSERT INTO public.tour_availability (tour_id, date, slots_total, slots_booked)
    VALUES (p_tour_id, p_date, 20, 0)
    ON CONFLICT (tour_id, date) DO NOTHING;

  SELECT * INTO v_avail FROM public.tour_availability
    WHERE tour_id = p_tour_id AND date = p_date FOR UPDATE;

  IF v_avail.is_blocked THEN
    RAISE EXCEPTION 'This date is not available for this tour';
  END IF;
  IF v_avail.slots_booked + v_seats > v_avail.slots_total THEN
    RAISE EXCEPTION 'Only % seat(s) left on this date', GREATEST(v_avail.slots_total - v_avail.slots_booked, 0);
  END IF;

  -- ---- server-authoritative pricing (never trust the client) ----
  v_unit_adult := COALESCE(v_avail.price_override, v_tour.price_adult);
  v_total := p_adults * v_unit_adult + p_children * v_tour.price_child;

  -- ---- reserve the seats ----
  UPDATE public.tour_availability
    SET slots_booked = slots_booked + v_seats
    WHERE id = v_avail.id;

  -- ---- create the booking ----
  INSERT INTO public.bookings (
    tour_id, user_id, guest_name, guest_email, guest_phone,
    booking_date, adults, children, total_amount, currency, notes,
    status, payment_status
  ) VALUES (
    p_tour_id, p_user_id, btrim(p_guest_name), btrim(p_guest_email), btrim(p_guest_phone),
    p_date, p_adults, p_children, v_total, 'AED', NULLIF(btrim(COALESCE(p_notes, '')), ''),
    'pending', 'unpaid'
  ) RETURNING * INTO v_booking;

  RETURN v_booking;
END; $$;

REVOKE ALL ON FUNCTION public.create_booking(UUID, TEXT, TEXT, TEXT, DATE, INT, INT, TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_booking(UUID, TEXT, TEXT, TEXT, DATE, INT, INT, TEXT, UUID) TO anon, authenticated, service_role;

-- ============================================================
-- FREE SEATS when a booking is cancelled (admin path)
-- Decrements slots_booked safely (never below zero).
-- ============================================================
CREATE OR REPLACE FUNCTION public.release_booking_seats(p_booking_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_booking public.bookings;
  v_seats INT;
BEGIN
  SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
  IF NOT FOUND THEN RETURN; END IF;
  v_seats := v_booking.adults + v_booking.children;
  UPDATE public.tour_availability
    SET slots_booked = GREATEST(slots_booked - v_seats, 0)
    WHERE tour_id = v_booking.tour_id AND date = v_booking.booking_date;
END; $$;

REVOKE ALL ON FUNCTION public.release_booking_seats(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.release_booking_seats(UUID) TO authenticated, service_role;
