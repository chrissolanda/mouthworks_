-- Open reads on dentists to fix fetch errors in assign-dentist modal
ALTER TABLE dentists ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dentists'
      AND policyname = 'Dentists select any'
  ) THEN
    CREATE POLICY "Dentists select any" ON dentists
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

