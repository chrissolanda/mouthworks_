-- Clean duplicate dentists and enforce uniqueness on email

-- Remove exact-email duplicates, keep the lowest id per email (compare as text)
DELETE FROM dentists d
WHERE d.id NOT IN (
  SELECT MIN(id::text)::uuid FROM dentists GROUP BY lower(email)
);

-- Add/ensure unique constraint on lower(email)
DO $$
BEGIN
  -- Drop existing index if present to avoid name collision
  PERFORM 1 FROM pg_indexes WHERE indexname = 'dentists_email_lower_key';
  IF FOUND THEN
    EXECUTE 'DROP INDEX IF EXISTS dentists_email_lower_key';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'dentists_email_lower_key'
      AND conrelid = 'public.dentists'::regclass
  ) THEN
    CREATE UNIQUE INDEX dentists_email_lower_key ON dentists (lower(email));
  END IF;
END $$;

