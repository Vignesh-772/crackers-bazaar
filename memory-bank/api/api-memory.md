# API Module Memory Bank

## Overview
RESTful API endpoints for Crackers Bazaar with JWT authentication, role-based access control, and comprehensive error handling.

## API Architecture
- **Base URL**: http://localhost:8080
- **Authentication**: JWT Bearer tokens
- **Content Type**: application/json
- **CORS**: Enabled for frontend integration
- **Error Handling**: Standardized error responses

## Authentication Endpoints

### User Login
**Endpoint**: `POST /api/auth/login`
**Description**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (Success)**:
```json
{
  "token": "jwt_token_string",
  "type": "Bearer",
  "id": 1,
  "username": "admin",
  "email": "admin@crackersbazaar.com",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "ADMIN"
}
```

**Response (Error)**:
```json
{
  "error": "Invalid username or password"
}
```

### User Registration
**Endpoint**: `POST /api/auth/register`
**Description**: Register new user (Retailer role only)

**Request Body**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "RETAILER"
}
```

**Response (Success)**:
```json
{
  "message": "User registered successfully!"
}
```

**Response (Error)**:
```json
{
  "error": "Username is already taken!"
}
```

### User Logout
**Endpoint**: `POST /api/auth/logout`
**Description**: Logout user and clear session

**Response**:
```json
{
  "message": "User logged out successfully!"
}
```

## User Management Endpoints

### Get User Profile
**Endpoint**: `GET /api/users/profile`
**Authentication**: Required (JWT Bearer token)
**Description**: Get current user profile information

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Response (Success)**:
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@crackersbazaar.com",
  "firstName": "System",
  "lastName": "Administrator",
  "role": "ADMIN",
  "active": true,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

## System Endpoints

### Health Check
**Endpoint**: `GET /api/health`
**Description**: Check application health status

**Response**:
```json
{
  "status": "UP",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Data Transfer Objects (DTOs)

### LoginRequest
```java
public class LoginRequest {
    private String username;
    private String password;
}
```

### RegisterRequest
```java
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private Role role;
}
```

### JwtResponse
```java
public class JwtResponse {
    private String token;
    private String type;
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": "Error message description",
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 400
}
```

### Common Error Scenarios
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Authentication Flow

### JWT Token Structure
- **Header**: Algorithm and token type
- **Payload**: User information and claims
- **Signature**: Token verification

### Token Claims
- **Subject**: Username
- **Role**: User role
- **Expiration**: Token expiry time
- **Issued At**: Token creation time

### Token Management
- **Generation**: On successful login
- **Validation**: On protected endpoints
- **Expiration**: Configurable (default: 24 hours)
- **Refresh**: Automatic token validation

## Role-Based Access Control

### User Roles
- **RETAILER**: Basic user access
- **DASHBOARD_ADMIN**: Dashboard management
- **ADMIN**: Full system access
- **MANUFACTURER**: Manufacturer-specific access

### Permission Matrix
| Endpoint | RETAILER | DASHBOARD_ADMIN | ADMIN | MANUFACTURER |
|----------|----------|-----------------|-------|--------------|
| POST /api/auth/login | ✓ | ✓ | ✓ | ✓ |
| POST /api/auth/register | ✓ | ✗ | ✗ | ✗ |
| GET /api/users/profile | ✓ | ✓ | ✓ | ✓ |
| POST /api/auth/logout | ✓ | ✓ | ✓ | ✓ |

## CORS Configuration

### Allowed Origins
- **Development**: http://localhost:3000
- **Production**: Configurable via environment

### CORS Headers
- **Access-Control-Allow-Origin**: Frontend URL
- **Access-Control-Allow-Methods**: GET, POST, PUT, DELETE
- **Access-Control-Allow-Headers**: Authorization, Content-Type
- **Access-Control-Max-Age**: 3600 seconds

## Request/Response Examples

### Successful Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:8080/api/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

### User Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newuser",
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "RETAILER"
  }'
```

## API Documentation

### OpenAPI/Swagger
- **URL**: http://localhost:8080/swagger-ui.html (if enabled)
- **JSON**: http://localhost:8080/v3/api-docs
- **Interactive**: Swagger UI interface

### Postman Collection
- **Collection**: Available in project repository
- **Environment**: Development setup

## Testing

### Unit Tests
- Controller layer testing
- Service layer testing
- Integration testing
- Security testing

### API Testing
- Endpoint testing
- Authentication testing
- Authorization testing
- Error handling testing

### Test Data
- Mock users for testing
- Test JWT tokens
- Test scenarios
- Edge cases

## Performance

### Response Times
- **Login**: < 200ms
- **Profile**: < 100ms
- **Registration**: < 300ms

### Optimization
- Connection pooling
- Query optimization
- Caching strategies
- Load balancing

---

*Last Updated: [Current Date]*
*Module: API*
*Status: Active Development*
