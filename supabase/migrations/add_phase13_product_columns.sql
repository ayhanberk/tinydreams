-- Add Phase 13 columns to products table if they don't exist

-- min_age_months
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'min_age_months') THEN
        ALTER TABLE products ADD COLUMN min_age_months INTEGER;
    END IF;
END $$;

-- max_age_months
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'max_age_months') THEN
        ALTER TABLE products ADD COLUMN max_age_months INTEGER;
    END IF;
END $$;

-- certifications
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'certifications') THEN
        ALTER TABLE products ADD COLUMN certifications JSONB DEFAULT '[]'::jsonb;
    END IF;
END $$;
