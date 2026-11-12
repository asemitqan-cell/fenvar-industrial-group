-- 1) جدول طلبات عروض الأسعار
create table if not exists public.hz_quote_requests(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section text not null,
  lines jsonb not null default '[]',
  custom text,
  budget numeric,
  city text,
  chosen_provider uuid,
  quote jsonb,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.hz_quote_requests enable row level security;
drop policy if exists "qr insert own" on public.hz_quote_requests;
drop policy if exists "qr read own or chosen" on public.hz_quote_requests;
create policy "qr insert own" on public.hz_quote_requests for insert to authenticated with check (user_id = auth.uid());
create policy "qr read own or chosen" on public.hz_quote_requests for select to authenticated using (user_id = auth.uid() or chosen_provider = auth.uid());

-- 2) قراءة أسعار الموردين الفعّالة + بيانات الموردين عشان العرض يتحسب
drop policy if exists "price items readable" on public.hz_price_items;
create policy "price items readable" on public.hz_price_items for select to authenticated using (active = true);
drop policy if exists "providers readable" on public.hz_providers;
create policy "providers readable" on public.hz_providers for select to authenticated using (true);
drop policy if exists "profiles readable" on public.hz_profiles;
create policy "profiles readable" on public.hz_profiles for select to authenticated using (true);
-- (لو السياسات دي موجودة عندك بأسماء تانية ومش عايز تكرار، تجاهل أو امسح اللي مش محتاجه)

-- 3) إشعار للمورد أول ما يتبعتله الطلب (بيظهر في جرس الإشعارات الموجود)
create or replace function public.hz_notify_quote() returns trigger
language plpgsql security definer set search_path=public as $$
declare nm text; n int;
begin
  if new.chosen_provider is null then return new; end if;
  select coalesce(full_name,'عميل') into nm from public.hz_profiles where id=new.user_id;
  n := coalesce(jsonb_array_length(new.lines),0);
  insert into public.hz_notifications(user_id,kind,actor_name,listing_title,detail)
  values(new.chosen_provider,'feedback',coalesce(nm,'عميل'),'طلب عرض سعر',
    'طلب عرض سعر جديد (' || new.section || ') - ' || n || ' بنود' ||
    case when new.budget is not null then ' - ميزانية ' || new.budget else '' end ||
    case when new.city is not null then ' - ' || new.city else '' end);
  return new;
end $$;
drop trigger if exists hz_quote_notify on public.hz_quote_requests;
create trigger hz_quote_notify after insert on public.hz_quote_requests for each row execute function public.hz_notify_quote();
