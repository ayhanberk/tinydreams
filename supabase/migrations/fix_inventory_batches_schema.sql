-- Fix missing batch_number column in inventory_batches
-- It seems the previous migration might have failed or the table was created differently.

-- Safely add batch_number if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'inventory_batches' and column_name = 'batch_number') then
    alter table inventory_batches add column batch_number text not null default 'BATCH-000';
  end if;
end $$;

-- Verify other columns just in case
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'inventory_batches' and column_name = 'quantity') then
    alter table inventory_batches add column quantity integer not null default 0;
  end if;
  
  if not exists (select 1 from information_schema.columns where table_name = 'inventory_batches' and column_name = 'expiry_date') then
    alter table inventory_batches add column expiry_date date;
  end if;
end $$;
