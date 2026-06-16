-- Initial schema and Row Level Security for the student organization website.
-- Apply this in the Supabase SQL editor or through the Supabase CLI.

create extension if not exists pgcrypto;

create schema if not exists private;

do $$
begin
  create type public.user_role as enum (
    'member',
    'officer',
    'president',
    'vp_internal_affairs',
    'vp_external_affairs'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.member_status as enum ('active', 'inactive');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.activity_status as enum ('upcoming', 'completed', 'past');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.registration_status as enum (
    'registered',
    'pre_registered',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.user_role not null default 'member',
  member_status public.member_status not null default 'active',
  msc_id_code text,
  school_id_code text,
  first_name text,
  middle_name text,
  last_name text,
  extension text,
  college text,
  program text,
  major text,
  year_level text,
  section text,
  username text unique,
  date_of_birth date,
  address text,
  social_media_url text,
  personal_email text,
  bulsu_email text,
  gender text,
  phone text,
  profile_picture_url text,
  guardian_name text,
  guardian_relationship text,
  guardian_phone text,
  guardian_address text,
  member_since timestamptz default now(),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_public boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  starts_at timestamptz not null,
  short_description text not null,
  location text not null,
  status public.activity_status not null default 'upcoming',
  is_public boolean not null default true,
  image_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity_registrations (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status public.registration_status not null default 'registered',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (activity_id, user_id)
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  description text,
  location text,
  is_public boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  website_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.officers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  position text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, position)
);

create table if not exists public.committees (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    personal_email,
    role,
    member_status
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    new.email,
    'member',
    'active'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_regular_role_change()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if auth.uid() = new.id and old.role is distinct from new.role then
    raise exception 'Changing member roles is not allowed through member profile updates.';
  end if;

  if auth.uid() = new.id and old.member_status is distinct from new.member_status then
    raise exception 'Changing member status is not allowed through member profile updates.';
  end if;

  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists prevent_regular_profile_role_change on public.profiles;
create trigger prevent_regular_profile_role_change
before update on public.profiles
for each row execute function public.prevent_regular_role_change();

drop trigger if exists set_announcements_updated_at on public.announcements;
create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
before update on public.activities
for each row execute function public.set_updated_at();

drop trigger if exists set_activity_registrations_updated_at on public.activity_registrations;
create trigger set_activity_registrations_updated_at
before update on public.activity_registrations
for each row execute function public.set_updated_at();

drop trigger if exists set_calendar_events_updated_at on public.calendar_events;
create trigger set_calendar_events_updated_at
before update on public.calendar_events
for each row execute function public.set_updated_at();

drop trigger if exists set_partners_updated_at on public.partners;
create trigger set_partners_updated_at
before update on public.partners
for each row execute function public.set_updated_at();

drop trigger if exists set_officers_updated_at on public.officers;
create trigger set_officers_updated_at
before update on public.officers
for each row execute function public.set_updated_at();

drop trigger if exists set_committees_updated_at on public.committees;
create trigger set_committees_updated_at
before update on public.committees
for each row execute function public.set_updated_at();

create or replace function public.is_event_creator(user_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in (
        'president',
        'vp_internal_affairs',
        'vp_external_affairs'
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.announcements enable row level security;
alter table public.activities enable row level security;
alter table public.activity_registrations enable row level security;
alter table public.calendar_events enable row level security;
alter table public.partners enable row level security;
alter table public.officers enable row level security;
alter table public.committees enable row level security;
alter table public.event_logs enable row level security;

grant usage on schema public to anon, authenticated;
grant select on
  public.announcements,
  public.activities,
  public.calendar_events,
  public.partners,
  public.officers,
  public.committees
to anon;
grant select, insert, update on
  public.profiles,
  public.announcements,
  public.activities,
  public.activity_registrations,
  public.calendar_events,
  public.partners,
  public.officers,
  public.committees,
  public.event_logs
to authenticated;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id and role = 'member');

drop policy if exists "Users can update their own non-role profile" on public.profiles;
create policy "Users can update their own non-role profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Public can view public announcements" on public.announcements;
create policy "Public can view public announcements"
on public.announcements
for select
to anon, authenticated
using (is_public = true or auth.role() = 'authenticated');

drop policy if exists "Event creators can manage announcements" on public.announcements;
create policy "Event creators can manage announcements"
on public.announcements
for all
to authenticated
using (public.is_event_creator(auth.uid()))
with check (public.is_event_creator(auth.uid()));

drop policy if exists "Public can view public activities" on public.activities;
create policy "Public can view public activities"
on public.activities
for select
to anon, authenticated
using (is_public = true or auth.role() = 'authenticated');

drop policy if exists "Officer roles can create activities" on public.activities;
create policy "Officer roles can create activities"
on public.activities
for insert
to authenticated
with check (
  public.is_event_creator(auth.uid())
  and created_by = auth.uid()
);

drop policy if exists "Officer roles can update their activities" on public.activities;
create policy "Officer roles can update their activities"
on public.activities
for update
to authenticated
using (public.is_event_creator(auth.uid()))
with check (public.is_event_creator(auth.uid()));

drop policy if exists "Users can view their own activity registrations" on public.activity_registrations;
create policy "Users can view their own activity registrations"
on public.activity_registrations
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can create their own activity registrations" on public.activity_registrations;
create policy "Users can create their own activity registrations"
on public.activity_registrations
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update their own activity registrations" on public.activity_registrations;
create policy "Users can update their own activity registrations"
on public.activity_registrations
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Authenticated users can view calendar events" on public.calendar_events;
create policy "Authenticated users can view calendar events"
on public.calendar_events
for select
to authenticated
using (true);

drop policy if exists "Public can view public calendar events" on public.calendar_events;
create policy "Public can view public calendar events"
on public.calendar_events
for select
to anon
using (is_public = true);

drop policy if exists "Officer roles can manage calendar events" on public.calendar_events;
create policy "Officer roles can manage calendar events"
on public.calendar_events
for all
to authenticated
using (public.is_event_creator(auth.uid()))
with check (public.is_event_creator(auth.uid()));

drop policy if exists "Public can view public partners" on public.partners;
create policy "Public can view public partners"
on public.partners
for select
to anon, authenticated
using (is_public = true or auth.role() = 'authenticated');

drop policy if exists "Officer roles can manage partners" on public.partners;
create policy "Officer roles can manage partners"
on public.partners
for all
to authenticated
using (public.is_event_creator(auth.uid()))
with check (public.is_event_creator(auth.uid()));

drop policy if exists "Public can view officers" on public.officers;
create policy "Public can view officers"
on public.officers
for select
to anon, authenticated
using (true);

drop policy if exists "Officer roles can manage officers" on public.officers;
create policy "Officer roles can manage officers"
on public.officers
for all
to authenticated
using (public.is_event_creator(auth.uid()))
with check (public.is_event_creator(auth.uid()));

drop policy if exists "Public can view committees" on public.committees;
create policy "Public can view committees"
on public.committees
for select
to anon, authenticated
using (true);

drop policy if exists "Officer roles can manage committees" on public.committees;
create policy "Officer roles can manage committees"
on public.committees
for all
to authenticated
using (public.is_event_creator(auth.uid()))
with check (public.is_event_creator(auth.uid()));

drop policy if exists "Officer roles can view event logs" on public.event_logs;
create policy "Officer roles can view event logs"
on public.event_logs
for select
to authenticated
using (public.is_event_creator(auth.uid()));

drop policy if exists "Officer roles can create event logs" on public.event_logs;
create policy "Officer roles can create event logs"
on public.event_logs
for insert
to authenticated
with check (
  public.is_event_creator(auth.uid())
  and actor_id = auth.uid()
);

insert into storage.buckets (id, name, public)
values
  ('profile-pictures', 'profile-pictures', true),
  ('organization-assets', 'organization-assets', true),
  ('activity-images', 'activity-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view public storage assets" on storage.objects;
create policy "Public can view public storage assets"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id in (
    'profile-pictures',
    'organization-assets',
    'activity-images'
  )
);

drop policy if exists "Users can upload their own profile picture" on storage.objects;
create policy "Users can upload their own profile picture"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-pictures'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can update their own profile picture" on storage.objects;
create policy "Users can update their own profile picture"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-pictures'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-pictures'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Officer roles can manage organization assets" on storage.objects;
create policy "Officer roles can manage organization assets"
on storage.objects
for all
to authenticated
using (
  bucket_id in ('organization-assets', 'activity-images')
  and public.is_event_creator(auth.uid())
)
with check (
  bucket_id in ('organization-assets', 'activity-images')
  and public.is_event_creator(auth.uid())
);
