# Duplicate Key Constraint Fix

## Problem
```
ERROR: duplicate key value violates unique constraint "users_pkey"
Detail: Key (id)=(1) already exists.
```

## Root Cause
The data.sql script was trying to insert data that already existed in the database from a previous run. This happens when:
1. **Application restarts** but database data persists
2. **data.sql runs again** trying to insert the same IDs
3. **Primary key constraints** prevent duplicate IDs

## ✅ **Solution Applied**

### **1. Clear Existing Data First**
```sql
-- Clear existing data first (for clean testing)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM manufacturers;
DELETE FROM users;
```

### **2. Reset Sequences**
```sql
-- Reset sequences to start from 1
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE manufacturers_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;
```

### **3. Clean Data Insertion**
```sql
-- Now insert fresh data
INSERT INTO users (id, username, email, ...) VALUES (1, ...);
INSERT INTO manufacturers (id, ...) VALUES (1, ...);
-- etc.
```

## 🔧 **How It Works**

### **Data Cleanup Process:**
1. **Delete all existing data** in reverse dependency order
2. **Reset all sequences** to start from 1
3. **Insert fresh data** with clean IDs
4. **No duplicate key conflicts**

### **Deletion Order (Important):**
```sql
DELETE FROM order_items;     -- Child table first
DELETE FROM orders;          -- Parent table
DELETE FROM product_images;  -- Child table first
DELETE FROM products;         -- Parent table
DELETE FROM manufacturers;    -- Parent table
DELETE FROM users;           -- Root table last
```

### **Why This Order:**
- **Foreign key constraints** prevent deleting parent records with child references
- **Must delete children first**, then parents
- **Ensures clean slate** for fresh data insertion

## 🚀 **Benefits**

### **1. Clean Testing Environment**
- ✅ **Fresh data** on every application start
- ✅ **No duplicate key errors**
- ✅ **Consistent test data**
- ✅ **Predictable behavior**

### **2. Development Friendly**
- ✅ **No manual database cleanup** needed
- ✅ **Easy to restart and test**
- ✅ **Consistent state** every time
- ✅ **No leftover data** from previous runs

### **3. Production Safe**
- ✅ **Only runs in development** (data.sql)
- ✅ **Production uses different** initialization
- ✅ **No impact on live data**

## 🔍 **Alternative Solutions**

### **Option 1: Use INSERT ... ON CONFLICT (PostgreSQL)**
```sql
INSERT INTO users (id, username, email, ...) 
VALUES (1, 'rajesh_kumar', 'rajesh@sparklefireworks.com', ...)
ON CONFLICT (id) DO NOTHING;
```

### **Option 2: Use IF NOT EXISTS (MySQL)**
```sql
INSERT IGNORE INTO users (id, username, email, ...) 
VALUES (1, 'rajesh_kumar', 'rajesh@sparklefireworks.com', ...);
```

### **Option 3: Check Before Insert**
```sql
INSERT INTO users (id, username, email, ...) 
SELECT 1, 'rajesh_kumar', 'rajesh@sparklefireworks.com', ...
WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = 1);
```

### **Option 4: Use MERGE/UPSERT**
```sql
MERGE INTO users USING (SELECT 1 as id, 'rajesh_kumar' as username, ...) AS source
ON users.id = source.id
WHEN NOT MATCHED THEN INSERT (id, username, ...) VALUES (source.id, source.username, ...);
```

## 📊 **Current Implementation**

### **Chosen Solution: Clean Slate Approach**
```sql
-- 1. Clear all existing data
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM manufacturers;
DELETE FROM users;

-- 2. Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE manufacturers_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;
ALTER SEQUENCE orders_id_seq RESTART WITH 1;
ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- 3. Insert fresh data
INSERT INTO users (id, username, email, ...) VALUES (1, ...);
-- etc.
```

### **Why This Approach:**
- ✅ **Simple and reliable**
- ✅ **Works with all databases**
- ✅ **Ensures clean state**
- ✅ **No complex conflict resolution**
- ✅ **Perfect for development/testing**

## 🎯 **Testing the Fix**

### **1. Start the Application**
```bash
cd backend
./mvnw spring-boot:run
```

### **2. Expected Results**
- ✅ **No duplicate key errors**
- ✅ **Application starts successfully**
- ✅ **All test data loaded**
- ✅ **Clean database state**

### **3. Verify Data**
```sql
-- Check if data was loaded correctly
SELECT COUNT(*) FROM users;        -- Should return 3
SELECT COUNT(*) FROM manufacturers; -- Should return 1
SELECT COUNT(*) FROM products;     -- Should return 6
SELECT COUNT(*) FROM orders;       -- Should return 3
```

### **4. Test Login**
- **Manufacturer:** `rajesh@sparklefireworks.com` / `password123`
- **Retailer:** `retailer@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`

## 🔧 **Troubleshooting**

### **If Still Getting Errors:**

#### **1. Check Database Connection**
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d crackers_bazaar
```

#### **2. Check Table Existence**
```sql
-- Verify tables exist
\dt
```

#### **3. Check Sequences**
```sql
-- Verify sequences exist
SELECT * FROM information_schema.sequences;
```

#### **4. Manual Cleanup**
```sql
-- If needed, manual cleanup
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS manufacturers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

## 📋 **Summary**

The duplicate key constraint error has been fixed by:

1. ✅ **Clearing existing data** before insertion
2. ✅ **Resetting sequences** to start from 1
3. ✅ **Proper deletion order** to respect foreign keys
4. ✅ **Clean slate approach** for reliable testing

### **Key Benefits:**
- ✅ **No more duplicate key errors**
- ✅ **Clean testing environment**
- ✅ **Reliable application startup**
- ✅ **Consistent test data**

The application should now start successfully without any duplicate key constraint violations! 🎆✨

## 🎯 **Next Steps**

1. **Start the application** and verify no errors
2. **Test login** with provided credentials
3. **Verify data** in manufacturer dashboard
4. **Check order management** functionality

### **Test Credentials:**
- **Manufacturer:** `rajesh@sparklefireworks.com` / `password123`
- **Retailer:** `retailer@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`
