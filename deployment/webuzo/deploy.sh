#!/bin/bash

# Automated Deployment Script for Crackers Bazaar
# This script automates the deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="${PROJECT_DIR:-/home/webuzo/crackers-bazaar}"
BACKEND_DIR="$PROJECT_DIR/backend"
SERVICE_NAME="crackers-bazaar-backend"
BUILD_SKIP_TESTS="${BUILD_SKIP_TESTS:-true}"

echo "=========================================="
echo "Crackers Bazaar Deployment Script"
echo "=========================================="
echo ""

# Check if running as correct user
if [ "$USER" != "webuzo" ] && [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}Warning: Not running as webuzo user. Some commands may require sudo.${NC}"
fi

# Step 1: Navigate to project directory
echo -e "${BLUE}Step 1: Checking project directory...${NC}"
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Error: Project directory not found at $PROJECT_DIR${NC}"
    exit 1
fi

cd "$PROJECT_DIR"
echo -e "${GREEN}✓ Project directory found${NC}"
echo ""

# Step 2: Pull latest code (if using git)
if [ -d ".git" ]; then
    echo -e "${BLUE}Step 2: Pulling latest code...${NC}"
    git pull
    echo -e "${GREEN}✓ Code updated${NC}"
    echo ""
else
    echo -e "${YELLOW}Step 2: Not a git repository, skipping pull...${NC}"
    echo ""
fi

# Step 3: Check environment file
echo -e "${BLUE}Step 3: Checking environment configuration...${NC}"
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo -e "${YELLOW}⚠ .env file not found. Creating from template...${NC}"
    if [ -f "deployment/webuzo/.env.production" ]; then
        cp deployment/webuzo/.env.production "$PROJECT_DIR/.env"
        echo -e "${YELLOW}⚠ Please edit .env file with your configuration before continuing${NC}"
        read -p "Press Enter after updating .env file..."
    else
        echo -e "${RED}Error: .env template not found${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✓ Environment file found${NC}"
echo ""

# Step 4: Build backend
echo -e "${BLUE}Step 4: Building backend application...${NC}"
cd "$BACKEND_DIR"

if [ "$BUILD_SKIP_TESTS" = "true" ]; then
    mvn clean package -DskipTests
else
    mvn clean package
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend built successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Step 5: Run database migrations (if needed)
echo -e "${BLUE}Step 5: Checking database migrations...${NC}"
# Add migration logic here if using Flyway/Liquibase
# For now, we'll just verify database connection
echo -e "${GREEN}✓ Database migrations check skipped (using SQL init)${NC}"
echo ""

# Step 6: Restart service
echo -e "${BLUE}Step 6: Restarting backend service...${NC}"
if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo "Stopping service..."
    sudo systemctl stop "$SERVICE_NAME"
    sleep 2
fi

echo "Starting service..."
sudo systemctl start "$SERVICE_NAME"
sleep 3

if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo -e "${GREEN}✓ Service started successfully${NC}"
else
    echo -e "${RED}✗ Service failed to start. Check logs with: sudo journalctl -u $SERVICE_NAME${NC}"
    exit 1
fi
echo ""

# Step 7: Health check
echo -e "${BLUE}Step 7: Performing health check...${NC}"
sleep 5

HEALTH_CHECK_URL="http://localhost:8080/api/health"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_CHECK_URL" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Health check passed (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠ Health check returned HTTP $HTTP_CODE. Service may still be starting...${NC}"
    fi
else
    echo -e "${YELLOW}⚠ curl not available, skipping health check${NC}"
fi
echo ""

# Step 8: Reload Nginx (if configured)
echo -e "${BLUE}Step 8: Reloading Nginx...${NC}"
if systemctl is-active --quiet nginx; then
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}✓ Nginx reloaded${NC}"
else
    echo -e "${YELLOW}⚠ Nginx not running, skipping reload${NC}"
fi
echo ""

# Summary
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Service Status:"
sudo systemctl status "$SERVICE_NAME" --no-pager -l
echo ""
echo "View logs: sudo journalctl -u $SERVICE_NAME -f"
echo "Check health: curl http://localhost:8080/api/health"
echo ""

