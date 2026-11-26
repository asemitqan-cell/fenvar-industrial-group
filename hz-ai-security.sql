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
     or p_limit < 1 or p_limit > 1000
     or p_window_seconds not in (60, 3600) then
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

-- Close the legacy blanket-read policies. Public quote screens use the sanitized views below.
drop policy if exists "providers readable" on public.hz_providers;
drop policy if exists "profiles readable" on public.hz_profiles;

-- Public supplier directory: business-facing fields only. License documents, registration
-- numbers, phone numbers and rejection notes remain in the protected base table.
create or replace view public.hz_public_providers
with (security_barrier = true)
as
select
  p.user_id,
  p.provider_type,
  p.full_name,
  p.business_name,
  p.profession,
  p.field,
  p.experience_years,
  p.areas,
  p.work_hours,
  p.website,
  p.about,
  p.verified,
  to_jsonb(p)->>'city' as city,
  to_jsonb(p)->>'governorate' as governorate
from public.hz_providers p
where p.verified is true and p.status = 'approved';

-- Public-facing identity fields only; email and phone stay in the protected base table.
create or replace view public.hz_public_profiles
with (security_barrier = true)
as
select
  p.id,
  p.full_name,
  p.brand,
  p.avatar_url,
  p.bio,
  to_jsonb(p)->>'city' as city
from public.hz_profiles p;

revoke all on public.hz_public_providers from public, anon;
revoke all on public.hz_public_profiles from public, anon;
grant select on public.hz_public_providers to authenticated;
grant select on public.hz_public_profiles to authenticated;

-- Keep only the public configuration keys readable by ordinary users.
drop policy if exists "hz_settings read" on public.hz_settings;
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
