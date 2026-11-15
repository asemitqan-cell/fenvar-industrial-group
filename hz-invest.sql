-- ============================================================
-- Horizon: متابعة عروض الأسعار + الصفقات + التقييمات + لوحة أرقام المالك
-- شغّله مرة واحدة في Supabase > SQL Editor (مشروع FENVAR). آمن لو اتشغّل أكتر من مرة.
-- مابيمسحش ولا بيعدّل أي بيانات موجودة. بيضيف جداول ودوال وصلاحيات جديدة بس.
-- ============================================================

-- 1) العروض اللي الموردين بيبعتوها على طلبات العملاء
create table if not exists public.hzq_offers(
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.hz_quote_requests(id) on delete cascade,
  provider_id uuid not null,
  total numeric not null check (total > 0),
  days int check (days is null or (days >= 0 and days <= 365)),
  note text,
  status text not null default 'sent' check (status in ('sent','accepted','rejected','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (request_id, provider_id)
);
create index if not exists hzq_offers_provider_idx on public.hzq_offers(provider_id);

-- 2) الصفقات (بعد ما العميل يقبل عرض): مراحل التنفيذ + العمولة + التقييم + رقم الفاتورة
create table if not exists public.hzq_deals(
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique references public.hz_quote_requests(id) on delete cascade,
  offer_id uuid references public.hzq_offers(id) on delete set null,
  customer_id uuid not null,
  provider_id uuid not null,
  section text not null,
  total numeric not null,
  stage text not null default 'accepted' check (stage in ('accepted','in_progress','delivered','closed','cancelled')),
  commission_rate numeric not null default 0,
  commission numeric not null default 0,
  invoice_no bigint generated always as identity,
  rating int check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz,
  rated_at timestamptz
);
create index if not exists hzq_deals_provider_idx on public.hzq_deals(provider_id);
create index if not exists hzq_deals_customer_idx on public.hzq_deals(customer_id);

alter table public.hzq_offers enable row level security;
alter table public.hzq_deals enable row level security;

drop policy if exists hzq_o_sel on public.hzq_offers;
create policy hzq_o_sel on public.hzq_offers for select to authenticated using (
  provider_id = auth.uid()
  or exists (select 1 from public.hz_quote_requests r where r.id = request_id and r.user_id = auth.uid())
  or public.hz_is_owner() or public.hz_is_admin());

drop policy if exists hzq_d_sel on public.hzq_deals;
create policy hzq_d_sel on public.hzq_deals for select to authenticated using (
  customer_id = auth.uid() or provider_id = auth.uid() or public.hz_is_owner() or public.hz_is_admin());
-- (مفيش سياسات كتابة: كل التعديلات بتتم عن طريق الدوال تحت بس)

-- 3) الموردين الموثّقين اللي عندهم أسعار في قسم الطلب يشوفوا الطلبات المفتوحة بتاعت قسمهم
drop policy if exists "qr read matching providers" on public.hz_quote_requests;
create policy "qr read matching providers" on public.hz_quote_requests for select to authenticated using (
  chosen_provider is null
  and exists (select 1 from public.hz_providers p where p.user_id = auth.uid() and p.verified)
  and exists (select 1 from public.hz_price_items i where i.provider_id = auth.uid()
              and i.section = hz_quote_requests.section and coalesce(i.active, true) and i.price is not null));

drop policy if exists "qr read owner" on public.hz_quote_requests;
create policy "qr read owner" on public.hz_quote_requests for select to authenticated using (
  public.hz_is_owner() or public.hz_is_admin());

-- 4) نسبة عمولة افتراضية (فرضية قابلة للتغيير من جدول hz_settings، المفتاح commission)
insert into public.hz_settings(key, value) values ('commission', '{"rate":0.02}'::jsonb) on conflict (key) do nothing;

-- 5) إشعار جوه التطبيق
create or replace function public.hzq_note(p_user uuid, p_actor uuid, p_title text, p_detail text)
returns void language plpgsql security definer set search_path = public as $$
declare nm text;
begin
  select coalesce((select nullif(business_name,'') from public.hz_providers where user_id = p_actor),
                  (select coalesce(nullif(brand,''), nullif(full_name,'')) from public.hz_profiles where id = p_actor),
                  'Horizon') into nm;
  insert into public.hz_notifications(user_id, actor_id, actor_name, kind, listing_title, detail)
  values (p_user, p_actor, nm, 'feedback', p_title, left(p_detail, 200));
