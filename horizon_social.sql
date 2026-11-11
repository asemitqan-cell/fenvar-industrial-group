-- =====================================================================
-- Horizon: social + trust layer (آمن تشغّله أكتر من مرة)
-- الرياكتات + التعليقات + بروفايل مقدم الخدمة + توثيق + "تم الاتفاق" + التقييم بالنجوم
-- شغّله كله مرة واحدة في Supabase > SQL Editor > Run
-- ملحوظة: بيفترض إن hz_listings.id و hz_conversations.id من نوع uuid
-- =====================================================================

-- 0) دالة تعرّف الأدمن (غيّر الإيميل لو لزم)
create or replace function public.hz_is_admin() returns boolean
language sql stable as $$
  select lower(coalesce(auth.jwt()->>'email','')) = any (array['asem.itqan@gmail.com'])
$$;

-- 1) أعمدة البروفايل
alter table public.hz_profiles
  add column if not exists avatar_url text,
  add column if not exists bio text,
  add column if not exists brand text;

-- 2) الرياكتات
create table if not exists public.hz_reactions(
  listing_id uuid not null references public.hz_listings(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  kind text not null check (kind in ('like','love','haha','wow')),
  created_at timestamptz default now(),
  primary key (listing_id, user_id)
);
alter table public.hz_reactions enable row level security;
drop policy if exists rx_sel on public.hz_reactions;
drop policy if exists rx_ins on public.hz_reactions;
drop policy if exists rx_upd on public.hz_reactions;
drop policy if exists rx_del on public.hz_reactions;
create policy rx_sel on public.hz_reactions for select using (true);
create policy rx_ins on public.hz_reactions for insert to authenticated with check (user_id = auth.uid());
create policy rx_upd on public.hz_reactions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy rx_del on public.hz_reactions for delete to authenticated using (user_id = auth.uid());

-- 3) التعليقات
create table if not exists public.hz_comments(
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.hz_listings(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  user_name text,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz default now()
);
alter table public.hz_comments enable row level security;
drop policy if exists cm_sel on public.hz_comments;
drop policy if exists cm_ins on public.hz_comments;
drop policy if exists cm_del on public.hz_comments;
create policy cm_sel on public.hz_comments for select using (true);
create policy cm_ins on public.hz_comments for insert to authenticated with check (user_id = auth.uid());
create policy cm_del on public.hz_comments for delete to authenticated using (user_id = auth.uid() or public.hz_is_admin());

-- 4) "تم الاتفاق" على المحادثات
alter table public.hz_conversations
  add column if not exists deal_status text not null default 'none',
  add column if not exists deal_by uuid,
  add column if not exists deal_at timestamptz;

create or replace function public.hz_deal(p_conv uuid, p_action text default 'mark')
returns text language plpgsql security definer set search_path = public as $$
declare c record; uid uuid := auth.uid(); st text;
begin
  if uid is null then raise exception 'login required'; end if;
  select * into c from public.hz_conversations where id = p_conv for update;
  if not found or uid not in (c.buyer_id, c.seller_id) then raise exception 'not allowed'; end if;
  st := coalesce(c.deal_status,'none');
  if st = 'agreed' then return 'agreed'; end if;

  if p_action = 'cancel' then
    if st = 'proposed' then
      update public.hz_conversations set deal_status='none', deal_by=null where id=p_conv;
    end if;
    return 'none';
  end if;

  if st = 'none' then
    update public.hz_conversations set deal_status='proposed', deal_by=uid where id=p_conv;
    insert into public.hz_messages(conversation_id, sender_id, body)
      values (p_conv, uid, '🤝 بقترح نأكّد إننا اتفقنا. اضغط "تأكيد الاتفاق" لو موافق.');
    return 'proposed';
  elsif st = 'proposed' then
    if c.deal_by = uid then return 'proposed'; end if;
    update public.hz_conversations set deal_status='agreed', deal_at=now() where id=p_conv;
    insert into public.hz_messages(conversation_id, sender_id, body)
      values (p_conv, uid, '✅ تم الاتفاق');
    return 'agreed';
  end if;
  return st;
end $$;
revoke all on function public.hz_deal(uuid,text) from public, anon;
grant execute on function public.hz_deal(uuid,text) to authenticated;

-- 5) التقييم بالنجوم (العميل بس، وبعد تأكيد الاتفاق من الطرفين)
create table if not exists public.hz_ratings(
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null unique,
  listing_id uuid,
  provider_id uuid not null,
  rater_id uuid not null,
  rater_name text,
  stars int not null check (stars between 1 and 5),
  comment text,
  created_at timestamptz default now()
);
create index if not exists hz_ratings_provider_idx on public.hz_ratings(provider_id);
alter table public.hz_ratings enable row level security;
drop policy if exists rt_sel on public.hz_ratings;
drop policy if exists rt_del on public.hz_ratings;
create policy rt_sel on public.hz_ratings for select using (true);
create policy rt_del on public.hz_ratings for delete to authenticated using (public.hz_is_admin());
-- مفيش insert مباشر: التقييم بيتسجّل بس من خلال hz_rate

