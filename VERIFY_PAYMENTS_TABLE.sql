-- ============================================
-- VERIFY PAYMENTS TABLE STRUCTURE
-- ============================================
-- Run this in Supabase SQL Editor to check your payments table

-- Step 1: Check all columns exist
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position;

-- Expected columns:
-- id (uuid)
-- patient_id (uuid)
-- dentist_id (uuid) ⚠️ THIS IS CRITICAL
-- amount (numeric)
-- method (text)
-- status (text)
-- date (date)
-- description (text)
-- created_at (timestamp)
-- updated_at (timestamp)

-- Step 2: Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'payments';

-- Step 3: Check existing policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'payments';

-- Step 4: Count existing payment records
SELECT COUNT(*) as total_payments FROM payments;

-- Step 5: Show sample payment record (if any)
SELECT * FROM payments LIMIT 1;
