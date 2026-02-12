-- Add color and size columns to order_items table
ALTER TABLE order_items ADD COLUMN color text;
ALTER TABLE order_items ADD COLUMN size text;
