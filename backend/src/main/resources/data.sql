-- Corrected dummy data for testing Crackers Bazaar with UUIDs
-- This script creates a manufacturer with products and some orders
-- Fixed to match actual entity schemas with UUID primary keys

-- Clear existing data first (for clean testing)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM manufacturers;
DELETE FROM users;

-- Insert dummy users first (to avoid circular dependency)
INSERT INTO users (id, username, email, password, first_name, last_name, role, is_active, created_at, updated_at)
VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'rajesh_kumar',
    'rajesh@sparklefireworks.com',
    '$2a$10$FprmIXAyUz5r0zJkn2vQuOqKNCaNDtpU1IfeWLonnIeWbh3LTDv7y', -- password: password123
    'Rajesh',
    'Kumar',
    'MANUFACTURER',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'retailer_user',
    'retailer@test.com',
    '$2a$10$FprmIXAyUz5r0zJkn2vQuOqKNCaNDtpU1IfeWLonnIeWbh3LTDv7y', -- password: password123
    'Test',
    'Retailer',
    'RETAILER',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'admin_user',
    'admin@test.com',
    '$2a$10$FprmIXAyUz5r0zJkn2vQuOqKNCaNDtpU1IfeWLonnIeWbh3LTDv7y', -- password: password123
    'Test',
    'Admin',
    'ADMIN',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert dummy manufacturer (after users to avoid circular dependency)
