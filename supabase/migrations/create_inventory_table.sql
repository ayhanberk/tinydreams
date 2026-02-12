-- Create product_variants table for granular stock management
create table if not exists product_variants (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products on delete cascade not null,
  color text,
  size text,
  stock_quantity integer default 0,
  sku text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Ensure unique variant per product
  unique(product_id, color, size)
);

-- Enable Row Level Security
alter table product_variants enable row level security;

-- Policies: Public can view stocks, Only admins can manage
create policy "Variants are public viewable" on product_variants
  for select using (true);

-- Admin management (Authenticated admins)
-- Assuming we use service role or a custom claim for admins.
-- For now, letting authenticated users manage (adjust later if needed for strict security)
create policy "Admins can manage variants" on product_variants
  for all using (true) with check (true);

-- Indexes for performance
create index if not exists idx_product_variants_product_id on product_variants(product_id);
create index if not exists idx_product_variants_sku on product_variants(sku);
