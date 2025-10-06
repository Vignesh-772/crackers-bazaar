#!/bin/bash

# Start PostgreSQL database using Docker Compose
echo "🐘 Starting PostgreSQL database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start the database
docker-compose -f docker-compose.yml up -d postgres

echo "✅ PostgreSQL started successfully!"
echo "📍 Database URL: jdbc:postgresql://localhost:5432/crackers_bazaar"
echo "👤 Username: postgres"
echo "🔑 Password: password"
echo ""
echo "🔧 To start pgAdmin as well, run: docker-compose -f docker-compose.yml up -d"
echo "🌐 pgAdmin will be available at: http://localhost:5050"
echo "   Email: admin@crackersbazaar.com"
echo "   Password: admin123"

