#!/bin/bash

# Systemd Service Setup Script for Crackers Bazaar
# This script sets up the systemd service for the backend application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Crackers Bazaar Systemd Service Setup"
echo "=========================================="
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Warning: Not running as root. This script requires sudo privileges.${NC}"
    SUDO="sudo"
else
    SUDO=""
fi

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/../.." && pwd )"
SERVICE_FILE="$SCRIPT_DIR/crackers-bazaar-backend.service"
SYSTEMD_DIR="/etc/systemd/system"
SERVICE_NAME="crackers-bazaar-backend"

# Check if service file exists
if [ ! -f "$SERVICE_FILE" ]; then
    echo -e "${RED}Error: Service file not found at $SERVICE_FILE${NC}"
    exit 1
fi

echo -e "${BLUE}Step 0: Fixing permissions...${NC}"

# Run fix-permissions script if it exists
FIX_PERMISSIONS_SCRIPT="$SCRIPT_DIR/fix-permissions.sh"
if [ -f "$FIX_PERMISSIONS_SCRIPT" ]; then
    echo -e "${BLUE}Running permissions fix script...${NC}"
    $SUDO bash "$FIX_PERMISSIONS_SCRIPT"
    echo ""
else
    echo -e "${YELLOW}⚠ Permissions fix script not found. Setting basic permissions...${NC}"
    # Create directories and set ownership
    $SUDO mkdir -p "$PROJECT_DIR/backend" "$PROJECT_DIR/logs" "$PROJECT_DIR/uploads"
    $SUDO chown -R webuzo:webuzo "$PROJECT_DIR" 2>/dev/null || \
    $SUDO chown -R $(whoami):$(whoami) "$PROJECT_DIR"
    echo ""
fi

echo -e "${BLUE}Step 1: Checking prerequisites...${NC}"

# Check if JAR file exists
JAR_FILE="$PROJECT_DIR/backend/target/crackers-bazaar-backend-1.0.0.jar"
if [ ! -f "$JAR_FILE" ]; then
    echo -e "${YELLOW}⚠ JAR file not found at $JAR_FILE${NC}"
    echo -e "${YELLOW}⚠ Please build the application first:${NC}"
    echo "   cd $PROJECT_DIR/backend"
    echo "   mvn clean package -DskipTests"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ JAR file found${NC}"
fi

# Check if .env file exists
ENV_FILE="$PROJECT_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠ .env file not found at $ENV_FILE${NC}"
    echo -e "${YELLOW}⚠ Please create it from the template:${NC}"
    echo "   cp $SCRIPT_DIR/env.production.template $ENV_FILE"
    echo "   nano $ENV_FILE"
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✓ Environment file found${NC}"
fi

echo ""

# Step 2: Update service file with correct paths
echo -e "${BLUE}Step 2: Preparing service file...${NC}"

# Create temporary service file with updated paths
TEMP_SERVICE_FILE="/tmp/crackers-bazaar-backend.service"
cp "$SERVICE_FILE" "$TEMP_SERVICE_FILE"

# Update paths in service file
sed -i "s|/home/webuzo/crackers-bazaar|$PROJECT_DIR|g" "$TEMP_SERVICE_FILE"

echo -e "${GREEN}✓ Service file prepared${NC}"
echo ""

# Step 3: Copy service file to systemd directory
echo -e "${BLUE}Step 3: Installing service file...${NC}"

$SUDO cp  "/home/dhana/git/crackers-bazaar/deployment/webuzo/crackers-bazaar-backend.service" "/etc/systemd/system/crackers-bazaar-backend.service"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Service file installed to $SYSTEMD_DIR/$SERVICE_NAME.service${NC}"
else
    echo -e "${RED}✗ Failed to install service file${NC}"
    exit 1
fi
echo ""

# Step 4: Reload systemd
echo -e "${BLUE}Step 4: Reloading systemd daemon...${NC}"

$SUDO systemctl daemon-reload

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Systemd daemon reloaded${NC}"
else
    echo -e "${RED}✗ Failed to reload systemd${NC}"
    exit 1
fi
echo ""

# Step 5: Enable service
echo -e "${BLUE}Step 5: Enabling service...${NC}"

$SUDO systemctl enable "$SERVICE_NAME"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Service enabled (will start on boot)${NC}"
else
    echo -e "${RED}✗ Failed to enable service${NC}"
    exit 1
fi
echo ""

# Step 6: Start service
echo -e "${BLUE}Step 6: Starting service...${NC}"

$SUDO systemctl start "$SERVICE_NAME"

sleep 3

if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo -e "${GREEN}✓ Service started successfully${NC}"
else
    echo -e "${RED}✗ Service failed to start${NC}"
    echo -e "${YELLOW}Check logs with: sudo journalctl -u $SERVICE_NAME -n 50${NC}"
    exit 1
fi
echo ""

# Step 7: Show status
echo -e "${BLUE}Step 7: Service status...${NC}"
$SUDO systemctl status "$SERVICE_NAME" --no-pager -l | head -20
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}Service Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Service: $SERVICE_NAME"
echo "Status: $(systemctl is-active $SERVICE_NAME)"
echo ""
echo "Useful Commands:"
echo "  Start:    sudo systemctl start $SERVICE_NAME"
echo "  Stop:     sudo systemctl stop $SERVICE_NAME"
echo "  Restart:  sudo systemctl restart $SERVICE_NAME"
echo "  Status:   sudo systemctl status $SERVICE_NAME"
echo "  Logs:     sudo journalctl -u $SERVICE_NAME -f"
echo ""