exception when others then null;
end $$;

-- 6) طلب جديد من غير مورد محدد: بلّغ كل الموردين المناسبين
create or replace function public.hzq_notify_new_request()
returns trigger language plpgsql security definer set search_path = public as $$
declare pr record; n int;
begin
  if new.chosen_provider is not null then return new; end if;
  n := coalesce(jsonb_array_length(new.lines), 0);
  for pr in
    select distinct i.provider_id from public.hz_price_items i
    join public.hz_providers p on p.user_id = i.provider_id and p.verified
    where i.section = new.section and coalesce(i.active, true) and i.price is not null and i.provider_id <> new.user_id
  loop
    perform public.hzq_note(pr.provider_id, new.user_id, 'طلب عرض سعر',
      'طلب جديد مفتوح (' || new.section || ') - ' || n || ' بنود' ||
      case when new.city is not null and new.city <> '' then ' - ' || new.city else '' end ||
      ' - ادخل على طلبات العملاء وقدّم عرضك');
  end loop;
  return new;
exception when others then return new;
end $$;
drop trigger if exists hzq_new_request_notify on public.hz_quote_requests;
create trigger hzq_new_request_notify after insert on public.hz_quote_requests
  for each row execute function public.hzq_notify_new_request();

-- 7) المورد يبعت (أو يعدّل) عرضه
create or replace function public.hzq_send_offer(p_request uuid, p_total numeric, p_days int, p_note text)
returns uuid language plpgsql security definer set search_path = public as $$
declare r public.hz_quote_requests%rowtype; oid uuid;
begin
  if auth.uid() is null then raise exception 'سجّل دخول الأول'; end if;
  select * into r from public.hz_quote_requests where id = p_request;
  if not found then raise exception 'الطلب مش موجود'; end if;
  if not (exists (select 1 from public.hz_providers where user_id = auth.uid() and verified)
          and (r.chosen_provider = auth.uid()
               or (r.chosen_provider is null and exists (select 1 from public.hz_price_items i
                   where i.provider_id = auth.uid() and i.section = r.section and coalesce(i.active, true))))) then
    raise exception 'مش مؤهل ترد على الطلب ده (لازم حساب موثّق وأسعار في نفس القسم)';
  end if;
  if r.status in ('closed','cancelled') or exists (select 1 from public.hzq_deals where request_id = p_request) then
    raise exception 'الطلب ده اتقفل';
  end if;
  if p_total is null or p_total <= 0 then raise exception 'اكتب إجمالي سعر صحيح'; end if;
  insert into public.hzq_offers(request_id, provider_id, total, days, note)
  values (p_request, auth.uid(), p_total, p_days, nullif(left(coalesce(p_note,''), 600), ''))
  on conflict (request_id, provider_id) do update
    set total = excluded.total, days = excluded.days, note = excluded.note, status = 'sent', updated_at = now()
    where public.hzq_offers.status in ('sent','withdrawn')
  returning id into oid;
  if oid is null then raise exception 'العرض ده اتقبل أو اترفض قبل كده'; end if;
  update public.hz_quote_requests set status = 'offered' where id = p_request and status = 'new';
  perform public.hzq_note(r.user_id, auth.uid(), 'عرض سعر', 'وصلك عرض سعر على طلبك (' || r.section || ') بقيمة ' || p_total);
  return oid;
end $$;

