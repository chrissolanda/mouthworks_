-- ============================================
-- FIX PAYMENTS TABLE - COMPLETE SETUP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Ensure dentist_id column exists
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL;

-- Step 2: Ensure all required columns exist
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS patient_id UUID REFERENCES patients(id) ON DELETE CASCADE;

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2) NOT NULL DEFAULT 0;

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS method TEXT DEFAULT 'Cash';

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unpaid';

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_patient_id ON payments(patient_id);
CREATE INDEX IF NOT EXISTS idx_payments_dentist_id ON payments(dentist_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Step 4: Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view payments" ON payments;
DROP POLICY IF EXISTS "Payments select all" ON payments;
DROP POLICY IF EXISTS "Payments select authenticated" ON payments;
DROP POLICY IF EXISTS "HR can manage payments" ON payments;
DROP POLICY IF EXISTS "HR can insert payments" ON payments;
DROP POLICY IF EXISTS "HR can update payments" ON payments;
DROP POLICY IF EXISTS "HR can delete payments" ON payments;
DROP POLICY IF EXISTS "Authenticated can view payments" ON payments;

-- Step 6: Create new policies - OPEN SELECT for all authenticated users
CREATE POLICY "Authenticated users can view all payments"
ON payments FOR SELECT
TO authenticated
USING (true);

-- Step 7: Allow authenticated users to INSERT payments (for HR and dentists)
CREATE POLICY "Authenticated users can insert payments"
ON payments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Step 8: Allow authenticated users to UPDATE payments (for HR)
CREATE POLICY "Authenticated users can update payments"
ON payments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 9: Allow authenticated users to DELETE payments (for HR)
CREATE POLICY "Authenticated users can delete payments"
ON payments FOR DELETE
TO authenticated
USING (true);

-- Step 10: Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Step 11: Verify everything worked
SELECT 
  'Payments table structure:' as info,
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position;

SELECT 
  'RLS status:' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'payments';

SELECT 
  'Active policies:' as info,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'payments';

-- ✅ NEXT STEPS AFTER RUNNING THIS:
-- 1. Wait 10 seconds for schema cache reload
-- 2. Stop your dev server (Ctrl+C)
-- 3. Run: npm run dev
-- 4. Hard refresh browser (Ctrl+Shift+R)
-- 5. Clear browser storage (F12 → Application → Clear site data)
-- 6. Try recording a payment
-- 7. Check browser console for "[v0]" logs
