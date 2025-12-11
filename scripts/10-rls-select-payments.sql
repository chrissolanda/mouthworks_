-- Allow authenticated users (dentists, HR, patients) to read payments.
-- Run this in Supabase SQL editor or via supabase cli after deploying.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'Authenticated can read payments'
  ) THEN
    CREATE POLICY "Authenticated can read payments" ON payments
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
