#!/bin/bash

# Prerequisites Installation Script for Crackers Bazaar
# This script checks and installs all required prerequisites

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Crackers Bazaar Prerequisites Installer"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}Warning: Not running as root. Some installations may require sudo.${NC}"
    SUDO="sudo"
else
    SUDO=""
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    OS_VERSION=$VERSION_ID
    echo -e "${BLUE}Detected OS: $OS $OS_VERSION${NC}"
else
    echo -e "${RED}Error: Cannot detect OS${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install package
install_package() {
    local package=$1
    local name=$2
    
    if command_exists "$package"; then
        echo -e "${GREEN}✓ $name is already installed${NC}"
        return 0
    fi
    
    echo -e "${BLUE}Installing $name...${NC}"
    
    case $OS in
        ubuntu|debian)
            $SUDO apt-get update
            $SUDO apt-get install -y "$package"
            ;;
        centos|rhel)
            $SUDO yum install -y "$package"
            ;;
        fedora)
            $SUDO dnf install -y "$package"
            ;;
        *)
            echo -e "${RED}Error: Unsupported OS for automatic installation${NC}"
            echo -e "${YELLOW}Please install $name manually${NC}"
            return 1
            ;;
    esac
}

# Function to check version
check_version() {
    local command=$1
    local min_version=$2
    local version_check=$3
    
    if command_exists "$command"; then
        local current_version=$($version_check)
        echo -e "${GREEN}✓ $command is installed (version: $current_version)${NC}"
        return 0
    else
        return 1
    fi
}

echo -e "${BLUE}Step 1: Checking and Installing Java 17+...${NC}"

# Check Java
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | sed '/^1\./s///' | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -ge 17 ]; then
        echo -e "${GREEN}✓ Java $JAVA_VERSION is installed${NC}"
    else
        echo -e "${YELLOW}⚠ Java $JAVA_VERSION found, but Java 17+ is required${NC}"
        echo -e "${BLUE}Installing Java 17...${NC}"
        
        case $OS in
            ubuntu|debian)
                $SUDO apt-get update
                $SUDO apt-get install -y openjdk-17-jdk
                ;;
            centos|rhel)
                $SUDO yum install -y java-17-openjdk-devel
                ;;
            fedora)
                $SUDO dnf install -y java-17-openjdk-devel
                ;;
        esac
        
        # Set JAVA_HOME
        JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")
        echo "export JAVA_HOME=$JAVA_HOME" | $SUDO tee -a /etc/environment
        echo "export PATH=\$PATH:\$JAVA_HOME/bin" | $SUDO tee -a /etc/environment
    fi
else
    echo -e "${BLUE}Installing Java 17...${NC}"
    case $OS in
        ubuntu|debian)
            $SUDO apt-get update
            $SUDO apt-get install -y openjdk-17-jdk
            ;;
        centos|rhel)
            $SUDO yum install -y java-17-openjdk-devel
            ;;
        fedora)
            $SUDO dnf install -y java-17-openjdk-devel
            ;;
    esac
fi

# Verify Java installation
if command_exists java; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓ Java installed: $JAVA_VERSION${NC}"
else
    echo -e "${RED}✗ Java installation failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 2: Checking and Installing Maven 3.6+...${NC}"

# Check Maven
if command_exists mvn; then
    MVN_VERSION=$(mvn -version | head -n 1 | awk '{print $3}')
    echo -e "${GREEN}✓ Maven is installed (version: $MVN_VERSION)${NC}"
else
    echo -e "${BLUE}Installing Maven...${NC}"
    
    case $OS in
        ubuntu|debian)
            $SUDO apt-get update
            $SUDO apt-get install -y maven
            ;;
        centos|rhel)
            $SUDO yum install -y maven
            ;;
        fedora)
            $SUDO dnf install -y maven
            ;;
    esac
fi

# Verify Maven installation
if command_exists mvn; then
    MVN_VERSION=$(mvn -version | head -n 1)
    echo -e "${GREEN}✓ Maven installed: $MVN_VERSION${NC}"
else
    echo -e "${RED}✗ Maven installation failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 3: Checking and Installing MySQL 8.0+...${NC}"

