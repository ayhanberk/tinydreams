-- Safe Inventory Batches Migration
-- Checks for existence or drops objects before creating them to avoid strict duplicate errors.

-- 1. Create table if not exists
create table if not exists inventory_batches (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  batch_number text not null,
  quantity integer not null default 0,
  expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Add indexes (IF NOT EXISTS is supported for indexes in newer PG, but we can do it safely via DO block or just ignore if it fails silently in some tools, but let's try standard IF NOT EXISTS)
create index if not exists idx_inventory_batches_product_id on inventory_batches(product_id);
create index if not exists idx_inventory_batches_expiry_date on inventory_batches(expiry_date);

-- 3. Enable RLS
alter table inventory_batches enable row level security;

-- 4. Drop policies if they exist, then recreate
drop policy if exists "Admins can manage inventory batches" on inventory_batches;
drop policy if exists "Everyone can view inventory batches" on inventory_batches;

create policy "Admins can manage inventory batches"
  on inventory_batches
  for all
  using (is_admin());

create policy "Everyone can view inventory batches"
  on inventory_batches
  for select
  using (true);

-- 5. Trigger for updated_at (Drop first to be safe or CREATE OR REPLACE if possible, but triggers usually need DROP)
drop trigger if exists handle_updated_at on inventory_batches;
create trigger handle_updated_at before update on inventory_batches
  for each row execute procedure moddatetime (updated_at);
