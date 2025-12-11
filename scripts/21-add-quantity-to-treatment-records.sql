-- Add quantity column to treatment_records table
-- This is needed to track how many times a treatment was performed

ALTER TABLE treatment_records 
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1;

-- Add comment for documentation
COMMENT ON COLUMN treatment_records.quantity IS 'Number of times this treatment was performed in the appointment';
