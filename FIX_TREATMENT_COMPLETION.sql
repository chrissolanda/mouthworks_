-- ============================================
-- FIX TREATMENT COMPLETION ERROR
-- ============================================
-- This fixes the "Failed to complete appointment: Unknown error"
-- The issue: treatment_records table is missing the 'quantity' column

-- Step 1: Add quantity column to treatment_records
ALTER TABLE treatment_records 
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- Step 2: Add comment for documentation
COMMENT ON COLUMN treatment_records.quantity IS 'Number of times this treatment was performed';

-- Step 3: Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'treatment_records' 
  AND column_name = 'quantity';

-- Expected output:
-- column_name | data_type | is_nullable | column_default
-- ------------|-----------|-------------|----------------
-- quantity    | integer   | NO          | 1

-- ✅ After running this, dentists will be able to:
-- 1. Add treatments with quantities
-- 2. Save and complete appointments
-- 3. View treatment records with quantities
