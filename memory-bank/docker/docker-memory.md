# Docker & Infrastructure Memory Bank

## Overview
Docker containerization setup for Crackers Bazaar with PostgreSQL database, pgAdmin management interface, and development environment configuration.

## Technology Stack
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 15-alpine
- **Management**: pgAdmin 4
- **Networking**: Docker networks
- **Storage**: Docker volumes

## Docker Configuration

### Main Compose File
**File**: `docker-compose.yml`
- PostgreSQL database container
- pgAdmin management interface
- Persistent data volumes
- Network configuration
- Environment variables

### Development Compose File
**File**: `docker-compose.dev.yml`
- Development-specific configuration
- Additional development tools
- Debug settings
- Hot reloading support

## Container Services

### PostgreSQL Database
```yaml
postgres:
  image: postgres:15-alpine
  container_name: crackers-bazaar-postgres
  restart: unless-stopped
  environment:
    POSTGRES_DB: crackers_bazaar
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: password
  ports:
    - "5432:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./init-scripts:/docker-entrypoint-initdb.d
  networks:
    - crackers-network
```

**Features**:
- Alpine Linux base image (lightweight)
- Automatic restart policy
- Persistent data storage
- Initialization script mounting
- Network isolation

### pgAdmin Management Interface
```yaml
pgadmin:
  image: dpage/pgadmin4:latest
  container_name: crackers-bazaar-pgadmin
  restart: unless-stopped
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@crackersbazaar.com
    PGADMIN_DEFAULT_PASSWORD: admin123
  ports:
    - "5050:80"
  volumes:
    - pgadmin_data:/var/lib/pgadmin
  depends_on:
    - postgres
  networks:
    - crackers-network
```

**Features**:
- Web-based database management
- Automatic server connection
- Persistent configuration
- Dependency management

## Network Configuration

### Docker Network
```yaml
networks:
  crackers-network:
    driver: bridge
```

**Features**:
- Isolated network for services
- Internal communication
- Security isolation
- Service discovery

## Volume Management

### Data Volumes
```yaml
volumes:
  postgres_data:
    driver: local
  pgadmin_data:
    driver: local
```

**Features**:
- Persistent data storage
- Data backup and recovery
- Volume management
- Data isolation

## Port Configuration

### Service Ports
- **PostgreSQL**: 5432 (database access)
- **pgAdmin**: 5050 (web interface)
- **Backend**: 8080 (Spring Boot)
- **Frontend**: 3000 (React dev server)

### Port Mapping
- Host to container port mapping
- External access configuration
- Security considerations
- Development vs production

## Environment Variables

### Database Configuration
- **POSTGRES_DB**: crackers_bazaar
- **POSTGRES_USER**: postgres
- **POSTGRES_PASSWORD**: password

### pgAdmin Configuration
- **PGADMIN_DEFAULT_EMAIL**: admin@crackersbazaar.com
- **PGADMIN_DEFAULT_PASSWORD**: admin123

### Application Configuration
- **DATABASE_URL**: jdbc:postgresql://localhost:5432/crackers_bazaar
- **DATABASE_USERNAME**: postgres
- **DATABASE_PASSWORD**: password

## Development Scripts

### Database Management Scripts
**File**: `scripts/start-db.sh`
```bash
#!/bin/bash
# Start PostgreSQL database
docker-compose up -d postgres
```

**File**: `scripts/stop-db.sh`
```bash
#!/bin/bash
# Stop PostgreSQL database
docker-compose down postgres
```

**File**: `scripts/reset-db.sh`
```bash
#!/bin/bash
# Reset database and volumes
docker-compose down -v
docker-compose up -d postgres
```

### Script Features
- Database lifecycle management
- Volume management
- Cleanup operations
- Development workflow

## Initialization Scripts

### Database Initialization
**File**: `init-scripts/01-init.sql`
- Database setup script
- Extension creation
- Index creation
- Initial data preparation

### Initialization Features
- Automatic script execution
- Database schema setup
- Performance optimization
- Data preparation

## Development Workflow

### Local Development Setup
1. **Start Database**:
   ```bash
   docker-compose up -d postgres
   ```

2. **Start Backend**:
   ```bash
   cd backend && mvn spring-boot:run
   ```

3. **Start Frontend**:
   ```bash
   cd frontend && npm start
   ```

### Development Features
- Hot reloading support
- Debug configuration
- Log aggregation
- Service monitoring

## Production Configuration

### Production Considerations
- Environment variable management
- Secret management
- Resource limits
- Security hardening
- Monitoring and logging

### Production Deployment
- Container orchestration
- Load balancing
- Health checks
- Auto-scaling
- Backup strategies

## Monitoring and Logging

### Container Monitoring
- Container health checks
- Resource usage monitoring
- Log aggregation
- Performance metrics

### Database Monitoring
- Connection monitoring
- Query performance
- Storage usage
- Backup status

## Security Configuration

### Container Security
- Non-root user execution
- Resource limits
- Network isolation
- Secret management

### Database Security
- Encrypted connections
- Access control
- Audit logging
- Backup encryption

## Troubleshooting

### Common Issues
- Container startup failures
- Network connectivity issues
- Volume mounting problems
- Port conflicts

### Solutions
- Container logs inspection
- Network debugging
- Volume verification
- Port conflict resolution

## Backup and Recovery

### Data Backup
- Volume backup strategies
- Database backup procedures
- Configuration backup
- Disaster recovery plans

### Recovery Procedures
- Data restoration
- Service recovery
- Configuration recovery
- Testing procedures

## Performance Optimization

### Container Optimization
- Resource allocation
- Memory management
- CPU optimization
- Network optimization

### Database Optimization
- Connection pooling
- Query optimization
- Index management
- Storage optimization

## Documentation

### Setup Documentation
**File**: `README_DOCKER.md`
- Docker setup instructions
- Service configuration
- Development workflow
- Troubleshooting guide

### API Documentation
**File**: `DOCKER_SETUP.md`
- API endpoint documentation
- Service integration
- Configuration reference
- Best practices

---

*Last Updated: [Current Date]*
*Module: Docker & Infrastructure*
*Status: Active Development*
