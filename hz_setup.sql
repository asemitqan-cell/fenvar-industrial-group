-- Horizon setup: run once in Supabase > SQL Editor. Safe to run again.
-- Fixes: "Could not find the table 'public.hz_providers' in the schema cache"
-- and adds the Suggestions & Complaints box (hz_feedback) with a notification to the owner.

create table if not exists public.hz_providers(
  user_id uuid primary key references auth.users(id) on delete cascade,
  field text default 'general',
  provider_type text default 'individual',
  full_name text, business_name text, profession text,
  license_no text, license_issuer text, license_expiry text, license_doc text,
  commercial_reg text, experience_years int, areas text, work_hours text,
  website text, whatsapp text, about text,
  status text default 'pending', verified boolean default false, reject_reason text,
  created_at timestamptz default now()
);
alter table public.hz_providers enable row level security;
drop policy if exists hz_prov_own_sel on public.hz_providers;
drop policy if exists hz_prov_own_ins on public.hz_providers;
drop policy if exists hz_prov_own_upd on public.hz_providers;
drop policy if exists hz_prov_admin on public.hz_providers;
create policy hz_prov_own_sel on public.hz_providers for select using (auth.uid()=user_id);
create policy hz_prov_own_ins on public.hz_providers for insert with check (auth.uid()=user_id and coalesce(verified,false)=false and coalesce(status,'pending')='pending');
create policy hz_prov_own_upd on public.hz_providers for update using (auth.uid()=user_id) with check (auth.uid()=user_id and coalesce(verified,false)=false);
create policy hz_prov_admin on public.hz_providers for all using ((auth.jwt()->>'email')='asem.itqan@gmail.com') with check ((auth.jwt()->>'email')='asem.itqan@gmail.com');

-- private bucket for license photos (the app uploads to provider-docs/<user id>/...)
insert into storage.buckets(id,name,public) values('provider-docs','provider-docs',false) on conflict do nothing;
drop policy if exists hz_pdocs_ins on storage.objects;
drop policy if exists hz_pdocs_sel on storage.objects;
create policy hz_pdocs_ins on storage.objects for insert to authenticated with check (bucket_id='provider-docs' and (storage.foldername(name))[1]=auth.uid()::text);
create policy hz_pdocs_sel on storage.objects for select to authenticated using (bucket_id='provider-docs' and ((storage.foldername(name))[1]=auth.uid()::text or (auth.jwt()->>'email')='asem.itqan@gmail.com'));

-- suggestions & complaints
create table if not exists public.hz_feedback(
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text, user_name text,
  kind text default 'suggestion', body text not null,
  created_at timestamptz default now()
);
alter table public.hz_feedback enable row level security;
drop policy if exists hz_fb_ins on public.hz_feedback;
drop policy if exists hz_fb_admin on public.hz_feedback;
create policy hz_fb_ins on public.hz_feedback for insert to authenticated with check (auth.uid()=user_id);
create policy hz_fb_admin on public.hz_feedback for select using ((auth.jwt()->>'email')='asem.itqan@gmail.com');

-- tell the owner (shows in the notifications list). Never blocks the user's message if it fails.
create or replace function public.hz_feedback_notify() returns trigger language plpgsql security definer set search_path=public as $$
declare o uuid;
begin
  select id into o from auth.users where lower(email)='asem.itqan@gmail.com' limit 1;
  if o is not null then
    begin
      insert into public.hz_notifications(user_id,kind,detail,actor_name,listing_title)
      values(o,'feedback',left(new.body,200),coalesce(new.user_name,new.user_email),case when new.kind='complaint' then 'شكوى' else 'اقتراح' end);
    exception when others then null;
    end;
  end if;
  return new;
end $$;
drop trigger if exists hz_feedback_ai on public.hz_feedback;
create trigger hz_feedback_ai after insert on public.hz_feedback for each row execute function public.hz_feedback_notify();


-- ===== managers tree (admin panel > الهيكل) =====
create or replace function public.hz_is_admin() returns boolean language sql security definer set search_path=public stable as $$
  select exists(select 1 from public.hz_admins where user_id=auth.uid()) $$;

create table if not exists public.hz_staff(
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text, full_name text,
  role text default 'section_manager',
  parent_id uuid references public.hz_staff(id) on delete set null,
  sections text[] default '{}', permissions text[] default '{review}',
  needs_approval boolean default true, active boolean default true,
  notes text, created_at timestamptz default now()
);
create table if not exists public.hz_staff_log(
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references public.hz_staff(id) on delete cascade,
  user_id uuid, action text, listing_id uuid, listing_title text, detail text,
  status text default 'done', created_at timestamptz default now(), decided_at timestamptz
);
alter table public.hz_staff enable row level security;
alter table public.hz_staff_log enable row level security;

create or replace function public.hz_staff_can(c text, direct boolean) returns boolean language sql security definer set search_path=public stable as $$
  select exists(select 1 from public.hz_staff s where s.user_id=auth.uid() and s.active
    and 'review'=any(s.permissions) and c=any(s.sections) and (not direct or not s.needs_approval)) $$;

drop policy if exists hz_staff_admin on public.hz_staff;
drop policy if exists hz_staff_self on public.hz_staff;
drop policy if exists hz_slog_admin on public.hz_staff_log;
drop policy if exists hz_slog_sel on public.hz_staff_log;
drop policy if exists hz_slog_ins on public.hz_staff_log;
create policy hz_staff_admin on public.hz_staff for all using (public.hz_is_admin()) with check (public.hz_is_admin());
create policy hz_staff_self on public.hz_staff for select using (user_id=auth.uid());
create policy hz_slog_admin on public.hz_staff_log for all using (public.hz_is_admin()) with check (public.hz_is_admin());
create policy hz_slog_sel on public.hz_staff_log for select using (user_id=auth.uid());
create policy hz_slog_ins on public.hz_staff_log for insert with check (user_id=auth.uid() and exists(select 1 from public.hz_staff s where s.id=staff_id and s.user_id=auth.uid() and s.active));

-- a manager sees (and, only when allowed to decide directly, edits) listings of his own sections
drop policy if exists hz_l_staff_sel on public.hz_listings;
drop policy if exists hz_l_staff_upd on public.hz_listings;
drop policy if exists hz_p_staff_sel on public.hz_profiles;
create policy hz_l_staff_sel on public.hz_listings for select using (public.hz_staff_can(cat,false));
create policy hz_l_staff_upd on public.hz_listings for update using (public.hz_staff_can(cat,true)) with check (public.hz_staff_can(cat,true));
create policy hz_p_staff_sel on public.hz_profiles for select using (exists(select 1 from public.hz_staff s where s.user_id=auth.uid() and s.active));

-- every manager proposal reaches the owner as a notification
create or replace function public.hz_staff_log_notify() returns trigger language plpgsql security definer set search_path=public as $$
declare o uuid;
begin
  if new.status='pending' then
    select id into o from auth.users where lower(email)='asem.itqan@gmail.com' limit 1;
    if o is not null then
      begin
        insert into public.hz_notifications(user_id,kind,detail,actor_name,listing_title)
        values(o,'feedback','مقترح من مدير: '||new.action||' - '||coalesce(new.listing_title,''),'مدير قسم',coalesce(new.listing_title,''));
      exception when others then null;
      end;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists hz_staff_log_ai on public.hz_staff_log;
create trigger hz_staff_log_ai after insert on public.hz_staff_log for each row execute function public.hz_staff_log_notify();


-- phone sign-in users have no email: let the profile row exist without one
do $$ begin alter table public.hz_profiles alter column email drop not null; exception when others then null; end $$;

notify pgrst, 'reload schema';
