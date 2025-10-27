# JPA Dependency Error Fix

## Problem
```
Caused by: org.springframework.beans.factory.UnsatisfiedDependencyException: 
Error creating bean with name 'jwtAuthenticationFilter': 
Unsatisfied dependency expressed through field 'userDetailsService': 
Error creating bean with name 'userDetailsServiceImpl': 
Unsatisfied dependency expressed through field 'userRepository': 
Error creating bean with name 'userRepository' defined in com.crackersbazaar.repository.UserRepository 
defined in @EnableJpaRepositories declared on JpaRepositoriesRegistrar.EnableJpaRepositoriesConfiguration: 
Cannot resolve reference to bean 'jpaSharedEM_entityManagerFactory' while setting bean property 'entityManager'
```

## Root Causes

### 1. **Circular Dependency Issue**
- **Manufacturer entity** has `@OneToOne` relationship with `User`
- **Data.sql** was trying to insert Manufacturer before User
- **JPA** couldn't resolve the foreign key relationship

### 2. **SQL Initialization Timing**
- **data.sql** was loading before JPA entities were fully initialized
- **Entity Manager Factory** wasn't ready when SQL was executing
- **Foreign key constraints** were failing

### 3. **Configuration Issues**
- **Missing `defer-datasource-initialization`** configuration
- **SQL init mode** conflicting with JPA initialization
- **Entity relationships** not properly ordered

## ✅ **Fixes Applied**

### 1. **Fixed Data Insertion Order**
```sql
-- BEFORE (Incorrect Order)
1. Insert Manufacturer (with user_id = 1)
2. Insert User (id = 1)

-- AFTER (Correct Order)
1. Insert Users first
2. Insert Manufacturer (with user_id = 1)
3. Insert Products
4. Insert Orders
```

### 2. **Updated Application Configuration**
```yaml
# BEFORE
spring:
  jpa:
    hibernate:
      ddl-auto: update
  sql:
    init:
      mode: always

# AFTER
spring:
  jpa:
    hibernate:
      ddl-auto: update
    defer-datasource-initialization: true
  sql:
    init:
      mode: always
      continue-on-error: false
```

### 3. **Fixed Entity Relationships**
- ✅ **Users inserted first** to avoid foreign key violations
- ✅ **Manufacturer references existing User** (user_id = 1)
- ✅ **Products reference existing Manufacturer** (manufacturer_id = 1)
- ✅ **Orders reference existing User** (user_id = 2)

## 🔧 **Configuration Changes**

### **application.yml Updates:**
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    defer-datasource-initialization: true  # ← Added this
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql
      continue-on-error: false  # ← Added this
```

### **Key Configuration Properties:**
- ✅ **`defer-datasource-initialization: true`** - Ensures JPA entities are ready before SQL execution
- ✅ **`continue-on-error: false`** - Stops on first error for easier debugging
- ✅ **Proper initialization order** - Users → Manufacturer → Products → Orders

## 📊 **Data Insertion Order**

### **Correct Order:**
1. **Users** (3 users: manufacturer, retailer, admin)
2. **Manufacturer** (references user_id = 1)
3. **Products** (6 products, references manufacturer_id = 1)
4. **Product Images** (separate table)
5. **Orders** (3 orders, references user_id = 2)
6. **Order Items** (6 items, references order_id and product_id)

### **Foreign Key Relationships:**
```
Users (1) ← Manufacturer (user_id = 1)
Manufacturer (1) ← Products (manufacturer_id = 1)
Products (1-6) ← Product Images (product_id = 1-6)
Users (2) ← Orders (user_id = 2)
Orders (1-3) ← Order Items (order_id = 1-3)
Products (1-6) ← Order Items (product_id = 1-6)
```

## 🚀 **Testing the Fix**

### **1. Start the Application**
```bash
cd backend
./mvnw spring-boot:run
```

### **2. Expected Results**
- ✅ **No JPA dependency errors**
- ✅ **Application starts successfully**
- ✅ **All tables populated with test data**
- ✅ **Foreign key relationships working**

### **3. Verify Data Loading**
```sql
-- Check if data was loaded
SELECT COUNT(*) FROM users;        -- Should return 3
SELECT COUNT(*) FROM manufacturers; -- Should return 1
SELECT COUNT(*) FROM products;     -- Should return 6
SELECT COUNT(*) FROM orders;       -- Should return 3
```

## 🔍 **Troubleshooting**

### **If Still Getting Errors:**

#### **1. Check Database Connection**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crackers_bazaar
    username: postgres
    password: password
```

#### **2. Check JPA Configuration**
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    defer-datasource-initialization: true
```

#### **3. Check SQL Initialization**
```yaml
spring:
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql
      continue-on-error: false
```

#### **4. Verify Entity Relationships**
- Check `@OneToOne`, `@ManyToOne` annotations
- Ensure foreign key columns exist
- Verify cascade settings

### **Common Issues:**

#### **1. Circular Dependencies**
```java
// Manufacturer.java
@OneToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User user;

// Solution: Insert User first, then Manufacturer
```

#### **2. Foreign Key Violations**
```sql
-- Wrong order
INSERT INTO manufacturers (user_id) VALUES (1);  -- User doesn't exist yet
INSERT INTO users (id) VALUES (1);

-- Correct order
INSERT INTO users (id) VALUES (1);
INSERT INTO manufacturers (user_id) VALUES (1);  -- User exists
```

#### **3. JPA Initialization Timing**
```yaml
# Wrong
spring:
  sql:
    init:
      mode: always  # Runs before JPA is ready

# Correct
spring:
  jpa:
    defer-datasource-initialization: true  # Wait for JPA
  sql:
    init:
      mode: always  # Now runs after JPA is ready
```

## 📋 **Summary**

The JPA dependency error has been fixed by:

1. ✅ **Reordering data insertion** - Users first, then Manufacturer
2. ✅ **Adding proper JPA configuration** - `defer-datasource-initialization`
3. ✅ **Fixing foreign key relationships** - Proper reference order
4. ✅ **Adding error handling** - `continue-on-error: false`

The application should now start successfully with all test data loaded correctly! 🎆✨

## 🎯 **Next Steps**

1. **Start the application** and verify no errors
2. **Test login** with provided credentials
3. **Verify data** in manufacturer dashboard
4. **Check order management** functionality

### **Test Credentials:**
- **Manufacturer:** `rajesh@sparklefireworks.com` / `password123`
- **Retailer:** `retailer@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`
