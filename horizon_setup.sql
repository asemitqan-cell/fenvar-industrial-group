-- ===== Horizon: ملف الإعداد (شغّله مرة واحدة في Supabase > SQL Editor) =====
-- مهم: غيّر الإيميل في آخر الملف لإيميل المدير بتاعك قبل ما تشغّله.

-- 1) جداول المستخدمين والمدير
create table if not exists public.profiles(
  id uuid primary key references auth.users(id) on delete cascade,
  email text, role text default 'client', full_name text, phone text,
  created_at timestamptz default now());
create table if not exists public.admins(user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.profiles enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin() returns boolean
language sql security definer set search_path=public stable
as $$ select exists(select 1 from public.admins where user_id=auth.uid()) $$;

drop policy if exists "admins read own" on public.admins;
create policy "admins read own" on public.admins for select to authenticated using (user_id=auth.uid());
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select to authenticated using (id=auth.uid() or public.is_admin());
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert to authenticated with check (id=auth.uid());
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());

-- أي حساب جديد يتعمله ملف تلقائي (نوع الحساب من وقت التسجيل)
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,email,role)
  values(new.id,new.email,coalesce(new.raw_user_meta_data->>'role','client'))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();
-- الحسابات القديمة
insert into public.profiles(id,email,role)
select id,email,coalesce(raw_user_meta_data->>'role','client') from auth.users
on conflict (id) do nothing;

-- 2) الإعلانات (منتجات وخدمات) - بتنزل "بانتظار الموافقة" وبعد كده المدير يقبلها
create table if not exists public.listings(
  id uuid primary key default gen_random_uuid(),
  owner uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('product','service')),
  cat text not null,
  title text not null,
  description text,
  price numeric,
  currency text default 'EGP',
  city text,
  attrs jsonb default '{}'::jsonb,
  summary text,
  photos text[] default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  reject_reason text,
  created_at timestamptz default now());
alter table public.listings enable row level security;
drop policy if exists "listings read" on public.listings;
create policy "listings read" on public.listings for select to anon, authenticated
  using (status='approved' or owner=auth.uid() or public.is_admin());
drop policy if exists "listings insert" on public.listings;
create policy "listings insert" on public.listings for insert to authenticated
  with check (owner=auth.uid() and status='pending');
drop policy if exists "listings update own" on public.listings;
create policy "listings update own" on public.listings for update to authenticated
  using (owner=auth.uid()) with check (owner=auth.uid() and status='pending');
drop policy if exists "listings update admin" on public.listings;
create policy "listings update admin" on public.listings for update to authenticated
  using (public.is_admin()) with check (true);
drop policy if exists "listings delete" on public.listings;
create policy "listings delete" on public.listings for delete to authenticated
  using (owner=auth.uid() or public.is_admin());

-- 3) المحادثات والرسائل
create table if not exists public.conversations(
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete cascade,
  listing_title text,
  buyer_id uuid not null references auth.users(id) on delete cascade,
  seller_id uuid not null references auth.users(id) on delete cascade,
  last_message_at timestamptz default now(),
  last_sender uuid,
  last_text text,
  created_at timestamptz default now(),
  unique(listing_id,buyer_id));
create table if not exists public.messages(
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz default now());
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
drop policy if exists "conv read" on public.conversations;
create policy "conv read" on public.conversations for select to authenticated
  using (buyer_id=auth.uid() or seller_id=auth.uid() or public.is_admin());
drop policy if exists "conv insert" on public.conversations;
create policy "conv insert" on public.conversations for insert to authenticated
  with check (buyer_id=auth.uid() and seller_id<>auth.uid());
drop policy if exists "msg read" on public.messages;
create policy "msg read" on public.messages for select to authenticated
  using (exists(select 1 from public.conversations c where c.id=conversation_id and (c.buyer_id=auth.uid() or c.seller_id=auth.uid())) or public.is_admin());
drop policy if exists "msg insert" on public.messages;
create policy "msg insert" on public.messages for insert to authenticated
  with check (sender_id=auth.uid() and exists(select 1 from public.conversations c where c.id=conversation_id and (c.buyer_id=auth.uid() or c.seller_id=auth.uid())));

create or replace function public.touch_conversation() returns trigger
language plpgsql security definer set search_path=public as $$
begin
  update public.conversations set last_message_at=new.created_at, last_sender=new.sender_id, last_text=left(new.body,80) where id=new.conversation_id;
  return new;
end $$;
drop trigger if exists on_message_created on public.messages;
create trigger on_message_created after insert on public.messages
for each row execute function public.touch_conversation();

-- 4) تخزين الصور
insert into storage.buckets(id,name,public) values('listings','listings',true) on conflict (id) do nothing;
drop policy if exists "listing photos read" on storage.objects;
create policy "listing photos read" on storage.objects for select using (bucket_id='listings');
drop policy if exists "listing photos upload" on storage.objects;
create policy "listing photos upload" on storage.objects for insert to authenticated
  with check (bucket_id='listings' and (storage.foldername(name))[1]=auth.uid()::text);
drop policy if exists "listing photos delete" on storage.objects;
create policy "listing photos delete" on storage.objects for delete to authenticated
  using (bucket_id='listings' and ((storage.foldername(name))[1]=auth.uid()::text or public.is_admin()));

-- 5) صلاحيات الجداول
grant select on public.listings to anon;
grant select,insert,update,delete on public.listings,public.profiles,public.conversations,public.messages to authenticated;
grant select on public.admins to authenticated;

-- 6) خلّي نفسك مدير (غيّر الإيميل ده لإيميلك اللي بتدخل بيه)
insert into public.admins(user_id)
select id from auth.users where email='PUT_YOUR_ADMIN_EMAIL_HERE' on conflict do nothing;
