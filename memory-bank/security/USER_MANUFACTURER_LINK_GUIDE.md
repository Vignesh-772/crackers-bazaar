# User-Manufacturer Foreign Key Relationship Guide

## Overview
This document describes the implementation of the foreign key relationship between the `User` and `Manufacturer` entities, ensuring every manufacturer is properly linked to a user account for authentication.

## ✅ What Was Implemented

### 1. Database Schema Changes

#### Manufacturer Entity
Added a **OneToOne** relationship with User:

```java
@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id", unique = true)
private User user;
```

**Key Features:**
- `@OneToOne`: Each manufacturer has exactly one user
- `@JoinColumn`: Creates `user_id` foreign key column in manufacturers table
- `unique = true`: Ensures one user can only be linked to one manufacturer
- `FetchType.LAZY`: User data loaded only when explicitly accessed

#### Database Column
- **Table**: `manufacturers`
- **Column**: `user_id` (BIGINT)
- **Constraint**: FOREIGN KEY references `users(id)`
- **Constraint**: UNIQUE (one user per manufacturer)
- **Nullable**: Yes (for existing data, but required for new)

### 2. Repository Methods

Added methods to find manufacturers by user:

```java
Optional<Manufacturer> findByUser(User user);
Optional<Manufacturer> findByUserId(Long userId);
```

### 3. Service Layer Updates

#### ManufacturerService

**Updated `createManufacturer` method:**
```java
// 1. Create user account first
User user = new User();
// ... set user properties
User savedUser = userRepository.save(user);

// 2. Create manufacturer and link to user
Manufacturer manufacturer = new Manufacturer();
// ... set manufacturer properties
manufacturer.setUser(savedUser);  // 🔗 Link the user
Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
```

**New methods:**
```java
ManufacturerResponse getManufacturerByUserId(Long userId)
ManufacturerResponse getManufacturerByUserEmail(String email)
```

### 4. New API Endpoints

#### ManufacturerController (NEW)

**File**: `ManufacturerController.java`

**Endpoints:**

1. **Get My Profile** (Manufacturer)
   ```
   GET /api/manufacturer/profile
   Authorization: Bearer {jwt_token}
   Role Required: MANUFACTURER
   ```
   
   Returns the manufacturer profile for the authenticated user.
   
   **Response:**
   ```json
   {
     "id": 1,
     "userId": 5,
     "companyName": "ABC Crackers Ltd",
     "contactPerson": "John Doe",
     "email": "manufacturer@example.com",
     ...
   }
   ```

2. **Get Manufacturer by User ID** (Admin)
   ```
   GET /api/manufacturer/by-user/{userId}
   Authorization: Bearer {jwt_token}
   Role Required: ADMIN, DASHBOARD_ADMIN
   ```
   
   Returns manufacturer profile for a specific user ID.

### 5. Frontend Integration

#### Updated Types
```typescript
export interface Manufacturer {
  id: string;
  userId?: number;  // 🆕 Added
  companyName: string;
  contactPerson: string;  // 🆕 Updated from separate field
  phoneNumber: string;    // 🆕 Updated from phone
  pincode: string;        // 🆕 Updated from zipCode
  // ... other fields
}
```

#### Updated API Client
```typescript
// Get manufacturer profile for authenticated user
getMyProfile: async (): Promise<Manufacturer> => {
  const response = await apiClient.get<Manufacturer>("/manufacturer/profile");
  return response.data;
}
```

#### Updated ManufacturerDashboard
```typescript
// Fetch manufacturer profile dynamically
const { data: manufacturerProfile } = useQuery({
  queryKey: ["manufacturerProfile"],
  queryFn: manufacturerApi.getMyProfile,
});

const manufacturerId = manufacturerProfile?.id;  // Real manufacturer ID

// Use manufacturerId for fetching products
const { data: productsData } = useQuery({
  queryKey: ["manufacturerProducts", manufacturerId, page],
  queryFn: async () => {
    if (!manufacturerId) return null;
    return await productApi.getProductsByManufacturer({
      manufacturerId,
      page,
      size: 20,
    });
  },
  enabled: !!manufacturerId,
});
```

## 🔄 Data Flow

### Creating a Manufacturer

```
Admin fills Add Manufacturer form
  ↓
POST /api/admin/manufacturers
  ↓
Backend: ManufacturerService.createManufacturer()
  ↓
1. Validate password confirmation
2. Check email uniqueness
3. Check username uniqueness
  ↓
4. Create User account
   - Username, email, password (hashed)
   - Role: MANUFACTURER
   - Active: true
   - Save to database → Get user.id
  ↓
5. Create Manufacturer
   - Company details
   - Contact info
   - Documents
   - user_id = saved user.id  🔗
   - Status: PENDING
   - Save to database
  ↓
Success Response with userId included
```

