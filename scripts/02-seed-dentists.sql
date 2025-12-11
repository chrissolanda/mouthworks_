-- Seed dentists into the database (explicit IDs to avoid missing defaults)
INSERT INTO dentists (id, name, email, phone, specialization) VALUES
  (gen_random_uuid(), 'Dr. Sarah Smith', 'sarah.smith@dental.com', '+1 (555) 123-4567', 'General Dentistry'),
  (gen_random_uuid(), 'Dr. John Doe', 'john.doe@dental.com', '+1 (555) 234-5678', 'Orthodontics'),
  (gen_random_uuid(), 'Dr. Emily Johnson', 'emily.johnson@dental.com', '+1 (555) 345-6789', 'Periodontics'),
  (gen_random_uuid(), 'Dr. Michael Chen', 'michael.chen@dental.com', '+1 (555) 456-7890', 'Prosthodontics'),
  (gen_random_uuid(), 'Dr. Lisa Anderson', 'lisa.anderson@dental.com', '+1 (555) 567-8901', 'Endodontics');
