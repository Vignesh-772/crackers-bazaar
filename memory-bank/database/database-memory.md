# Database Module Memory Bank

## Overview
PostgreSQL database setup for Crackers Bazaar with Docker containerization, initialization scripts, and multi-environment configuration.

## Technology Stack
- **Database**: PostgreSQL 15-alpine
- **ORM**: Spring Data JPA + Hibernate
- **Containerization**: Docker
- **Management**: pgAdmin 4
- **Testing**: H2 Database

## Database Architecture

### Production Database
- **Engine**: PostgreSQL 15-alpine
- **Container**: crackers-bazaar-postgres
- **Port**: 5432
- **Database**: crackers_bazaar
- **User**: postgres
- **Password**: password

### Development Database
- **Engine**: PostgreSQL 15-alpine
- **Configuration**: Docker Compose
- **Persistent Storage**: Docker volumes
- **Network**: crackers-network

### Testing Database
- **Engine**: H2 Database (in-memory)
- **Configuration**: Spring Boot test profile
- **URL**: jdbc:h2:mem:testdb
- **Console**: http://localhost:8080/h2-console

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table Structure Details
- **id**: Primary key, auto-incrementing
- **username**: Unique identifier, max 50 characters
- **email**: Unique email address, max 100 characters
- **password**: Encrypted password, max 120 characters
- **first_name**: User's first name, max 50 characters
- **last_name**: User's last name, max 50 characters
- **role**: User role enum (RETAILER, DASHBOARD_ADMIN, ADMIN, MANUFACTURER)
- **is_active**: Account status flag
- **created_at**: Account creation timestamp
- **updated_at**: Last modification timestamp

## Docker Configuration

### PostgreSQL Container
**File**: `docker-compose.yml`
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

### pgAdmin Container
**File**: `docker-compose.yml`
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

## Database Initialization

### Initialization Script
**File**: `init-scripts/01-init.sql`
- Database setup script
- Extension creation (uuid-ossp)
- Index creation for performance
- Initial data preparation

### Data Initialization
**File**: `backend/src/main/java/com/crackersbazaar/config/DataInitializer.java`
- Default admin user creation
- Default dashboard admin user creation
- Password encryption
- Role assignment

## Default Users

### Admin User
- **Username**: admin
- **Email**: admin@crackersbazaar.com
- **Password**: admin123 (encrypted)
- **Role**: ADMIN
- **Status**: Active

### Dashboard Admin User
- **Username**: dashboard_admin
- **Email**: dashboard@crackersbazaar.com
- **Password**: dashboard123 (encrypted)
- **Role**: DASHBOARD_ADMIN
- **Status**: Active

## Environment Configuration

### Development Profile
**File**: `backend/src/main/resources/application.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crackers_bazaar
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### Production Profile
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USERNAME}
    password: ${DATABASE_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
```

### Test Profile
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
    username: sa
    password: password
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
```

## JPA Configuration

### Entity Mapping
- **User Entity**: Maps to users table
- **Role Enum**: Maps to VARCHAR column
- **Timestamps**: Automatic creation and update
- **Validation**: Bean validation constraints

### Hibernate Settings
- **Dialect**: PostgreSQLDialect (production), H2Dialect (testing)
- **DDL Auto**: update (dev), validate (prod), create-drop (test)
- **SQL Logging**: Enabled in development
- **Format SQL**: Enabled for readability

## Database Management

### pgAdmin Access
- **URL**: http://localhost:5050
- **Email**: admin@crackersbazaar.com
- **Password**: admin123
- **Server**: crackers-bazaar-postgres:5432

### Direct PostgreSQL Access
- **Host**: localhost
- **Port**: 5432
- **Database**: crackers_bazaar
- **Username**: postgres
- **Password**: password

### H2 Console (Testing)
- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: jdbc:h2:mem:testdb
- **Username**: sa
- **Password**: password

## Performance Optimization

### Indexes
- Primary key index on id
- Unique indexes on username and email
- Performance indexes for common queries

### Connection Pooling
- Spring Boot default HikariCP
- Configurable pool size
- Connection timeout settings

### Query Optimization
- JPA query optimization
- Lazy loading configuration
- N+1 query prevention

## Security Configuration

### Database Security
- Encrypted password storage
- SQL injection prevention via JPA
- Connection encryption (production)
- Access control and authentication

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- Data encryption

## Backup and Recovery

### Data Persistence
- Docker volumes for data persistence
- Automatic backup configuration
- Data recovery procedures

### Migration Management
- Flyway or Liquibase integration
- Schema versioning
- Data migration scripts

## Development Scripts

### Database Management
**File**: `scripts/start-db.sh`
- Start PostgreSQL container
- Initialize database
- Run setup scripts

**File**: `scripts/stop-db.sh`
- Stop PostgreSQL container
- Clean up resources

**File**: `scripts/reset-db.sh`
- Reset database
- Clean data
- Reinitialize

## Monitoring and Logging

### Database Logging
- Query logging in development
- Performance monitoring
- Error tracking
- Connection monitoring

### Health Checks
- Database connectivity
- Query performance
- Connection pool status
- Data integrity checks

## Environment Variables

### Development
- DATABASE_URL: jdbc:postgresql://localhost:5432/crackers_bazaar
- DATABASE_USERNAME: postgres
- DATABASE_PASSWORD: password

### Production
- DATABASE_URL: ${DATABASE_URL}
- DATABASE_USERNAME: ${DATABASE_USERNAME}
- DATABASE_PASSWORD: ${DATABASE_PASSWORD}

## Troubleshooting

### Common Issues
- Connection refused errors
- Authentication failures
- Schema migration issues
- Performance problems

### Solutions
- Check container status
- Verify credentials
- Review logs
- Optimize queries

---

*Last Updated: [Current Date]*
*Module: Database*
*Status: Active Development*
