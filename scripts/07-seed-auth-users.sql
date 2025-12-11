-- Seed core auth/staff/patient users and link them to domain tables
-- Safe to run multiple times; uses upserts/updates on email match.

-- 1) Upsert auth_users for dentists, HR, and demo patients (explicit IDs)
WITH upsert_auth AS (
  INSERT INTO auth_users (id, email, password_hash, name, role, phone, specialization)
  VALUES
    (gen_random_uuid(), 'sarah.smith@dental.com',     'Changeme!123', 'Dr. Sarah Smith',   'dentist', '+1 (555) 123-4567', 'General Dentistry'),
    (gen_random_uuid(), 'john.doe@dental.com',        'Changeme!123', 'Dr. John Doe',      'dentist', '+1 (555) 234-5678', 'Orthodontics'),
    (gen_random_uuid(), 'emily.johnson@dental.com',   'Changeme!123', 'Dr. Emily Johnson', 'dentist', '+1 (555) 345-6789', 'Periodontics'),
    (gen_random_uuid(), 'michael.chen@dental.com',    'Changeme!123', 'Dr. Michael Chen',  'dentist', '+1 (555) 456-7890', 'Prosthodontics'),
    (gen_random_uuid(), 'lisa.anderson@dental.com',   'Changeme!123', 'Dr. Lisa Anderson', 'dentist', '+1 (555) 567-8901', 'Endodontics'),
    (gen_random_uuid(), 'hr@mouthworks.com',          'Changeme!123', 'Mouthworks HR',     'hr',      '+1 (555) 000-0000', NULL),
    (gen_random_uuid(), 'patient.one@mouthworks.com',  'Changeme!123', 'Patient One',       'patient', '+1 (555) 101-0001', NULL),
    (gen_random_uuid(), 'patient.two@mouthworks.com',  'Changeme!123', 'Patient Two',       'patient', '+1 (555) 102-0002', NULL),
    (gen_random_uuid(), 'patient.three@mouthworks.com','Changeme!123', 'Patient Three',     'patient', '+1 (555) 103-0003', NULL)
  ON CONFLICT (email) DO UPDATE
    SET name = EXCLUDED.name,
        role = EXCLUDED.role,
        phone = EXCLUDED.phone,
        specialization = EXCLUDED.specialization,
        updated_at = CURRENT_TIMESTAMP
  RETURNING id, email, role, name, phone, specialization
)
SELECT * FROM upsert_auth;

-- 2) Ensure dentists table rows are linked to auth_users
INSERT INTO dentists (id, user_id, name, email, phone, specialization)
SELECT gen_random_uuid(), au.id, au.name, au.email, au.phone, au.specialization
FROM auth_users au
WHERE au.role = 'dentist'
  AND NOT EXISTS (SELECT 1 FROM dentists d WHERE d.email = au.email);

UPDATE dentists d
SET user_id = au.id,
    name = au.name,
    phone = au.phone,
    specialization = au.specialization,
    updated_at = CURRENT_TIMESTAMP
FROM auth_users au
WHERE d.email = au.email
  AND au.role = 'dentist'
  AND (d.user_id IS DISTINCT FROM au.id OR d.name IS DISTINCT FROM au.name OR d.phone IS DISTINCT FROM au.phone OR d.specialization IS DISTINCT FROM au.specialization);

-- 3) Ensure HR staff row exists and is linked
INSERT INTO staff (id, user_id, name, email, role, phone)
SELECT gen_random_uuid(), au.id, au.name, au.email, 'hr', au.phone
FROM auth_users au
WHERE au.role = 'hr'
  AND NOT EXISTS (SELECT 1 FROM staff s WHERE s.email = au.email);

UPDATE staff s
SET user_id = au.id,
    name = au.name,
    role = 'hr',
    phone = au.phone,
    updated_at = CURRENT_TIMESTAMP
FROM auth_users au
WHERE s.email = au.email
  AND au.role = 'hr'
  AND (s.user_id IS DISTINCT FROM au.id OR s.name IS DISTINCT FROM au.name OR s.phone IS DISTINCT FROM au.phone);

-- 4) Ensure patient rows exist and are linked
INSERT INTO patients (id, user_id, name, email, phone, dob, gender, address)
SELECT gen_random_uuid(), au.id, au.name, au.email, au.phone, NULL, NULL, NULL
FROM auth_users au
WHERE au.role = 'patient'
  AND NOT EXISTS (SELECT 1 FROM patients p WHERE p.email = au.email);

UPDATE patients p
SET user_id = au.id,
    name = au.name,
    phone = au.phone,
    updated_at = CURRENT_TIMESTAMP
FROM auth_users au
WHERE p.email = au.email
  AND au.role = 'patient'
  AND (p.user_id IS DISTINCT FROM au.id OR p.name IS DISTINCT FROM au.name OR p.phone IS DISTINCT FROM au.phone);

-- Verification hints:
-- SELECT role, count(*) FROM auth_users GROUP BY role;
-- SELECT count(*) FROM dentists WHERE user_id IS NOT NULL;
-- SELECT count(*) FROM patients WHERE user_id IS NOT NULL;
-- SELECT count(*) FROM staff WHERE role = 'hr';

