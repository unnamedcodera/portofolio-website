#!/bin/bash

# Seed Production Database
# This script seeds the database with initial data

echo "🌱 Seeding production database..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.production to .env and configure it first."
    exit 1
fi

# Load environment variables
source .env

# Seed the database using the backend container
docker exec darahitam_backend node -e "
import('./database-postgres.js').then(async (db) => {
  try {
    console.log('🔄 Initializing database...');
    await db.initDatabase();
    console.log('✅ Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
});
"

echo "✅ Database seeding complete!"