create or replace function public.hzq_withdraw_offer(p_offer uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.hzq_offers set status = 'withdrawn', updated_at = now()
   where id = p_offer and provider_id = auth.uid() and status = 'sent';
  if not found then raise exception 'مش قادر أسحب العرض ده'; end if;
end $$;

-- 8) العميل يقبل عرض: بتتفتح الصفقة والعروض التانية بتتقفل
create or replace function public.hzq_accept(p_offer uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare o public.hzq_offers%rowtype; r public.hz_quote_requests%rowtype; rate numeric; did uuid; x record;
begin
  if auth.uid() is null then raise exception 'سجّل دخول الأول'; end if;
  select * into o from public.hzq_offers where id = p_offer;
  if not found then raise exception 'العرض مش موجود'; end if;
  select * into r from public.hz_quote_requests where id = o.request_id;
  if r.user_id <> auth.uid() then raise exception 'ده مش طلبك'; end if;
  if o.status <> 'sent' then raise exception 'العرض ده مش متاح'; end if;
  if exists (select 1 from public.hzq_deals where request_id = r.id) then raise exception 'الطلب ده اتقفل قبل كده'; end if;
  select coalesce(case when jsonb_typeof(value) = 'object' then (value->>'rate')::numeric
                       when jsonb_typeof(value) = 'number' then (value #>> '{}')::numeric end, 0)
    into rate from public.hz_settings where key = 'commission';
  rate := coalesce(rate, 0);
  for x in select id, provider_id from public.hzq_offers where request_id = r.id and status = 'sent' and id <> p_offer loop
    perform public.hzq_note(x.provider_id, auth.uid(), 'عرض سعر', 'العميل اختار عرض تاني على الطلب ده');
  end loop;
  update public.hzq_offers set status = case when id = p_offer then 'accepted' else 'rejected' end, updated_at = now()
   where request_id = r.id and status = 'sent';
  update public.hz_quote_requests set status = 'accepted', chosen_provider = o.provider_id where id = r.id;
  insert into public.hzq_deals(request_id, offer_id, customer_id, provider_id, section, total, commission_rate)
  values (r.id, o.id, r.user_id, o.provider_id, r.section, o.total, rate) returning id into did;
  perform public.hzq_note(o.provider_id, auth.uid(), 'صفقة جديدة', 'العميل قبل عرضك بقيمة ' || o.total || '. ابدأ التنفيذ وحدّث الحالة.');
  return did;
end $$;

-- 9) مراحل الصفقة: المورد: قيد التنفيذ ثم تم التسليم. العميل: تأكيد الاستلام. الاتنين: إلغاء قبل التسليم
create or replace function public.hzq_stage(p_deal uuid, p_stage text)
returns void language plpgsql security definer set search_path = public as $$
declare d public.hzq_deals%rowtype; me uuid := auth.uid(); other uuid; msg text; rs text;
begin
  if me is null then raise exception 'سجّل دخول الأول'; end if;
  select * into d from public.hzq_deals where id = p_deal for update;
  if not found then raise exception 'الصفقة مش موجودة'; end if;
  if me not in (d.provider_id, d.customer_id) then raise exception 'مش من أطراف الصفقة'; end if;
  other := case when me = d.provider_id then d.customer_id else d.provider_id end;
  if me = d.provider_id and p_stage = 'in_progress' and d.stage = 'accepted' then
    update public.hzq_deals set stage = 'in_progress', updated_at = now() where id = d.id;
    msg := 'المورد بدأ تنفيذ طلبك'; rs := 'accepted';
  elsif me = d.provider_id and p_stage = 'delivered' and d.stage in ('accepted','in_progress') then
    update public.hzq_deals set stage = 'delivered', updated_at = now() where id = d.id;
    msg := 'المورد بلّغ إنه سلّم الطلب. أكّد الاستلام وقيّمه.'; rs := 'accepted';
  elsif me = d.customer_id and p_stage = 'closed' and d.stage = 'delivered' then
    update public.hzq_deals set stage = 'closed', closed_at = now(), updated_at = now(),
           commission = round(total * commission_rate, 2) where id = d.id;
    msg := 'العميل أكّد الاستلام. الصفقة اتقفلت.'; rs := 'closed';
  elsif p_stage = 'cancelled' and d.stage in ('accepted','in_progress') then
    update public.hzq_deals set stage = 'cancelled', updated_at = now() where id = d.id;
    msg := 'الصفقة اتلغت'; rs := 'cancelled';
  else
    raise exception 'الخطوة دي مش متاحة دلوقتي';
  end if;
  update public.hz_quote_requests set status = rs where id = d.request_id;
  perform public.hzq_note(other, me, 'تحديث صفقة', msg);
end $$;

-- 10) العميل يقيّم المورد بعد قفل الصفقة
create or replace function public.hzq_rate(p_deal uuid, p_rating int, p_review text)
returns void language plpgsql security definer set search_path = public as $$
declare d public.hzq_deals%rowtype;
begin
  if p_rating is null or p_rating < 1 or p_rating > 5 then raise exception 'التقييم من 1 لـ 5'; end if;
  select * into d from public.hzq_deals where id = p_deal and customer_id = auth.uid();
  if not found then raise exception 'مش صفقتك'; end if;
  if d.stage <> 'closed' then raise exception 'قيّم بعد ما تأكّد الاستلام'; end if;
  if d.rating is not null then raise exception 'قيّمت الصفقة دي قبل كده'; end if;
  update public.hzq_deals set rating = p_rating, review = nullif(left(coalesce(p_review,''), 500), ''), rated_at = now(), updated_at = now() where id = d.id;
  perform public.hzq_note(d.provider_id, auth.uid(), 'تقييم جديد', 'قيّمك ' || repeat('★', p_rating) || coalesce(' - ' || nullif(left(coalesce(p_review,''), 100), ''), ''));
end $$;

-- 11) بيانات التواصل بتظهر بعد قبول العرض بس (للطرفين)
create or replace function public.hzq_contact(p_deal uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare d public.hzq_deals%rowtype; me uuid := auth.uid(); other uuid; nm text; ph text;
begin
  select * into d from public.hzq_deals where id = p_deal;
  if not found or me is null or me not in (d.provider_id, d.customer_id) or d.stage = 'cancelled' then return null; end if;
  other := case when me = d.provider_id then d.customer_id else d.provider_id end;
  select coalesce(nullif(pv.business_name,''), nullif(pr.brand,''), nullif(pr.full_name,''), nullif(pv.full_name,'')),
         coalesce(nullif(pv.whatsapp,''), nullif(pr.phone,''))
    into nm, ph
  from public.hz_profiles pr left join public.hz_providers pv on pv.user_id = pr.id where pr.id = other;
  return jsonb_build_object('name', nm, 'phone', ph);
end $$;

-- 12) سمعة الموردين (بتظهر للعميل جنب كل عرض)
create or replace function public.hzq_provider_stats(p_ids uuid[])
returns jsonb language sql stable security definer set search_path = public as $$
  select coalesce(jsonb_object_agg(t.pid::text, jsonb_build_object('avg', t.avg_r, 'n', t.n_r, 'closed', t.closed, 'offers', t.offers)), '{}'::jsonb)
  from (
    select p as pid,
      (select round(avg(rating), 2) from public.hzq_deals d where d.provider_id = p and d.rating is not null) as avg_r,
      (select count(rating) from public.hzq_deals d where d.provider_id = p) as n_r,
      (select count(*) from public.hzq_deals d where d.provider_id = p and d.stage = 'closed') as closed,
      (select count(*) from public.hzq_offers o where o.provider_id = p) as offers
    from unnest(coalesce(p_ids, '{}'::uuid[])) as p
  ) t $$;

