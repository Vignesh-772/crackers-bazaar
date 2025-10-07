# Security Module Memory Bank

## Overview
Comprehensive security implementation for Crackers Bazaar with JWT authentication, role-based access control, password encryption, and security best practices.

## Security Architecture
- **Authentication**: JWT-based token authentication
- **Authorization**: Role-based access control (RBAC)
- **Password Security**: BCrypt encryption
- **Session Management**: Stateless JWT tokens
- **CORS**: Cross-origin resource sharing configuration

## Authentication System

### JWT Token Implementation
**File**: `util/JwtUtil.java`
- Token generation and validation
- Configurable expiration (default: 24 hours)
- Role-based claims
- Secret key management

### Token Structure
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "username",
    "role": "ADMIN",
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### Token Lifecycle
1. **Generation**: On successful login
2. **Validation**: On protected endpoints
3. **Expiration**: Automatic token expiry
4. **Refresh**: Token validation on each request

## Password Security

### BCrypt Encryption
**File**: `config/SecurityConfig.java`
- Password hashing with BCrypt
- Configurable strength (default: 10)
- Salt generation
- Secure password storage

### Password Requirements
- Minimum length validation
- Complexity requirements
- Secure storage
- No plain text storage

## Role-Based Access Control (RBAC)

### User Roles
```java
public enum Role {
    RETAILER,           // Basic user access
    DASHBOARD_ADMIN,    // Dashboard management
    ADMIN,              // Full system access
    MANUFACTURER        // Manufacturer-specific access
}
```

### Permission Matrix
| Resource | RETAILER | DASHBOARD_ADMIN | ADMIN | MANUFACTURER |
|----------|----------|-----------------|-------|--------------|
| Login | ✓ | ✓ | ✓ | ✓ |
| Register | ✓ | ✗ | ✗ | ✗ |
| Profile | ✓ | ✓ | ✓ | ✓ |
| Admin Panel | ✗ | ✓ | ✓ | ✗ |
| User Management | ✗ | ✗ | ✓ | ✗ |

### Authorization Implementation
- Method-level security
- Endpoint protection
- Role-based filtering
- Permission validation

## Security Configuration

### Spring Security Setup
**File**: `config/SecurityConfig.java`
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    // Security filter chain
    // Password encoder
    // Authentication manager
    // CORS configuration
}
```

### Security Filter Chain
1. **CORS Filter**: Handle cross-origin requests
2. **JWT Filter**: Token validation
3. **Authentication**: User authentication
4. **Authorization**: Role-based access

### CORS Configuration
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    return configuration;
}
```

## JWT Authentication Filter

### Filter Implementation
**File**: `security/JwtAuthenticationFilter.java`
- Token extraction from headers
- Token validation
- User authentication
- Security context setup

### Filter Chain
1. **Extract Token**: From Authorization header
2. **Validate Token**: JWT signature and expiration
3. **Load User**: User details from database
4. **Set Context**: Security context authentication

### Token Validation
- Signature verification
- Expiration check
- Role validation
- User status check

## User Details Service

### Custom User Details
**File**: `service/UserDetailsServiceImpl.java`
- User loading from database
- Role-based authorities
- User status validation
- Custom user details

### User Loading
```java
@Override
public UserDetails loadUserByUsername(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
    return UserPrincipal.create(user);
}
```

## Security Best Practices

### Input Validation
- Bean validation annotations
- SQL injection prevention
- XSS protection
- Input sanitization

### Data Protection
- Password encryption
- Sensitive data masking
- Secure storage
- Data transmission security

### Session Security
- Stateless JWT tokens
- Token expiration
- Secure token storage
- Session invalidation

## Security Headers

### HTTP Security Headers
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: 1; mode=block
- **Strict-Transport-Security**: max-age=31536000

### CORS Headers
- **Access-Control-Allow-Origin**: Frontend URL
- **Access-Control-Allow-Methods**: Allowed HTTP methods
- **Access-Control-Allow-Headers**: Allowed headers
- **Access-Control-Max-Age**: Cache duration

## Error Handling

### Security Exceptions
- **AuthenticationException**: Invalid credentials
- **AccessDeniedException**: Insufficient permissions
- **TokenExpiredException**: Expired JWT token
- **InvalidTokenException**: Malformed JWT token

### Error Responses
```json
{
  "error": "Authentication failed",
  "timestamp": "2024-01-01T00:00:00Z",
  "status": 401
}
```

## Security Testing

### Authentication Testing
- Login endpoint testing
- Token validation testing
- Password security testing
- Session management testing

### Authorization Testing
- Role-based access testing
- Permission validation testing
- Endpoint protection testing
- Access control testing

### Security Scanning
- Vulnerability assessment
- Penetration testing
- Security code review
- Dependency scanning

## Configuration Security

### Environment Variables
- **JWT_SECRET**: Secret key for token signing
- **JWT_EXPIRATION**: Token expiration time
- **DATABASE_PASSWORD**: Database credentials
- **CORS_ORIGINS**: Allowed origins

### Secret Management
- Environment variable storage
- Secure key generation
- Key rotation strategy
- Production secret management

## Security Monitoring

### Authentication Monitoring
- Login attempt tracking
- Failed authentication logging
- Suspicious activity detection
- Security event monitoring

### Authorization Monitoring
- Access pattern analysis
- Permission usage tracking
- Role-based activity monitoring
- Security violation detection

## Compliance and Standards

### Security Standards
- OWASP Top 10 compliance
- Security best practices
- Industry standards
- Regulatory compliance

### Data Protection
- GDPR compliance
- Data privacy protection
- User consent management
- Data retention policies

## Security Documentation

### Security Policies
- Password policies
- Access control policies
- Data protection policies
- Incident response procedures

### Security Procedures
- Authentication procedures
- Authorization procedures
- Security incident response
- Security maintenance procedures

---

*Last Updated: [Current Date]*
*Module: Security*
*Status: Active Development*
