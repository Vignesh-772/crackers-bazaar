# DataInitializer Conflict Fix

## Problem
```
ERROR: duplicate key value violates unique constraint "users_pkey"
Detail: Key (id)=(1) already exists.
```

## Root Cause
There were **two data initialization mechanisms** running simultaneously:

1. **`data.sql` script** - Loading test data via SQL
2. **`DataInitializer.java`** - Loading data via Java CommandLineRunner

Both were trying to insert the same data, causing duplicate key constraint violations.

## 🔍 **Conflict Analysis**

### **Execution Order:**
1. **SQL Script runs first** (data.sql)
2. **DataInitializer runs second** (CommandLineRunner)
3. **Both try to insert users** with same IDs
4. **Duplicate key constraint violation** occurs

### **Conflicting Data:**
- **data.sql:** Creates users with IDs 1, 2, 3
- **DataInitializer:** Tries to create users with same IDs
- **Result:** Constraint violation on primary key

## ✅ **Solution Applied**

### **1. Added Conflict Detection**
```java
@Override
public void run(String... args) throws Exception {
    // Check if data already exists (from data.sql)
    if (userRepository.count() > 0) {
        System.out.println("Data already exists from data.sql, skipping DataInitializer");
        return;
    }
    // ... rest of the method
}
```

### **2. How It Works**
- **DataInitializer checks** if users already exist
- **If data exists** (from data.sql), it skips initialization
- **If no data exists**, it runs the original logic
- **No more conflicts** between the two systems

## 🔧 **Implementation Details**

### **Conflict Detection Logic:**
```java
// Check if data already exists (from data.sql)
if (userRepository.count() > 0) {
    System.out.println("Data already exists from data.sql, skipping DataInitializer");
    return;
}
```

### **Why This Works:**
- ✅ **`userRepository.count() > 0`** - Checks if any users exist
- ✅ **Early return** - Skips all data creation if data exists
- ✅ **No duplicate insertion** - Prevents constraint violations
- ✅ **Backward compatible** - Still works if data.sql is disabled

## 🚀 **Benefits**

### **1. No More Conflicts**
- ✅ **Single source of truth** - data.sql takes precedence
- ✅ **No duplicate key errors**
- ✅ **Clean application startup**
- ✅ **Predictable behavior**

### **2. Flexible Data Loading**
- ✅ **data.sql runs first** - Loads comprehensive test data
- ✅ **DataInitializer as fallback** - Only runs if no data exists
- ✅ **Development friendly** - Easy to switch between approaches
- ✅ **Production safe** - Won't interfere with live data

### **3. Better Error Handling**
- ✅ **Clear logging** - Shows which data source is used
- ✅ **No silent failures** - Explicit conflict detection
- ✅ **Easy debugging** - Clear console messages

## 📊 **Data Loading Strategy**

### **Current Approach (Recommended):**
1. **data.sql loads first** - Comprehensive test data
2. **DataInitializer checks** if data exists
3. **If data exists** - Skip DataInitializer
4. **If no data** - Run DataInitializer as fallback

### **Alternative Approaches:**

#### **Option 1: Disable DataInitializer**
```java
@Component
@ConditionalOnProperty(name = "app.data.initializer.enabled", havingValue = "true", matchIfMissing = false)
public class DataInitializer implements CommandLineRunner {
    // ...
}
```

#### **Option 2: Disable data.sql**
```yaml
spring:
  sql:
    init:
      mode: never
```

#### **Option 3: Use Different Data Sources**
- **Development:** Use data.sql
- **Production:** Use DataInitializer
- **Testing:** Use both with different data

## 🎯 **Testing the Fix**

### **1. Start the Application**
```bash
cd backend
./mvnw spring-boot:run
```

### **2. Expected Console Output**
```
Data already exists from data.sql, skipping DataInitializer
```

### **3. Verify Data Loading**
- ✅ **No duplicate key errors**
- ✅ **Application starts successfully**
- ✅ **Test data loaded from data.sql**
- ✅ **DataInitializer skipped**

### **4. Test Login**
- **Manufacturer:** `rajesh@sparklefireworks.com` / `password123`
- **Retailer:** `retailer@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`

## 🔍 **Troubleshooting**

### **If Still Getting Errors:**

#### **1. Check Console Output**
```
# Should see this message:
Data already exists from data.sql, skipping DataInitializer
```

#### **2. Verify Data Loading**
```sql
-- Check if data was loaded
SELECT COUNT(*) FROM users;        -- Should return 3
SELECT COUNT(*) FROM manufacturers; -- Should return 1
SELECT COUNT(*) FROM products;     -- Should return 6
```

#### **3. Check Execution Order**
- **data.sql** should run first (during JPA initialization)
- **DataInitializer** should run second (during CommandLineRunner)
- **Conflict detection** should prevent duplicate insertion

### **Common Issues:**

#### **1. DataInitializer Still Running**
```java
// Check if the condition is working
if (userRepository.count() > 0) {
    System.out.println("Data already exists from data.sql, skipping DataInitializer");
    return;
}
```

#### **2. data.sql Not Loading**
```yaml
# Check application.yml
spring:
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql
```

#### **3. Database Connection Issues**
```yaml
# Check database configuration
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crackers_bazaar
    username: postgres
    password: password
```

## 📋 **Summary**

The DataInitializer conflict has been fixed by:

1. ✅ **Added conflict detection** - Check if data already exists
2. ✅ **Early return** - Skip DataInitializer if data exists
3. ✅ **Clear logging** - Show which data source is used
4. ✅ **No duplicate insertion** - Prevent constraint violations

### **Key Benefits:**
- ✅ **No more duplicate key errors**
- ✅ **Clean application startup**
- ✅ **Flexible data loading**
- ✅ **Better error handling**

The application should now start successfully without any DataInitializer conflicts! 🎆✨

## 🎯 **Next Steps**

1. **Start the application** and verify no errors
2. **Check console output** for conflict detection message
3. **Test login** with provided credentials
4. **Verify data** in manufacturer dashboard

### **Test Credentials:**
- **Manufacturer:** `rajesh@sparklefireworks.com` / `password123`
- **Retailer:** `retailer@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`
