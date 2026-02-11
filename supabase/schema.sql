-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for products
create table products (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  price decimal(10,2) not null,
  image_url text,
  category text,
  stock integer default 0,
  is_featured boolean default false
);

alter table products enable row level security;

create policy "Products are viewable by everyone." on products
  for select using (true);

create policy "Only admins can insert products." on products
  for insert with check (auth.role() = 'service_role'); -- Simplified for now, typically requires custom claims

create policy "Only admins can update products." on products
  for update using (auth.role() = 'service_role');

-- Create a table for orders
create table orders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  status text default 'pending', -- pending, processing, shipped, delivered, cancelled
  total_amount decimal(10,2) not null,
  shipping_address jsonb
);

alter table orders enable row level security;

create policy "Users can view their own orders." on orders
  for select using (auth.uid() = user_id);

create policy "Users can insert their own orders." on orders
  for insert with check (auth.uid() = user_id);

-- Create a table for order items
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders on delete cascade not null,
  product_id uuid references products not null,
  quantity integer not null,
  price_at_purchase decimal(10,2) not null
);

alter table order_items enable row level security;

create policy "Users can view their own order items." on order_items
  for select using (
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );

create policy "Users can insert their own order items." on order_items
  for insert with check (
    exists ( select 1 from orders where orders.id = order_items.order_id and orders.user_id = auth.uid() )
  );

-- Storage buckets setup (conceptual)
-- insert into storage.buckets (id, name) values ('products', 'products');
-- insert into storage.buckets (id, name) values ('avatars', 'avatars');