-- 13) العميل يلغي طلبه لو لسه مفيش صفقة
create or replace function public.hzq_cancel_request(p_request uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from public.hzq_deals where request_id = p_request and stage <> 'cancelled') then
    raise exception 'فيه صفقة شغالة على الطلب ده. ألغيها من الصفقة نفسها.';
  end if;
  update public.hz_quote_requests set status = 'cancelled' where id = p_request and user_id = auth.uid() and status in ('new','offered');
  if not found then raise exception 'مش قادر ألغي الطلب ده'; end if;
  update public.hzq_offers set status = 'rejected', updated_at = now() where request_id = p_request and status = 'sent';
end $$;

-- 14) لوحة أرقام المالك (للمالك والأدمن بس)
create or replace function public.hzq_stats()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare res jsonb;
begin
  if not (public.hz_is_owner() or public.hz_is_admin()) then raise exception 'للمالك فقط'; end if;
  select jsonb_build_object(
    'sections', coalesce((select jsonb_agg(q.x order by q.x->>'section') from (
      select jsonb_build_object(
        'section', s.section,
        'requests', (select count(*) from public.hz_quote_requests r where r.section = s.section),
        'requests_7d', (select count(*) from public.hz_quote_requests r where r.section = s.section and r.created_at > now() - interval '7 days'),
        'answered', (select count(distinct r.id) from public.hz_quote_requests r join public.hzq_offers o on o.request_id = r.id where r.section = s.section),
        'offers', (select count(*) from public.hzq_offers o join public.hz_quote_requests r on r.id = o.request_id where r.section = s.section),
        'deals', (select count(*) from public.hzq_deals d where d.section = s.section and d.stage <> 'cancelled'),
        'closed', (select count(*) from public.hzq_deals d where d.section = s.section and d.stage = 'closed'),
        'gmv', (select coalesce(sum(d.total), 0) from public.hzq_deals d where d.section = s.section and d.stage = 'closed'),
        'commission', (select coalesce(sum(d.commission), 0) from public.hzq_deals d where d.section = s.section and d.stage = 'closed'),
        'providers_priced', (select count(distinct i.provider_id) from public.hz_price_items i where i.section = s.section and coalesce(i.active, true) and i.price is not null),
        'providers_verified', (select count(distinct i.provider_id) from public.hz_price_items i join public.hz_providers p on p.user_id = i.provider_id and p.verified where i.section = s.section and coalesce(i.active, true) and i.price is not null),
        'price_items', (select count(*) from public.hz_price_items i where i.section = s.section and coalesce(i.active, true) and i.price is not null),
        'avg_first_offer_min', (select round(avg(extract(epoch from (fo.t - r.created_at)) / 60)) from public.hz_quote_requests r join (select request_id, min(created_at) as t from public.hzq_offers group by request_id) fo on fo.request_id = r.id where r.section = s.section),
        'avg_rating', (select round(avg(d.rating), 2) from public.hzq_deals d where d.section = s.section and d.rating is not null)
      ) as x
      from (select section from public.hz_quote_requests union select section from public.hz_price_items
            union select 'upvc' union select 'wood' union select 'nursing') s(section)
    ) q), '[]'::jsonb),
    'providers', jsonb_build_object(
      'registered', (select count(*) from public.hz_providers),
      'verified', (select count(*) from public.hz_providers where verified),
      'pending', (select count(*) from public.hz_providers where not coalesce(verified, false) and coalesce(status, 'pending') = 'pending')),
    'customers_requesting', (select count(distinct user_id) from public.hz_quote_requests),
    'repeat_customers', (select count(*) from (select user_id from public.hz_quote_requests group by user_id having count(*) > 1) z),
    'commission_rate', (select coalesce(case when jsonb_typeof(value) = 'object' then (value->>'rate')::numeric when jsonb_typeof(value) = 'number' then (value #>> '{}')::numeric end, 0) from public.hz_settings where key = 'commission'),
    'cities', coalesce((select jsonb_agg(jsonb_build_object('city', c.city, 'n', c.n) order by c.n desc) from (
        select coalesce(nullif(trim(city), ''), '—') as city, count(*) as n from public.hz_quote_requests group by 1 order by 2 desc limit 8) c), '[]'::jsonb),
    'daily', coalesce((select jsonb_agg(jsonb_build_object('d', z.d, 'n', z.n) order by z.d) from (
        select to_char(date_trunc('day', created_at), 'MM-DD') as d, count(*) as n from public.hz_quote_requests
        where created_at > now() - interval '14 days' group by 1) z), '[]'::jsonb)
  ) into res;
  return res;
end $$;

-- 15) صلاحيات تشغيل الدوال: للمسجّلين بس
do $$
declare f text;
begin
  foreach f in array array[
    'hzq_send_offer(uuid,numeric,int,text)','hzq_withdraw_offer(uuid)','hzq_accept(uuid)','hzq_stage(uuid,text)',
    'hzq_rate(uuid,int,text)','hzq_contact(uuid)','hzq_provider_stats(uuid[])','hzq_cancel_request(uuid)','hzq_stats()',
    'hzq_note(uuid,uuid,text,text)','hzq_notify_new_request()']
  loop
    execute format('revoke all on function public.%s from public, anon', f);
  end loop;
  foreach f in array array[
    'hzq_send_offer(uuid,numeric,int,text)','hzq_withdraw_offer(uuid)','hzq_accept(uuid)','hzq_stage(uuid,text)',
    'hzq_rate(uuid,int,text)','hzq_contact(uuid)','hzq_provider_stats(uuid[])','hzq_cancel_request(uuid)','hzq_stats()']
  loop
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
