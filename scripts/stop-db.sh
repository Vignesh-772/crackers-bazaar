#!/bin/bash

# Stop PostgreSQL database using Docker Compose
echo "🛑 Stopping PostgreSQL database..."

# Stop and remove containers
docker-compose -f docker-compose.yml down

echo "✅ PostgreSQL stopped successfully!"
echo ""
echo "💾 Data is preserved in Docker volumes."
echo "🔄 To start again, run: ./scripts/start-db.sh"

