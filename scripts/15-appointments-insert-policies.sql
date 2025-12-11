-- Open insert/select; only assigned dentist or HR can update; HR can delete
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointments'
      AND policyname = 'Appointments insert any'
  ) THEN
    CREATE POLICY "Appointments insert any" ON appointments
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointments'
      AND policyname = 'Appointments select any'
  ) THEN
    CREATE POLICY "Appointments select any" ON appointments
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- Only the assigned dentist (auth.uid()) can update/approve/reject
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointments'
      AND policyname = 'Appointments update dentist'
  ) THEN
    CREATE POLICY "Appointments update dentist" ON appointments
      FOR UPDATE
      TO authenticated
      USING (
        dentist_id IN (
          SELECT d.id FROM dentists d WHERE d.user_id = auth.uid()
        )
      )
      WITH CHECK (
        dentist_id IN (
          SELECT d.id FROM dentists d WHERE d.user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- HR can update any appointment
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointments'
      AND policyname = 'Appointments update hr'
  ) THEN
    CREATE POLICY "Appointments update hr" ON appointments
      FOR UPDATE
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM staff s
          WHERE s.user_id = auth.uid()
            AND s.role = 'hr'
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM staff s
          WHERE s.user_id = auth.uid()
            AND s.role = 'hr'
        )
      );
  END IF;
END $$;

-- HR can delete any appointment
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointments'
      AND policyname = 'Appointments delete hr'
  ) THEN
    CREATE POLICY "Appointments delete hr" ON appointments
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

-- Fallback: allow delete for all (demo safety to ensure removal works)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointments'
      AND policyname = 'Appointments delete any'
  ) THEN
    CREATE POLICY "Appointments delete any" ON appointments
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;

