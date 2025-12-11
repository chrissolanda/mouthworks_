-- Allow clients to read treatments so services show up in booking flows

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatments'
      AND policyname = 'Treatments readable public'
  ) THEN
    CREATE POLICY "Treatments readable public" ON treatments
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Optional: ensure index on category/name for UI sorting/filtering
CREATE INDEX IF NOT EXISTS idx_treatments_category_name ON treatments(category, name);