### Manufacturer Login & Dashboard Access

```
Manufacturer logs in
  ↓
POST /api/auth/login
  ↓
JWT token issued with user email
  ↓
Manufacturer navigates to /manufacturer
  ↓
GET /api/manufacturer/profile
  ↓
Backend:
  1. Extract email from JWT
  2. Find User by email
  3. Find Manufacturer by user.id (via foreign key)
  4. Return manufacturer profile
  ↓
Frontend:
  1. Receive manufacturer profile with real ID
  2. Use manufacturer.id to fetch products
  3. Display company name in dashboard header
```

## 🎯 Benefits

### 1. **Data Integrity**
- ✅ Foreign key constraint ensures valid user references
- ✅ Unique constraint prevents duplicate user-manufacturer links
- ✅ Cascading deletes can be configured if needed

### 2. **Authentication & Authorization**
- ✅ Manufacturer login uses User table
- ✅ JWT tokens based on user credentials
- ✅ Role-based access control (MANUFACTURER role)
- ✅ Easy to link actions to specific manufacturer

### 3. **Query Efficiency**
- ✅ Direct join between users and manufacturers
- ✅ Fast lookups: `SELECT * FROM manufacturers WHERE user_id = ?`
- ✅ Can fetch user details with manufacturer: `JOIN users`

### 4. **Code Clarity**
- ✅ Clear relationship in code: `manufacturer.getUser()`
- ✅ Type-safe with JPA entities
- ✅ Easier to understand system architecture

### 5. **Future Extensibility**
- ✅ Easy to add user-based features (notifications, settings)
- ✅ Audit trail: Who created what and when
- ✅ User preferences can apply to manufacturer
- ✅ Single sign-on possibilities

## 📊 Database Schema

### Before (No Foreign Key)
```
users                    manufacturers
+----+----------+        +----+--------------+
| id | username |        | id | company_name |
| 5  | abc_mfg  |        | 1  | ABC Crackers |
+----+----------+        +----+--------------+
     ❌ No link
```

### After (With Foreign Key)
```
users                    manufacturers
+----+----------+        +----+---------+--------------+
| id | username |        | id | user_id | company_name |
| 5  | abc_mfg  |    ┌-->| 1  |    5    | ABC Crackers |
+----+----------+    |   +----+---------+--------------+
                     |           ↑
                     └───────────┘ Foreign Key
```

## 🔍 Testing the Integration

### 1. Test Manufacturer Creation

```bash
# Create a new manufacturer via API
POST http://localhost:8080/api/admin/manufacturers
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "companyName": "Test Crackers Ltd",
  "contactPerson": "Test User",
  "email": "test@crackers.com",
  "phoneNumber": "9876543210",
  "address": "123 Test Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "country": "India",
  "username": "test_manufacturer",
  "password": "test123",
  "confirmPassword": "test123"
}

# Response should include userId
{
  "id": 10,
  "userId": 25,  // ✅ User ID is included
  "companyName": "Test Crackers Ltd",
  ...
}
```

### 2. Test Database Link

```sql
-- Check the foreign key relationship
SELECT 
    m.id as manufacturer_id,
    m.company_name,
    m.user_id,
    u.id as user_id_check,
    u.username,
    u.email,
    u.role
FROM manufacturers m
JOIN users u ON m.user_id = u.id
WHERE m.id = 10;

-- Should return:
-- manufacturer_id | company_name         | user_id | user_id_check | username          | email             | role
-- 10              | Test Crackers Ltd    | 25      | 25            | test_manufacturer | test@crackers.com | MANUFACTURER
```

### 3. Test Manufacturer Profile API

```bash
# Login as manufacturer
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "test_manufacturer",
  "password": "test123"
}

# Use the JWT token from response
GET http://localhost:8080/api/manufacturer/profile
Authorization: Bearer {manufacturer_jwt_token}

# Response should include userId and all manufacturer details
{
  "id": 10,
  "userId": 25,
  "companyName": "Test Crackers Ltd",
  ...
}
```

### 4. Test Frontend Integration

```bash
# 1. Login as manufacturer at frontend
http://localhost:5173/auth

# 2. Navigate to manufacturer dashboard
http://localhost:5173/manufacturer

# 3. Check browser console - should see:
# - Fetching manufacturer profile: /api/manufacturer/profile
# - Response with real manufacturer ID
# - Fetching products with that manufacturer ID
# - Dashboard shows company name in header
```

## ⚠️ Migration Considerations

### For Existing Data

If you have existing manufacturers without linked users:

