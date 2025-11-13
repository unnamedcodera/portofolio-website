#!/bin/bash

# Migration script to fix the featured column in projects table
# This renames is_featured to featured to match the application code

set -e

echo "🔄 Starting migration to rename is_featured to featured..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Load environment variables if .env exists
if [ -f "$PROJECT_ROOT/.env" ]; then
  export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
fi

# Set default values if not in environment
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-darahitam_dev}
DB_USER=${DB_USER:-darahitam}
DB_PASSWORD=${DB_PASSWORD:-dev_password_2024}

echo "Using database: $DB_NAME"
echo "Using user: $DB_USER"
echo "Using host: $DB_HOST:$DB_PORT"
echo ""

# Check if we're using Docker (check if postgres container exists)
if docker ps 2>/dev/null | grep -q postgres; then
  echo "📦 Docker container detected, running migration in Docker..."
  # Get the actual postgres user from docker
  DOCKER_USER=$(docker exec $(docker ps | grep postgres | awk '{print $1}') printenv POSTGRES_USER 2>/dev/null || echo "darahitam")
  docker exec -i $(docker ps | grep postgres | awk '{print $1}') psql -U $DOCKER_USER -d $DB_NAME < "$PROJECT_ROOT/backend/migrate-featured-column.sql"
else
  echo "💻 Running migration on local PostgreSQL..."
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$PROJECT_ROOT/backend/migrate-featured-column.sql"
fi

echo "✅ Migration completed successfully!"
echo ""
echo "The 'is_featured' column has been renamed to 'featured' in the projects table."
