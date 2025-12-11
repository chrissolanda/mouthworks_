-- Quick check: Do you have any payments in the database?
-- Run this in Supabase SQL Editor

-- Count total payments
SELECT 
  'Total payments in database:' as info,
  COUNT(*) as count 
FROM payments;

-- Show last 5 payments
SELECT 
  'Last 5 payments:' as info,
  id,
  amount,
  status,
  date,
  description,
  patient_id,
  dentist_id,
  created_at
FROM payments 
ORDER BY created_at DESC 
LIMIT 5;

-- Check if dentist_id column exists
SELECT 
  'Checking dentist_id column:' as info,
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'payments' 
  AND column_name = 'dentist_id';

-- If this returns nothing, you need to run FIX_PAYMENTS_TABLE_COMPLETE.sql