create or replace function public.hz_rate(p_conv uuid, p_stars int, p_comment text default null)
returns void language plpgsql security definer set search_path = public as $$
declare c record; nm text; uid uuid := auth.uid();
begin
  if uid is null then raise exception 'login required'; end if;
  if p_stars < 1 or p_stars > 5 then raise exception 'bad stars'; end if;
  select * into c from public.hz_conversations where id = p_conv;
  if not found or c.buyer_id <> uid then raise exception 'only the customer can rate'; end if;
  if coalesce(c.deal_status,'none') <> 'agreed' then raise exception 'deal not confirmed'; end if;
  select coalesce(nullif(full_name,''), split_part(email,'@',1)) into nm from public.hz_profiles where id = uid;
  insert into public.hz_ratings(conversation_id, listing_id, provider_id, rater_id, rater_name, stars, comment)
  values (p_conv, c.listing_id, c.seller_id, uid, nm, p_stars, left(nullif(trim(coalesce(p_comment,'')),''),500))
  on conflict (conversation_id) do update
    set stars = excluded.stars, comment = excluded.comment, created_at = now();
end $$;
revoke all on function public.hz_rate(uuid,int,text) from public, anon;
grant execute on function public.hz_rate(uuid,int,text) to authenticated;

-- 6) بيانات مقدم الخدمة (توثيق)
create table if not exists public.hz_providers(
  user_id uuid primary key references auth.users(id) on delete cascade,
  provider_type text not null default 'individual',
  full_name text,
  business_name text,
  profession text not null,
  license_no text,
  license_issuer text,
  license_expiry date,
  license_doc text,
  commercial_reg text,
  experience_years int,
  areas text,
  work_hours text,
  website text,
  whatsapp text,
  about text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  verified boolean not null default false,
  reject_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.hz_providers alter column license_no drop not null;
alter table public.hz_providers add column if not exists field text not null default 'general';
-- أي مقدم خدمة مسجّل قبل كده وعنده كارنيه يتحسب طبي
update public.hz_providers set field='medical' where license_no is not null and field='general';
alter table public.hz_providers enable row level security;
drop policy if exists pv_sel on public.hz_providers;
drop policy if exists pv_ins on public.hz_providers;
drop policy if exists pv_upd on public.hz_providers;
drop policy if exists pv_adm on public.hz_providers;
create policy pv_sel on public.hz_providers for select to authenticated using (user_id = auth.uid() or public.hz_is_admin());
create policy pv_ins on public.hz_providers for insert to authenticated with check (user_id = auth.uid());
create policy pv_upd on public.hz_providers for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy pv_adm on public.hz_providers for all to authenticated using (public.hz_is_admin()) with check (public.hz_is_admin());

-- المستخدم العادي ميقدرش يوثّق نفسه: الحالة بتتحدد من الأدمن بس
create or replace function public.hz_providers_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- الأدمن أو تعديل من SQL Editor: من غير قيود
  if auth.uid() is null or public.hz_is_admin() then new.updated_at := now(); return new; end if;
  if tg_op = 'INSERT' then
    -- الكارنيه للمجال الطبي بس (مراجعة). غير كده بيتسجّل علطول من غير علامة ✓
    new.status := case when new.field = 'medical' then 'pending' else 'approved' end;
    new.verified := false; new.reject_reason := null;
  else
    if old.status = 'rejected'
       or new.field is distinct from old.field
       or new.license_no is distinct from old.license_no
       or new.license_doc is distinct from old.license_doc
       or new.provider_type is distinct from old.provider_type
       or new.profession is distinct from old.profession then
      new.status := case when new.field = 'medical' then 'pending' else 'approved' end;
      new.verified := false; new.reject_reason := null;
    else
      new.status := old.status; new.verified := old.verified; new.reject_reason := old.reject_reason;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
drop trigger if exists hz_providers_guard_t on public.hz_providers;
create trigger hz_providers_guard_t before insert or update on public.hz_providers
  for each row execute function public.hz_providers_guard();

-- 7) مخزن خاص لصور الكارنيهات (الإدارة وصاحب الكارنيه بس)
insert into storage.buckets(id, name, public) values ('provider-docs','provider-docs', false)
  on conflict (id) do nothing;
drop policy if exists pd_ins on storage.objects;
drop policy if exists pd_sel on storage.objects;
drop policy if exists pd_upd on storage.objects;
drop policy if exists pd_del on storage.objects;
create policy pd_ins on storage.objects for insert to authenticated
  with check (bucket_id='provider-docs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy pd_sel on storage.objects for select to authenticated
  using (bucket_id='provider-docs' and ((storage.foldername(name))[1] = auth.uid()::text or public.hz_is_admin()));
create policy pd_upd on storage.objects for update to authenticated
  using (bucket_id='provider-docs' and (storage.foldername(name))[1] = auth.uid()::text);
create policy pd_del on storage.objects for delete to authenticated
  using (bucket_id='provider-docs' and ((storage.foldername(name))[1] = auth.uid()::text or public.hz_is_admin()));

-- 8) البروفايل العام (من غير إيميل ولا تليفون) + التقييم والتوثيق
drop view if exists public.hz_public_profiles;
create view public.hz_public_profiles as
select
  p.id, p.full_name, p.brand, p.bio, p.avatar_url,
  pr.business_name, pr.profession, pr.field as provider_field, pr.experience_years, pr.areas, pr.work_hours, pr.provider_type,
  (pr.status = 'approved' and pr.verified) as verified,
  coalesce(r.avg_stars, 0)::numeric(3,2) as rating_avg,
  coalesce(r.n, 0)::int as rating_count,
  coalesce(d.n, 0)::int as deals_count
