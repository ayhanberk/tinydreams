-- Create Banners Table
create table banners (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text,
  image_url text, -- Optional background image or icon
  style text default 'info', -- info, warning, success, premium
  is_active boolean default false,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  link text -- Optional link to click
);

alter table banners enable row level security;

-- Everyone can view active banners
create policy "Banners viewable by everyone" on banners
  for select using (is_active = true);

-- Only admins can manage banners
create policy "Admins can manage banners" on banners
  for all using (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );


-- Create Notifications Table
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade, -- If null, it's a broadcast
  title text not null,
  message text not null,
  type text default 'info', -- info, success, warning, error
  is_read boolean default false,
  link text
);

alter table notifications enable row level security;

-- Users can view their own notifications or broadcast notifications
create policy "Users can view own notifications" on notifications
  for select using (
    (auth.uid() = user_id) or (user_id is null)
  );

-- Only admins can create notifications (for now)
create policy "Admins can create notifications" on notifications
  for insert with check (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );

-- Users can update read status of their own notifications
create policy "Users can update own notifications" on notifications
  for update using (auth.uid() = user_id);
