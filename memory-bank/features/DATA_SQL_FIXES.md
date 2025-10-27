# Data.sql Schema Fixes

## Issues Found and Fixed

### ❌ **Original Problems**

#### **1. Schema Mismatches**
- **Manufacturer table:** Missing required fields like `user_id`, `license_number`, `status`
- **User table:** Trying to insert fields that don't exist (`phone`, `address`, `city`, etc.)
- **Product table:** Using `image_urls` as JSON instead of separate `product_images` table

#### **2. Field Name Issues**
- **Manufacturer:** `phone` vs `phone_number` (entity uses `phone_number`)
- **User:** Extra fields not in entity schema
- **Product:** `image_urls` field doesn't exist in entity

#### **3. Data Type Issues**
- **Phone numbers:** Should be 10 digits without country code
- **Image storage:** Should use separate `product_images` table
- **Foreign keys:** Missing proper relationships

### ✅ **Fixes Applied**

#### **1. Manufacturer Table Fixes**
```sql
-- BEFORE (Incorrect)
INSERT INTO manufacturers (id, company_name, contact_person, email, phone, ...)

-- AFTER (Correct)
INSERT INTO manufacturers (id, company_name, contact_person, email, phone_number, address, city, state, pincode, country, gst_number, pan_number, license_number, status, is_verified, user_id, created_at, updated_at)
```

**Changes:**
- ✅ `phone` → `phone_number`
- ✅ Added `license_number` field
- ✅ Added `status` field (APPROVED)
- ✅ Added `is_verified` field (true)
- ✅ Added `user_id` field (1)
- ✅ Removed non-existent fields

#### **2. User Table Fixes**
```sql
-- BEFORE (Incorrect)
INSERT INTO users (id, username, email, password, first_name, last_name, phone, address, city, state, pincode, country, role, is_active, email_verified, created_at, updated_at, manufacturer_id)

-- AFTER (Correct)
INSERT INTO users (id, username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
```

**Changes:**
- ✅ Removed `phone`, `address`, `city`, `state`, `pincode`, `country` (not in entity)
- ✅ Removed `email_verified` (not in entity)
- ✅ Removed `manufacturer_id` (not in entity)
- ✅ Kept only fields that exist in User entity

#### **3. Product Table Fixes**
```sql
-- BEFORE (Incorrect)
INSERT INTO products (..., image_urls)
VALUES (..., '["url1", "url2"]')

-- AFTER (Correct)
INSERT INTO products (..., manufacturer_id)
VALUES (..., 1)

-- Separate table for images
INSERT INTO product_images (product_id, image_url)
VALUES (1, 'url1'), (1, 'url2')
```

**Changes:**
- ✅ Removed `image_urls` field (doesn't exist in entity)
- ✅ Added separate `product_images` table inserts
- ✅ Fixed foreign key relationships

#### **4. Phone Number Format**
```sql
-- BEFORE (Incorrect)
'+91-9876543210'

-- AFTER (Correct)
'9876543210'
```

**Changes:**
- ✅ Removed country code and formatting
- ✅ Used 10-digit format as per entity validation

### 📊 **Schema Validation**

#### **Manufacturer Entity Fields:**
- ✅ `company_name` - String
- ✅ `contact_person` - String  
- ✅ `email` - String (unique)
- ✅ `phone_number` - String (10 digits)
- ✅ `address` - String
- ✅ `city` - String
- ✅ `state` - String
- ✅ `pincode` - String (6 digits)
- ✅ `country` - String
- ✅ `gst_number` - String
- ✅ `pan_number` - String
- ✅ `license_number` - String
- ✅ `status` - Enum (APPROVED)
- ✅ `is_verified` - Boolean
- ✅ `user_id` - Long (foreign key)

#### **User Entity Fields:**
- ✅ `username` - String (unique)
- ✅ `email` - String (unique)
- ✅ `password` - String (hashed)
- ✅ `first_name` - String
- ✅ `last_name` - String
- ✅ `role` - Enum (MANUFACTURER/RETAILER/ADMIN)
- ✅ `is_active` - Boolean
- ✅ `created_at` - Timestamp
- ✅ `updated_at` - Timestamp

#### **Product Entity Fields:**
- ✅ `name` - String
- ✅ `description` - String
- ✅ `price` - BigDecimal
- ✅ `stock_quantity` - Integer
- ✅ `min_order_quantity` - Integer
- ✅ `max_order_quantity` - Integer
- ✅ `category` - String
- ✅ `subcategory` - String
- ✅ `brand` - String
- ✅ `sku` - String
- ✅ `weight` - BigDecimal
- ✅ `dimensions` - String
- ✅ `is_active` - Boolean
- ✅ `manufacturer_id` - Long (foreign key)

#### **Product Images Table:**
- ✅ `product_id` - Long (foreign key)
- ✅ `image_url` - String

### 🔧 **Testing the Fixes**

#### **1. Start the Application**
```bash
cd backend
./mvnw spring-boot:run
```

#### **2. Check for Errors**
- Look for SQL syntax errors in console
- Check for constraint violations
- Verify foreign key relationships

#### **3. Test Data Loading**
- Verify users are created
- Verify manufacturer is created
- Verify products are created
- Verify images are stored in product_images table
- Verify orders are created

### 📝 **Files Updated**

#### **1. `data.sql` (Main file)**
- ✅ Fixed all schema mismatches
- ✅ Removed non-existent fields
- ✅ Added proper foreign key relationships
- ✅ Fixed data types and formats

#### **2. `data-corrected.sql` (Backup)**
- ✅ Complete corrected version
- ✅ Can be used as reference
- ✅ Ready for production use

### 🚀 **Expected Results**

#### **After Fixes:**
- ✅ **No SQL errors** during application startup
- ✅ **All tables populated** with test data
- ✅ **Foreign key relationships** working correctly
- ✅ **Images stored** in product_images table
- ✅ **Users can login** with test credentials
- ✅ **Manufacturer dashboard** shows products and orders

#### **Test Credentials:**
- **Manufacturer:** `rajesh@sparklefireworks.com` / `password123`
- **Retailer:** `retailer@test.com` / `password123`
- **Admin:** `admin@test.com` / `password123`

### 🔍 **Troubleshooting**

#### **If Still Getting Errors:**

1. **Check Entity Annotations:**
   ```java
   @Column(name = "phone_number")  // Verify column names
   ```

2. **Check Database Schema:**
   ```sql
   \d manufacturers  -- PostgreSQL
   DESCRIBE manufacturers;  -- MySQL
   ```

3. **Check Hibernate Logs:**
   ```yaml
   spring:
     jpa:
       show-sql: true
       properties:
         hibernate:
           format_sql: true
   ```

4. **Verify Foreign Keys:**
   ```sql
   SELECT * FROM manufacturers WHERE user_id = 1;
   SELECT * FROM products WHERE manufacturer_id = 1;
   ```

### 📋 **Summary**

The data.sql file has been completely fixed to match the actual entity schemas:

- ✅ **Schema mismatches resolved**
- ✅ **Field names corrected**
- ✅ **Data types fixed**
- ✅ **Foreign key relationships established**
- ✅ **Image storage properly implemented**
- ✅ **Phone number format corrected**

The application should now start without any SQL errors and load all test data correctly! 🎆✨
