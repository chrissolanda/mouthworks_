-- Seed treatments/services so patients can select them
-- Safe to run multiple times; uses ON CONFLICT on (name, category)

-- Ensure unique constraint exists for upsert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'treatments'
      AND indexname = 'treatments_name_category_key'
  ) THEN
    ALTER TABLE treatments ADD CONSTRAINT treatments_name_category_key UNIQUE (name, category);
  END IF;
END $$;

INSERT INTO treatments (id, name, category, price, description)
VALUES
  (gen_random_uuid(), 'Comprehensive Oral Exam', 'Examination', 50.00, 'Full mouth exam with treatment planning'),
  (gen_random_uuid(), 'Prophylaxis (Cleaning)', 'Cleaning', 75.00, 'Routine dental cleaning'),
  (gen_random_uuid(), 'Deep Cleaning (SRP)', 'Cleaning', 300.00, 'Scaling and root planing per quadrant'),
  (gen_random_uuid(), 'Fluoride Treatment', 'Preventive', 35.00, 'Topical fluoride application'),
  (gen_random_uuid(), 'Dental Sealant', 'Preventive', 40.00, 'Sealant per tooth'),
  (gen_random_uuid(), 'Tooth-Colored Filling', 'Restorative', 180.00, 'Composite restoration, single surface'),
  (gen_random_uuid(), 'Root Canal Therapy (Anterior)', 'Endodontics', 650.00, 'Root canal on anterior tooth'),
  (gen_random_uuid(), 'Root Canal Therapy (Molar)', 'Endodontics', 900.00, 'Root canal on molar'),
  (gen_random_uuid(), 'Crown - Porcelain', 'Prosthodontics', 1100.00, 'Full coverage porcelain crown'),
  (gen_random_uuid(), 'Dental Bridge', 'Prosthodontics', 1800.00, 'Three-unit fixed bridge'),
  (gen_random_uuid(), 'Tooth Extraction (Simple)', 'Oral Surgery', 150.00, 'Simple extraction'),
  (gen_random_uuid(), 'Surgical Extraction', 'Oral Surgery', 300.00, 'Surgical extraction of erupted tooth'),
  (gen_random_uuid(), 'Dental Implant Placement', 'Implants', 2500.00, 'Implant fixture placement'),
  (gen_random_uuid(), 'Implant Crown', 'Implants', 1500.00, 'Crown on existing implant'),
  (gen_random_uuid(), 'Orthodontic Consultation', 'Orthodontics', 80.00, 'Consult and records'),
  (gen_random_uuid(), 'Braces (Metal)', 'Orthodontics', 3500.00, 'Comprehensive orthodontic treatment'),
  (gen_random_uuid(), 'Clear Aligners (Case Start)', 'Orthodontics', 2800.00, 'Aligner case start fee'),
  (gen_random_uuid(), 'Whitening (In-Office)', 'Cosmetic', 400.00, 'In-office teeth whitening'),
  (gen_random_uuid(), 'Veneer (Per Tooth)', 'Cosmetic', 900.00, 'Porcelain veneer per tooth'),
  (gen_random_uuid(), 'Periodontal Maintenance', 'Periodontics', 180.00, 'Periodontal maintenance visit')
ON CONFLICT (name, category) DO UPDATE
SET price = EXCLUDED.price,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