INSERT INTO manufacturers (id, company_name, company_legal_name, contact_person, email, phone_number, address, city, state, pincode, country, latitude, longitude, gst_number, pan_number, license_number, peso_license_number, peso_license_expiry, factory_license_number, factory_license_expiry, fire_noc_url, status, is_verified, user_id, created_at, updated_at)
VALUES (
    '550e8400-e29b-41d4-a716-446655440004',
    'Sparkle Fireworks Ltd',
    'Sparkle Fireworks Private Limited',
    'Rajesh Kumar',
    'rajesh@sparklefireworks.com',
    '9876543210',
    '123 Industrial Area, Sector 5',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    19.0760,  -- Mumbai latitude
    72.8777,  -- Mumbai longitude
    '27ABCDE1234F1Z5',
    'ABCDE1234F',
    'LIC123456789',
    'PESO2024001',
    '2025-12-31',
    'FACTORY2024001',
    '2025-12-31',
    'https://example.com/fire-noc-document.pdf',
    'APPROVED',
    true,
    '550e8400-e29b-41d4-a716-446655440001',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert dummy products for the manufacturer
INSERT INTO products (id, name, description, price, stock_quantity, min_order_quantity, max_order_quantity, category, subcategory, brand, sku, weight, dimensions, is_active, created_at, updated_at, manufacturer_id)
VALUES 
(
    '550e8400-e29b-41d4-a716-446655440005',
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
    '550e8400-e29b-41d4-a716-446655440004'
),
(
    '550e8400-e29b-41d4-a716-446655440006',
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
    '550e8400-e29b-41d4-a716-446655440004'
),
(
    '550e8400-e29b-41d4-a716-446655440007',
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
    '550e8400-e29b-41d4-a716-446655440004'
),
(
    '550e8400-e29b-41d4-a716-446655440008',
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
    '550e8400-e29b-41d4-a716-446655440004'
),
(
    '550e8400-e29b-41d4-a716-446655440009',
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
    '550e8400-e29b-41d4-a716-446655440004'
),
(
    '550e8400-e29b-41d4-a716-446655440010',
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
    '550e8400-e29b-41d4-a716-446655440004'
);

-- Insert product images in separate table
INSERT INTO product_images (product_id, image_url)
VALUES 
('550e8400-e29b-41d4-a716-446655440005', 'https://picsum.photos/400/300?random=1'),
('550e8400-e29b-41d4-a716-446655440005', 'https://picsum.photos/400/300?random=2'),
('550e8400-e29b-41d4-a716-446655440006', 'https://picsum.photos/400/300?random=3'),
('550e8400-e29b-41d4-a716-446655440006', 'https://picsum.photos/400/300?random=4'),
('550e8400-e29b-41d4-a716-446655440007', 'https://picsum.photos/400/300?random=5'),
('550e8400-e29b-41d4-a716-446655440008', 'https://picsum.photos/400/300?random=6'),
('550e8400-e29b-41d4-a716-446655440009', 'https://picsum.photos/400/300?random=1'),
('550e8400-e29b-41d4-a716-446655440010', 'https://picsum.photos/400/300?random=2');

-- Insert some dummy orders
INSERT INTO orders (id, user_id, order_number, status, subtotal, tax, shipping_cost, discount, total, shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_country, billing_address, billing_city, billing_state, billing_pincode, billing_country, contact_email, contact_phone, payment_method, payment_status, notes, created_at, updated_at)
VALUES 
(
    '550e8400-e29b-41d4-a716-446655440011',
    '550e8400-e29b-41d4-a716-446655440002',
    'ORD-2024-001',
    'CONFIRMED',
    1197.00,
    0.00,
    50.00,
    0.00,
    1247.00,
    '123 Retail Street, Sector 10',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    '123 Retail Street, Sector 10',
    'Delhi',
    'Delhi',
    '110001',
    'India',
    'retailer@test.com',
    '9876543210',
    'CASH_ON_DELIVERY',
    'PENDING',
    'Please deliver after 6 PM',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440002',
    'ORD-2024-002',
    'PROCESSING',
    799.00,
    0.00,
    50.00,
    0.00,
    849.00,
    '456 Business Avenue, Block A',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    '456 Business Avenue, Block A',
    'Mumbai',
    'Maharashtra',
    '400001',
    'India',
    'retailer@test.com',
    '9876543210',
    'ONLINE',
    'PAID',
    'Urgent delivery required',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
(
    '550e8400-e29b-41d4-a716-446655440013',
    '550e8400-e29b-41d4-a716-446655440002',
    'ORD-2024-003',
    'SHIPPED',
    1295.00,
    0.00,
    50.00,
    0.00,
    1345.00,
    '789 Commercial Complex, Floor 2',
    'Bangalore',
    'Karnataka',
    '560001',
    'India',
    '789 Commercial Complex, Floor 2',
    'Bangalore',
    'Karnataka',
    '560001',
    'India',
    'retailer@test.com',
    '9876543210',
    'CARD',
    'PAID',
    'Gift wrapping required',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert order items
INSERT INTO order_items (id, order_id, product_id, product_name, product_sku, quantity, unit_price, discount, total_price, image_url, created_at)
VALUES 
-- Order 1 items
('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440005', 'Premium Sparklers - 10 inch', 'SPK-001', 2, 299.00, 0.00, 598.00, 'https://picsum.photos/400/300?random=1', CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440015', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440006', 'Festival Crackers - Assorted Pack', 'CRK-002', 1, 599.00, 0.00, 599.00, 'https://picsum.photos/400/300?random=3', CURRENT_TIMESTAMP),

-- Order 2 items
('550e8400-e29b-41d4-a716-446655440016', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440007', 'Rocket Fireworks - 12 inch', 'RKT-003', 1, 799.00, 0.00, 799.00, 'https://picsum.photos/400/300?random=5', CURRENT_TIMESTAMP),

-- Order 3 items
('550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440009', 'Roman Candles - 6 Shot', 'RMC-005', 1, 499.00, 0.00, 499.00, 'https://picsum.photos/400/300?random=1', CURRENT_TIMESTAMP),
('550e8400-e29b-41d4-a716-446655440018', '550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440010', 'Ground Spinners - Colorful', 'SPN-006', 4, 199.00, 0.00, 796.00, 'https://picsum.photos/400/300?random=2', CURRENT_TIMESTAMP);
