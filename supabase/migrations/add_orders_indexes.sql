-- Create indexes for orders table to improve query performance
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Ensure profiles(email) is indexed effectively (Supabase usually indexes PK, but let's be safe if searching by email)
CREATE INDEX IF NOT EXISTS idx_profiles_email_gin ON public.profiles USING gin(email gin_trgm_ops);
-- Note: pg_trgm extension might be needed for the above GIN index on text. 
-- If pg_trgm is not enabled, standard btree index:
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
