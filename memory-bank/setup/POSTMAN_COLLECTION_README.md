# Crackers Bazaar API Postman Collection

This repository contains a comprehensive Postman collection for testing the Crackers Bazaar API endpoints.

## Files Included

1. **Crackers_Bazaar_API_Collection.postman_collection.json** - Main collection with all API endpoints
2. **Crackers_Bazaar_Environment.postman_environment.json** - Environment variables for testing
3. **POSTMAN_COLLECTION_README.md** - This documentation file

## Setup Instructions

### 1. Import Collection and Environment

1. Open Postman
2. Click "Import" button
3. Import both files:
   - `Crackers_Bazaar_API_Collection.postman_collection.json`
   - `Crackers_Bazaar_Environment.postman_environment.json`
4. Select the "Crackers Bazaar Environment" from the environment dropdown

### 2. Configure Environment Variables

The environment includes the following variables:

- **baseUrl**: `http://localhost:8080` (default backend URL)
- **jwtToken**: Will be automatically set after login
- **userId**: User ID for testing (default: 1)
- **productId**: Product ID for testing (default: 1)
- **manufacturerId**: Manufacturer ID for testing (default: 1)
- **adminId**: Admin ID for testing (default: 1)

## API Endpoints Overview

### 🔐 Authentication
- **Health Check** - Verify API server status
- **User Login** - Authenticate and get JWT token
- **User Registration** - Register new retailer users
- **User Logout** - Logout current user

### 👤 User Management
- **Get User Profile** - Get current user's profile
- **Create Manufacturer User** - Create manufacturer accounts (Admin only)
- **Get All Users** - List all users (Admin only)
- **Get Users by Role** - Filter users by role
- **Activate/Deactivate User** - Manage user status

### 📦 Product Management
- **Create Product** - Add new products (Manufacturer only)
- **Get Product by ID/SKU/Barcode** - Retrieve product details
- **Get All Products** - List products with pagination
- **Update/Delete Product** - Modify product information
- **Search Products** - Search by name, description, brand
- **Filter Products** - Filter by category, price range, manufacturer
- **Product Statistics** - Get product counts and stats
- **Stock Management** - Manage product inventory

### 🏢 Admin Management
- **Manufacturer CRUD** - Create, read, update, delete manufacturers
- **Manufacturer Search** - Search by company name, city, state
- **Manufacturer Verification** - Verify manufacturer accounts
- **Dashboard Statistics** - Get admin dashboard metrics
- **Pending Approvals** - View pending manufacturer approvals

### 👥 Manufacturer User Management
- **Create User Accounts** - Create accounts for manufacturers
- **Password Reset** - Reset manufacturer passwords
- **Account Status Check** - Verify if manufacturer has user account

### 📁 File Upload
- **Upload Product Images** - Upload single or multiple images
- **Delete Images** - Remove product images
- **Image Management** - Manage product image assets

## Testing Workflow

### 1. Basic Health Check
Start by testing the health endpoint to ensure the API is running:
```
GET /api/health
```

### 2. Authentication Flow
1. **Login** with valid credentials to get JWT token
2. The token will be automatically stored in the `jwtToken` environment variable
3. All subsequent requests will use this token for authentication

### 3. Role-Based Testing

#### As Retailer:
- Get user profile
- Browse products
- Search and filter products

#### As Manufacturer:
- Create and manage products
- Upload product images
- View product statistics
- Manage inventory

#### As Admin:
- Manage manufacturers
- Verify manufacturer accounts
- View dashboard statistics
- Manage user accounts

## Sample Request Bodies

### Login Request
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Product Creation
```json
{
  "name": "Premium Firecrackers",
  "description": "High-quality firecrackers for festivals",
  "category": "Firecrackers",
  "subcategory": "Sound Crackers",
  "brand": "Premium Brand",
  "price": 150.00,
  "stockQuantity": 100,
  "sku": "FC001",
  "barcode": "1234567890123",
  "isActive": true,
  "isFeatured": false
}
```

### Manufacturer Creation
```json
{
  "companyName": "Premium Fireworks Ltd",
  "contactPerson": "John Smith",
  "email": "contact@premiumfireworks.com",
  "phone": "+91-9876543210",
  "address": "123 Industrial Area",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "gstNumber": "27ABCDE1234F1Z5",
  "licenseNumber": "LIC123456",
  "licenseExpiry": "2025-12-31",
  "businessType": "Manufacturer",
  "yearsInBusiness": 10,
  "annualTurnover": 5000000,
  "employeeCount": 50
}
```

## Authentication

The API uses JWT (JSON Web Token) authentication. After successful login:

1. The JWT token is returned in the response
2. Store this token in the `jwtToken` environment variable
3. All protected endpoints will automatically include the token in the Authorization header

## Error Handling

The API returns standard HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

Error responses include a JSON object with an `error` field:
```json
{
  "error": "Error message description"
}
```

## Pagination

Many endpoints support pagination with the following query parameters:
- `page`: Page number (default: 0)
- `size`: Page size (default: 10)
- `sortBy`: Sort field (default: varies by endpoint)
- `sortDir`: Sort direction - "asc" or "desc" (default: "desc")

## File Upload

For file upload endpoints:
1. Use `multipart/form-data` content type
2. Include the file in the request body
3. Specify the `productId` parameter
4. Supported file types: Images (JPG, PNG, GIF)

## Environment Variables

Update the following variables as needed:
- `baseUrl`: Change if running on different port/host
- `userId`, `productId`, `manufacturerId`: Update with actual IDs from your database
- `email`, `companyName`, etc.: Update with test data

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**: 
   - Ensure you're logged in and have a valid JWT token
   - Check if the token has expired

2. **403 Forbidden**: 
   - Verify you have the correct role for the endpoint
   - Check if your account is active

3. **404 Not Found**: 
   - Verify the endpoint URL is correct
   - Check if the resource ID exists

4. **Connection Issues**: 
   - Ensure the backend server is running on the correct port
   - Check the `baseUrl` environment variable

## API Base URL

Default: `http://localhost:8080`

Change this in the environment variables if your backend runs on a different host/port.

## Support

For API documentation and support, refer to the backend codebase or contact the development team.
