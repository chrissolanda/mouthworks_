-- URGENT FIX: Add missing dentist_id column to payments table
-- Copy and paste this ENTIRE script into your Supabase SQL Editor and run it NOW

-- Add dentist_id column to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_payments_dentist_id ON payments(dentist_id);

-- Verify the column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position;
