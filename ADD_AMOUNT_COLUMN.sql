-- ============================================
-- ADD AMOUNT COLUMN TO APPOINTMENTS
-- ============================================
-- This fixes: "Could not find the 'amount' column of 'appointments'"

-- Add amount column to store the total cost of treatments
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2) DEFAULT 0;

-- Add comment for documentation
COMMENT ON COLUMN appointments.amount IS 'Total amount charged for treatments performed during this appointment';

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'appointments' 
  AND column_name = 'amount';

-- Expected output:
-- column_name | data_type | is_nullable | column_default
-- ------------|-----------|-------------|----------------
-- amount      | numeric   | YES         | 0

-- ✅ After running this:
-- 1. Hard refresh browser (Ctrl + Shift + R)
-- 2. Try Save & Complete again
-- 3. It should work now!
