# Order Management and Search Functionality Implementation

## Overview
This document details the complete implementation of Order Management system and Search functionality for the Crackers Bazaar application.

## Implementation Date
October 23, 2025

---

## Backend Implementation

### 1. Entities Created

#### OrderStatus Enum (`OrderStatus.java`)
```java
PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED
```

#### Order Entity (`Order.java`)
- **Fields:**
  - Order tracking (id, orderNumber, status)
  - Financial data (subtotal, tax, shippingCost, discount, total)
  - Shipping address (address, city, state, pincode, country)
  - Billing address (address, city, state, pincode, country)
  - Contact information (contactEmail, contactPhone)
  - Payment details (paymentMethod, paymentStatus, paymentTransactionId)
  - Tracking (trackingNumber, shippedAt, deliveredAt)
  - Cancellation (cancelledAt, cancellationReason)
  - Metadata (notes, createdAt, updatedAt)
  - Relationships: User (Many-to-One), OrderItems (One-to-Many)

#### OrderItem Entity (`OrderItem.java`)
- **Fields:**
  - id, order (FK), product (FK)
  - Product snapshot (productName, productSku, imageUrl)
  - Pricing (quantity, unitPrice, discount, totalPrice)
  - Metadata (createdAt)

### 2. Repositories Created

#### OrderRepository (`OrderRepository.java`)
- **Basic Queries:**
  - findByOrderNumber
  - findByUser, findByUserId
  - findByStatus
  - findByUserAndStatus
  - findByCreatedAtBetween
  
- **Count Queries:**
  - countByUser, countByStatus, countByUserAndStatus
  
- **Custom Queries:**
  - findOrdersByManufacturerId (for manufacturer dashboard)
  - findOrdersByManufacturerIdAndStatus
  - countOrdersByManufacturerId
  - getTotalSpentByUser
  - getTotalRevenueByManufacturer

#### OrderItemRepository (`OrderItemRepository.java`)
- findByOrder, findByProduct
- findByUserId, findByManufacturerId
- getTotalQuantitySoldByProduct
- getTotalRevenueByProduct

### 3. DTOs Created

- **OrderItemRequest:** For creating order items
- **OrderItemResponse:** For returning order item data
- **OrderRequest:** For creating orders with shipping/billing details
- **OrderResponse:** Complete order data with items
- **OrderStatusUpdateRequest:** For updating order status

### 4. Service Layer

#### OrderService (`OrderService.java`)
- **Order Creation:**
  - createOrder: Validates products, checks stock, calculates totals, updates stock
  - Generates unique order numbers (ORDYYYYMMDDHHMMSSxxxx)
  
- **Order Retrieval:**
  - getOrderById, getOrderByOrderNumber
  - getAllOrders (paginated)
  - getOrdersByUserId (paginated)
  - getOrdersByStatus (paginated)
  - getOrdersByManufacturerId (paginated)
  
- **Order Management:**
  - updateOrderStatus: Validates transitions, updates timestamps
  - cancelOrder: Restores product stock
  - deleteOrder
  
- **Statistics:**
  - getOrderCountByUserId
  - getOrderCountByStatus
  - getTotalSpentByUser
  - getTotalRevenueByManufacturer
  - getOrderCountByManufacturer
  
- **Helper Methods:**
  - generateOrderNumber
  - validateStatusTransition
  - restoreProductStock

### 5. Controller Layer

#### OrderController (`OrderController.java`)
- **Endpoints:**

**POST /api/orders**
- Create new order
- Authentication: Required
- Body: OrderRequest

**GET /api/orders/{id}**
- Get order by ID
- Authentication: Required
- Authorization: Order owner, Admin, or Dashboard Admin

**GET /api/orders/number/{orderNumber}**
- Get order by order number
- Authentication: Required

**GET /api/orders**
- Get all orders (Admin only)
- Pagination support

**GET /api/orders/my-orders**
- Get current user's orders
- Pagination support

**GET /api/orders/user/{userId}**
- Get orders by user ID (Admin only)

**GET /api/orders/status/{status}**
- Get orders by status
- Roles: Admin, Dashboard Admin, Manufacturer

**GET /api/orders/manufacturer/my-orders**
- Get current manufacturer's orders
- Pagination support

**GET /api/orders/manufacturer/{manufacturerId}**
- Get orders by manufacturer ID (Admin only)

**PUT /api/orders/{id}/status**
- Update order status
- Roles: Admin, Dashboard Admin, Manufacturer

**PUT /api/orders/{id}/cancel**
- Cancel order
- Authorization: Order owner or Admin

**DELETE /api/orders/{id}**
- Delete order (Admin only)

**GET /api/orders/stats/user**
- Get user order statistics

**GET /api/orders/stats/manufacturer**
- Get manufacturer order statistics

