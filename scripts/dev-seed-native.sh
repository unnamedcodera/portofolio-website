#!/bin/bash

# Add Node.js@20 to PATH
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

echo "🌱 Seeding development database..."
echo "📝 This will populate the database with sample data"
echo ""

# Check if PostgreSQL is running
if ! brew services list | grep -q "postgresql@15.*started"; then
    echo "❌ PostgreSQL is not running!"
    echo "💡 Start it with: brew services start postgresql@15"
    exit 1
fi

# Check if seed.js exists
if [ ! -f "backend/seed.js" ]; then
    echo "❌ Seed file not found: backend/seed.js"
    echo "💡 Make sure you're in the project root directory"
    exit 1
fi

# Change to backend directory
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Set environment variables for seeding
export NODE_ENV=development
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=darahitam_dev
export DB_USER=darahitam
export DB_PASSWORD=dev_password_2024

echo "🏃 Running database seed..."
node seed-postgres.js

if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully!"
    echo "🎉 Your development database now has sample data"
else
    echo "❌ Database seeding failed!"
    echo "💡 Check the logs above for error details"
    exit 1
fi