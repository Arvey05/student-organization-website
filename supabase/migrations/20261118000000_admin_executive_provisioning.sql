-- Administrator-managed Executive Board provisioning.
--
-- Prerequisites, applied earlier and committed:
--   20261025000000_add_executive_roles.sql
--   20261025000100_executive_roster_access.sql
--
-- Executive access is still derived from exactly two facts: an active entry in
-- private.approved_executives and a completed email-verification cycle on the
-- matching Auth account. Members no longer pick a membership type when they sign
-- up. Instead, a site administrator adds the roster entry from the admin
-- dashboard, and the person's role follows as soon as their login email is
-- verified (the triggers from the roster migration keep profiles.role in sync).
--
-- Site administrators are a separate, deliberately small allowlist. They are not
-- derived from the Executive Board roster, so approving executives never
-- implies the power to approve more executives.
--
-- Bootstrap the first administrator once, from the SQL Editor, with a real
-- address. Never commit real addresses to Git:
--
--   insert into private.site_administrators (email, note)
--   values ('maintainer@example.com', 'Website maintainer')
--   on conflict (email) do update set active = true;
--
-- Every function below is SECURITY DEFINER with an empty search_path and checks
-- the caller itself, because the underlying tables are private and a definer
-- function is callable by every authenticated user by default.
begin;

-- A single definition of "this Auth account has proven inbox ownership". An
-- auto-confirmed signup has no completed confirmation cycle and fails closed.
create or replace function private.account_email_verified(target_user_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as account
    where account.id = target_user_id
      and account.email_confirmed_at is not null
      and account.confirmation_sent_at is not null
      and account.email_confirmed_at >= account.confirmation_sent_at
  );
$$;
revoke all on function private.account_email_verified(uuid) from public, anon, authenticated;

-- Same behavior as the original definition, now sharing the predicate above.
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
      and private.account_email_verified(account.id)
  ), 'member'::public.user_role);
$$;
revoke all on function private.executive_role_for_user(uuid) from public, anon, authenticated;

alter table private.approved_executives
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists updated_by uuid references auth.users(id) on delete set null;

