-- Migration script to update existing manufacturer data
-- This script populates new fields from existing data where possible

-- Update company_legal_name from company_name if not already set
UPDATE manufacturers 
SET company_legal_name = company_name 
WHERE company_legal_name IS NULL OR company_legal_name = '';

-- Note: Other fields (PESO license, Factory license, Fire NOC, coordinates) 
-- will need to be populated manually through the admin dashboard or API
-- as they require specific document uploads and location data

-- Log the migration
DO $$
DECLARE
    updated_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO updated_count 
    FROM manufacturers 
    WHERE company_legal_name IS NOT NULL;
    
    RAISE NOTICE 'Migration completed: % manufacturers updated with company_legal_name', updated_count;
END $$;

