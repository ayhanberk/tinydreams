-- Create categories table
create table categories (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  slug text unique not null,
  parent_id uuid references categories(id) on delete set null,
  image_url text
);

-- Enable RLS for categories
alter table categories enable row level security;

create policy "Categories are viewable by everyone." on categories
  for select using (true);

create policy "Only admins can insert categories." on categories
  for insert with check (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );

create policy "Only admins can update categories." on categories
  for update using (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );

create policy "Only admins can delete categories." on categories
  for delete using (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );

-- Add category_id to products
alter table products add column category_id uuid references categories(id) on delete set null;

-- (Optional) If we want to migrate existing text categories to the new table, we would do it here using a script or manual update.
-- For now, we keep both columns but will prioritize category_id in the future.
