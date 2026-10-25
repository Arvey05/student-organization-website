-- The roster data is deliberately separate, in the ignored .private seed file.
-- Apply the role-enum migration first, in a separate committed transaction.
begin;

create table if not exists private.approved_executives (
  email text primary key check (email = lower(btrim(email)) and position('@' in email) > 1),
  full_name text not null,
  position text not null,
  role public.user_role not null check (role in ('core_executive', 'executive')),
  active boolean not null default true
);

alter table private.approved_executives enable row level security;
revoke all on private.approved_executives from public, anon, authenticated;

-- Only database-owned functions may read the private allowlist. Never use
-- editable profile/contact emails or user_metadata as authorization evidence.
create or replace function private.executive_role_for_user(target_user_id uuid)
returns public.user_role
language sql stable security definer set search_path = ''
as $$
  select coalesce((
    select roster.role
    from auth.users as account
    join private.approved_executives as roster
      on roster.email = lower(btrim(account.email))
    where account.id = target_user_id
      and roster.active
      and account.email_confirmed_at is not null
      -- Auto-confirmed signups have not proved inbox ownership. Requiring a
      -- completed email-confirmation cycle also fails closed in that setting.
      and account.confirmation_sent_at is not null
      and account.email_confirmed_at >= account.confirmation_sent_at
  ), 'member'::public.user_role);
$$;
revoke all on function private.executive_role_for_user(uuid) from public, anon, authenticated;

create or replace function public.executive_signup_is_allowed(signup_email text, requested_role text)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select requested_role in ('core_executive', 'executive') and exists (
    select 1 from private.approved_executives as roster
    where roster.email = lower(btrim(signup_email))
      and roster.role::text = requested_role
      and roster.active
  );
$$;
revoke all on function public.executive_signup_is_allowed(text, text) from public;
grant execute on function public.executive_signup_is_allowed(text, text) to anon, authenticated, service_role;

-- Protect direct Auth API signups as well as the application's server action.
create or replace function private.validate_executive_signup()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  requested text := coalesce(new.raw_user_meta_data ->> 'requested_role', 'member');
begin
  if requested not in ('member', 'core_executive', 'executive') then
    raise exception 'Invalid membership type.';
  end if;
  if requested <> 'member' and not public.executive_signup_is_allowed(new.email, requested) then
    raise exception 'Executive membership is not approved for this email and category.';
  end if;
  return new;
end;
$$;
revoke all on function private.validate_executive_signup() from public, anon, authenticated;
drop trigger if exists validate_executive_signup on auth.users;
create trigger validate_executive_signup before insert on auth.users
for each row execute function private.validate_executive_signup();

-- Every profile write receives the authoritative role, even when a client
-- attempts a direct REST insert/upsert/update with a forged role.
create or replace function private.assign_executive_profile_role()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  new.role := private.executive_role_for_user(new.id);
  return new;
end;
$$;
revoke all on function private.assign_executive_profile_role() from public, anon, authenticated;
drop trigger if exists assign_executive_profile_role on public.profiles;
create trigger assign_executive_profile_role before insert or update on public.profiles
for each row execute function private.assign_executive_profile_role();

-- Role assignment is now controlled above, while member status remains locked.
create or replace function public.prevent_regular_role_change()
returns trigger
language plpgsql security invoker set search_path = ''
as $$
begin
  if auth.uid() = new.id and old.member_status is distinct from new.member_status then
    raise exception 'Changing member status is not allowed through member profile updates.';
  end if;
  return new;
end;
$$;

drop policy if exists "Users can create their own profile" on public.profiles;
create policy "Users can create their own profile" on public.profiles
for insert to authenticated with check (auth.uid() = id);

-- Existing RLS policies already call this function for event mutations.
-- Match the caller, current roster, verification, and active profile each time.
create or replace function public.is_event_creator(user_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select user_id = auth.uid()
    and private.executive_role_for_user(user_id) in ('core_executive', 'executive')
    and exists (
      select 1 from public.profiles as profile
      where profile.id = user_id and profile.member_status = 'active'
    );
$$;
revoke all on function public.is_event_creator(uuid) from public, anon;
grant execute on function public.is_event_creator(uuid) to authenticated;

create or replace function private.sync_executive_profile_from_auth()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.profiles
  set role = private.executive_role_for_user(new.id)
  where id = new.id;
  return new;
end;
$$;
revoke all on function private.sync_executive_profile_from_auth() from public, anon, authenticated;
drop trigger if exists sync_executive_profile_from_auth on auth.users;
create trigger sync_executive_profile_from_auth
after update of email, email_confirmed_at, confirmation_sent_at on auth.users
for each row execute function private.sync_executive_profile_from_auth();

-- Removing or deactivating a roster entry revokes access immediately, including
-- for existing sessions. Auth email changes also drop the previous role.
create or replace function private.sync_executive_profiles_from_roster()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if tg_op <> 'INSERT' then
    update public.profiles as profile
    set role = private.executive_role_for_user(profile.id)
    from auth.users as account
    where profile.id = account.id and lower(btrim(account.email)) = old.email;
  end if;
  if tg_op <> 'DELETE' then
    update public.profiles as profile
    set role = private.executive_role_for_user(profile.id)
    from auth.users as account
    where profile.id = account.id and lower(btrim(account.email)) = new.email;
  end if;
  return null;
end;
$$;
revoke all on function private.sync_executive_profiles_from_roster() from public, anon, authenticated;
drop trigger if exists sync_executive_profiles_from_roster on private.approved_executives;
create trigger sync_executive_profiles_from_roster
after insert or update or delete on private.approved_executives
for each row execute function private.sync_executive_profiles_from_roster();

-- Remove legacy, manually assigned officer privileges. The private seed restores
-- the appropriate EB tier for roster members who have verified their email.
update public.profiles set role = private.executive_role_for_user(id);

commit;
