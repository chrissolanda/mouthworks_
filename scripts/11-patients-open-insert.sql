-- Allow client-side inserts into patients (anon/public) to unblock patient creation during login/registration
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patients'
      AND policyname = 'Patients insert public'
  ) THEN
    CREATE POLICY "Patients insert public" ON patients
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

-- Also allow reads so client can verify the new row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patients'
      AND policyname = 'Patients select public'
  ) THEN
    CREATE POLICY "Patients select public" ON patients
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

