# Backend Module Memory Bank

## Overview
Spring Boot 3.2.0 backend for Crackers Bazaar e-commerce platform with JWT authentication and role-based access control.

## Technology Stack
- **Framework**: Spring Boot 3.2.0
- **Java Version**: 17
- **Build Tool**: Maven
- **Database**: PostgreSQL (production), H2 (testing)
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA + Hibernate

## Project Structure
```
backend/
├── src/main/java/com/crackersbazaar/
│   ├── config/              # Configuration classes
│   │   ├── DataInitializer.java
│   │   └── SecurityConfig.java
│   ├── controller/          # REST controllers
│   │   ├── AuthController.java
│   │   ├── HealthController.java
│   │   ├── UserController.java
│   │   └── AdminController.java
│   ├── dto/                # Data Transfer Objects
│   │   ├── JwtResponse.java
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── ManufacturerRequest.java
│   │   ├── ManufacturerResponse.java
│   │   └── ManufacturerVerificationRequest.java
│   ├── entity/             # JPA entities
│   │   ├── Role.java
│   │   ├── User.java
│   │   ├── Manufacturer.java
│   │   └── ManufacturerStatus.java
│   ├── repository/         # Data repositories
│   │   ├── UserRepository.java
│   │   └── ManufacturerRepository.java
│   ├── security/          # Security components
│   │   └── JwtAuthenticationFilter.java
│   ├── service/           # Business logic
│   │   ├── UserDetailsServiceImpl.java
│   │   ├── UserService.java
│   │   └── ManufacturerService.java
│   ├── util/              # Utility classes
│   │   └── JwtUtil.java
│   └── CrackersBazaarApplication.java
└── src/main/resources/
    └── application.yml
```

## Core Components

### 1. Application Entry Point
**File**: `CrackersBazaarApplication.java`
- Main Spring Boot application class
- Enables auto-configuration and component scanning
- Runs on port 8080

### 2. User Entity
**File**: `entity/User.java`
- JPA entity with complete user profile
- Fields: id, username, email, password, firstName, lastName, role, active, timestamps
- Validation annotations: @NotBlank, @Size, @Email
- Unique constraints on username and email
- Automatic timestamp management with @CreationTimestamp and @UpdateTimestamp

### 3. Role Enum
**File**: `entity/Role.java`
- Four user roles: RETAILER, DASHBOARD_ADMIN, ADMIN, MANUFACTURER
- Used for role-based access control

### 4. Authentication Controller
**File**: `controller/AuthController.java`
- **POST /api/auth/login**: User authentication
- **POST /api/auth/register**: User registration (Retailer only)
- **POST /api/auth/logout**: User logout
- JWT token generation and validation
- Error handling with proper HTTP status codes

### 5. User Management
**File**: `controller/UserController.java`
- **GET /api/users/profile**: Get user profile
- Protected endpoints requiring authentication
- Role-based access control

### 6. Admin Module
**File**: `controller/AdminController.java`
- **POST /api/admin/manufacturers**: Create new manufacturer
- **GET /api/admin/manufacturers**: Get all manufacturers (paginated)
- **GET /api/admin/manufacturers/{id}**: Get manufacturer by ID
- **GET /api/admin/manufacturers/status/{status}**: Get manufacturers by status
- **GET /api/admin/manufacturers/search/company**: Search by company name
- **PUT /api/admin/manufacturers/{id}**: Update manufacturer
- **PUT /api/admin/manufacturers/{id}/verify**: Verify manufacturer
- **DELETE /api/admin/manufacturers/{id}**: Delete manufacturer
- **GET /api/admin/dashboard/stats**: Get dashboard statistics
- **GET /api/admin/dashboard/pending-approvals**: Get pending approvals
- Role-based access control (ADMIN, DASHBOARD_ADMIN only)

### 7. Security Configuration
**File**: `config/SecurityConfig.java`
- JWT authentication setup
- Password encoding with BCrypt
- CORS configuration for frontend integration
- Security filter chain configuration
- Role-based authorization

### 8. JWT Utilities
**File**: `util/JwtUtil.java`
- JWT token generation and validation
- Token expiration handling
- Role extraction from tokens
- Secret key management

### 9. User Service
**File**: `service/UserService.java`
- Business logic for user operations
- User creation, validation, and management
- Password encoding integration
- Username and email uniqueness checks

### 10. User Repository
**File**: `repository/UserRepository.java`
- JPA repository with custom query methods
- Username and email existence checks
- User profile retrieval

### 11. Manufacturer Entity
**File**: `entity/Manufacturer.java`
- Complete manufacturer profile with business details
- Fields: id, companyName, contactPerson, email, phoneNumber, address, city, state, pincode, country
- Business fields: gstNumber, panNumber, licenseNumber, licenseValidity
- Status tracking: status, verified, verificationNotes, verifiedBy, verifiedAt
- Validation annotations for data integrity
- Automatic timestamp management

