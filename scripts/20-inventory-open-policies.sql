-- Open RLS for inventory to allow CRUD from the app
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inventory'
      AND policyname = 'Inventory select any'
  ) THEN
    CREATE POLICY "Inventory select any" ON inventory
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inventory'
      AND policyname = 'Inventory insert any'
  ) THEN
    CREATE POLICY "Inventory insert any" ON inventory
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
      AND tablename = 'inventory'
      AND policyname = 'Inventory update any'
  ) THEN
    CREATE POLICY "Inventory update any" ON inventory
      FOR UPDATE
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inventory'
      AND policyname = 'Inventory delete any'
  ) THEN
    CREATE POLICY "Inventory delete any" ON inventory
      FOR DELETE
      TO public
      USING (true);
  END IF;
END $$;

