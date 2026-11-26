-- Allow IPv6 addresses plus a server-side pepper in the persistent AI limiter key.
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
  if p_key is null or length(p_key) < 1 or length(p_key) > 512
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