create table if not exists private.site_administrators (
  email text primary key check (email = lower(btrim(email)) and position('@' in email) > 1),
  note text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table private.site_administrators enable row level security;
revoke all on private.site_administrators from public, anon, authenticated;

-- Roster changes are recorded here rather than in public.event_logs, which every
-- event creator can read and which must not expose the private roster.
create table if not exists private.executive_provisioning_audit (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  action text not null check (action in ('added', 'updated', 'activated', 'deactivated', 'removed')),
  target_email text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists executive_provisioning_audit_created_at_idx
  on private.executive_provisioning_audit (created_at desc);
alter table private.executive_provisioning_audit enable row level security;
revoke all on private.executive_provisioning_audit from public, anon, authenticated;

create or replace function private.is_site_admin(target_user_id uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as account
    join private.site_administrators as site_admin
      on site_admin.email = lower(btrim(account.email))
    where account.id = target_user_id
      and site_admin.active
      and private.account_email_verified(account.id)
      and exists (
        select 1 from public.profiles as profile
        where profile.id = account.id and profile.member_status = 'active'
      )
  );
$$;
revoke all on function private.is_site_admin(uuid) from public, anon, authenticated;

-- Returns the caller's id, or raises insufficient_privilege. Every admin_*
-- function starts with this call.
create or replace function private.require_site_admin()
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
begin
  if v_actor is null or not private.is_site_admin(v_actor) then
    raise exception 'Administrator access is required.' using errcode = '42501';
  end if;
  return v_actor;
end;
$$;
revoke all on function private.require_site_admin() from public, anon, authenticated;

create or replace function public.is_site_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and private.is_site_admin(auth.uid());
$$;
revoke all on function public.is_site_admin() from public, anon, authenticated;
grant execute on function public.is_site_admin() to authenticated;

-- Normalizes and validates one roster entry. Only email, full_name, position and
-- role of the returned row are meaningful. The application validates the same
-- rules for friendlier messages; this is the authoritative copy.
create or replace function private.validate_roster_entry(
  p_email text,
  p_full_name text,
  p_position text,
  p_role text
)
returns private.approved_executives
language plpgsql set search_path = ''
as $$
declare
  v_entry private.approved_executives;
begin
  v_entry.email := lower(btrim(coalesce(p_email, '')));
  v_entry.full_name := regexp_replace(btrim(coalesce(p_full_name, '')), '\s+', ' ', 'g');
  v_entry."position" := regexp_replace(btrim(coalesce(p_position, '')), '\s+', ' ', 'g');

  if char_length(v_entry.email) > 254 or v_entry.email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'Enter a valid login email address.' using errcode = '22023';
  end if;
  if char_length(v_entry.full_name) not between 1 and 120 then
    raise exception 'Enter the full name (up to 120 characters).' using errcode = '22023';
  end if;
  if char_length(v_entry."position") not between 1 and 120 then
    raise exception 'Enter the Executive Board position (up to 120 characters).' using errcode = '22023';
  end if;
  if p_role is null or p_role not in ('core_executive', 'executive') then
    raise exception 'Choose either core executive or executive.' using errcode = '22023';
  end if;
  v_entry.role := p_role::public.user_role;

  return v_entry;
end;
$$;
revoke all on function private.validate_roster_entry(text, text, text, text) from public, anon, authenticated;

create or replace function private.record_provisioning_event(
  p_actor uuid,
  p_action text,
  p_target_email text,
  p_details jsonb default '{}'::jsonb
)
returns void
language sql security definer set search_path = ''
as $$
  insert into private.executive_provisioning_audit (actor_id, actor_email, action, target_email, details)
  values (
    p_actor,
    (select lower(btrim(account.email)) from auth.users as account where account.id = p_actor),
    p_action,
    p_target_email,
    coalesce(p_details, '{}'::jsonb)
  );
$$;
revoke all on function private.record_provisioning_event(uuid, text, text, jsonb) from public, anon, authenticated;

-- Roster with the state of each person's account. account_status is
-- 'no_account' (has not signed up yet), 'awaiting_verification' (signed up but
-- the login email is unverified), or 'verified'. has_access is true only when
-- the person can currently create events.
create or replace function public.admin_list_executives()
returns table (
  email text,
  full_name text,
  "position" text,
  role public.user_role,
  active boolean,
  account_status text,
  has_access boolean,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql security definer set search_path = ''
as $$
begin
  perform private.require_site_admin();

  -- user_role declares core_executive before executive, so ordering by the enum
  -- lists the core tier first.
  return query
  select
    roster.email,
    roster.full_name,
    roster."position",
    roster.role,
    roster.active,
    case
      when account.id is null then 'no_account'
      when private.account_email_verified(account.id) then 'verified'
      else 'awaiting_verification'
    end,
    coalesce(
      account.id is not null
        and private.executive_role_for_user(account.id) in ('core_executive', 'executive')
        and exists (
          select 1 from public.profiles as profile
          where profile.id = account.id and profile.member_status = 'active'
        ),
      false
    ),
    roster.created_at,
    roster.updated_at
  from private.approved_executives as roster
  left join lateral (
    select candidate.id
    from auth.users as candidate
    where lower(btrim(candidate.email)) = roster.email
    order by candidate.id
    limit 1
  ) as account on true
  order by roster.active desc, roster.role, lower(roster.full_name), roster.email;
end;
$$;
revoke all on function public.admin_list_executives() from public, anon, authenticated;
grant execute on function public.admin_list_executives() to authenticated;

create or replace function public.admin_add_executive(
  p_email text,
  p_full_name text,
  p_position text,
  p_role text
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := private.require_site_admin();
  v_entry private.approved_executives := private.validate_roster_entry(p_email, p_full_name, p_position, p_role);
begin
  insert into private.approved_executives (email, full_name, "position", role, active, updated_by)
  values (v_entry.email, v_entry.full_name, v_entry."position", v_entry.role, true, v_actor);

  perform private.record_provisioning_event(
    v_actor, 'added', v_entry.email,
    jsonb_build_object('role', v_entry.role, 'position', v_entry."position", 'full_name', v_entry.full_name)
  );
exception
  when unique_violation then
    raise exception 'This email is already on the roster. Edit the existing entry instead.' using errcode = '23505';
end;
$$;
revoke all on function public.admin_add_executive(text, text, text, text) from public, anon, authenticated;
grant execute on function public.admin_add_executive(text, text, text, text) to authenticated;

-- Changes the name, position, or tier of an existing entry. The login email is
-- the identity: to change it, remove the entry and add the new address.
create or replace function public.admin_update_executive(
  p_email text,
  p_full_name text,
  p_position text,
  p_role text
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := private.require_site_admin();
  v_entry private.approved_executives := private.validate_roster_entry(p_email, p_full_name, p_position, p_role);
  v_before private.approved_executives;
begin
  select * into v_before from private.approved_executives as roster
  where roster.email = v_entry.email for update;
  if not found then
    raise exception 'That email is not on the roster.' using errcode = 'P0002';
  end if;

  if v_before.full_name = v_entry.full_name
    and v_before."position" = v_entry."position"
    and v_before.role = v_entry.role then
    return;
  end if;

  update private.approved_executives as roster
  set full_name = v_entry.full_name,
      "position" = v_entry."position",
      role = v_entry.role,
      updated_at = now(),
      updated_by = v_actor
  where roster.email = v_entry.email;

  perform private.record_provisioning_event(
    v_actor, 'updated', v_entry.email,
    jsonb_build_object(
      'from', jsonb_build_object('role', v_before.role, 'position', v_before."position", 'full_name', v_before.full_name),
      'to', jsonb_build_object('role', v_entry.role, 'position', v_entry."position", 'full_name', v_entry.full_name)
    )
  );
end;
$$;
revoke all on function public.admin_update_executive(text, text, text, text) from public, anon, authenticated;
grant execute on function public.admin_update_executive(text, text, text, text) to authenticated;

-- Deactivating revokes access immediately, including existing sessions. The entry
-- is kept so it can be reactivated and so the history stays readable.
create or replace function public.admin_set_executive_active(p_email text, p_active boolean)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := private.require_site_admin();
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_before private.approved_executives;
begin
  if p_active is null then
    raise exception 'Choose whether to activate or deactivate this entry.' using errcode = '22023';
  end if;

  select * into v_before from private.approved_executives as roster
  where roster.email = v_email for update;
  if not found then
    raise exception 'That email is not on the roster.' using errcode = 'P0002';
  end if;
  if v_before.active = p_active then
    return;
  end if;

  update private.approved_executives as roster
  set active = p_active, updated_at = now(), updated_by = v_actor
  where roster.email = v_email;

  perform private.record_provisioning_event(
    v_actor,
    case when p_active then 'activated' else 'deactivated' end,
    v_email,
    jsonb_build_object('role', v_before.role, 'position', v_before."position")
  );
end;
$$;
revoke all on function public.admin_set_executive_active(text, boolean) from public, anon, authenticated;
grant execute on function public.admin_set_executive_active(text, boolean) to authenticated;

create or replace function public.admin_remove_executive(p_email text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := private.require_site_admin();
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_before private.approved_executives;
begin
  delete from private.approved_executives as roster
  where roster.email = v_email
  returning * into v_before;
  if not found then
    raise exception 'That email is not on the roster.' using errcode = 'P0002';
  end if;

  perform private.record_provisioning_event(
    v_actor, 'removed', v_email,
    jsonb_build_object('role', v_before.role, 'position', v_before."position", 'full_name', v_before.full_name)
  );
end;
$$;
revoke all on function public.admin_remove_executive(text) from public, anon, authenticated;
grant execute on function public.admin_remove_executive(text) to authenticated;

create or replace function public.admin_list_provisioning_activity(p_limit integer default 20)
returns table (
  id bigint,
  action text,
  target_email text,
  actor_email text,
  actor_name text,
  details jsonb,
  created_at timestamptz
)
language plpgsql security definer set search_path = ''
as $$
begin
  perform private.require_site_admin();

  return query
  select
    entry.id,
    entry.action,
    entry.target_email,
    entry.actor_email,
    nullif(btrim(concat_ws(' ', profile.first_name, profile.last_name)), ''),
    entry.details,
    entry.created_at
  from private.executive_provisioning_audit as entry
  left join public.profiles as profile on profile.id = entry.actor_id
  order by entry.created_at desc, entry.id desc
  limit least(greatest(coalesce(p_limit, 20), 1), 100);
end;
$$;
revoke all on function public.admin_list_provisioning_activity(integer) from public, anon, authenticated;
grant execute on function public.admin_list_provisioning_activity(integer) to authenticated;

commit;
