-- Migration: Add missing columns to projects table
-- This adds columns that exist in database.sql but may be missing in running database

DO $$
BEGIN
  -- Add category column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'category'
  ) THEN
    ALTER TABLE projects ADD COLUMN category VARCHAR(255);
    RAISE NOTICE 'Added column: category';
  END IF;

  -- Add content column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'content'
  ) THEN
    ALTER TABLE projects ADD COLUMN content TEXT;
    RAISE NOTICE 'Added column: content';
  END IF;

  -- Add canvas_content column if it doesn't exist (rename from canvas_data if needed)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'canvas_content'
  ) THEN
    -- Check if canvas_data exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'canvas_data'
    ) THEN
      ALTER TABLE projects RENAME COLUMN canvas_data TO canvas_content;
      RAISE NOTICE 'Renamed column: canvas_data to canvas_content';
    ELSE
      ALTER TABLE projects ADD COLUMN canvas_content TEXT;
      RAISE NOTICE 'Added column: canvas_content';
    END IF;
  END IF;

  -- Add slug column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'slug'
  ) THEN
    ALTER TABLE projects ADD COLUMN slug VARCHAR(255) UNIQUE;
    RAISE NOTICE 'Added column: slug';
  END IF;

  -- Add author column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'author'
  ) THEN
    ALTER TABLE projects ADD COLUMN author VARCHAR(255);
    RAISE NOTICE 'Added column: author';
  END IF;

  -- Add tags column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'tags'
  ) THEN
    ALTER TABLE projects ADD COLUMN tags TEXT;
    RAISE NOTICE 'Added column: tags';
  END IF;

  -- Add views column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'views'
  ) THEN
    ALTER TABLE projects ADD COLUMN views INTEGER DEFAULT 0;
    RAISE NOTICE 'Added column: views';
  END IF;

  -- Add published_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE projects ADD COLUMN published_at TIMESTAMP;
    RAISE NOTICE 'Added column: published_at';
  END IF;

  -- Ensure featured column exists (might be named is_featured)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'featured'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'projects' AND column_name = 'is_featured'
    ) THEN
      ALTER TABLE projects RENAME COLUMN is_featured TO featured;
      RAISE NOTICE 'Renamed column: is_featured to featured';
    ELSE
      ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT FALSE;
      RAISE NOTICE 'Added column: featured';
    END IF;
  END IF;

  RAISE NOTICE 'Migration completed successfully!';
END $$;