from public.hz_profiles p
left join public.hz_providers pr on pr.user_id = p.id and pr.status = 'approved'
left join (select provider_id, avg(stars) as avg_stars, count(*) as n from public.hz_ratings group by provider_id) r on r.provider_id = p.id
left join (select seller_id, count(*) as n from public.hz_conversations where deal_status = 'agreed' group by seller_id) d on d.seller_id = p.id;
grant select on public.hz_public_profiles to anon, authenticated;

-- 9) تعديل الإعلانات: صاحب الإعلان يعدّل، والتعديل المهم بيرجّعه للمراجعة
alter table public.hz_listings enable row level security;
drop policy if exists hz_listings_owner_update on public.hz_listings;
create policy hz_listings_owner_update on public.hz_listings for update to authenticated
  using (owner = auth.uid()) with check (owner = auth.uid());

create or replace function public.hz_listings_guard() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.hz_is_admin() then return new; end if;
  new.owner := old.owner; new.kind := old.kind; new.cat := old.cat;
  if old.status = 'rejected'
     or new.title is distinct from old.title
     or new.description is distinct from old.description
     or new.photos::text is distinct from old.photos::text
     or new.attrs::text is distinct from old.attrs::text then
    new.status := 'pending'; new.reject_reason := null;
  else
    new.status := old.status; new.reject_reason := old.reject_reason;
  end if;
  return new;
end $$;
drop trigger if exists hz_listings_guard_t on public.hz_listings;
create trigger hz_listings_guard_t before update on public.hz_listings
  for each row execute function public.hz_listings_guard();

-- 10) الإشعارات (رياكت / تعليق / تقييم)
create table if not exists public.hz_notifications(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor_id uuid,
  actor_name text,
  kind text not null check (kind in ('reaction','comment','rating')),
  listing_id uuid,
  listing_title text,
  detail text,
  read boolean not null default false,
  created_at timestamptz default now()
);
create index if not exists hz_notif_user_idx on public.hz_notifications(user_id, created_at desc);
create unique index if not exists hz_notif_rx_u on public.hz_notifications(user_id, actor_id, listing_id) where kind = 'reaction';
alter table public.hz_notifications enable row level security;
drop policy if exists nt_sel on public.hz_notifications;
drop policy if exists nt_upd on public.hz_notifications;
drop policy if exists nt_del on public.hz_notifications;
create policy nt_sel on public.hz_notifications for select to authenticated using (user_id = auth.uid());
create policy nt_upd on public.hz_notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy nt_del on public.hz_notifications for delete to authenticated using (user_id = auth.uid());

create or replace function public.hz_notify_reaction() returns trigger
language plpgsql security definer set search_path = public as $$
declare o uuid; t text; nm text;
begin
  select owner, title into o, t from public.hz_listings where id = new.listing_id;
  if o is null or o = new.user_id then return new; end if;
  select coalesce(nullif(full_name,''), split_part(email,'@',1)) into nm from public.hz_profiles where id = new.user_id;
  insert into public.hz_notifications(user_id, actor_id, actor_name, kind, listing_id, listing_title, detail)
  values (o, new.user_id, nm, 'reaction', new.listing_id, t, new.kind) on conflict do nothing;
  return new;
end $$;
drop trigger if exists hz_notify_reaction_t on public.hz_reactions;
create trigger hz_notify_reaction_t after insert on public.hz_reactions
  for each row execute function public.hz_notify_reaction();

create or replace function public.hz_notify_comment() returns trigger
language plpgsql security definer set search_path = public as $$
declare o uuid; t text;
begin
  select owner, title into o, t from public.hz_listings where id = new.listing_id;
  if o is null or o = new.user_id then return new; end if;
  insert into public.hz_notifications(user_id, actor_id, actor_name, kind, listing_id, listing_title, detail)
  values (o, new.user_id, new.user_name, 'comment', new.listing_id, t, left(new.body, 80));
  return new;
end $$;
drop trigger if exists hz_notify_comment_t on public.hz_comments;
create trigger hz_notify_comment_t after insert on public.hz_comments
  for each row execute function public.hz_notify_comment();

create or replace function public.hz_notify_rating() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.hz_notifications(user_id, actor_id, actor_name, kind, listing_id, detail)
  values (new.provider_id, new.rater_id, new.rater_name, 'rating', new.listing_id, new.stars::text);
  return new;
end $$;
drop trigger if exists hz_notify_rating_t on public.hz_ratings;
create trigger hz_notify_rating_t after insert on public.hz_ratings
  for each row execute function public.hz_notify_rating();
