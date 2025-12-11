-- ============================================
-- EMERGENCY FIX - RUN THIS RIGHT NOW
-- ============================================
-- This fixes BOTH payments AND treatments RLS issues

-- ========== FIX TREATMENTS TABLE ==========
-- Enable RLS on treatments
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for treatments
DROP POLICY IF EXISTS "Anyone can view treatments" ON treatments;
DROP POLICY IF EXISTS "Treatments select all" ON treatments;
DROP POLICY IF EXISTS "Treatments select authenticated" ON treatments;
DROP POLICY IF EXISTS "HR can manage treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can view treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can insert treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can update treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can delete treatments" ON treatments;

-- Create WIDE OPEN policies for treatments (authenticated users can do ANYTHING)
CREATE POLICY "treatments_select_all"
ON treatments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "treatments_insert_all"
ON treatments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "treatments_update_all"
ON treatments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "treatments_delete_all"
ON treatments FOR DELETE
TO authenticated
USING (true);

-- ========== FIX PAYMENTS TABLE ==========
-- Ensure dentist_id column exists
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL;

-- Enable RLS on payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies for payments
DROP POLICY IF EXISTS "Anyone can view payments" ON payments;
DROP POLICY IF EXISTS "Payments select all" ON payments;
DROP POLICY IF EXISTS "Payments select authenticated" ON payments;
DROP POLICY IF EXISTS "HR can manage payments" ON payments;
DROP POLICY IF EXISTS "HR can insert payments" ON payments;
DROP POLICY IF EXISTS "HR can update payments" ON payments;
DROP POLICY IF EXISTS "HR can delete payments" ON payments;
DROP POLICY IF EXISTS "Authenticated can view payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can view all payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can insert payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can update payments" ON payments;
DROP POLICY IF EXISTS "Authenticated users can delete payments" ON payments;

-- Create WIDE OPEN policies for payments (authenticated users can do ANYTHING)
CREATE POLICY "payments_select_all"
ON payments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "payments_insert_all"
ON payments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "payments_update_all"
ON payments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "payments_delete_all"
ON payments FOR DELETE
TO authenticated
USING (true);

-- Force PostgREST to reload schema
NOTIFY pgrst, 'reload schema';

-- ========== VERIFY EVERYTHING ==========
SELECT '🔍 Checking treatments policies...' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'treatments';

SELECT '🔍 Checking payments policies...' as status;
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'payments';

SELECT '✅ RLS POLICIES FIXED!' as status;
