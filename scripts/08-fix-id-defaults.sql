-- Ensure primary key ID columns have defaults (fixes NULL id errors)

ALTER TABLE auth_users     ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE patients       ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE dentists       ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE staff          ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE treatments     ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE appointments   ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE treatment_records ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE payments       ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE inventory      ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE supply_requests ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- If you imported an old schema without defaults, run this once before seeding.

