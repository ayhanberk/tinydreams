-- Create supported_languages table
create table if not exists supported_languages (
  code text primary key,
  name text not null,
  flag text,
  is_default boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table supported_languages enable row level security;

-- Policies for supported_languages
create policy "Public read access for supported_languages"
  on supported_languages for select
  using (true);

create policy "Admin write access for supported_languages"
  on supported_languages for all
  using (is_admin());

-- Create translations table
create table if not exists translations (
  id uuid default gen_random_uuid() primary key,
  locale text not null references supported_languages(code) on delete cascade,
  namespace text not null,
  key text not null,
  value text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(locale, namespace, key)
);

-- Enable RLS
alter table translations enable row level security;

-- Policies for translations
create policy "Public read access for translations"
  on translations for select
  using (true);

create policy "Admin write access for translations"
  on translations for all
  using (is_admin());

-- Seed Initial Languages
insert into supported_languages (code, name, flag, is_default)
values 
  ('en', 'English', '🇺🇸', true),
  ('tr', 'Türkçe', '🇹🇷', false)
on conflict (code) do nothing;

-- Seed Initial Translations (Sample)
insert into translations (locale, namespace, key, value)
values 
  -- Navigation (EN)
  ('en', 'nav', 'home', 'Home'),
  ('en', 'nav', 'shop', 'Shop'),
  ('en', 'nav', 'about', 'About'),
  ('en', 'nav', 'contact', 'Contact'),
  ('en', 'nav', 'cart', 'Cart'),
  ('en', 'nav', 'admin_panel', 'Admin Panel'),
  ('en', 'nav', 'dashboard', 'Dashboard'),
  ('en', 'nav', 'my_family', 'My Family'),
  ('en', 'nav', 'sign_out', 'Sign Out'),
  ('en', 'nav', 'login', 'Login'),
  
  -- Navigation (TR)
  ('tr', 'nav', 'home', 'Anasayfa'),
  ('tr', 'nav', 'shop', 'Mağaza'),
  ('tr', 'nav', 'about', 'Hakkımızda'),
  ('tr', 'nav', 'contact', 'İletişim'),
  ('tr', 'nav', 'cart', 'Sepet'),
  ('tr', 'nav', 'admin_panel', 'Yönetim Paneli'),
  ('tr', 'nav', 'dashboard', 'Hesabım'),
  ('tr', 'nav', 'my_family', 'Ailem'),
  ('tr', 'nav', 'sign_out', 'Çıkış Yap'),
  ('tr', 'nav', 'login', 'Giriş Yap'),

  -- Common (EN)
  ('en', 'common', 'loading', 'Loading...'),
  ('en', 'common', 'error', 'Error'),
  ('en', 'common', 'success', 'Success'),
  ('en', 'common', 'save', 'Save'),
  ('en', 'common', 'cancel', 'Cancel'),
  ('en', 'common', 'delete', 'Delete'),
  ('en', 'common', 'edit', 'Edit'),

  -- Common (TR)
  ('tr', 'common', 'loading', 'Yükleniyor...'),
  ('tr', 'common', 'error', 'Hata'),
  ('tr', 'common', 'success', 'Başarılı'),
  ('tr', 'common', 'save', 'Kaydet'),
  ('tr', 'common', 'cancel', 'İptal'),
  ('tr', 'common', 'delete', 'Sil'),
  ('tr', 'common', 'edit', 'Düzenle')

on conflict (locale, namespace, key) do update set value = excluded.value;
