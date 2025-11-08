# Database Migration Guide

## Overview
This guide explains how to migrate your existing database to include the new manufacturer fields and supporting tables.

## New Fields Added to Manufacturers Table

1. **company_legal_name** - Legal company name from GST/PAN documents
2. **latitude** - Latitude coordinate for geofencing
3. **longitude** - Longitude coordinate for geofencing
4. **peso_license_number** - PESO license number
5. **peso_license_expiry** - PESO license expiry date
6. **factory_license_number** - Factory/Shop license number
7. **factory_license_expiry** - Factory/Shop license expiry date
8. **fire_noc_url** - Fire/Local NOC document URL

## New Tables Created

1. **product_compliance_tags** - For managing product compliance tags (Green Cracker, Hazard Class, etc.)
2. **geofencing_rules** - For managing geofencing zones
3. **audit_logs** - For tracking admin actions and system events

## Migration Scripts

### Option 1: Complete Migration (Recommended)
Run the complete migration script that handles everything:

```bash
psql -U postgres -d crackers_bazaar -f backend/src/main/resources/migration-complete-manufacturer-update.sql
```

### Option 2: Step-by-Step Migration
If you prefer to run migrations in steps:

1. **Add manufacturer fields:**
   ```bash
   psql -U postgres -d crackers_bazaar -f backend/src/main/resources/migration-add-manufacturer-fields.sql
   ```

2. **Add new tables:**
   ```bash
   psql -U postgres -d crackers_bazaar -f backend/src/main/resources/migration-add-new-tables.sql
   ```

3. **Update existing data:**
   ```bash
   psql -U postgres -d crackers_bazaar -f backend/src/main/resources/migration-update-existing-data.sql
   ```

## Using Docker

If you're using Docker, you can run the migration inside the container:

```bash
# Connect to the PostgreSQL container
docker exec -i crackers-bazaar-postgres psql -U postgres -d crackers_bazaar < backend/src/main/resources/migration-complete-manufacturer-update.sql
```

Or using docker-compose:

```bash
docker-compose exec postgres psql -U postgres -d crackers_bazaar -f /path/to/migration-complete-manufacturer-update.sql
```

## What the Migration Does

1. **Adds new columns** to the manufacturers table (only if they don't exist)
2. **Updates the status constraint** to include new statuses: ACTIVE, INACTIVE, VERIFIED
3. **Creates new tables** for compliance tags, geofencing, and audit logs
4. **Creates indexes** for better query performance
5. **Updates existing data** by setting `company_legal_name` from `company_name` where applicable
6. **Adds documentation** comments to all new columns and tables

## Data Updates

The migration script automatically:
- Sets `company_legal_name` = `company_name` for existing manufacturers (if not already set)

**Note:** Other fields (PESO license, Factory license, Fire NOC, coordinates) will need to be populated manually through:
- Admin Dashboard UI
- API endpoints
- Direct database updates

## Verification

After running the migration, verify it was successful:

```sql
-- Check if new columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'manufacturers' 
  AND column_name IN (
    'company_legal_name', 'latitude', 'longitude',
    'peso_license_number', 'peso_license_expiry',
    'factory_license_number', 'factory_license_expiry',
    'fire_noc_url'
  );

-- Check if new tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN (
    'product_compliance_tags',
    'geofencing_rules',
    'audit_logs'
  );

-- Check updated data
SELECT COUNT(*) as total,
       COUNT(company_legal_name) as with_legal_name
FROM manufacturers;
```

## Rollback

If you need to rollback the migration, you can drop the new columns and tables:

```sql
-- Drop new columns (be careful - this will lose data!)
ALTER TABLE manufacturers 
  DROP COLUMN IF EXISTS company_legal_name,
  DROP COLUMN IF EXISTS latitude,
  DROP COLUMN IF EXISTS longitude,
  DROP COLUMN IF EXISTS peso_license_number,
  DROP COLUMN IF EXISTS peso_license_expiry,
  DROP COLUMN IF EXISTS factory_license_number,
  DROP COLUMN IF EXISTS factory_license_expiry,
  DROP COLUMN IF EXISTS fire_noc_url;

-- Drop new tables
DROP TABLE IF EXISTS product_compliance_tags CASCADE;
DROP TABLE IF EXISTS geofencing_rules CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
```

## Troubleshooting

### Error: Column already exists
The migration scripts check if columns exist before adding them, so this shouldn't happen. If it does, the column was already added in a previous migration.

### Error: Constraint already exists
The migration script drops the old constraint before adding the new one. If you see this error, the constraint was already updated.

### Error: Table already exists
The migration scripts use `CREATE TABLE IF NOT EXISTS`, so this shouldn't cause an error. The table will be skipped if it already exists.

## Support

For issues or questions, check:
- Database logs
- Application logs
- Migration script output messages

