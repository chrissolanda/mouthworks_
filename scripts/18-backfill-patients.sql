-- Backfill patients for all auth_users (so every user has a patient record)

INSERT INTO patients (id, user_id, name, email, phone, dob, gender, address)
SELECT gen_random_uuid(), au.id, COALESCE(au.name, au.email), au.email, au.phone, NULL, NULL, NULL
FROM auth_users au
WHERE NOT EXISTS (
  SELECT 1 FROM patients p WHERE p.email = au.email
);

