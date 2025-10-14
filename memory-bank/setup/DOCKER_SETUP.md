# Docker Setup for Crackers Bazaar

This document explains how to set up and use PostgreSQL with Docker Compose for the Crackers Bazaar project.

## 🐘 PostgreSQL with Docker Compose

### Quick Start

1. **Start the database:**
   ```bash
   ./scripts/start-db.sh
   ```

2. **Start with pgAdmin (optional):**
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

### Manual Commands

#### Start PostgreSQL only
```bash
docker-compose -f docker-compose.yml up -d postgres
```

#### Start PostgreSQL + pgAdmin
```bash
docker-compose -f docker-compose.yml up -d
```

#### Stop all services
```bash
docker-compose -f docker-compose.yml down
```

#### Stop and remove all data
```bash
docker-compose -f docker-compose.yml down -v
```

## 📊 Database Configuration

### Connection Details
- **Host:** localhost
- **Port:** 5432
- **Database:** crackers_bazaar
- **Username:** postgres
- **Password:** password

### Connection URL
```
jdbc:postgresql://localhost:5432/crackers_bazaar
```

## 🛠️ pgAdmin (Database Management Tool)

If you started pgAdmin, you can access it at:
- **URL:** http://localhost:5050
- **Email:** admin@crackersbazaar.com
- **Password:** admin123

### Adding PostgreSQL Server in pgAdmin

1. Right-click "Servers" → "Create" → "Server"
2. **General Tab:**
   - Name: `Crackers Bazaar DB`
3. **Connection Tab:**
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `crackers_bazaar`
   - Username: `postgres`
   - Password: `password`

## 🔧 Environment Variables

The application supports environment variables for configuration:

```bash
# Database Configuration
export DATABASE_URL="jdbc:postgresql://localhost:5432/crackers_bazaar"
export DATABASE_USERNAME="postgres"
export DATABASE_PASSWORD="password"

# JWT Configuration
export JWT_SECRET="your-secret-key"
export JWT_EXPIRATION="86400"

# Logging
export LOG_LEVEL_APP="DEBUG"
export LOG_LEVEL_WEB="DEBUG"
export LOG_LEVEL_SECURITY="DEBUG"
```

## 📁 Docker Compose Files

- `docker-compose.yml` - Main compose file
- `docker-compose.dev.yml` - Development overrides
- `init-scripts/` - SQL initialization scripts

## 🚀 Running the Application

1. **Start PostgreSQL:**
   ```bash
   ./scripts/start-db.sh
   ```

2. **Start Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

## 🔄 Development Workflow

### Reset Database (Clean Start)
```bash
./scripts/reset-db.sh
```

### View Logs
```bash
# PostgreSQL logs
docker-compose -f docker-compose.yml logs postgres

# All services logs
docker-compose -f docker-compose.yml logs -f
```

### Backup Database
```bash
docker exec crackers-bazaar-postgres pg_dump -U postgres crackers_bazaar > backup.sql
```

### Restore Database
```bash
docker exec -i crackers-bazaar-postgres psql -U postgres crackers_bazaar < backup.sql
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5432 is already in use:
```bash
# Check what's using the port
lsof -i :5432

# Stop the conflicting service or change the port in docker-compose.yml
```

### Permission Issues
```bash
# Fix script permissions
chmod +x scripts/*.sh
```

### Container Won't Start
```bash
# Check container logs
docker logs crackers-bazaar-postgres

# Remove and recreate
docker-compose -f docker-compose.yml down -v
docker-compose -f docker-compose.yml up -d postgres
```

## 📋 Available Scripts

- `./scripts/start-db.sh` - Start PostgreSQL
- `./scripts/stop-db.sh` - Stop PostgreSQL
- `./scripts/reset-db.sh` - Reset database (removes all data)

## 🔒 Security Notes

- Default passwords are for development only
- Change passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production deployments