# Check MySQL
if command_exists mysql; then
    MYSQL_VERSION=$(mysql --version | awk '{print $5}' | cut -d',' -f1 | cut -d'.' -f1)
    if [ "$MYSQL_VERSION" -ge 8 ]; then
        echo -e "${GREEN}✓ MySQL $MYSQL_VERSION is installed${NC}"
    else
        echo -e "${YELLOW}⚠ MySQL $MYSQL_VERSION found, but MySQL 8.0+ is required${NC}"
        echo -e "${BLUE}Installing MySQL 8.0...${NC}"
        
        case $OS in
            ubuntu|debian)
                $SUDO apt-get update
                $SUDO apt-get install -y mysql-server
                ;;
            centos|rhel)
                $SUDO yum install -y mysql-server
                ;;
            fedora)
                $SUDO dnf install -y mysql-server
                ;;
        esac
        
        # Start and enable MySQL
        $SUDO systemctl enable mysql
        $SUDO systemctl start mysql
    fi
else
    echo -e "${BLUE}Installing MySQL 8.0...${NC}"
    
    case $OS in
        ubuntu|debian)
            $SUDO apt-get update
            $SUDO apt-get install -y mysql-server
            ;;
        centos|rhel)
            $SUDO yum install -y mysql-server
            ;;
        fedora)
            $SUDO dnf install -y mysql-server
            ;;
    esac
    
    # Start and enable MySQL
    $SUDO systemctl enable mysql
    $SUDO systemctl start mysql
fi

# Verify MySQL installation
if command_exists mysql; then
    MYSQL_VERSION=$(mysql --version)
    echo -e "${GREEN}✓ MySQL installed: $MYSQL_VERSION${NC}"
    
    # Check if MySQL is running
    if systemctl is-active --quiet mysql || systemctl is-active --quiet mysqld; then
        echo -e "${GREEN}✓ MySQL service is running${NC}"
    else
        echo -e "${YELLOW}⚠ MySQL service is not running. Starting...${NC}"
        $SUDO systemctl start mysql || $SUDO systemctl start mysqld
    fi
    
    # Secure MySQL installation (optional)
    echo -e "${YELLOW}⚠ Note: Run 'sudo mysql_secure_installation' to secure MySQL${NC}"
else
    echo -e "${RED}✗ MySQL installation failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 4: Checking and Installing Nginx...${NC}"

# Check Nginx
if command_exists nginx; then
    NGINX_VERSION=$(nginx -v 2>&1 | cut -d'/' -f2)
    echo -e "${GREEN}✓ Nginx is installed (version: $NGINX_VERSION)${NC}"
else
    echo -e "${BLUE}Installing Nginx...${NC}"
    
    case $OS in
        ubuntu|debian)
            $SUDO apt-get update
            $SUDO apt-get install -y nginx
            ;;
        centos|rhel)
            $SUDO yum install -y nginx
            ;;
        fedora)
            $SUDO dnf install -y nginx
            ;;
    esac
    
    # Start and enable Nginx
    $SUDO systemctl enable nginx
    $SUDO systemctl start nginx
fi

# Verify Nginx installation
if command_exists nginx; then
    NGINX_VERSION=$(nginx -v 2>&1)
    echo -e "${GREEN}✓ Nginx installed: $NGINX_VERSION${NC}"
    
    # Check if Nginx is running
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx service is running${NC}"
    else
        echo -e "${YELLOW}⚠ Nginx service is not running. Starting...${NC}"
        $SUDO systemctl start nginx
    fi
else
    echo -e "${RED}✗ Nginx installation failed${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 5: Checking and Installing Certbot (for SSL)...${NC}"

# Check Certbot
if command_exists certbot; then
    CERTBOT_VERSION=$(certbot --version | awk '{print $2}')
    echo -e "${GREEN}✓ Certbot is installed (version: $CERTBOT_VERSION)${NC}"
else
    echo -e "${BLUE}Installing Certbot...${NC}"
    
    case $OS in
        ubuntu|debian)
            $SUDO apt-get update
            $SUDO apt-get install -y certbot python3-certbot-nginx
            ;;
        centos|rhel)
            $SUDO yum install -y certbot python3-certbot-nginx
            ;;
        fedora)
            $SUDO dnf install -y certbot python3-certbot-nginx
            ;;
    esac
