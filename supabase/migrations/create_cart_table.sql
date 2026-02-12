-- Create cart_items table
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  product_id uuid references products on delete cascade not null,
  quantity integer default 1 check (quantity > 0),
  unique(user_id, product_id)
);

-- Enable RLS
alter table cart_items enable row level security;

-- Policies
create policy "Users can view their own cart items" on cart_items
  for select using (auth.uid() = user_id);

create policy "Users can insert their own cart items" on cart_items
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own cart items" on cart_items
  for update using (auth.uid() = user_id);

create policy "Users can delete their own cart items" on cart_items
  for delete using (auth.uid() = user_id);
