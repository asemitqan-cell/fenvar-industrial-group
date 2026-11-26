-- Horizon AI abuse protection.
-- Apply this SQL migration before deploying the updated fenvar-ai Edge Function.
-- The function stores only a SHA-256 hash of the caller key, never the raw IP address.
begin;

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.hz_ai_rate_limits (
  key_hash text not null,
  window_seconds integer not null check (window_seconds in (60, 3600)),
  window_started_at timestamptz not null default clock_timestamp(),
  hits integer not null default 0 check (hits >= 0),
  primary key (key_hash, window_seconds)
);

alter table public.hz_ai_rate_limits enable row level security;
revoke all on table public.hz_ai_rate_limits from public, anon, authenticated;

create or replace function public.hz_ai_consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  v_hash text;
  v_hits integer;
  v_now timestamptz := clock_timestamp();
begin
  if p_key is null or length(p_key) < 1 or length(p_key) > 256
     or p_limit is null or p_limit < 1 or p_limit > 1000
     or p_window_seconds is null or p_window_seconds not in (60, 3600) then
    return false;
  end if;

  v_hash := encode(digest(convert_to(p_key, 'UTF8'), 'sha256'), 'hex');

  insert into public.hz_ai_rate_limits as current_limit
    (key_hash, window_seconds, window_started_at, hits)
  values
    (v_hash, p_window_seconds, v_now, 1)
  on conflict (key_hash, window_seconds) do update
    set window_started_at = case
          when current_limit.window_started_at <= v_now - make_interval(secs => p_window_seconds)
          then v_now else current_limit.window_started_at end,
        hits = case
          when current_limit.window_started_at <= v_now - make_interval(secs => p_window_seconds)
          then 1 else current_limit.hits + 1 end
  returning hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

revoke all on function public.hz_ai_consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.hz_ai_consume_rate_limit(text, integer, integer) to service_role;

-- Close the legacy blanket-read policies that expose provider verification fields and profile emails.
drop policy if exists "providers readable" on public.hz_providers;
drop policy if exists "profiles readable" on public.hz_profiles;

-- Keep a separate, sanitized public supplier directory. Do not expose license documents,
-- registration numbers, WhatsApp, private profile email/phone, or rejection notes.
create table if not exists public.hz_public_providers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider_type text,
  full_name text,
  business_name text,
  profession text,
  field text,
  experience_years integer,
  areas text,
  work_hours text,
  website text,
  about text,
  city text,
  governorate text,
  verified boolean not null default true,
  created_at timestamptz,
  updated_at timestamptz not null default now()
);
alter table public.hz_public_providers enable row level security;
drop policy if exists hz_public_providers_read on public.hz_public_providers;
create policy hz_public_providers_read on public.hz_public_providers
  for select to anon, authenticated using (true);
revoke all on table public.hz_public_providers from public, anon, authenticated;
grant select on table public.hz_public_providers to anon, authenticated;

create or replace function public.hz_sync_public_provider()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'DELETE' then
    delete from public.hz_public_providers where user_id = old.user_id;
    return old;
  end if;

  if new.verified is true and new.status = 'approved' then
    insert into public.hz_public_providers (
      user_id, provider_type, full_name, business_name, profession, field,
      experience_years, areas, work_hours, website, about, verified, created_at, updated_at
    ) values (
      new.user_id, new.provider_type, new.full_name, new.business_name, new.profession, new.field,
      new.experience_years, new.areas, new.work_hours, new.website, new.about,
      true, new.created_at, now()
    )
    on conflict (user_id) do update set
      provider_type = excluded.provider_type,
      full_name = excluded.full_name,
      business_name = excluded.business_name,
      profession = excluded.profession,
      field = excluded.field,
      experience_years = excluded.experience_years,
      areas = excluded.areas,
      work_hours = excluded.work_hours,
      website = excluded.website,
      about = excluded.about,
      verified = true,
      updated_at = now();
  else
    delete from public.hz_public_providers where user_id = new.user_id;
  end if;
  return new;
end;
$$;
revoke all on function public.hz_sync_public_provider() from public, anon, authenticated;
drop trigger if exists hz_sync_public_provider on public.hz_providers;
create trigger hz_sync_public_provider
  after insert or update or delete on public.hz_providers
  for each row execute function public.hz_sync_public_provider();

-- Initial safe directory backfill.
insert into public.hz_public_providers (
  user_id, provider_type, full_name, business_name, profession, field,
  experience_years, areas, work_hours, website, about, verified, created_at, updated_at
)
select user_id, provider_type, full_name, business_name, profession, field,
       experience_years, areas, work_hours, website, about, true, created_at, now()
from public.hz_providers
where verified is true and status = 'approved'
on conflict (user_id) do update set
  provider_type = excluded.provider_type,
  full_name = excluded.full_name,
  business_name = excluded.business_name,
  profession = excluded.profession,
  field = excluded.field,
  experience_years = excluded.experience_years,
  areas = excluded.areas,
  work_hours = excluded.work_hours,
  website = excluded.website,
  about = excluded.about,
  verified = true,
  updated_at = now();

delete from public.hz_public_providers pub
where not exists (
  select 1 from public.hz_providers p
  where p.user_id = pub.user_id and p.verified is true and p.status = 'approved'
);

-- Settings are public only for the three keys used by the public app.
drop policy if exists "hz_settings read" on public.hz_settings;
drop policy if exists set_read on public.hz_settings;
drop policy if exists hz_settings_public_read on public.hz_settings;
drop policy if exists hz_settings_owner_read on public.hz_settings;
create policy hz_settings_public_read on public.hz_settings
  for select to anon, authenticated
  using (key in ('layout', 'commission', 'upvc_systems'));
create policy hz_settings_owner_read on public.hz_settings
  for select to authenticated
  using (lower(coalesce(auth.jwt()->>'email','')) = 'asem.itqan@gmail.com');

notify pgrst, 'reload schema';

commit;
