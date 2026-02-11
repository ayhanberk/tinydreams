-- Add role column to profiles table
alter table profiles 
add column role text default 'user' check (role in ('user', 'admin'));

-- Update policy to allow admins to view all profiles
create policy "Admins can view all profiles." on profiles
  for select using (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );

-- Update policy to allow admins to update any profile
create policy "Admins can update any profile." on profiles
  for update using (
    exists ( select 1 from profiles where id = auth.uid() and role = 'admin' )
  );
