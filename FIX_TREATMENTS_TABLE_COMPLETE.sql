-- ============================================
-- FIX TREATMENTS TABLE - COMPLETE SETUP
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor

-- Step 1: Check if treatments table exists, create if not
CREATE TABLE IF NOT EXISTS treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Ensure all required columns exist
ALTER TABLE treatments 
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT 'Unnamed Service';

ALTER TABLE treatments 
ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'General';

ALTER TABLE treatments 
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

ALTER TABLE treatments 
ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE treatments 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE treatments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_treatments_category ON treatments(category);
CREATE INDEX IF NOT EXISTS idx_treatments_name ON treatments(name);

-- Step 4: Enable RLS
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop all existing policies
DROP POLICY IF EXISTS "Anyone can view treatments" ON treatments;
DROP POLICY IF EXISTS "Treatments select all" ON treatments;
DROP POLICY IF EXISTS "Treatments select authenticated" ON treatments;
DROP POLICY IF EXISTS "HR can manage treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can view treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can insert treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can update treatments" ON treatments;
DROP POLICY IF EXISTS "Authenticated users can delete treatments" ON treatments;

-- Step 6: Create new policies - OPEN for all authenticated users
CREATE POLICY "Authenticated users can view all treatments"
ON treatments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert treatments"
ON treatments FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update treatments"
ON treatments FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete treatments"
ON treatments FOR DELETE
TO authenticated
USING (true);

-- Step 7: Insert default treatments if table is empty
INSERT INTO treatments (name, category, price, description)
SELECT 'Cleaning', 'Preventive', 500.00, 'Regular teeth cleaning and polishing'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Cleaning');

INSERT INTO treatments (name, category, price, description)
SELECT 'Filling', 'Restorative', 800.00, 'Tooth filling for cavities'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Filling');

INSERT INTO treatments (name, category, price, description)
SELECT 'Root Canal', 'Endodontic', 3000.00, 'Root canal treatment'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Root Canal');

INSERT INTO treatments (name, category, price, description)
SELECT 'Extraction', 'Surgical', 1000.00, 'Tooth extraction'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Extraction');

INSERT INTO treatments (name, category, price, description)
SELECT 'Whitening', 'Cosmetic', 5000.00, 'Professional teeth whitening'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Whitening');

INSERT INTO treatments (name, category, price, description)
SELECT 'Braces', 'Orthodontic', 25000.00, 'Dental braces installation'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Braces');

INSERT INTO treatments (name, category, price, description)
SELECT 'Crown', 'Restorative', 4000.00, 'Dental crown placement'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Crown');

INSERT INTO treatments (name, category, price, description)
SELECT 'Consultation', 'General', 300.00, 'Initial consultation and examination'
WHERE NOT EXISTS (SELECT 1 FROM treatments WHERE name = 'Consultation');

-- Step 8: Force PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';

-- Step 9: Verify everything worked
SELECT 
  '✅ Treatments table structure:' as info,
  column_name, 
  data_type
FROM information_schema.columns 
WHERE table_name = 'treatments' 
ORDER BY ordinal_position;

SELECT 
  '✅ RLS status:' as info,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'treatments';

SELECT 
  '✅ Active policies:' as info,
  policyname,
  cmd as operation
FROM pg_policies 
WHERE tablename = 'treatments';

SELECT 
  '✅ Current treatments:' as info,
  COUNT(*) as total_treatments
FROM treatments;

SELECT 
  '✅ Sample treatments:' as info,
  name,
  category,
  price
FROM treatments 
LIMIT 5;

-- ✅ AFTER RUNNING THIS:
-- 1. Wait 10 seconds for schema cache reload
-- 2. Restart dev server: npm run dev
-- 3. Hard refresh browser: Ctrl+Shift+R
-- 4. Go to HR → Treatments
-- 5. Click "Add Treatment"
-- 6. Fill in the form and click save
-- 7. Watch browser console for [v0] logs
