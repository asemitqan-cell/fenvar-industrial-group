-- ============================================================
-- Horizon: نقل أرقام التليفونات لجدول مقفول (حماية حقيقية في قاعدة البيانات)
-- شغّله بعد hz-invest.sql، في Supabase > SQL Editor (مشروع FENVAR)، مرة واحدة. آمن لو اتشغّل تاني.
-- بيتنفّذ كله في معاملة واحدة: لو أي خطوة فشلت، مفيش حاجة بتتغيّر.
-- اللي بيحصل:
--  1) جدول hz_private_contacts: كل واحد يقرا رقمه بس (والمالك/الأدمن يقروا الكل).
--  2) بيتنسخ كل رقم موجود في hz_profiles.phone و hz_providers.whatsapp للجدول الجديد.
--  3) بيتأكد إن النسخ كمل، وبعدين بيفضّي العمود القديم ('' بدل الرقم) علشان محدش يقراه.
--  4) تريجرات: أي رقم جديد بيتبعت من التطبيق لـ hz_profiles / hz_providers بيتحوّل تلقائي للجدول المقفول.
--  5) hzq_contact بقت بتقرا من الجدول المقفول (التواصل بعد قبول العرض بس).
-- ============================================================
begin;

create table if not exists public.hz_private_contacts(
  user_id uuid primary key,
  phone text,
  updated_at timestamptz not null default now()
);
alter table public.hz_private_contacts enable row level security;

drop policy if exists hzpc_own_sel on public.hz_private_contacts;
create policy hzpc_own_sel on public.hz_private_contacts for select to authenticated using (user_id = auth.uid());
drop policy if exists hzpc_staff_sel on public.hz_private_contacts;
create policy hzpc_staff_sel on public.hz_private_contacts for select to authenticated using (public.hz_is_owner() or public.hz_is_admin());
-- (مفيش سياسات كتابة: الكتابة بتتم من التريجرات بس)

-- نسخ الأرقام الموجودة (رقم المورد له أولوية، زي ما كانت hzq_contact بتعمل)
insert into public.hz_private_contacts(user_id, phone)
select pr.id, btrim(coalesce(nullif(pv.whatsapp,''), nullif(pr.phone,'')))
from public.hz_profiles pr left join public.hz_providers pv on pv.user_id = pr.id
where nullif(btrim(coalesce(nullif(pv.whatsapp,''), nullif(pr.phone,''))),'') is not null
on conflict (user_id) do nothing;

insert into public.hz_private_contacts(user_id, phone)
select pv.user_id, btrim(pv.whatsapp) from public.hz_providers pv
where nullif(btrim(coalesce(pv.whatsapp,'')),'') is not null
on conflict (user_id) do nothing;

-- أمان: لو في رقم ما اتنسخش، وقّف كل حاجة (المعاملة كلها بترجع)
do $$
declare m1 int; m2 int;
begin
  select count(*) into m1 from public.hz_profiles pr
   where nullif(btrim(coalesce(pr.phone,'')),'') is not null
     and not exists (select 1 from public.hz_private_contacts c where c.user_id = pr.id);
  select count(*) into m2 from public.hz_providers pv
   where nullif(btrim(coalesce(pv.whatsapp,'')),'') is not null
     and not exists (select 1 from public.hz_private_contacts c where c.user_id = pv.user_id);
  if m1 > 0 or m2 > 0 then raise exception 'النسخ ما كملش (% بروفايل، % مورد). ما اتغيّرش حاجة.', m1, m2; end if;
end $$;

-- تفضية الأعمدة القديمة (الأرقام بقت في الجدول المقفول)
update public.hz_profiles  set phone = ''    where nullif(btrim(coalesce(phone,'')),'') is not null;
update public.hz_providers set whatsapp = '' where nullif(btrim(coalesce(whatsapp,'')),'') is not null;

-- تريجرات الحماية (بتتعمل بعد التفضية علشان ماتكتبش فوق النسخ)
create or replace function public.hz_profile_phone_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if nullif(btrim(coalesce(new.phone,'')),'') is not null then
    insert into public.hz_private_contacts(user_id, phone) values (new.id, btrim(new.phone))
    on conflict (user_id) do update set phone = excluded.phone, updated_at = now();
  end if;
  new.phone := '';
  return new;
end $$;
drop trigger if exists hz_profile_phone_guard on public.hz_profiles;
create trigger hz_profile_phone_guard before insert or update on public.hz_profiles
  for each row execute function public.hz_profile_phone_guard();

create or replace function public.hz_provider_phone_guard()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if nullif(btrim(coalesce(new.whatsapp,'')),'') is not null then
    insert into public.hz_private_contacts(user_id, phone) values (new.user_id, btrim(new.whatsapp))
    on conflict (user_id) do update set phone = excluded.phone, updated_at = now();
  end if;
  new.whatsapp := '';
  return new;
end $$;
drop trigger if exists hz_provider_phone_guard on public.hz_providers;
create trigger hz_provider_phone_guard before insert or update on public.hz_providers
  for each row execute function public.hz_provider_phone_guard();

-- بيانات التواصل بعد قبول العرض بس (للطرفين) من الجدول المقفول
create or replace function public.hzq_contact(p_deal uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare d public.hzq_deals%rowtype; me uuid := auth.uid(); other uuid; nm text; ph text;
begin
  select * into d from public.hzq_deals where id = p_deal;
  if not found or me is null or me not in (d.provider_id, d.customer_id) or d.stage = 'cancelled' then return null; end if;
  other := case when me = d.provider_id then d.customer_id else d.provider_id end;
  select coalesce(nullif(pv.business_name,''), nullif(pr.brand,''), nullif(pr.full_name,''), nullif(pv.full_name,''))
    into nm
  from public.hz_profiles pr left join public.hz_providers pv on pv.user_id = pr.id where pr.id = other;
  select nullif(c.phone,'') into ph from public.hz_private_contacts c where c.user_id = other;
  return jsonb_build_object('name', nm, 'phone', ph);
end $$;
revoke all on function public.hzq_contact(uuid) from public, anon;
grant execute on function public.hzq_contact(uuid) to authenticated;

commit;

-- ============================================================
-- للتراجع (لو احتجت، شغّل ده بس): بيرجّع الأرقام للأعمدة القديمة ويشيل التريجرات
-- drop trigger if exists hz_profile_phone_guard on public.hz_profiles;
-- drop trigger if exists hz_provider_phone_guard on public.hz_providers;
-- update public.hz_profiles p set phone = c.phone from public.hz_private_contacts c where c.user_id = p.id and coalesce(p.phone,'') = '';
-- update public.hz_providers v set whatsapp = c.phone from public.hz_private_contacts c where c.user_id = v.user_id and coalesce(v.whatsapp,'') = '';
-- ============================================================
