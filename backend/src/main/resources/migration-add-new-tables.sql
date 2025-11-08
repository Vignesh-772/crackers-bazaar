-- Migration script to add new tables for compliance, geofencing, and audit logs
-- This script creates the new tables if they don't exist

-- Create product_compliance_tags table if it doesn't exist
CREATE TABLE IF NOT EXISTS product_compliance_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    product_id VARCHAR(36) NOT NULL,
    tag_type VARCHAR(50) NOT NULL, -- 'GREEN_CRACKER', 'HAZARD_CLASS', etc.
    tag_value VARCHAR(100) NOT NULL,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create geofencing_rules table if it doesn't exist
CREATE TABLE IF NOT EXISTS geofencing_rules (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    zone_type VARCHAR(50) NOT NULL, -- 'RESTRICTED', 'ALLOWED', etc.
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    radius_meters INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create audit_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL, -- 'CREATE_MANUFACTURER', 'VERIFY_MANUFACTURER', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'MANUFACTURER', 'PRODUCT', 'USER', etc.
    entity_id VARCHAR(36),
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_compliance_tags_product_id ON product_compliance_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_product_compliance_tags_tag_type ON product_compliance_tags(tag_type);

CREATE INDEX IF NOT EXISTS idx_geofencing_rules_active ON geofencing_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_geofencing_rules_zone_type ON geofencing_rules(zone_type);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add comments for documentation
COMMENT ON TABLE product_compliance_tags IS 'Product compliance tags managed by admin (Green Cracker, Hazard Class, etc.)';
COMMENT ON TABLE geofencing_rules IS 'Geofencing rules for restricted/allowed zones';
COMMENT ON TABLE audit_logs IS 'Audit logs for tracking admin actions and system events';

