# Featured Column Migration Fix

## Problem
The database schema had a column named `is_featured` but the application code was trying to use `featured`, causing this error when creating or editing projects:
```
"column \"featured\" of relation \"projects\" does not exist"
```

## Solution
1. **Updated Schema**: Changed `is_featured` to `featured` in `backend/database.sql`
2. **Created Migration**: Added `backend/migrate-featured-column.sql` to rename the column in existing databases
3. **Created Migration Script**: Added `scripts/migrate-featured.sh` for easy execution

## How to Fix Your Database

### Option 1: Run the migration script (Recommended for local)
```bash
./scripts/migrate-featured.sh
```

### Option 2: Manual SQL command (Recommended for server)

**On your server (root@srv1097148), run these commands:**

First, check your database user and name:
```bash
docker exec $(docker ps | grep postgres | awk '{print $1}') printenv | grep POSTGRES
```

Then run the migration (replace `darahitam` with your actual DB user if different):
```bash
docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U darahitam -d darahitam_db -c "ALTER TABLE projects RENAME COLUMN is_featured TO featured;"
```

Fix the index:
```bash
docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U darahitam -d darahitam_db -c "DROP INDEX IF EXISTS idx_projects_featured; CREATE INDEX idx_projects_featured ON projects(featured);"
```

### Option 3: Interactive psql
Connect to psql interactively:
```bash
docker exec -it $(docker ps | grep postgres | awk '{print $1}') psql -U darahitam -d darahitam_db
```

Then run:
```sql
ALTER TABLE projects RENAME COLUMN is_featured TO featured;
DROP INDEX IF EXISTS idx_projects_featured;
CREATE INDEX idx_projects_featured ON projects(featured);
\q
```

## Verification
After running the migration, try creating or editing a project. The error should be resolved.

## For Fresh Installations
New databases will automatically have the correct `featured` column name since the schema file has been updated.