fi

# Verify Certbot installation
if command_exists certbot; then
    CERTBOT_VERSION=$(certbot --version)
    echo -e "${GREEN}✓ Certbot installed: $CERTBOT_VERSION${NC}"
else
    echo -e "${YELLOW}⚠ Certbot installation failed (optional, can install later)${NC}"
fi
echo ""

echo -e "${BLUE}Step 6: Checking Git...${NC}"

# Check Git
if command_exists git; then
    GIT_VERSION=$(git --version | awk '{print $3}')
    echo -e "${GREEN}✓ Git is installed (version: $GIT_VERSION)${NC}"
else
    echo -e "${BLUE}Installing Git...${NC}"
    install_package git "Git"
fi
echo ""

echo -e "${BLUE}Step 7: Checking curl and wget...${NC}"

# Check curl
if command_exists curl; then
    echo -e "${GREEN}✓ curl is installed${NC}"
else
    install_package curl "curl"
fi

# Check wget
if command_exists wget; then
    echo -e "${GREEN}✓ wget is installed${NC}"
else
    install_package wget "wget"
fi
echo ""

echo -e "${BLUE}Step 8: Setting up firewall (UFW)...${NC}"

# Check UFW
if command_exists ufw; then
    echo -e "${GREEN}✓ UFW is installed${NC}"
    
    # Check if firewall is active
    if ufw status | grep -q "Status: active"; then
        echo -e "${GREEN}✓ Firewall is active${NC}"
    else
        echo -e "${YELLOW}⚠ Firewall is not active. Setting up basic rules...${NC}"
        read -p "Do you want to configure firewall now? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            $SUDO ufw allow 22/tcp    # SSH
            $SUDO ufw allow 80/tcp   # HTTP
            $SUDO ufw allow 443/tcp  # HTTPS
            $SUDO ufw --force enable
            echo -e "${GREEN}✓ Firewall configured${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ UFW not found. Installing...${NC}"
    install_package ufw "UFW"
fi
echo ""

echo -e "${BLUE}Step 9: Creating necessary directories...${NC}"

# Create directories
DIRS=(
    "/home/webuzo/crackers-bazaar"
    "/home/webuzo/crackers-bazaar/logs"
    "/home/webuzo/crackers-bazaar/uploads"
)

for dir in "${DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        $SUDO mkdir -p "$dir"
        $SUDO chown webuzo:webuzo "$dir" 2>/dev/null || echo -e "${YELLOW}⚠ Could not set ownership for $dir (may need manual setup)${NC}"
        echo -e "${GREEN}✓ Created directory: $dir${NC}"
    else
        echo -e "${GREEN}✓ Directory exists: $dir${NC}"
    fi
done
echo ""

echo "=========================================="
echo -e "${GREEN}Prerequisites Installation Complete!${NC}"
echo "=========================================="
echo ""
echo "Installed Components:"
echo "  ✓ Java 17+"
echo "  ✓ Maven 3.6+"
echo "  ✓ MySQL 8.0+"
echo "  ✓ Nginx"
echo "  ✓ Certbot (for SSL)"
echo "  ✓ Git"
echo "  ✓ curl & wget"
echo ""
echo "Next Steps:"
echo "  1. Secure MySQL (recommended):"
echo "     sudo mysql_secure_installation"
echo ""
echo "  2. Verify all services are running:"
echo "     sudo systemctl status mysql"
echo "     sudo systemctl status nginx"
echo ""
echo "  2. Setup database:"
echo "     sudo bash deployment/webuzo/setup-database.sh"
echo ""
echo "  3. Configure environment:"
echo "     cp deployment/webuzo/env.production.template /home/webuzo/crackers-bazaar/.env"
echo "     nano /home/webuzo/crackers-bazaar/.env"
echo ""
echo "  4. Deploy application:"
echo "     bash deployment/webuzo/deploy.sh"
echo ""
echo "  5. Setup SSL:"
echo "     sudo bash deployment/webuzo/setup-ssl.sh"
echo ""

