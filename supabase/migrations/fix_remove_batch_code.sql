-- Fix: Remove or rename 'batch_code' column
-- The error "null value in column "batch_code" ... violates not-null constraint" indicates this column exists and is required, 
-- but our application uses 'batch_number'.

DO $$
BEGIN
    -- Check if 'batch_code' exists
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_batches' AND column_name = 'batch_code') THEN
        -- Check if 'batch_number' ALSO exists (which it should from our previous fix)
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'inventory_batches' AND column_name = 'batch_number') THEN
            -- We have both, drop the unused 'batch_code' that is causing the error
            ALTER TABLE inventory_batches DROP COLUMN batch_code;
        ELSE
            -- We only have 'batch_code', so rename it to 'batch_number' to match our code
            ALTER TABLE inventory_batches RENAME COLUMN batch_code TO batch_number;
        END IF;
    END IF;
END $$;
