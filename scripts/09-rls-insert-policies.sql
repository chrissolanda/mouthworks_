-- Add missing insert policies to allow creating patients and payments from the app

-- Patients: allow authenticated user to insert their own row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patients'
      AND policyname = 'Patients can insert themselves'
  ) THEN
    CREATE POLICY "Patients can insert themselves" ON patients
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Payments: allow inserts when the auth user is either the patient owner or HR
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'Patients/HR can insert payments'
  ) THEN
    CREATE POLICY "Patients/HR can insert payments" ON payments
      FOR INSERT
      TO authenticated
      WITH CHECK (
        -- patient creating their own payment
        EXISTS (
          SELECT 1 FROM patients p
          WHERE p.id = payments.patient_id
            AND p.user_id = auth.uid()
        )
        OR
        -- HR can insert any payment
        EXISTS (
          SELECT 1 FROM staff s
          WHERE s.user_id = auth.uid()
            AND s.role = 'hr'
        )
      );
  END IF;
END $$;

-- Optional: dentists can insert payments tied to their appointment/patient
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payments'
      AND policyname = 'Dentists can insert their payments'
  ) THEN
    CREATE POLICY "Dentists can insert their payments" ON payments
      FOR INSERT
      TO authenticated
      WITH CHECK (
        payments.dentist_id IN (
          SELECT d.id FROM dentists d WHERE d.user_id = auth.uid()
        )
      );
  END IF;
END $$;

