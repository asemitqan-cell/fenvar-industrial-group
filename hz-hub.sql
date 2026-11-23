-- Horizon: جدول إعدادات عام (بيخزّن القطاعات/الأنظمة الإضافية اللي المالك بيضيفها في قسم UPVC).
-- شغّله مرة واحدة في Supabase > SQL Editor. لو ما اتشغّلش، الإضافات بتتحفظ على جهازك بس.
create table if not exists public.hz_settings (
  key text primary key,
  value jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.hz_settings enable row level security;

drop policy if exists "hz_settings read" on public.hz_settings;
create policy "hz_settings read" on public.hz_settings for select using (true);

drop policy if exists "hz_settings owner insert" on public.hz_settings;
create policy "hz_settings owner insert" on public.hz_settings for insert
  with check ((auth.jwt() ->> 'email') = 'asem.itqan@gmail.com');

drop policy if exists "hz_settings owner update" on public.hz_settings;
create policy "hz_settings owner update" on public.hz_settings for update
  using ((auth.jwt() ->> 'email') = 'asem.itqan@gmail.com')
  with check ((auth.jwt() ->> 'email') = 'asem.itqan@gmail.com');
