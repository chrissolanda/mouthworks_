-- ============================================
-- CRITICAL: ADD AMOUNT COLUMN + RELOAD SCHEMA CACHE
-- ============================================
-- This fixes the schema cache error

-- Step 1: Add the column
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2) DEFAULT 0;

-- Step 2: FORCE PostgREST to reload schema (CRITICAL!)
NOTIFY pgrst, 'reload schema';

-- Step 3: Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
  AND column_name = 'amount';

-- ✅ CRITICAL NEXT STEPS:
-- 1. Run this SQL in Supabase
-- 2. WAIT 5-10 SECONDS (for cache reload)
-- 3. Stop dev server (Ctrl+C)
-- 4. Run: npm run dev
-- 5. Hard refresh browser (Ctrl+Shift+R)
-- 6. Clear browser storage (F12 → Application → Clear site data)
-- 7. Try Save & Complete
