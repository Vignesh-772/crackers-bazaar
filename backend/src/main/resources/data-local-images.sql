-- Dummy data for testing Crackers Bazaar with LOCAL images
-- This script creates a manufacturer with products and some orders
-- Uses local placeholder images for better reliability

-- Insert dummy manufacturer
INSERT INTO manufacturers (id, company_name, contact_person, email, phone, address, city, state, pincode, country, gst_number, pan_number, bank_account_number, ifsc_code, is_active, created_at, updated_at)
VALUES (
    1,
    'Sparkle Fireworks Ltd',
    'Rajesh Kumar',
    'rajesh@sparklefireworks.com',
    '+91-9876543210',
    '123 Industrial Area, Sector 5',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    '27ABCDE1234F1Z5',
    'ABCDE1234F',
    '1234567890123456',
    'SBIN0001234',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert dummy user for the manufacturer
INSERT INTO users (id, username, email, password, first_name, last_name, phone, address, city, state, pincode, country, role, is_active, email_verified, created_at, updated_at, manufacturer_id)
VALUES (
    1,
    'rajesh_kumar',
    'rajesh@sparklefireworks.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', -- password: password123
    'Rajesh',
    'Kumar',
    '+91-9876543210',
    '123 Industrial Area, Sector 5',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    'MANUFACTURER',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1
);

-- Insert dummy retailer user
INSERT INTO users (id, username, email, password, first_name, last_name, phone, address, city, state, pincode, country, role, is_active, email_verified, created_at, updated_at)
VALUES (
    2,
    'retailer_test',
    'retailer@test.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', -- password: password123
    'Test',
    'Retailer',
    '+91-9876543211',
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'RETAILER',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert dummy admin user
INSERT INTO users (id, username, email, password, first_name, last_name, phone, address, city, state, pincode, country, role, is_active, email_verified, created_at, updated_at)
VALUES (
    3,
    'admin_test',
    'admin@test.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', -- password: password123
    'Test',
    'Admin',
    '+91-9876543212',
    '789 Admin Building',
    'Bangalore',
    'Karnataka',
    '560001',
    'India',
    'ADMIN',
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert dummy products for the manufacturer with LOCAL images
INSERT INTO products (id, name, description, price, stock_quantity, min_order_quantity, max_order_quantity, category, subcategory, brand, sku, weight, dimensions, is_active, created_at, updated_at, manufacturer_id, image_urls)
VALUES 
(
    1,
    'Premium Sparklers - 10 inch',
    'High-quality sparklers perfect for celebrations. Safe and reliable with beautiful sparkle effects.',
    299.00,
    100,
    1,
    50,
    'Sparklers',
    'Handheld',
    'Sparkle Fireworks',
    'SPK-001',
    0.5,
    '10x0.5x0.5',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    '["/images/product-1.jpg", "/images/product-2.jpg"]'
),
(
    2,
    'Festival Crackers - Assorted Pack',
    'Mixed pack of festival crackers including flower pots, chakras, and ground spinners.',
    599.00,
    50,
    1,
    20,
    'Crackers',
    'Ground',
    'Sparkle Fireworks',
    'CRK-002',
    2.0,
    '15x10x5',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    '["/images/product-3.jpg", "/images/product-4.jpg"]'
),
(
    3,
    'Rocket Fireworks - 12 inch',
    'Aerial rockets with colorful burst effects. Perfect for outdoor celebrations.',
    799.00,
    75,
    1,
    30,
    'Rockets',
    'Aerial',
    'Sparkle Fireworks',
    'RKT-003',
    1.5,
    '12x2x2',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    '["/images/product-5.jpg"]'
),
(
    4,
    'Fountain Fireworks - Multi Color',
    'Beautiful fountain display with multiple colors. Safe for indoor and outdoor use.',
    399.00,
    80,
    1,
    25,
    'Fountains',
    'Ground',
    'Sparkle Fireworks',
    'FNT-004',
    1.0,
    '8x8x8',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    '["/images/product-6.jpg"]'
),
(
    5,
    'Roman Candles - 6 Shot',
    'Roman candles with 6 shots of different colors. Great for group celebrations.',
    499.00,
    60,
    1,
    20,
    'Roman Candles',
    'Handheld',
    'Sparkle Fireworks',
    'RMC-005',
    1.2,
    '15x3x3',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    '["/images/product-1.jpg"]'
),
(
    6,
    'Ground Spinners - Colorful',
    'Colorful ground spinners that create beautiful patterns. Safe for children.',
    199.00,
    120,
    1,
    50,
    'Spinners',
    'Ground',
    'Sparkle Fireworks',
    'SPN-006',
    0.3,
    '5x5x1',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    1,
    '["/images/product-2.jpg"]'
);

-- Insert some dummy orders
INSERT INTO orders (id, order_number, user_id, status, subtotal, tax, shipping_cost, discount, total, shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_country, billing_address, billing_city, billing_state, billing_pincode, billing_country, contact_email, contact_phone, payment_method, payment_status, notes, tracking_number, shipped_at, delivered_at, cancelled_at, cancellation_reason, created_at, updated_at)
VALUES 
(
    1,
    'ORD-2024-001',
    2,
    'CONFIRMED',
    1197.00,
    0.00,
    50.00,
    0.00,
    1247.00,
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'retailer@test.com',
    '+91-9876543211',
    'CASH_ON_DELIVERY',
    'PENDING',
    'Please deliver during business hours',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    2,
    'ORD-2024-002',
    2,
    'PROCESSING',
    998.00,
    0.00,
    50.00,
    0.00,
    1048.00,
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'retailer@test.com',
    '+91-9876543211',
    'CARD',
    'PAID',
    'Urgent delivery required',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    3,
    'ORD-2024-003',
    2,
    'SHIPPED',
    1298.00,
    0.00,
    50.00,
    0.00,
    1348.00,
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    '456 Market Street',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'retailer@test.com',
    '+91-9876543211',
    'UPI',
    'PAID',
    'Handle with care',
    'TRK123456789',
    CURRENT_TIMESTAMP,
    NULL,
    NULL,
    NULL,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert order items for the orders with LOCAL images
INSERT INTO order_items (id, order_id, product_id, product_name, product_sku, quantity, unit_price, discount, total_price, image_url, created_at)
VALUES 
-- Order 1 items
(1, 1, 1, 'Premium Sparklers - 10 inch', 'SPK-001', 2, 299.00, 0.00, 598.00, '/images/product-1.jpg', CURRENT_TIMESTAMP),
(2, 1, 2, 'Festival Crackers - Assorted Pack', 'CRK-002', 1, 599.00, 0.00, 599.00, '/images/product-3.jpg', CURRENT_TIMESTAMP),

-- Order 2 items
(3, 2, 3, 'Rocket Fireworks - 12 inch', 'RKT-003', 1, 799.00, 0.00, 799.00, '/images/product-5.jpg', CURRENT_TIMESTAMP),
(4, 2, 4, 'Fountain Fireworks - Multi Color', 'FNT-004', 1, 399.00, 0.00, 399.00, '/images/product-6.jpg', CURRENT_TIMESTAMP),

-- Order 3 items
(5, 3, 5, 'Roman Candles - 6 Shot', 'RMC-005', 1, 499.00, 0.00, 499.00, '/images/product-1.jpg', CURRENT_TIMESTAMP),
(6, 3, 6, 'Ground Spinners - Colorful', 'SPN-006', 4, 199.00, 0.00, 796.00, '/images/product-2.jpg', CURRENT_TIMESTAMP);

-- Update sequences to avoid conflicts
SELECT setval('manufacturers_id_seq', 1, true);
SELECT setval('users_id_seq', 3, true);
SELECT setval('products_id_seq', 6, true);
SELECT setval('orders_id_seq', 3, true);
SELECT setval('order_items_id_seq', 6, true);
