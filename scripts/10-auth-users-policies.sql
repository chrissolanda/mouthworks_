-- Enable RLS on auth_users and allow reads for app clients

ALTER TABLE auth_users ENABLE ROW LEVEL SECURITY;

-- Allow anonymous (public) to read auth_users for credential checks
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'auth_users'
      AND policyname = 'Auth users readable anon'
  ) THEN
    CREATE POLICY "Auth users readable anon" ON auth_users
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Allow authenticated as well (kept for completeness)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'auth_users'
      AND policyname = 'Auth users readable'
  ) THEN
    CREATE POLICY "Auth users readable" ON auth_users
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Note: service_role bypasses RLS, so registration inserts remain unaffected.

