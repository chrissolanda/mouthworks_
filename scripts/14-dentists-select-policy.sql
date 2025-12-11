-- Allow clients to read dentists for booking flows (HR/patient)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'dentists'
      AND policyname = 'Dentists readable public'
  ) THEN
    CREATE POLICY "Dentists readable public" ON dentists
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Useful index for ordering/filtering
CREATE INDEX IF NOT EXISTS idx_dentists_name ON dentists(name);

