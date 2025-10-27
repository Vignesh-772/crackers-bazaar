# Test Data for Crackers Bazaar

## Overview
This document describes the dummy test data created for testing the Crackers Bazaar application. The test data includes manufacturers, users, products, and orders to facilitate comprehensive testing of all features.

## Test Data Created

### 1. Test Users

#### **Manufacturer User**
- **Username:** `rajesh_kumar`
- **Email:** `rajesh@sparklefireworks.com`
- **Password:** `password123`
- **Role:** `MANUFACTURER`
- **Company:** Sparkle Fireworks Ltd
- **Contact:** Rajesh Kumar (+91-9876543210)

#### **Retailer User**
- **Username:** `retailer_test`
- **Email:** `retailer@test.com`
- **Password:** `password123`
- **Role:** `RETAILER`
- **Name:** Test Retailer
- **Contact:** +91-9876543211

#### **Admin User**
- **Username:** `admin_test`
- **Email:** `admin@test.com`
- **Password:** `password123`
- **Role:** `ADMIN`
- **Name:** Test Admin
- **Contact:** +91-9876543212

### 2. Test Manufacturer

#### **Company Details:**
- **Company Name:** Sparkle Fireworks Ltd
- **Contact Person:** Rajesh Kumar
- **Email:** rajesh@sparklefireworks.com
- **Phone:** +91-9876543210
- **Address:** 123 Industrial Area, Sector 5, Mumbai, Maharashtra 400001
- **GST Number:** 27ABCDE1234F1Z5
- **PAN Number:** ABCDE1234F
- **Bank Account:** 1234567890123456
- **IFSC Code:** SBIN0001234
- **Status:** Active

### 3. Test Products

#### **Product 1: Premium Sparklers - 10 inch**
- **Price:** ₹299.00
- **Stock:** 100 units
- **Category:** Sparklers > Handheld
- **Brand:** Sparkle Fireworks
- **SKU:** SPK-001
- **Description:** High-quality sparklers perfect for celebrations

#### **Product 2: Festival Crackers - Assorted Pack**
- **Price:** ₹599.00
- **Stock:** 50 units
- **Category:** Crackers > Ground
- **Brand:** Sparkle Fireworks
- **SKU:** CRK-002
- **Description:** Mixed pack of festival crackers

#### **Product 3: Rocket Fireworks - 12 inch**
- **Price:** ₹799.00
- **Stock:** 75 units
- **Category:** Rockets > Aerial
- **Brand:** Sparkle Fireworks
- **SKU:** RKT-003
- **Description:** Aerial rockets with colorful burst effects

#### **Product 4: Fountain Fireworks - Multi Color**
- **Price:** ₹399.00
- **Stock:** 80 units
- **Category:** Fountains > Ground
- **Brand:** Sparkle Fireworks
- **SKU:** FNT-004
- **Description:** Beautiful fountain display with multiple colors

#### **Product 5: Roman Candles - 6 Shot**
- **Price:** ₹499.00
- **Stock:** 60 units
- **Category:** Roman Candles > Handheld
- **Brand:** Sparkle Fireworks
- **SKU:** RMC-005
- **Description:** Roman candles with 6 shots of different colors

#### **Product 6: Ground Spinners - Colorful**
- **Price:** ₹199.00
- **Stock:** 120 units
- **Category:** Spinners > Ground
- **Brand:** Sparkle Fireworks
- **SKU:** SPN-006
- **Description:** Colorful ground spinners that create beautiful patterns

### 4. Test Orders

#### **Order 1: ORD-2024-001**
- **Status:** CONFIRMED
- **Customer:** Test Retailer
- **Total:** ₹1,247.00 (including ₹50 shipping)
- **Items:**
  - 2x Premium Sparklers (₹598.00)
  - 1x Festival Crackers (₹599.00)
- **Payment:** Cash on Delivery
- **Notes:** Please deliver during business hours

#### **Order 2: ORD-2024-002**
- **Status:** PROCESSING
- **Customer:** Test Retailer
- **Total:** ₹1,048.00 (including ₹50 shipping)
- **Items:**
  - 1x Rocket Fireworks (₹799.00)
  - 1x Fountain Fireworks (₹399.00)
- **Payment:** Card (Paid)
- **Notes:** Urgent delivery required

#### **Order 3: ORD-2024-003**
- **Status:** SHIPPED
- **Customer:** Test Retailer
- **Total:** ₹1,348.00 (including ₹50 shipping)
- **Items:**
  - 1x Roman Candles (₹499.00)
  - 4x Ground Spinners (₹796.00)
- **Payment:** UPI (Paid)
- **Tracking:** TRK123456789
- **Notes:** Handle with care

