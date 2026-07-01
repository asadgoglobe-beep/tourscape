-- ============================================================
-- CONTACT MESSAGES — stores enquiries from the public contact form
-- Public can insert (submit form); only admins can read/manage.
-- ============================================================

CREATE TYPE public.contact_status AS ENUM ('new', 'in_progress', 'closed');

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  tour_type TEXT,
  travel_dates TEXT,
  message TEXT,
  status public.contact_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit the contact form
CREATE POLICY "contact_public_insert" ON public.contact_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Only admins/editors can read submissions
CREATE POLICY "contact_admin_read" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

-- Only admins can update status / delete
CREATE POLICY "contact_admin_update" ON public.contact_messages
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "contact_admin_delete" ON public.contact_messages
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX contact_messages_created_idx ON public.contact_messages(created_at DESC);
CREATE INDEX contact_messages_status_idx ON public.contact_messages(status);
