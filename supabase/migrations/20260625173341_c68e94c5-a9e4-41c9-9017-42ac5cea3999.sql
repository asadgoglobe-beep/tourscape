
-- Lock down SECURITY DEFINER trigger functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role is used in RLS — keep executable by authenticated, revoke from anon
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Add validation constraints on bookings instead of leaving INSERT WITH CHECK (true) wide open
ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_guest_name_len CHECK (char_length(guest_name) BETWEEN 2 AND 120),
  ADD CONSTRAINT bookings_guest_email_fmt CHECK (guest_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND char_length(guest_email) <= 200),
  ADD CONSTRAINT bookings_guest_phone_len CHECK (char_length(guest_phone) BETWEEN 5 AND 40),
  ADD CONSTRAINT bookings_adults_range CHECK (adults BETWEEN 1 AND 30),
  ADD CONSTRAINT bookings_children_range CHECK (children BETWEEN 0 AND 30),
  ADD CONSTRAINT bookings_total_nonneg CHECK (total_amount >= 0),
  ADD CONSTRAINT bookings_notes_len CHECK (notes IS NULL OR char_length(notes) <= 2000);

-- Replace permissive public insert policy with a constrained version requiring a published tour
DROP POLICY IF EXISTS "bookings_public_insert" ON public.bookings;
CREATE POLICY "bookings_public_insert" ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.tours t WHERE t.id = tour_id AND t.is_published = true)
    AND booking_date >= CURRENT_DATE
    AND booking_date <= CURRENT_DATE + INTERVAL '2 years'
  );