### 12. Manufacturer Status
**File**: `entity/ManufacturerStatus.java`
- Status enum: PENDING, APPROVED, REJECTED, SUSPENDED, ACTIVE, INACTIVE
- Used for manufacturer lifecycle management

### 13. Manufacturer Service
**File**: `service/ManufacturerService.java`
- Business logic for manufacturer operations
- CRUD operations with validation
- Status management and verification workflow
- Search and filtering capabilities
- Dashboard statistics generation

### 14. Manufacturer Repository
**File**: `repository/ManufacturerRepository.java`
- JPA repository with custom query methods
- Search by company name, city, state
- Status-based filtering
- Pagination support
- Statistics queries

### 15. Data Initialization
**File**: `config/DataInitializer.java`
- Creates default admin users on application startup
- Default users:
  - Admin: admin/admin123 (ADMIN role)
  - Dashboard Admin: dashboard_admin/dashboard123 (DASHBOARD_ADMIN role)

## Configuration

### Application Configuration
**File**: `resources/application.yml`
- Multi-profile setup (dev, prod, test)
- Database configuration for each profile
- JWT configuration (secret, expiration)
- Logging configuration
- Hibernate settings

### Maven Dependencies
**File**: `pom.xml`
- Spring Boot starters (web, data-jpa, security, validation)
- PostgreSQL driver
- JWT libraries (jjwt-api, jjwt-impl, jjwt-jackson)
- Testing dependencies

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/login`
  - Body: `{username, password}`
  - Response: JWT token + user data
- `POST /api/auth/register`
  - Body: `{username, email, password, firstName, lastName, role}`
  - Response: Success/error message
- `POST /api/auth/logout`
  - Response: Success message

### User Endpoints
- `GET /api/users/profile`
  - Headers: `Authorization: Bearer <token>`
  - Response: User profile data

### Health Check
- `GET /api/health`
  - Response: Application health status

### Admin Endpoints
- `POST /api/admin/manufacturers`
  - Body: ManufacturerRequest
  - Response: ManufacturerResponse
  - Access: ADMIN, DASHBOARD_ADMIN
- `GET /api/admin/manufacturers`
  - Query: page, size, sortBy, sortDir
  - Response: Page<ManufacturerResponse>
  - Access: ADMIN, DASHBOARD_ADMIN
- `GET /api/admin/manufacturers/{id}`
  - Response: ManufacturerResponse
  - Access: ADMIN, DASHBOARD_ADMIN
- `GET /api/admin/manufacturers/status/{status}`
  - Query: page, size, sortBy, sortDir
  - Response: Page<ManufacturerResponse>
  - Access: ADMIN, DASHBOARD_ADMIN
- `GET /api/admin/manufacturers/search/company`
  - Query: companyName
  - Response: List<ManufacturerResponse>
  - Access: ADMIN, DASHBOARD_ADMIN
- `PUT /api/admin/manufacturers/{id}`
  - Body: ManufacturerRequest
  - Response: ManufacturerResponse
  - Access: ADMIN, DASHBOARD_ADMIN
- `PUT /api/admin/manufacturers/{id}/verify`
  - Body: ManufacturerVerificationRequest
  - Headers: X-Admin-Id
  - Response: ManufacturerResponse
  - Access: ADMIN, DASHBOARD_ADMIN
- `DELETE /api/admin/manufacturers/{id}`
  - Response: Success message
  - Access: ADMIN, DASHBOARD_ADMIN
- `GET /api/admin/dashboard/stats`
  - Response: DashboardStats
  - Access: ADMIN, DASHBOARD_ADMIN
- `GET /api/admin/dashboard/pending-approvals`
  - Response: List<ManufacturerResponse>
  - Access: ADMIN, DASHBOARD_ADMIN

## Security Features

### Authentication
- JWT token-based authentication
- Configurable token expiration (default: 24 hours)
- Password encryption with BCrypt
- Session management

### Authorization
- Role-based access control
- Protected endpoints
- User role validation
- Admin-only operations

### Data Protection
- Input validation with Bean Validation
- SQL injection prevention via JPA
- XSS protection through proper encoding

## Database Integration

### JPA Configuration
- Automatic schema management
- Connection pooling
- Transaction management
- Query optimization

### Entity Relationships
- User entity with role mapping
- Automatic timestamp management
- Validation constraints

## Development Features

### Logging
- Debug level logging for development
- Security event logging
- Application performance monitoring

### Testing
- Spring Boot test configuration
- Security testing support
- H2 database for testing

## Default Users
- **Admin**: username: `admin`, password: `admin123`, role: `ADMIN`
- **Dashboard Admin**: username: `dashboard_admin`, password: `dashboard123`, role: `DASHBOARD_ADMIN`

## Build and Run
```bash
# Development
mvn spring-boot:run

# Production
mvn clean package
java -jar target/crackers-bazaar-backend-1.0.0.jar
```

## Key Dependencies
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation
- postgresql
- jjwt-api, jjwt-impl, jjwt-jackson

---

*Last Updated: [Current Date]*
*Module: Backend*
*Status: Active Development*
