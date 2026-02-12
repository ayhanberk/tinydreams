-- Add color and size columns
ALTER TABLE cart_items ADD COLUMN color text;
ALTER TABLE cart_items ADD COLUMN size text;

-- Drop old uniqueness constraint (user_id + product_id)
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Add new uniqueness constraint (user_id + product_id + color + size)
-- Note: In Postgres, multiple NULLs are distinct. 
-- To ensure uniqueness even with NULLs, we can use a unique index with COALESCE,
-- or just rely on application logic to prevent duplicates.
-- For simplicity and robustness, let's create a unique index that treats NULL as empty string equivalent.
CREATE UNIQUE INDEX cart_items_unique_idx ON cart_items (
    user_id, 
    product_id, 
    COALESCE(color, ''), 
    COALESCE(size, '')
);
