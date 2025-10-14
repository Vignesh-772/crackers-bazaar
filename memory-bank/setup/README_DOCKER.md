# Crackers Bazaar - Docker Setup

## 🚀 Quick Start with Docker

### 1. Start PostgreSQL Database

```bash
# Start PostgreSQL using the provided script
./scripts/start-db.sh

# Or manually with Docker Compose
docker-compose -f docker-compose.yml up -d postgres
```

### 2. Database Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** crackers_bazaar
- **Username:** postgres
- **Password:** password

### 3. Optional - Start pgAdmin (Database Management UI)

```bash
docker-compose -f docker-compose.yml up -d
```

Access pgAdmin at: http://localhost:5050
- **Email:** admin@crackersbazaar.com
- **Password:** admin123

### 4. Start the Application

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm start
```

## 🔧 Available Scripts

- `./scripts/start-db.sh` - Start PostgreSQL
- `./scripts/stop-db.sh` - Stop PostgreSQL  
- `./scripts/reset-db.sh` - Reset database (removes all data)

## 📊 Default Users

The following admin users are automatically created:

- **Admin:** `admin` / `admin123`
- **Dashboard Admin:** `dashboard_admin` / `dashboard123`

## 🛠️ Development Commands

### View Database Logs
```bash
docker-compose -f docker-compose.yml logs postgres
```

### Reset Database (Clean Start)
```bash
./scripts/reset-db.sh
```

### Stop All Services
```bash
docker-compose -f docker-compose.yml down
```

## 📁 Project Structure with Docker

```
crackers-bazaar/
├── docker-compose.yml          # Main Docker Compose file
├── docker-compose.dev.yml      # Development overrides
├── init-scripts/               # Database initialization scripts
├── scripts/                    # Helper scripts
│   ├── start-db.sh
│   ├── stop-db.sh
│   └── reset-db.sh
├── backend/                    # Spring Boot backend
├── frontend/                   # React TypeScript frontend
└── DOCKER_SETUP.md            # Detailed Docker documentation
```

## 🔒 Features

- **PostgreSQL 15** with Alpine Linux
- **pgAdmin 4** for database management
- **Persistent data** with Docker volumes
- **Environment-based configuration**
- **Development and production profiles**
- **JWT authentication** with 24-hour expiry
- **Role-based access control**

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 5432
lsof -i :5432

# Or change the port in docker-compose.yml
```

### Permission Issues
```bash
# Fix script permissions
chmod +x scripts/*.sh
```

### Container Won't Start
```bash
# Check logs
docker logs crackers-bazaar-postgres

# Remove and recreate
docker-compose -f docker-compose.yml down -v
docker-compose -f docker-compose.yml up -d postgres
```

For more detailed information, see [DOCKER_SETUP.md](./DOCKER_SETUP.md).

