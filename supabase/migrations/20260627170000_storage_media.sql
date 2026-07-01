-- ============================================================================
-- Public "media" storage bucket for tour & blog image uploads.
-- Run once. Public read; only admins/editors can upload, replace or delete.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

-- Anyone can view media (images are shown on the public site)
drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

-- Admins & editors can upload
drop policy if exists "media admin insert" on storage.objects;
create policy "media admin insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'))
  );

-- Admins & editors can replace
drop policy if exists "media admin update" on storage.objects;
create policy "media admin update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'media'
    and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'))
  );

-- Admins & editors can delete
drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'media'
    and (public.has_role(auth.uid(), 'admin') or public.has_role(auth.uid(), 'editor'))
  );