## How to Use Test Data

### 1. Login Credentials

#### **For Manufacturer Testing:**
```
Email: rajesh@sparklefireworks.com
Password: password123
Role: MANUFACTURER
```

#### **For Retailer Testing:**
```
Email: retailer@test.com
Password: password123
Role: RETAILER
```

#### **For Admin Testing:**
```
Email: admin@test.com
Password: password123
Role: ADMIN
```

### 2. Testing Scenarios

#### **Manufacturer Dashboard Testing:**
1. Login as manufacturer (`rajesh@sparklefireworks.com`)
2. Navigate to manufacturer dashboard
3. View products tab - should see 6 products
4. View orders tab - should see 3 orders
5. Test order status updates:
   - Process Order 1 (CONFIRMED → PROCESSING)
   - Ship Order 2 (PROCESSING → SHIPPED)
   - Deliver Order 3 (SHIPPED → DELIVERED)

#### **Retailer Testing:**
1. Login as retailer (`retailer@test.com`)
2. Browse products - should see all 6 products
3. Add products to cart
4. Place new orders
5. View order history

#### **Admin Testing:**
1. Login as admin (`admin@test.com`)
2. Access admin dashboard
3. Manage users and products
4. View all orders

### 3. Product Categories

#### **Sparklers**
- Premium Sparklers (Handheld)
- Roman Candles (Handheld)

#### **Crackers**
- Festival Crackers (Ground)

#### **Rockets**
- Rocket Fireworks (Aerial)

#### **Fountains**
- Fountain Fireworks (Ground)

#### **Spinners**
- Ground Spinners (Ground)

### 4. Order Status Testing

#### **Status Workflow:**
```
PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED
```

#### **Test Order Statuses:**
- **Order 1:** CONFIRMED (ready for processing)
- **Order 2:** PROCESSING (ready for shipping)
- **Order 3:** SHIPPED (ready for delivery)

### 5. Search and Filter Testing

#### **Product Search:**
- Search by product name
- Search by category
- Search by brand
- Search by price range

#### **Order Filtering:**
- Filter by status
- Search by order number
- Search by customer name

## Database Schema

### Tables Populated:
- `manufacturers` - 1 manufacturer
- `users` - 3 users (manufacturer, retailer, admin)
- `products` - 6 products
- `orders` - 3 orders
- `order_items` - 6 order items

### Relationships:
- Manufacturer → Products (1:6)
- User → Orders (1:3 for retailer)
- Orders → Order Items (1:2 each)
- Products → Order Items (1:1 each)

## Data Loading

The test data is automatically loaded when the application starts in development mode. The `data.sql` file is executed during application startup.

### Configuration:
```yaml
spring:
  sql:
    init:
      mode: always
      data-locations: classpath:data.sql
```

## Testing Features

### 1. Manufacturer Features
- ✅ View all products
- ✅ Add new products
- ✅ Update product status
- ✅ View orders containing their products
- ✅ Update order status
- ✅ Add tracking numbers
- ✅ Search and filter orders

### 2. Retailer Features
- ✅ Browse products
- ✅ Search products
- ✅ Add to cart
- ✅ Place orders
- ✅ View order history
- ✅ Track orders

### 3. Admin Features
- ✅ Manage users
- ✅ Manage products
- ✅ View all orders
- ✅ Update order status
- ✅ System administration

## Image URLs

All products include placeholder images from Unsplash:
- Fireworks images: `https://images.unsplash.com/photo-1484503369366-c546e5814e13?w=400`
- Celebration images: `https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400`

## Notes

### Security:
- All passwords are hashed using BCrypt
- Test data is safe for development use
- Production deployment should use different credentials

### Data Integrity:
- All foreign key relationships are maintained
- Sequence values are properly set
- Timestamps are realistic

### Performance:
- Test data is minimal for fast loading
- Realistic data volumes for testing
- Optimized for development environment

## Troubleshooting

### Common Issues:

#### **Data Not Loading:**
1. Check database connection
2. Verify `data.sql` file exists
3. Check application logs for SQL errors

#### **Login Issues:**
1. Verify password: `password123`
2. Check user role assignments
3. Ensure email verification is set to true

#### **Order Issues:**
1. Verify manufacturer-product relationships
2. Check order status values
3. Ensure proper foreign key constraints

### Reset Data:
To reset test data, restart the application. The `data.sql` file will be executed again, recreating all test data.

## Support

For issues with test data:
1. Check application logs
2. Verify database connectivity
3. Ensure all required tables exist
4. Check foreign key constraints

The test data provides a comprehensive foundation for testing all features of the Crackers Bazaar application! 🎆
