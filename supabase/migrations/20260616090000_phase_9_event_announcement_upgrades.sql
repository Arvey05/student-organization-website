-- Add event scheduling, announcement media, and archive fields without
-- changing existing authentication or registration records.

alter table public.activities
  add column if not exists ends_at timestamptz,
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references public.profiles(id) on delete set null,
  add column if not exists archive_reason text;

alter table public.announcements
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists location text,
  add column if not exists image_url text,
  add column if not exists archived_at timestamptz,
  add column if not exists archived_by uuid references public.profiles(id) on delete set null;

do $$
begin
  alter table public.activities
    add constraint activities_ends_at_after_starts_at
    check (ends_at is null or ends_at >= starts_at);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.announcements
    add constraint announcements_ends_at_after_starts_at
    check (starts_at is null or ends_at is null or ends_at >= starts_at);
exception
  when duplicate_object then null;
end $$;

create index if not exists activities_visible_starts_at_idx
  on public.activities (starts_at)
  where archived_at is null;

create index if not exists announcements_visible_published_at_idx
  on public.announcements (published_at desc, created_at desc)
  where archived_at is null;

insert into storage.buckets (id, name, public)
values ('announcement-images', 'announcement-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view public announcements" on public.announcements;
create policy "Public can view public announcements"
on public.announcements
for select
to anon, authenticated
using (
  archived_at is null
  and (is_public = true or auth.role() = 'authenticated')
);

drop policy if exists "Public can view public activities" on public.activities;
create policy "Public can view public activities"
on public.activities
for select
to anon, authenticated
using (
  archived_at is null
  and (is_public = true or auth.role() = 'authenticated')
);

drop policy if exists "Public can view public storage assets" on storage.objects;
create policy "Public can view public storage assets"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id in (
    'profile-pictures',
    'organization-assets',
    'activity-images',
    'announcement-images'
  )
);

drop policy if exists "Officer roles can manage organization assets" on storage.objects;
create policy "Officer roles can manage organization assets"
on storage.objects
for all
to authenticated
using (
  bucket_id in ('organization-assets', 'activity-images', 'announcement-images')
  and public.is_event_creator(auth.uid())
)
with check (
  bucket_id in ('organization-assets', 'activity-images', 'announcement-images')
  and public.is_event_creator(auth.uid())
);
