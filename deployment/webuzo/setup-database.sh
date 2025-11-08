#!/bin/bash

# Database Setup Script for Crackers Bazaar
# This script sets up MySQL database for the application

set -e

echo "=========================================="
echo "Crackers Bazaar Database Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_NAME="${DB_NAME:-crackers_bazaar}"
DB_USER="${DB_USER:-crackers_user}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-}"

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Warning: Not running as root. Some commands may require sudo.${NC}"
fi

# Get database root password if not set
if [ -z "$DB_ROOT_PASSWORD" ]; then
    echo -e "${YELLOW}Enter MySQL root password:${NC}"
    read -s DB_ROOT_PASSWORD
    echo
fi

# Get database user password if not set
if [ -z "$DB_PASSWORD" ]; then
    echo -e "${YELLOW}Enter database password for user '$DB_USER':${NC}"
    read -s DB_PASSWORD
    echo
fi

# Get project directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/../.." && pwd )"
SCHEMA_FILE="$PROJECT_DIR/backend/src/main/resources/schema-uuid.sql"
DATA_FILE="$PROJECT_DIR/backend/src/main/resources/data.sql"

# Check if schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
    echo -e "${RED}Error: Schema file not found at $SCHEMA_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}Step 1: Creating database and user...${NC}"

# Create database and user
mysql -u root -p"$DB_ROOT_PASSWORD" <<EOF
-- Create database
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';

-- Grant privileges for remote access (optional)
CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';

-- Flush privileges
FLUSH PRIVILEGES;
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database and user created successfully${NC}"
else
    echo -e "${RED}✗ Failed to create database/user${NC}"
    exit 1
fi

echo -e "${GREEN}Step 2: Loading schema...${NC}"

# Load schema
mysql -u root -p"$DB_ROOT_PASSWORD" $DB_NAME < "$SCHEMA_FILE"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Schema loaded successfully${NC}"
else
    echo -e "${RED}✗ Failed to load schema${NC}"
    exit 1
fi

echo -e "${GREEN}Step 3: Loading initial data...${NC}"

# Load data if file exists
if [ -f "$DATA_FILE" ]; then
    mysql -u root -p"$DB_ROOT_PASSWORD" $DB_NAME < "$DATA_FILE"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Initial data loaded successfully${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: Failed to load initial data (may already exist)${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Data file not found, skipping...${NC}"
fi

echo -e "${GREEN}Step 4: Verifying database setup...${NC}"

# Verify tables were created
TABLE_COUNT=$(mysql -u root -p"$DB_ROOT_PASSWORD" $DB_NAME -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';")

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Database setup complete! Found $TABLE_COUNT tables${NC}"
else
    echo -e "${RED}✗ No tables found. Setup may have failed.${NC}"
    exit 1
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Database Setup Complete!${NC}"
echo "=========================================="
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo ""
echo "Connection String:"
echo "jdbc:mysql://localhost:3306/$DB_NAME?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
echo ""
echo "Update your .env file with:"
echo "DATABASE_URL=jdbc:mysql://localhost:3306/$DB_NAME?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
echo "DATABASE_USERNAME=$DB_USER"
echo "DATABASE_PASSWORD=$DB_PASSWORD"
echo ""

