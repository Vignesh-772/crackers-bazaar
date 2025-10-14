# Crackers Bazaar - Main Memory Bank

## Project Overview
**Crackers Bazaar** is a modern e-commerce platform for fireworks and crackers, built with a React TypeScript frontend and Spring Boot backend. The application features a comprehensive authentication system with role-based access control.

## Directory-Based Memory Bank Structure
This project uses a modular memory bank system with dedicated files for each major component:

```
memory-bank/
├── backend/backend-memory.md      # Spring Boot backend details
├── frontend/frontend-memory.md    # React TypeScript frontend details
├── database/database-memory.md   # PostgreSQL database configuration
├── docker/docker-memory.md       # Docker containerization setup
├── api/api-memory.md             # REST API endpoints and documentation
└── security/security-memory.md   # Security implementation details
```

**Note**: For detailed information about specific modules, refer to the corresponding memory bank files listed above.

## System Architecture

### Technology Stack
- **Backend**: Spring Boot 3.2.0, Java 17, PostgreSQL, JWT Authentication
- **Frontend**: React 18, TypeScript, React Router DOM, Axios
- **Database**: PostgreSQL 15 (production), H2 (testing)
- **Containerization**: Docker & Docker Compose
- **Build Tools**: Maven (backend), npm (frontend)

### Project Structure
```
crackers-bazaar/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/crackersbazaar/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── entity/         # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── security/      # Security configuration
│   │   ├── service/       # Business logic
│   │   └── util/          # Utility classes
│   └── src/main/resources/
│       └── application.yml # Configuration
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/     # React contexts
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx       # Main app component
│   └── package.json
├── init-scripts/          # Database initialization
├── scripts/              # Utility scripts
└── docker-compose.yml    # Container orchestration
```

## Backend Architecture

### Core Components

#### 1. Authentication & Security
- **JWT-based authentication** with configurable expiration
- **Role-based access control** with 4 user roles:
  - `RETAILER`: Can self-register, basic access
  - `DASHBOARD_ADMIN`: Dashboard management access
  - `ADMIN`: Full system administration
  - `MANUFACTURER`: Manufacturer-specific access
- **Password encryption** using Spring Security's PasswordEncoder
- **CORS configuration** for frontend integration

#### 2. User Management
- **User Entity**: Complete user profile with validation
  - Fields: id, username, email, password, firstName, lastName, role, active, timestamps
  - Validation: @NotBlank, @Size, @Email constraints
  - Unique constraints on username and email
- **User Repository**: JPA repository with custom query methods
- **User Service**: Business logic for user operations
- **User Controller**: REST endpoints for user management

#### 3. API Endpoints
- **Authentication**:
  - `POST /api/auth/login` - User login
  - `POST /api/auth/register` - User registration (Retailer only)
  - `POST /api/auth/logout` - User logout
- **User Management**:
  - `GET /api/users/profile` - Get user profile
- **Health Check**:
  - `GET /api/health` - Application health status

#### 4. Database Configuration
- **Multi-profile setup**: dev, prod, test
- **PostgreSQL** for production/development
- **H2** for testing
- **JPA/Hibernate** with automatic schema management
- **Connection pooling** and performance optimization

### Key Backend Files
- `CrackersBazaarApplication.java` - Main Spring Boot application
- `User.java` - User entity with JPA annotations
- `Role.java` - Enum for user roles
- `AuthController.java` - Authentication endpoints
- `UserController.java` - User management endpoints
- `SecurityConfig.java` - Security configuration
- `JwtUtil.java` - JWT token utilities
- `DataInitializer.java` - Default user creation

## Frontend Architecture

### Core Components

#### 1. Authentication System
- **AuthContext**: React context for global authentication state
- **JWT token management** with localStorage persistence
- **Axios interceptors** for automatic token attachment
- **Protected routes** based on authentication status

#### 2. User Interface
- **React Router** for client-side navigation
- **Component-based architecture** with TypeScript
- **Responsive design** with CSS3
- **Form validation** and error handling

#### 3. Key Components
- `App.tsx` - Main application with routing
- `AuthContext.tsx` - Authentication state management
- `Login.tsx` - User login form
- `Register.tsx` - User registration form
- `Dashboard.tsx` - User dashboard
- `Header.tsx` - Navigation header
- `Home.tsx` - Landing page
- `About.tsx` - About page
- `Footer.tsx` - Site footer

