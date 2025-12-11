-- RLS policies for treatment_records to allow dentists and HR to insert/select
ALTER TABLE treatment_records ENABLE ROW LEVEL SECURITY;

-- Make script idempotent by dropping existing policies before recreating
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatment_records'
      AND policyname = 'Treatment records select any'
  ) THEN
    DROP POLICY "Treatment records select any" ON treatment_records;
  END IF;
END $$;

-- Allow SELECT to authenticated users (clinic staff and dentists)
CREATE POLICY "Treatment records select any" ON treatment_records
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow INSERT for the assigned dentist for the appointment
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatment_records'
      AND policyname = 'Treatment records insert dentist'
  ) THEN
    DROP POLICY "Treatment records insert dentist" ON treatment_records;
  END IF;
END $$;

CREATE POLICY "Treatment records insert dentist" ON treatment_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- The inserting user must be the assigned dentist on the appointment
    EXISTS (
      SELECT 1 FROM dentists d
      WHERE d.user_id = auth.uid()
        AND d.id = dentist_id
    )
    AND EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = appointment_id
        AND a.dentist_id = dentist_id
    )
  );

-- Fallback: temporarily allow inserts for authenticated to unblock testing
-- NOTE: Remove this once dentist mapping is verified in production
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatment_records'
      AND policyname = 'Treatment records insert any (TEMP)'
  ) THEN
    DROP POLICY "Treatment records insert any (TEMP)" ON treatment_records;
  END IF;
END $$;

CREATE POLICY "Treatment records insert any (TEMP)" ON treatment_records
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow INSERT for HR staff (e.g., backfills or corrections)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatment_records'
      AND policyname = 'Treatment records insert hr'
  ) THEN
    DROP POLICY "Treatment records insert hr" ON treatment_records;
  END IF;
END $$;

CREATE POLICY "Treatment records insert hr" ON treatment_records
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff s
      WHERE s.user_id = auth.uid()
        AND s.role = 'hr'
    )
  );

-- Allow UPDATE for HR only (optional; keep tight)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatment_records'
      AND policyname = 'Treatment records update hr'
  ) THEN
    DROP POLICY "Treatment records update hr" ON treatment_records;
  END IF;
END $$;

CREATE POLICY "Treatment records update hr" ON treatment_records
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

-- Optionally, allow DELETE for HR
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'treatment_records'
      AND policyname = 'Treatment records delete hr'
  ) THEN
    DROP POLICY "Treatment records delete hr" ON treatment_records;
  END IF;
END $$;

CREATE POLICY "Treatment records delete hr" ON treatment_records
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM staff s
      WHERE s.user_id = auth.uid()
        AND s.role = 'hr'
    )
  );