**GET /api/orders/stats/status/{status}**
- Get order count by status (Admin only)

### 6. Search Functionality

#### ProductController Enhancement
Added comprehensive search endpoint:

**GET /api/products/search**
- Parameters:
  - query: Search by name/description
  - category: Filter by category
  - subcategory: Filter by subcategory
  - brand: Filter by brand
  - minPrice/maxPrice: Price range filter
  - Pagination (page, size, sortBy, sortDir)

---

## Frontend Implementation

### 1. Types Added (`types/index.ts`)

```typescript
// Order Status Enum
enum OrderStatus {
  PENDING, CONFIRMED, PROCESSING, SHIPPED, 
  DELIVERED, CANCELLED, REFUNDED
}

// Interfaces
interface OrderItem { ... }
interface Order { ... }
interface OrderItemRequest { ... }
interface OrderRequest { ... }
interface OrderStatusUpdateRequest { ... }
interface OrderStats { ... }
```

### 2. API Functions (`lib/api.ts`)

#### Order API
- createOrder
- getOrderById, getOrderByOrderNumber
- getAllOrders, getMyOrders
- getOrdersByUserId, getOrdersByStatus
- getManufacturerOrders, getOrdersByManufacturerId
- updateOrderStatus, cancelOrder, deleteOrder
- getUserOrderStats, getManufacturerOrderStats
- getOrderCountByStatus

#### Product API Enhancement
- searchProductsAdvanced: Comprehensive search with multiple filters

### 3. Pages Created

#### Orders Page (`pages/Orders.tsx`)
- **Features:**
  - Display all user orders
  - Order statistics (total orders, total spent)
  - Order status badges with icons
  - Order items preview
  - Quick actions (view details, cancel)
  - Empty state handling
  
- **Components:**
  - Stats cards
  - Order list with pagination
  - Status indicators with colors
  - Order item previews

#### OrderDetail Page (`pages/OrderDetail.tsx`)
- **Features:**
  - Complete order information
  - Order items list with images
  - Shipping and billing addresses
  - Contact information
  - Order timeline
  - Payment information
  - Order notes
  - Cancel order action
  
- **Sections:**
  - Order header with status badge
  - Order items detailed view
  - Shipping address card
  - Contact information card
  - Order summary with financial breakdown
  - Order timeline with timestamps
  - Payment information card
  - Notes section

### 4. Components Created

#### CheckoutDialog (`components/CheckoutDialog.tsx`)
- **Features:**
  - Order summary display
  - Shipping address form
  - Contact information form
  - Payment method selection
  - Order notes (optional)
  - Form validation
  - Loading states
  - Success navigation to order detail page
  
- **Form Fields:**
  - Shipping: address, city, state, pincode, country
  - Contact: email, phone
  - Payment: method selection (COD, Online, UPI, Card)
  - Notes: optional special instructions

### 5. Navigation Updates

#### Navbar Enhancement (`components/Navbar.tsx`)
- **Added:**
  - Search bar with form submission
  - Orders link for retailers
  - Orders icon in quick access
  - My Orders in user dropdown menu
  
- **Search:**
  - Real-time search input
  - Navigate to products page with search query
  - URL parameter passing

#### App Router (`App.tsx`)
- **Routes Added:**
  - `/orders` - Orders list page
  - `/orders/:id` - Order detail page
  - Protected with appropriate role access

### 6. Products Page Enhancement (`pages/Products.tsx`)
- Added URL search parameter handling
- Auto-populate search from URL query
- Debounced search functionality

---

## Key Features

### Order Management
1. **Create Orders:**
   - From cart with checkout dialog
   - Automatic stock validation
   - Stock quantity updates
   - Order number generation
   
2. **View Orders:**
   - User can view their orders
   - Manufacturers can view orders for their products
   - Admins can view all orders
   
3. **Order Status:**
   - 7 distinct statuses
   - Status transition validation
   - Automatic timestamp updates
   - Visual status indicators
   
4. **Order Actions:**
   - Cancel orders (pending only)
   - Update status (admin/manufacturer)
   - Track shipments
   - View order history
   
5. **Statistics:**
   - User spending totals
   - Manufacturer revenue
   - Order counts by status

### Search Functionality
1. **Product Search:**
   - Search by name
   - Search from navbar
   - URL parameter support
   - Debounced search
   - Comprehensive filters:
     - Category
     - Subcategory
     - Brand
     - Price range
   
2. **Search UX:**
   - Real-time results
   - Search suggestions
   - Empty state handling
   - Pagination support

---

## Database Changes Required

