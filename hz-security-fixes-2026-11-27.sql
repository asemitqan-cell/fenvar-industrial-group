-- FENVAR / Horizon: إصلاحات أمان اتطبّقت على Supabase بتاريخ 2026-11-27 (للتوثيق بس، مش لازم تشغّلها تاني).
revoke execute on function public.hzq_notify_owner_quote_request() from public, anon, authenticated;

create or replace function public.hz_providers_lock_review_cols() returns trigger language plpgsql security invoker set search_path to 'public' as $$
begin
  if auth.uid() is not null
     and not (public.hz_is_owner() or public.hz_is_admin()
              or lower(coalesce(auth.jwt() ->> 'email','')) = 'asem.itqan@gmail.com') then
    new.status := old.status;
    new.verified := old.verified;
    new.reject_reason := old.reject_reason;
  end if;
  return new;
end $$;
revoke execute on function public.hz_providers_lock_review_cols() from public, anon, authenticated;
drop trigger if exists hz_providers_lock_review_cols on public.hz_providers;
create trigger hz_providers_lock_review_cols before update on public.hz_providers for each row execute function public.hz_providers_lock_review_cols();
