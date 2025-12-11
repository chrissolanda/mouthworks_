-- RUN THIS IN SUPABASE SQL EDITOR NOW!
-- This adds the missing dentist_id column to payments table

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_dentist_id ON payments(dentist_id);

-- Verify it worked
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payments' 
AND column_name = 'dentist_id';

-- Should return: dentist_id | uuid
