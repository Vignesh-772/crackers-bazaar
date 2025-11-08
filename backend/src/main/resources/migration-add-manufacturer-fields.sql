-- Migration script to add new manufacturer fields
-- This script adds all the new compliance and geofencing fields to the manufacturers table
-- Run this script on existing databases to update the schema

-- Add company_legal_name column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'company_legal_name'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN company_legal_name VARCHAR(200);
    END IF;
END $$;

-- Add latitude column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'latitude'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
END $$;

-- Add longitude column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'longitude'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
END $$;

-- Add peso_license_number column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'peso_license_number'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN peso_license_number VARCHAR(50);
    END IF;
END $$;

-- Add peso_license_expiry column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'peso_license_expiry'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN peso_license_expiry DATE;
    END IF;
END $$;

-- Add factory_license_number column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'factory_license_number'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN factory_license_number VARCHAR(50);
    END IF;
END $$;

-- Add factory_license_expiry column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'factory_license_expiry'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN factory_license_expiry DATE;
    END IF;
END $$;

-- Add fire_noc_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'manufacturers' AND column_name = 'fire_noc_url'
    ) THEN
        ALTER TABLE manufacturers ADD COLUMN fire_noc_url VARCHAR(500);
    END IF;
END $$;

-- Update status constraint to include new statuses (ACTIVE, INACTIVE, VERIFIED)
-- First, drop the existing constraint if it exists
DO $$
BEGIN
    -- Drop the old constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE table_name = 'manufacturers' 
        AND constraint_name LIKE '%status%check%'
    ) THEN
        ALTER TABLE manufacturers DROP CONSTRAINT IF EXISTS manufacturers_status_check;
    END IF;
    
    -- Add the new constraint with all statuses
    ALTER TABLE manufacturers ADD CONSTRAINT manufacturers_status_check 
        CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'ACTIVE', 'INACTIVE', 'VERIFIED'));
END $$;

-- Update existing manufacturers: Set company_legal_name from company_name if not set
UPDATE manufacturers 
SET company_legal_name = company_name 
WHERE company_legal_name IS NULL AND company_name IS NOT NULL;

-- Create indexes for better performance on new fields
CREATE INDEX IF NOT EXISTS idx_manufacturers_peso_license_expiry ON manufacturers(peso_license_expiry);
CREATE INDEX IF NOT EXISTS idx_manufacturers_factory_license_expiry ON manufacturers(factory_license_expiry);
CREATE INDEX IF NOT EXISTS idx_manufacturers_coordinates ON manufacturers(latitude, longitude);

-- Add comments for documentation
COMMENT ON COLUMN manufacturers.company_legal_name IS 'Legal company name from GST/PAN documents';
COMMENT ON COLUMN manufacturers.latitude IS 'Latitude coordinate for geofencing';
COMMENT ON COLUMN manufacturers.longitude IS 'Longitude coordinate for geofencing';
COMMENT ON COLUMN manufacturers.peso_license_number IS 'PESO (Petroleum and Explosives Safety Organization) license number';
COMMENT ON COLUMN manufacturers.peso_license_expiry IS 'PESO license expiry date';
COMMENT ON COLUMN manufacturers.factory_license_number IS 'Factory/Shop license number';
COMMENT ON COLUMN manufacturers.factory_license_expiry IS 'Factory/Shop license expiry date';
COMMENT ON COLUMN manufacturers.fire_noc_url IS 'Fire/Local NOC document URL';

