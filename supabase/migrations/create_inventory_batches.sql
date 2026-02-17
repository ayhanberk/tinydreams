-- Create inventory_batches table
create table if not exists inventory_batches (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  batch_number text not null,
  quantity integer not null default 0,
  expiry_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes
create index if not exists idx_inventory_batches_product_id on inventory_batches(product_id);
create index if not exists idx_inventory_batches_expiry_date on inventory_batches(expiry_date);

-- Enable RLS
alter table inventory_batches enable row level security;

-- Policies
create policy "Admins can manage inventory batches"
  on inventory_batches
  for all
  using (is_admin());

create policy "Everyone can view inventory batches"
  on inventory_batches
  for select
  using (true); -- Publicly visible? Or strictly admin? Usually admin, but maybe needed for "stock left" logic. 
                -- Proceeding with public read for now to allow frontend to potentially show "Batch X exp Y". 
                -- If strict backend logic, then only admin. Let's make it admin-only write, public read for transparency if needed.

-- Add trigger for updated_at
create trigger handle_updated_at before update on inventory_batches
  for each row execute procedure moddatetime (updated_at);
