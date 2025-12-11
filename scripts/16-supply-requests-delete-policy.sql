-- Allow HR (and demo fallback public) to delete supply_requests
ALTER TABLE supply_requests ENABLE ROW LEVEL SECURITY;

-- HR delete
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_requests'
      AND policyname = 'Supply requests delete hr'
  ) THEN
    CREATE POLICY "Supply requests delete hr" ON supply_requests
      FOR DELETE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM staff s
          WHERE s.user_id = auth.uid()
            AND s.role = 'hr'
        )
      );
  END IF;
END $$;

-- Fallback delete any (demo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'supply_requests'
      AND policyname = 'Supply requests delete any'
  ) THEN
    CREATE POLICY "Supply requests delete any" ON supply_requests
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;