### New Tables
```sql
-- orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  order_number VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(20) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2),
  shipping_cost DECIMAL(10,2),
  discount DECIMAL(10,2),
  total DECIMAL(10,2) NOT NULL,
  shipping_address VARCHAR(500),
  shipping_city VARCHAR(100),
  shipping_state VARCHAR(100),
  shipping_pincode VARCHAR(10),
  shipping_country VARCHAR(100),
  billing_address VARCHAR(500),
  billing_city VARCHAR(100),
  billing_state VARCHAR(100),
  billing_pincode VARCHAR(10),
  billing_country VARCHAR(100),
  contact_email VARCHAR(100),
  contact_phone VARCHAR(20),
  payment_method VARCHAR(50),
  payment_status VARCHAR(20),
  payment_transaction_id VARCHAR(100),
  notes TEXT,
  tracking_number VARCHAR(100),
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancellation_reason VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- order_items table
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_name VARCHAR(200),
  product_sku VARCHAR(100),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2),
  total_price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

---

## Testing Checklist

### Backend Testing
- [x] Order creation with valid data
- [x] Order creation with insufficient stock
- [x] Order retrieval by ID
- [x] Order retrieval by user
- [x] Order status updates
- [x] Order cancellation and stock restoration
- [x] Manufacturer order queries
- [x] Order statistics calculations
- [x] Product search endpoint

### Frontend Testing
- [x] Navigate to Orders page
- [x] View order list
- [x] View order details
- [x] Cancel order
- [x] Checkout dialog
- [x] Order placement
- [x] Search from navbar
- [x] Search on products page
- [x] URL search parameters

---

## API Usage Examples

### Create Order
```bash
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {"productId": 1, "quantity": 2}
  ],
  "shippingAddress": "123 Main St",
  "shippingCity": "Mumbai",
  "shippingState": "Maharashtra",
  "shippingPincode": "400001",
  "shippingCountry": "India",
  "contactEmail": "user@example.com",
  "contactPhone": "9876543210",
  "paymentMethod": "COD",
  "shippingCost": 50
}
```

### Search Products
```bash
GET /api/products/search?query=sparklers&page=0&size=10
```

---

## Future Enhancements

1. **Order Management:**
   - Order tracking integration with shipping providers
   - Email notifications for order status changes
   - SMS notifications
   - Order invoice generation (PDF)
   - Return/refund management
   - Partial cancellations
   
2. **Search:**
   - Elasticsearch integration
   - Advanced filters (ratings, availability)
   - Search suggestions/autocomplete
   - Recent searches
   - Popular searches
   
3. **Payment Integration:**
   - Payment gateway integration (Razorpay, Stripe)
   - Multiple payment methods
   - Payment verification
   - Refund processing
   
4. **Analytics:**
   - Order analytics dashboard
   - Revenue charts
   - Popular products
   - User purchase patterns
   
5. **User Experience:**
   - Order rating and reviews
   - Reorder functionality
   - Save shipping addresses
   - Multiple shipping addresses
   - Wishlist to order conversion

---

## Configuration Required

### Environment Variables
No new environment variables required. Uses existing:
- `VITE_API_BASE_URL` for frontend
- Database configuration for backend

### Application Properties
No changes required to existing configuration.

---

## Dependencies

### Backend
All using existing dependencies:
- Spring Boot JPA
- Spring Security
- PostgreSQL Driver

### Frontend
All using existing dependencies:
- React
- React Router
- Axios
- Shadcn UI components

---

## Deployment Notes

1. **Database Migration:**
   - Run SQL scripts to create orders and order_items tables
   - Add indexes for performance
   
2. **Backend Deployment:**
   - No configuration changes needed
   - Restart application after deployment
   
3. **Frontend Deployment:**
   - Build with `npm run build`
   - Deploy static files
   
4. **Testing:**
   - Test order creation flow
   - Test search functionality
   - Verify role-based access
   - Test order status transitions

---

## Security Considerations

1. **Authorization:**
   - Users can only view/cancel their own orders
   - Manufacturers can view orders containing their products
   - Admins have full access
   
2. **Validation:**
   - Stock availability checked before order creation
   - Status transition validation
   - Product availability validation
   
3. **Data Protection:**
   - Sensitive payment data properly handled
   - Order data properly scoped by user

---

## Performance Considerations

1. **Database:**
   - Indexes added for common queries
   - Pagination implemented for all list endpoints
   
2. **Frontend:**
   - Debounced search queries
   - Lazy loading for order details
   - Optimistic UI updates
   
3. **Backend:**
   - Efficient queries with JPA
   - Proper use of fetch strategies
   - Transaction management

---

## Conclusion

The Order Management and Search functionality has been successfully implemented with:
- Complete CRUD operations for orders
- Role-based access control
- Comprehensive order tracking
- Stock management integration
- Advanced search capabilities
- Modern, responsive UI
- Proper error handling
- Security best practices

The system is production-ready and can be further enhanced with the suggested future improvements.

