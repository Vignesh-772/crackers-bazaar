#!/bin/bash

# Fix Permissions Script for Crackers Bazaar
# This script fixes file and directory permissions for the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Fix Permissions for Crackers Bazaar"
echo "=========================================="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Warning: Not running as root. This script requires sudo privileges.${NC}"
    SUDO="sudo"
else
    SUDO=""
fi

# Configuration
PROJECT_DIR="${PROJECT_DIR:-/home/webuzo/crackers-bazaar}"
APP_USER="${APP_USER:-webuzo}"
APP_GROUP="${APP_GROUP:-webuzo}"

echo -e "${BLUE}Configuration:${NC}"
echo "  Project Directory: $PROJECT_DIR"
echo "  User: $APP_USER"
echo "  Group: $APP_GROUP"
echo ""

# Check if user exists
if ! id "$APP_USER" &>/dev/null; then
    echo -e "${YELLOW}User '$APP_USER' does not exist. Creating...${NC}"
    $SUDO useradd -r -s /bin/bash -d "$PROJECT_DIR" "$APP_USER" 2>/dev/null || \
    $SUDO useradd -s /bin/bash -d "$PROJECT_DIR" "$APP_USER"
    echo -e "${GREEN}✓ User created${NC}"
fi

# Check if group exists
if ! getent group "$APP_GROUP" &>/dev/null; then
    echo -e "${YELLOW}Group '$APP_GROUP' does not exist. Creating...${NC}"
    $SUDO groupadd "$APP_GROUP" 2>/dev/null || true
    echo -e "${GREEN}✓ Group created${NC}"
fi

# Add user to group if not already
$SUDO usermod -a -G "$APP_GROUP" "$APP_USER" 2>/dev/null || true

echo -e "${BLUE}Step 1: Creating directories...${NC}"

# Create necessary directories
DIRS=(
    "$PROJECT_DIR"
    "$PROJECT_DIR/backend"
    "$PROJECT_DIR/backend/target"
    "$PROJECT_DIR/logs"
    "$PROJECT_DIR/uploads"
)

for dir in "${DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        $SUDO mkdir -p "$dir"
        echo -e "${GREEN}✓ Created: $dir${NC}"
    else
        echo -e "${GREEN}✓ Exists: $dir${NC}"
    fi
done
echo ""

echo -e "${BLUE}Step 2: Setting ownership...${NC}"

# Set ownership recursively
$SUDO chown -R "$APP_USER:$APP_GROUP" "$PROJECT_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Ownership set to $APP_USER:$APP_GROUP${NC}"
else
    echo -e "${RED}✗ Failed to set ownership${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 3: Setting directory permissions...${NC}"

# Set directory permissions (755 - owner can read/write/execute, others can read/execute)
$SUDO find "$PROJECT_DIR" -type d -exec chmod 755 {} \;

echo -e "${GREEN}✓ Directory permissions set to 755${NC}"
echo ""

echo -e "${BLUE}Step 4: Setting file permissions...${NC}"

# Set file permissions (644 - owner can read/write, others can read)
$SUDO find "$PROJECT_DIR" -type f -exec chmod 644 {} \;

# Make scripts executable
$SUDO find "$PROJECT_DIR" -type f -name "*.sh" -exec chmod +x {} \;

# Make JAR files executable
$SUDO find "$PROJECT_DIR" -type f -name "*.jar" -exec chmod 755 {} \;

echo -e "${GREEN}✓ File permissions set${NC}"
echo ""

echo -e "${BLUE}Step 5: Setting special permissions...${NC}"

# .env file should be readable only by owner
if [ -f "$PROJECT_DIR/.env" ]; then
    $SUDO chmod 600 "$PROJECT_DIR/.env"
    $SUDO chown "$APP_USER:$APP_GROUP" "$PROJECT_DIR/.env"
    echo -e "${GREEN}✓ .env file permissions secured${NC}"
else
    echo -e "${YELLOW}⚠ .env file not found${NC}"
fi

# Logs directory should be writable
$SUDO chmod 755 "$PROJECT_DIR/logs"
$SUDO chown "$APP_USER:$APP_GROUP" "$PROJECT_DIR/logs"

# Uploads directory should be writable
$SUDO chmod 755 "$PROJECT_DIR/uploads"
$SUDO chown "$APP_USER:$APP_GROUP" "$PROJECT_DIR/uploads"

echo -e "${GREEN}✓ Special permissions set${NC}"
echo ""

echo -e "${BLUE}Step 6: Verifying permissions...${NC}"

# Verify ownership
OWNER=$(stat -c '%U:%G' "$PROJECT_DIR" 2>/dev/null || stat -f '%Su:%Sg' "$PROJECT_DIR")
if [ "$OWNER" = "$APP_USER:$APP_GROUP" ] || [ "$OWNER" = "$APP_USER:$APP_USER" ]; then
    echo -e "${GREEN}✓ Ownership verified: $OWNER${NC}"
else
    echo -e "${YELLOW}⚠ Ownership is $OWNER (expected $APP_USER:$APP_GROUP)${NC}"
fi

# Check if user can access directories
if $SUDO -u "$APP_USER" test -r "$PROJECT_DIR" && $SUDO -u "$APP_USER" test -x "$PROJECT_DIR"; then
    echo -e "${GREEN}✓ User can read and access project directory${NC}"
else
    echo -e "${RED}✗ User cannot access project directory${NC}"
    exit 1
fi

if $SUDO -u "$APP_USER" test -r "$PROJECT_DIR/backend"; then
    echo -e "${GREEN}✓ User can access backend directory${NC}"
else
    echo -e "${RED}✗ User cannot access backend directory${NC}"
    exit 1
fi
echo ""

echo "=========================================="
echo -e "${GREEN}Permissions Fixed!${NC}"
echo "=========================================="
echo ""
echo "Summary:"
echo "  Project Directory: $PROJECT_DIR"
echo "  Owner: $APP_USER:$APP_GROUP"
echo "  Directories: 755 (rwxr-xr-x)"
echo "  Files: 644 (rw-r--r--)"
echo "  Scripts: 755 (rwxr-xr-x)"
echo "  .env: 600 (rw-------)"
echo ""
echo "Next steps:"
echo "  1. Verify service file paths match: $PROJECT_DIR"
echo "  2. Restart service: sudo systemctl restart crackers-bazaar-backend"
echo "  3. Check logs: sudo journalctl -u crackers-bazaar-backend -f"
echo ""

