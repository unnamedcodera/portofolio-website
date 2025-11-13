# Development Environment - PostgreSQL Setup

## ✅ Changes Made

Your development environment now uses **PostgreSQL** (same as production), no more SQLite!

### Removed Files:
- ❌ `backend/database.sqlite` - SQLite database file
- ❌ `backend/database.js` - SQLite database functions

### Updated Files:
- ✅ `backend/.env` - Now uses PostgreSQL configuration
- ✅ `scripts/dev-db-native.sh` - Updated database connection
- ✅ All backend code already uses `database-postgres.js`

### New Files:
- ✅ `scripts/setup-dev-db.sh` - Initialize PostgreSQL database
- ✅ `backend/migrate-canvas-column.js` - Migration script for production

---

## 🚀 Quick Start

### First Time Setup

1. **Setup PostgreSQL Database**
   ```bash
   ./scripts/setup-dev-db.sh
   ```

2. **Start Development Servers**
   ```bash
   ./scripts/dev-start-native.sh
   ```

### Daily Development

```bash
# Start servers (PostgreSQL auto-starts)
./scripts/dev-start-native.sh

# Stop servers
./scripts/dev-stop-native.sh

# Connect to database
./scripts/dev-db-native.sh

# View logs
./scripts/dev-logs-native.sh
```

---

## 🗄️ Database Configuration

### Development (.env)
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=darahitam_db
DB_USER=darahitam_user
DB_PASSWORD=darahitam_pass
```

### Production (docker-compose.prod.yml)
Uses the same schema and functions - **fully compatible!**

---

## 📊 Database Management

### Connect to Database
```bash
./scripts/dev-db-native.sh
```

### Useful SQL Commands
```sql
-- List all tables
\dt

-- View projects
SELECT id, title, slug, category FROM projects;

-- View team members
SELECT id, name, position FROM team_members;

-- View settings
SELECT * FROM settings;

-- Exit
\q
```

### Reset Database
```bash
./scripts/setup-dev-db.sh
```
This will drop and recreate everything.

---

## 🔄 Migrating Production Database

If your production database has the old `canvas_data` column:

### Option 1: Using Migration Script (Recommended)

```bash
# On your production server
cd backend
DB_HOST=your_host DB_USER=your_user DB_PASSWORD=your_pass DB_NAME=your_db node migrate-canvas-column.js
```

### Option 2: Manual SQL

```sql
-- Connect to production database
psql -h your_host -U your_user -d your_db

-- Run migration
BEGIN;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS canvas_content TEXT;
UPDATE projects SET canvas_content = canvas_data WHERE canvas_data IS NOT NULL;
ALTER TABLE projects DROP COLUMN canvas_data;
COMMIT;
```

---

## ✅ Benefits of PostgreSQL Everywhere

1. **Development = Production** - Same database, same behavior
2. **Advanced Features** - Full PostgreSQL features in development
3. **Better Testing** - Test with production-like data
4. **No Surprises** - What works in dev, works in production
5. **Modern Tools** - Better GUI tools, pgAdmin, DBeaver, etc.

---

## 🛠️ Troubleshooting

### PostgreSQL Not Starting
```bash
brew services restart postgresql@15
```

### Can't Connect to Database
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Check if database exists
psql postgres -c "\l" | grep darahitam_db

# Re-run setup
./scripts/setup-dev-db.sh
```

### Port 5432 Already in Use
```bash
# Find what's using the port
lsof -i :5432

# Stop the process
kill -9 <PID>
```

---

## 📝 Notes

- PostgreSQL runs via Homebrew (not Docker) for better performance in development
- Database persists between restarts
- Same schema as production (`backend/database.sql`)
- Auto-initializes with default data (categories, settings)

---

## 🎯 Next Steps

1. ✅ Development database is setup
2. ✅ Development uses PostgreSQL
3. 🔄 Migrate production database (if needed)
4. ✅ Deploy to production

Everything is now consistent! 🚀
