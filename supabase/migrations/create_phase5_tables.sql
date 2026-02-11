-- Create Reviews Table
create table reviews (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  product_id uuid references products on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  
  -- Ensure one review per product per user
  unique(user_id, product_id)
);

alter table reviews enable row level security;

-- Everyone can view reviews
create policy "Reviews are public" on reviews
  for select using (true);

-- Authenticated users can create reviews
create policy "Users can create reviews" on reviews
  for insert with check (auth.uid() = user_id);

-- Users can update/delete their own reviews
create policy "Users can update own reviews" on reviews
  for update using (auth.uid() = user_id);

create policy "Users can delete own reviews" on reviews
  for delete using (auth.uid() = user_id);


-- Create Wishlist Table
create table wishlist (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  product_id uuid references products on delete cascade not null,

  -- Ensure unique product in wishlist per user
  unique(user_id, product_id)
);

alter table wishlist enable row level security;

-- Users can view their own wishlist
create policy "Users can view own wishlist" on wishlist
  for select using (auth.uid() = user_id);

-- Users can add to their wishlist
create policy "Users can add to wishlist" on wishlist
  for insert with check (auth.uid() = user_id);

-- Users can remove from their wishlist
create policy "Users can remove from wishlist" on wishlist
  for delete using (auth.uid() = user_id);
