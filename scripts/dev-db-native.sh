#!/bin/bash

echo "🗄️  Connecting to PostgreSQL Database..."
echo "💡 You'll be connected to the development database"
echo "📝 Database: darahitam_dev, User: darahitam"
echo ""

# Check if PostgreSQL is running
if ! brew services list | grep -q "postgresql@15.*started"; then
    echo "❌ PostgreSQL is not running!"
    echo "💡 Start it with: brew services start postgresql@15"
    exit 1
fi

# Connect to database
psql -h localhost -U darahitam -d darahitam_dev