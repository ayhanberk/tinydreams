-- Safe Inventory Batches Migration v2
-- Fixes "moddatetime does not exist" by enabling the extension.

-- 0. Enable required extensions
create extension if not exists moddatetime schema extensions;

-- 1. Ensure table exists
create table if not exists inventory_batches (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  batch_number text not null,
  quantity integer not null default 0,
  expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Indexes
create index if not exists idx_inventory_batches_product_id on inventory_batches(product_id);
create index if not exists idx_inventory_batches_expiry_date on inventory_batches(expiry_date);

-- 3. Enable RLS
alter table inventory_batches enable row level security;

-- 4. Re-create Policies (Drop first)
drop policy if exists "Admins can manage inventory batches" on inventory_batches;
drop policy if exists "Everyone can view inventory batches" on inventory_batches;

create policy "Admins can manage inventory batches" on inventory_batches for all using (is_admin());
create policy "Everyone can view inventory batches" on inventory_batches for select using (true);

-- 5. Helper Trigger
-- Ensure the trigger uses the correct schema for the function if needed, usually just 'moddatetime' works if extension is loaded.
drop trigger if exists handle_updated_at on inventory_batches;
create trigger handle_updated_at before update on inventory_batches
  for each row execute procedure extensions.moddatetime (updated_at);
