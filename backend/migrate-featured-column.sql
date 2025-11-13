-- Migration: Rename is_featured to featured column in projects table
-- This fixes the mismatch between the schema and the application code

-- Step 1: Check if is_featured column exists and featured doesn't
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'is_featured'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'featured'
  ) THEN
    -- Rename the column
    ALTER TABLE projects RENAME COLUMN is_featured TO featured;
    RAISE NOTICE 'Column is_featured renamed to featured';
  ELSIF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'featured'
  ) THEN
    RAISE NOTICE 'Column featured already exists, no migration needed';
  ELSE
    -- Neither column exists, create featured column
    ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Column featured created';
  END IF;
END $$;
