-- Complete Migration Script for Manufacturer Table Updates
-- This script adds all new fields to the manufacturers table and creates new supporting tables
-- Run this script on existing databases to update the schema without losing data

-- ============================================================================
-- PART 1: Add new columns to manufacturers table
-- ============================================================================

-- Add company_legal_name column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'company_legal_name'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN company_legal_name VARCHAR(200);
        RAISE NOTICE 'Added column: company_legal_name';
    ELSE
        RAISE NOTICE 'Column company_legal_name already exists';
    END IF;
END $$;

-- Add latitude column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'latitude'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN latitude DECIMAL(10, 8);
        RAISE NOTICE 'Added column: latitude';
    ELSE
        RAISE NOTICE 'Column latitude already exists';
    END IF;
END $$;

-- Add longitude column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'longitude'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN longitude DECIMAL(11, 8);
        RAISE NOTICE 'Added column: longitude';
    ELSE
        RAISE NOTICE 'Column longitude already exists';
    END IF;
END $$;

-- Add peso_license_number column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'peso_license_number'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN peso_license_number VARCHAR(50);
        RAISE NOTICE 'Added column: peso_license_number';
    ELSE
        RAISE NOTICE 'Column peso_license_number already exists';
    END IF;
END $$;

-- Add peso_license_expiry column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'peso_license_expiry'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN peso_license_expiry DATE;
        RAISE NOTICE 'Added column: peso_license_expiry';
    ELSE
        RAISE NOTICE 'Column peso_license_expiry already exists';
    END IF;
END $$;

-- Add factory_license_number column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'factory_license_number'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN factory_license_number VARCHAR(50);
        RAISE NOTICE 'Added column: factory_license_number';
    ELSE
        RAISE NOTICE 'Column factory_license_number already exists';
    END IF;
END $$;

-- Add factory_license_expiry column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'factory_license_expiry'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN factory_license_expiry DATE;
        RAISE NOTICE 'Added column: factory_license_expiry';
    ELSE
        RAISE NOTICE 'Column factory_license_expiry already exists';
    END IF;
END $$;

-- Add fire_noc_url column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'fire_noc_url'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN fire_noc_url VARCHAR(500);
        RAISE NOTICE 'Added column: fire_noc_url';
    ELSE
        RAISE NOTICE 'Column fire_noc_url already exists';
    END IF;
END $$;

-- ============================================================================
-- PART 2: Update status constraint to include new statuses
-- ============================================================================

DO $$
BEGIN
    -- Drop the old constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'manufacturers' 
        AND constraint_name LIKE '%status%check%'
    ) THEN
        ALTER TABLE manufacturers DROP CONSTRAINT IF EXISTS manufacturers_status_check;
        RAISE NOTICE 'Dropped old status constraint';
    END IF;
    
    -- Add the new constraint with all statuses
    ALTER TABLE manufacturers ADD CONSTRAINT manufacturers_status_check 
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ACTIVE', 'INACTIVE', 'VERIFIED'));
    RAISE NOTICE 'Added new status constraint with all statuses';
END $$;

-- ============================================================================
-- PART 3: Create new supporting tables
-- ============================================================================

-- Create product_compliance_tags table
CREATE TABLE IF NOT EXISTS product_compliance_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id VARCHAR(36) NOT NULL,
    tag_type VARCHAR(50) NOT NULL,
    tag_value VARCHAR(100) NOT NULL,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create geofencing_rules table
CREATE TABLE IF NOT EXISTS geofencing_rules (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    zone_type VARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- PART 4: Create indexes for performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_manufacturers_peso_license_expiry ON manufacturers(peso_license_expiry);
CREATE INDEX IF NOT EXISTS idx_manufacturers_factory_license_expiry ON manufacturers(factory_license_expiry);
CREATE INDEX IF NOT EXISTS idx_manufacturers_coordinates ON manufacturers(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_product_compliance_tags_product_id ON product_compliance_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_compliance_tags_tag_type ON product_compliance_tags(tag_type);

CREATE INDEX IF NOT EXISTS idx_geofencing_rules_active ON geofencing_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_geofencing_rules_zone_type ON geofencing_rules(zone_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================================================
-- PART 5: Update existing data
-- ============================================================================

-- Update company_legal_name from company_name if not set
UPDATE manufacturers 
SET company_legal_name = company_name 
WHERE (company_legal_name IS NULL OR company_legal_name = '') 
  AND company_name IS NOT NULL;

-- ============================================================================
-- PART 6: Add column comments for documentation
-- ============================================================================

COMMENT ON COLUMN manufacturers.company_legal_name IS 'Legal company name from GST/PAN documents';
COMMENT ON COLUMN manufacturers.latitude IS 'Latitude coordinate for geofencing';
COMMENT ON COLUMN manufacturers.longitude IS 'Longitude coordinate for geofencing';
COMMENT ON COLUMN manufacturers.peso_license_number IS 'PESO (Petroleum and Explosives Safety Organization) license number';
COMMENT ON COLUMN manufacturers.peso_license_expiry IS 'PESO license expiry date';
COMMENT ON COLUMN manufacturers.factory_license_number IS 'Factory/Shop license number';
COMMENT ON COLUMN manufacturers.factory_license_expiry IS 'Factory/Shop license expiry date';
COMMENT ON COLUMN manufacturers.fire_noc_url IS 'Fire/Local NOC document URL';

COMMENT ON TABLE product_compliance_tags IS 'Product compliance tags managed by admin (Green Cracker, Hazard Class, etc.)';
COMMENT ON TABLE geofencing_rules IS 'Geofencing rules for restricted/allowed zones';
COMMENT ON TABLE audit_logs IS 'Audit logs for tracking admin actions and system events';

-- ============================================================================
-- Migration Complete
-- ============================================================================

DO $$
DECLARE
    manufacturer_count INTEGER;
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO manufacturer_count FROM manufacturers;
    SELECT COUNT(*) INTO updated_count FROM manufacturers WHERE company_legal_name IS NOT NULL;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration completed successfully!';
    RAISE NOTICE 'Total manufacturers: %', manufacturer_count;
    RAISE NOTICE 'Updated with company_legal_name: %', updated_count;
    RAISE NOTICE '========================================';
END $$;

