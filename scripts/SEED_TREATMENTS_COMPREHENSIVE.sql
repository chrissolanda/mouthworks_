-- Seed treatments/services so patients and dentists can select them
-- This file contains all dental services with proper pricing
-- Safe to run multiple times

-- Clear existing data if needed (OPTIONAL - comment out if you want to keep existing)
-- TRUNCATE TABLE treatments CASCADE;

INSERT INTO treatments (id, name, category, price, description)
VALUES
  (gen_random_uuid(), 'Comprehensive Oral Exam', 'Examination', 500.00, 'Full mouth exam with treatment planning'),
  (gen_random_uuid(), 'Prophylaxis (Cleaning)', 'Cleaning', 300.00, 'Routine dental cleaning'),
  (gen_random_uuid(), 'Deep Cleaning (SRP)', 'Cleaning', 800.00, 'Scaling and root planing per quadrant'),
  (gen_random_uuid(), 'Fluoride Treatment', 'Preventive', 350.00, 'Topical fluoride application'),
  (gen_random_uuid(), 'Dental Sealant', 'Preventive', 400.00, 'Sealant per tooth'),
  (gen_random_uuid(), 'Tooth-Colored Filling (1 Surface)', 'Restorative', 800.00, 'Composite restoration, single surface'),
  (gen_random_uuid(), 'Tooth-Colored Filling (2+ Surfaces)', 'Restorative', 1200.00, 'Composite restoration, multiple surfaces'),
  (gen_random_uuid(), 'Root Canal Therapy (Anterior)', 'Endodontics', 1500.00, 'Root canal on anterior tooth'),
  (gen_random_uuid(), 'Root Canal Therapy (Molar)', 'Endodontics', 2000.00, 'Root canal on molar'),
  (gen_random_uuid(), 'Root Canal Therapy (Premolar)', 'Endodontics', 1800.00, 'Root canal on premolar'),
  (gen_random_uuid(), 'Crown - All Ceramic', 'Prosthodontics', 2500.00, 'Full coverage ceramic crown'),
  (gen_random_uuid(), 'Crown - Porcelain Fused to Metal', 'Prosthodontics', 2200.00, 'PFM crown'),
  (gen_random_uuid(), 'Bridge - Three Unit', 'Prosthodontics', 3500.00, 'Three-unit fixed bridge'),
  (gen_random_uuid(), 'Simple Extraction', 'Oral Surgery', 600.00, 'Simple tooth extraction'),
  (gen_random_uuid(), 'Surgical Extraction', 'Oral Surgery', 1200.00, 'Surgical extraction of erupted tooth'),
  (gen_random_uuid(), 'Impacted Tooth Extraction', 'Oral Surgery', 1500.00, 'Extraction of impacted tooth'),
  (gen_random_uuid(), 'Dental Implant Placement', 'Implants', 2500.00, 'Implant fixture placement'),
  (gen_random_uuid(), 'Implant Crown', 'Implants', 2000.00, 'Crown on existing implant'),
  (gen_random_uuid(), 'Implant Abutment', 'Implants', 800.00, 'Custom abutment for implant'),
  (gen_random_uuid(), 'Orthodontic Consultation', 'Orthodontics', 300.00, 'Consult and records'),
  (gen_random_uuid(), 'Braces - Metal (Full Treatment)', 'Orthodontics', 3500.00, 'Comprehensive orthodontic treatment'),
  (gen_random_uuid(), 'Braces - Ceramic (Full Treatment)', 'Orthodontics', 4500.00, 'Ceramic braces full treatment'),
  (gen_random_uuid(), 'Clear Aligners (Full Case)', 'Orthodontics', 3000.00, 'Clear aligner case start fee'),
  (gen_random_uuid(), 'Teeth Whitening (In-Office)', 'Cosmetic', 1200.00, 'In-office professional teeth whitening'),
  (gen_random_uuid(), 'Teeth Whitening (Take-Home)', 'Cosmetic', 600.00, 'Take-home whitening kit'),
  (gen_random_uuid(), 'Veneer - Porcelain (Per Tooth)', 'Cosmetic', 1500.00, 'Porcelain veneer per tooth'),
  (gen_random_uuid(), 'Periodontal Maintenance', 'Periodontics', 600.00, 'Periodontal maintenance visit'),
  (gen_random_uuid(), 'Periodontal Therapy', 'Periodontics', 1000.00, 'Non-surgical periodontal therapy'),
  (gen_random_uuid(), 'Bonded Veneer', 'Cosmetic', 600.00, 'Bonded resin veneer'),
  (gen_random_uuid(), 'Emergency Consultation', 'Emergency', 200.00, 'Emergency dental consultation'),
  (gen_random_uuid(), 'Emergency Pain Relief', 'Emergency', 300.00, 'Emergency pain relief treatment'),
  (gen_random_uuid(), 'Temporary Filling', 'Restorative', 150.00, 'Temporary filling'),
  (gen_random_uuid(), 'Denture - Complete', 'Prosthodontics', 2500.00, 'Complete denture'),
  (gen_random_uuid(), 'Denture - Partial', 'Prosthodontics', 2000.00, 'Partial denture'),
  (gen_random_uuid(), 'Denture Reline', 'Prosthodontics', 600.00, 'Denture reline')
ON CONFLICT DO NOTHING;

-- Verify the data was inserted
SELECT COUNT(*) as treatment_count FROM treatments;
