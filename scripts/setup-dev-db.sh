#!/bin/bash

echo "🗄️  Setting up PostgreSQL for Development..."
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo "💡 Install with: brew install postgresql@15"
    exit 1
fi

# Start PostgreSQL if not running
if ! brew services list | grep -q "postgresql@15.*started"; then
    echo "🔧 Starting PostgreSQL..."
    brew services start postgresql@15
    sleep 3
fi

echo "✅ PostgreSQL is running"
echo ""

# Create user and database
echo "📝 Creating database and user..."
psql postgres <<EOF
-- Drop existing database and user if they exist
DROP DATABASE IF EXISTS darahitam_db;
DROP USER IF EXISTS darahitam_user;

-- Create user
CREATE USER darahitam_user WITH PASSWORD 'darahitam_pass';

-- Create database
CREATE DATABASE darahitam_db OWNER darahitam_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE darahitam_db TO darahitam_user;

\c darahitam_db
GRANT ALL ON SCHEMA public TO darahitam_user;
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database and user created successfully"
else
    echo "❌ Failed to create database and user"
    exit 1
fi

echo ""
echo "📋 Initializing database schema..."

# Run the database initialization script
psql -h localhost -U darahitam_user -d darahitam_db < backend/database.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema initialized successfully"
else
    echo "❌ Failed to initialize database schema"
    exit 1
fi

echo ""
echo "✅ Development database setup complete!"
echo ""
echo "🔗 Connection Details:"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Database: darahitam_db"
echo "   User: darahitam_user"
echo "   Password: darahitam_pass"
echo ""
echo "💡 You can now start the development server with: ./scripts/dev-start-native.sh"
