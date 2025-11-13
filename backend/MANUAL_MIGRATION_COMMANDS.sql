-- Quick Migration Fix for Featured Column
-- Run this directly on your server

-- For Docker (on server):
-- First, find your postgres container user and database name:
-- docker exec -i <container_id> printenv | grep POSTGRES

-- Then run this command (replace with your actual values):
-- docker exec -i <container_id> psql -U <your_db_user> -d <your_db_name> -c "ALTER TABLE projects RENAME COLUMN is_featured TO featured;"

-- For the provided example (root@srv1097148):
-- If the database user is 'darahitam' and database is 'darahitam_db':
-- docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U darahitam -d darahitam_db -c "ALTER TABLE projects RENAME COLUMN is_featured TO featured;"

-- Also fix the index:
-- docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U darahitam -d darahitam_db -c "DROP INDEX IF EXISTS idx_projects_featured; CREATE INDEX idx_projects_featured ON projects(featured);"

-- ALTERNATIVE: Connect to psql first, then run commands
-- docker exec -it $(docker ps | grep postgres | awk '{print $1}') psql -U darahitam -d darahitam_db

-- Then inside psql:
-- ALTER TABLE projects RENAME COLUMN is_featured TO featured;
-- DROP INDEX IF EXISTS idx_projects_featured;
-- CREATE INDEX idx_projects_featured ON projects(featured);
-- \q

-- Verify the change:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'featured';
