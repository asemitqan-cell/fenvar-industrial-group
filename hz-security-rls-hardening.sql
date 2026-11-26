-- Horizon: tighten remaining public-role RLS helpers and remove the last definer view.
begin;

-- Public listing visitors may see approved listings only. Authenticated owners and admins
-- retain their existing visibility, while staff-specific access requires authentication.
drop policy if exists "hz listings read" on public.hz_listings;
drop policy if exists hz_listings_public_read on public.hz_listings;
drop policy if exists hz_listings_authenticated_read on public.hz_listings;
create policy hz_listings_public_read on public.hz_listings
  for select to anon using (status = 'approved');
create policy hz_listings_authenticated_read on public.hz_listings
  for select to authenticated
  using (status = 'approved' or owner = auth.uid() or public.hz_is_admin());

drop policy if exists hz_l_staff_sel on public.hz_listings;
create policy hz_l_staff_sel on public.hz_listings
  for select to authenticated using (public.hz_staff_can(cat, false));
drop policy if exists hz_l_staff_upd on public.hz_listings;
create policy hz_l_staff_upd on public.hz_listings
  for update to authenticated
  using (public.hz_staff_can(cat, true))
  with check (public.hz_staff_can(cat, true));

drop policy if exists hz_staff_admin on public.hz_staff;
create policy hz_staff_admin on public.hz_staff
  for all to authenticated
  using (public.hz_is_admin())
  with check (public.hz_is_admin());

drop policy if exists hz_slog_admin on public.hz_staff_log;
create policy hz_slog_admin on public.hz_staff_log
  for all to authenticated
  using (public.hz_is_admin())
  with check (public.hz_is_admin());

-- These helpers are needed by authenticated RLS policies, not by anonymous callers.
revoke all on function public.hz_is_admin() from public, anon;
grant execute on function public.hz_is_admin() to authenticated;
revoke all on function public.hz_staff_can(text, boolean) from public, anon;
grant execute on function public.hz_staff_can(text, boolean) to authenticated;

-- Settings write policies are owner-only and must never target the anon role.
drop policy if exists "hz_settings owner insert" on public.hz_settings;
create policy "hz_settings owner insert" on public.hz_settings
  for insert to authenticated
  with check (lower(coalesce(auth.jwt()->>'email','')) = 'asem.itqan@gmail.com');
drop policy if exists "hz_settings owner update" on public.hz_settings;
create policy "hz_settings owner update" on public.hz_settings
  for update to authenticated
  using (lower(coalesce(auth.jwt()->>'email','')) = 'asem.itqan@gmail.com')
  with check (lower(coalesce(auth.jwt()->>'email','')) = 'asem.itqan@gmail.com');
drop policy if exists set_write on public.hz_settings;
create policy set_write on public.hz_settings
  for all to authenticated
  using (public.hz_is_owner())
  with check (public.hz_is_owner());

-- This aggregate view only reads approved listings. Run with the caller's RLS context.
create or replace view public.hz_price_stats
with (security_invoker = true)
as
select
  cat,
  coalesce(nullif(trim(city), ''), 'غير محدد') as city,
  coalesce(attrs->>'purpose', '') as purpose,
  currency,
  count(*) as n,
  min(price) as pmin,
  percentile_cont(0.5) within group (order by price::double precision) as pmed,
  max(price) as pmax,
  percentile_cont(0.5) within group (
    order by (price / nullif((attrs->>'area')::numeric, 0))::double precision
  ) filter (where (attrs->>'area') ~ '^[0-9.]+$') as sqm
from public.hz_listings
where status = 'approved' and price is not null and price > 0
group by cat, coalesce(nullif(trim(city), ''), 'غير محدد'),
         coalesce(attrs->>'purpose', ''), currency
having count(*) >= 2;

notify pgrst, 'reload schema';
commit;
