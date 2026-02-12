-- Update orders table to reference profiles directly for easier joins
ALTER TABLE orders
DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

ALTER TABLE orders
ADD CONSTRAINT orders_user_id_fkey
FOREIGN KEY (user_id) REFERENCES profiles(id)
ON DELETE CASCADE;

-- Update order_items to reference products correctly if needed
-- (Already seems ok, but let's double check RLS)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
