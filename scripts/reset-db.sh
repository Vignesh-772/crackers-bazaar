#!/bin/bash

# Reset PostgreSQL database (removes all data)
echo "⚠️  Resetting PostgreSQL database..."
echo "This will remove ALL data from the database!"

read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Operation cancelled."
    exit 1
fi

# Stop and remove containers and volumes
docker-compose -f docker-compose.yml down -v

echo "🗑️  Removed all containers and volumes."

# Start fresh
docker-compose -f docker-compose.yml up -d postgres

echo "✅ PostgreSQL reset and started successfully!"
echo "📍 Database URL: jdbc:postgresql://localhost:5432/crackers_bazaar"
echo "👤 Username: postgres"
echo "🔑 Password: password"