#### 4. Type Definitions
- `user.ts` - User-related TypeScript interfaces
- `api.ts` - API response types
- Comprehensive type safety throughout the application

### Frontend Features
- **Real-time API status checking**
- **Automatic token refresh** and session management
- **Role-based UI rendering**
- **Form validation** with user feedback
- **Responsive design** for mobile and desktop

## Database Schema

### User Table
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

### Default Users
- **Admin**: username: `admin`, password: `admin123`, role: `ADMIN`
- **Dashboard Admin**: username: `dashboard_admin`, password: `dashboard123`, role: `DASHBOARD_ADMIN`

## Configuration

### Backend Configuration (application.yml)
- **Server**: Port 8080
- **Database**: PostgreSQL with connection pooling
- **JWT**: Configurable secret and expiration
- **Profiles**: dev, prod, test with different configurations
- **Logging**: Debug level for development

### Frontend Configuration
- **Development server**: Port 3000
- **API base URL**: http://localhost:8080
- **TypeScript**: Strict type checking
- **React Scripts**: Standard Create React App setup

## Docker Setup

### Services
- **PostgreSQL**: Database with persistent storage
- **pgAdmin**: Database management interface
- **Networking**: Isolated network for services

### Environment Variables
- Database credentials
- JWT configuration
- Application profiles

## Development Workflow

### Backend Development
1. Start PostgreSQL: `docker-compose up postgres`
2. Run Spring Boot: `mvn spring-boot:run`
3. Access H2 console: http://localhost:8080/h2-console (test profile)

### Frontend Development
1. Install dependencies: `npm install`
2. Start development server: `npm start`
3. Access application: http://localhost:3000

### Full Stack Development
1. Start database: `docker-compose up postgres`
2. Start backend: `cd backend && mvn spring-boot:run`
3. Start frontend: `cd frontend && npm start`

## Security Features

### Authentication
- JWT tokens with configurable expiration
- Password encryption using BCrypt
- Session management with automatic cleanup

### Authorization
- Role-based access control
- Protected endpoints
- User role validation

### Data Protection
- Input validation and sanitization
- SQL injection prevention via JPA
- XSS protection through React

## API Documentation

### Authentication Endpoints
- **Login**: `POST /api/auth/login`
  - Body: `{username, password}`
  - Response: JWT token + user data
- **Register**: `POST /api/auth/register`
  - Body: `{username, email, password, firstName, lastName, role}`
  - Response: Success/error message
- **Logout**: `POST /api/auth/logout`
  - Response: Success message

### User Endpoints
- **Profile**: `GET /api/users/profile`
  - Headers: `Authorization: Bearer <token>`
  - Response: User profile data

## Current Status

### Completed Features
- ✅ User authentication (login/register/logout)
- ✅ JWT token management
- ✅ Role-based access control
- ✅ User profile management
- ✅ Database integration
- ✅ Frontend-backend communication
- ✅ Docker containerization
- ✅ Development environment setup

### Default Credentials
- **Admin**: admin / admin123
- **Dashboard Admin**: dashboard_admin / dashboard123

### Next Development Areas
- Product catalog management
- Order processing system
- Inventory management
- Payment integration
- Admin dashboard
- Retailer portal
- Manufacturer portal

## File Locations

### Backend Key Files
- Main App: `backend/src/main/java/com/crackersbazaar/CrackersBazaarApplication.java`
- User Entity: `backend/src/main/java/com/crackersbazaar/entity/User.java`
- Auth Controller: `backend/src/main/java/com/crackersbazaar/controller/AuthController.java`
- Security Config: `backend/src/main/java/com/crackersbazaar/config/SecurityConfig.java`
- Application Config: `backend/src/main/resources/application.yml`

### Frontend Key Files
- Main App: `frontend/src/App.tsx`
- Auth Context: `frontend/src/contexts/AuthContext.tsx`
- Login Component: `frontend/src/components/Login.tsx`
- User Types: `frontend/src/types/user.ts`
- Package Config: `frontend/package.json`

### Configuration Files
- Docker Compose: `docker-compose.yml`
- Database Init: `init-scripts/01-init.sql`
- Project README: `README.md`

---

*Last Updated: [Current Date]*
*Version: 1.0.0*
*Status: Active Development*
