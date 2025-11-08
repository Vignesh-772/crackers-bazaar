#!/bin/bash

# SSL Certificate Setup Script for Crackers Bazaar
# This script helps set up SSL certificates using Let's Encrypt

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "SSL Certificate Setup"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Error: This script must be run as root or with sudo${NC}"
    exit 1
fi

# Get domain name
read -p "Enter your domain name (e.g., api.yourdomain.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Domain name is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Setting up SSL for: $DOMAIN${NC}"
echo ""

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Certbot not found. Installing...${NC}"
    
    # Detect OS
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
    else
        echo -e "${RED}Error: Cannot detect OS${NC}"
        exit 1
    fi
    
    case $OS in
        ubuntu|debian)
            apt-get update
            apt-get install -y certbot python3-certbot-nginx
            ;;
        centos|rhel|fedora)
            yum install -y certbot python3-certbot-nginx
            ;;
        *)
            echo -e "${RED}Error: Unsupported OS. Please install certbot manually.${NC}"
            exit 1
            ;;
    esac
fi

# Check if Nginx is installed and running
if ! systemctl is-active --quiet nginx; then
    echo -e "${YELLOW}Nginx is not running. Starting...${NC}"
    systemctl start nginx
fi

# Method selection
echo ""
echo "Select SSL setup method:"
echo "1) Let's Encrypt (Automatic with Nginx)"
echo "2) Let's Encrypt (Standalone - for manual Nginx config)"
echo "3) Manual certificate (you provide certificate files)"
read -p "Enter choice [1-3]: " METHOD

case $METHOD in
    1)
        echo ""
        echo -e "${BLUE}Obtaining certificate with Nginx plugin...${NC}"
        certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" --redirect
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ SSL certificate obtained and configured${NC}"
        else
            echo -e "${RED}✗ Failed to obtain certificate${NC}"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo -e "${BLUE}Obtaining certificate in standalone mode...${NC}"
        echo -e "${YELLOW}Note: Make sure port 80 is not in use and Nginx is stopped${NC}"
        read -p "Press Enter to continue..."
        
        systemctl stop nginx
        certbot certonly --standalone -d "$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN"
        systemctl start nginx
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ SSL certificate obtained${NC}"
            echo -e "${YELLOW}⚠ You need to manually configure Nginx to use the certificate${NC}"
            echo "Certificate location: /etc/letsencrypt/live/$DOMAIN/"
        else
            echo -e "${RED}✗ Failed to obtain certificate${NC}"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo -e "${BLUE}Manual certificate setup...${NC}"
        read -p "Enter path to certificate file (.crt): " CERT_PATH
        read -p "Enter path to private key file (.key): " KEY_PATH
        
        if [ ! -f "$CERT_PATH" ] || [ ! -f "$KEY_PATH" ]; then
            echo -e "${RED}Error: Certificate or key file not found${NC}"
            exit 1
        fi
        
        # Create directory for SSL certificates
        SSL_DIR="/etc/nginx/ssl/$DOMAIN"
        mkdir -p "$SSL_DIR"
        
        # Copy certificates
        cp "$CERT_PATH" "$SSL_DIR/fullchain.pem"
        cp "$KEY_PATH" "$SSL_DIR/privkey.pem"
        
        echo -e "${GREEN}✓ Certificates copied to $SSL_DIR${NC}"
        echo -e "${YELLOW}⚠ Update Nginx config to use:${NC}"
        echo "  ssl_certificate $SSL_DIR/fullchain.pem;"
        echo "  ssl_certificate_key $SSL_DIR/privkey.pem;"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Setup auto-renewal
if [ "$METHOD" = "1" ] || [ "$METHOD" = "2" ]; then
    echo ""
    echo -e "${BLUE}Setting up auto-renewal...${NC}"
    
    # Test renewal
    certbot renew --dry-run
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Auto-renewal test passed${NC}"
    else
        echo -e "${YELLOW}⚠ Auto-renewal test failed. Check cron job manually.${NC}"
    fi
fi

echo ""
echo "=========================================="
echo -e "${GREEN}SSL Setup Complete!${NC}"
echo "=========================================="
echo ""
echo "Certificate details:"
if [ "$METHOD" != "3" ]; then
    certbot certificates
fi
echo ""
echo "Test SSL: openssl s_client -connect $DOMAIN:443 -servername $DOMAIN"
echo ""

