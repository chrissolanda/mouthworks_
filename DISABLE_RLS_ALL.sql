-- TEMP DEV UNBLOCK: DISABLE RLS ON ALL KEY TABLES
-- Run this in Supabase SQL editor to bypass auth requirements (use for development only)

ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE dentists DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE treatments DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('patients','dentists','appointments','treatments','payments');

NOTIFY pgrst, 'reload schema';

-- AFTER THIS: no auth needed; if you want to re-enable later, run the all_access policy script.