**Option 1: Null user_id (Temporary)**
```sql
-- Allow null temporarily
ALTER TABLE manufacturers MODIFY user_id BIGINT NULL;

-- Existing manufacturers will have user_id = NULL
-- They must be linked manually or via migration script
```

**Option 2: Migration Script**
```java
// Create users for existing manufacturers
@PostConstruct
public void migrateExistingManufacturers() {
    List<Manufacturer> unlinkedManufacturers = 
        manufacturerRepository.findAll().stream()
            .filter(m -> m.getUser() == null)
            .collect(Collectors.toList());
    
    for (Manufacturer manufacturer : unlinkedManufacturers) {
        // Create user account
        User user = new User();
        user.setUsername(generateUsername(manufacturer));
        user.setEmail(manufacturer.getEmail());
        user.setPassword(passwordEncoder.encode(generateTemporaryPassword()));
        user.setRole(Role.MANUFACTURER);
        User savedUser = userRepository.save(user);
        
        // Link to manufacturer
        manufacturer.setUser(savedUser);
        manufacturerRepository.save(manufacturer);
        
        // Notify admin to reset password
        System.out.println("Created user for manufacturer: " + manufacturer.getCompanyName());
    }
}
```

## 🚨 Important Notes

### 1. **User Creation Order**
Always create the **User first**, then the **Manufacturer**:
```java
// ✅ CORRECT
User user = userRepository.save(new User(...));
Manufacturer manufacturer = new Manufacturer(...);
manufacturer.setUser(user);
manufacturerRepository.save(manufacturer);

// ❌ WRONG
Manufacturer manufacturer = manufacturerRepository.save(new Manufacturer(...));
// Foreign key constraint violation!
```

### 2. **Cascade Operations**
Consider adding cascade settings if needed:
```java
@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
@JoinColumn(name = "user_id", unique = true)
private User user;
```

This will delete the user when manufacturer is deleted (use with caution!).

### 3. **Lazy Loading**
User is loaded lazily, so access it carefully:
```java
// ✅ Inside transaction or with JOIN FETCH
Manufacturer manufacturer = manufacturerRepository.findById(id).get();
User user = manufacturer.getUser();  // Will trigger additional query

// ✅ Better: Use JOIN FETCH
@Query("SELECT m FROM Manufacturer m JOIN FETCH m.user WHERE m.id = :id")
Optional<Manufacturer> findByIdWithUser(@Param("id") Long id);
```

### 4. **User Role**
Always ensure user role is MANUFACTURER:
```java
user.setRole(Role.MANUFACTURER);  // Critical!
```

## 📈 Future Enhancements

### 1. **Bidirectional Relationship**
Add reverse mapping in User entity:
```java
@Entity
public class User {
    @OneToOne(mappedBy = "user")
    private Manufacturer manufacturer;
    
    // Now you can do: user.getManufacturer()
}
```

### 2. **User Activity Tracking**
Track manufacturer activities through user:
```java
@Entity
public class Manufacturer {
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    public LocalDateTime getLastLoginTime() {
        return user.getLastLogin();
    }
}
```

### 3. **Unified User Management**
Centralize user operations:
- Password reset via user email
- Account activation/deactivation
- Notification preferences
- Security settings

## ✅ Summary

### Changes Made
1. ✅ Added `user_id` foreign key to Manufacturer entity
2. ✅ Updated ManufacturerService to link user on creation
3. ✅ Added repository methods to find manufacturer by user
4. ✅ Created ManufacturerController with profile endpoint
5. ✅ Updated ManufacturerResponse DTO to include userId
6. ✅ Updated frontend types and API client
7. ✅ Updated ManufacturerDashboard to fetch real profile

### Benefits Achieved
- ✅ **Data Integrity**: Foreign key constraint enforced
- ✅ **Authentication**: Proper user-manufacturer link
- ✅ **Dynamic Data**: Real manufacturer ID from authentication
- ✅ **Better UX**: Shows company name in dashboard
- ✅ **Scalability**: Easy to extend with user features
- ✅ **Type Safety**: Full TypeScript support

### Files Modified
**Backend:**
- `Manufacturer.java` - Added user relationship
- `ManufacturerRepository.java` - Added findByUser methods
- `ManufacturerService.java` - Updated creation logic
- `ManufacturerResponse.java` - Added userId field
- `ManufacturerController.java` - **NEW** controller for profile

**Frontend:**
- `types/index.ts` - Updated Manufacturer interface
- `lib/api.ts` - Added getMyProfile method
- `ManufacturerDashboard.tsx` - Fetch real profile

The implementation is **production-ready** and follows best practices for JPA relationships and REST API design! 🎉

