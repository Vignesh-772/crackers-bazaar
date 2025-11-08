# Prerequisites Installation Guide

This guide provides detailed instructions for installing all prerequisites needed for deploying Crackers Bazaar on Webuzo.

## 🎯 Quick Installation

For automated installation, run:

```bash
sudo bash deployment/webuzo/install-prerequisites.sh
```

This script will automatically detect your OS and install all required components.

## 📋 Prerequisites Checklist

- [ ] **Java 17+** - Required for running Spring Boot application
- [ ] **Maven 3.6+** - Required for building the application
- [ ] **MySQL 8.0+** - Database server (Webuzo supports MySQL internally)
- [ ] **Nginx** - Web server and load balancer
- [ ] **Certbot** - SSL certificate management (Let's Encrypt)
- [ ] **Git** - Version control (optional but recommended)
- [ ] **curl/wget** - For health checks and downloads
- [ ] **UFW** - Firewall management (optional but recommended)

## 🔧 Manual Installation Instructions

### 1. Java 17+ Installation

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y openjdk-17-jdk

# Verify installation
java -version
```

#### CentOS/RHEL:
```bash
sudo yum install -y java-17-openjdk-devel

# Verify installation
java -version
```

#### Fedora:
```bash
sudo dnf install -y java-17-openjdk-devel

# Verify installation
java -version
```

**Set JAVA_HOME:**
```bash
# Find Java installation
readlink -f /usr/bin/java

# Add to /etc/environment
echo "export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64" | sudo tee -a /etc/environment
echo "export PATH=\$PATH:\$JAVA_HOME/bin" | sudo tee -a /etc/environment

# Reload environment
source /etc/environment
```

### 2. Maven 3.6+ Installation

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y maven

# Verify installation
mvn -version
```

#### CentOS/RHEL:
```bash
sudo yum install -y maven

# Verify installation
mvn -version
```

#### Fedora:
```bash
sudo dnf install -y maven

# Verify installation
mvn -version
```

**Alternative: Install from Apache (Latest Version)**
```bash
# Download Maven
cd /tmp
wget https://dlcdn.apache.org/maven/maven-3/3.9.5/binaries/apache-maven-3.9.5-bin.tar.gz

# Extract
sudo tar -xzf apache-maven-3.9.5-bin.tar.gz -C /opt

# Create symlink
sudo ln -s /opt/apache-maven-3.9.5 /opt/maven

# Add to PATH
echo "export M2_HOME=/opt/maven" | sudo tee -a /etc/environment
echo "export PATH=\$PATH:\$M2_HOME/bin" | sudo tee -a /etc/environment

# Reload
source /etc/environment
mvn -version
```

### 3. MySQL 8.0+ Installation

#### Ubuntu/Debian:
```bash
# Install MySQL Server
sudo apt-get update
sudo apt-get install -y mysql-server

# Start and enable MySQL
sudo systemctl enable mysql
sudo systemctl start mysql

# Secure MySQL installation (recommended)
sudo mysql_secure_installation

# Verify installation
mysql --version
```

#### CentOS/RHEL:
```bash
# Install MySQL Server
sudo yum install -y mysql-server

# Start and enable MySQL
sudo systemctl enable mysqld
sudo systemctl start mysqld

# Get temporary root password
sudo grep 'temporary password' /var/log/mysqld.log

# Secure MySQL installation
sudo mysql_secure_installation

# Verify installation
mysql --version
```

#### Fedora:
```bash
# Install MySQL Server
sudo dnf install -y mysql-server

# Start and enable MySQL
sudo systemctl enable mysqld
sudo systemctl start mysqld

# Secure MySQL installation
sudo mysql_secure_installation

# Verify installation
mysql --version
```

**Configure MySQL:**
```bash
# Login to MySQL as root
sudo mysql -u root -p

# In MySQL prompt, create database and user
CREATE DATABASE crackers_bazaar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crackers_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON crackers_bazaar.* TO 'crackers_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Nginx Installation

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y nginx

# Start and enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify installation
nginx -v
sudo systemctl status nginx
```

#### CentOS/RHEL:
```bash
sudo yum install -y nginx

# Start and enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify installation
nginx -v
sudo systemctl status nginx
```

#### Fedora:
```bash
sudo dnf install -y nginx

# Start and enable Nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Verify installation
nginx -v
sudo systemctl status nginx
```

**Test Nginx:**
```bash
# Check if Nginx is serving pages
curl http://localhost

# If you see HTML, Nginx is working!
```

### 5. Certbot Installation (for SSL)

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

#### CentOS/RHEL:
```bash
sudo yum install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

#### Fedora:
```bash
sudo dnf install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### 6. Git Installation

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y git

# Verify installation
git --version
```

#### CentOS/RHEL:
```bash
sudo yum install -y git

# Verify installation
git --version
```

#### Fedora:
```bash
sudo dnf install -y git

# Verify installation
git --version
```

### 7. Additional Tools

#### curl and wget:
```bash
# Ubuntu/Debian
sudo apt-get install -y curl wget

# CentOS/RHEL
sudo yum install -y curl wget

# Fedora
sudo dnf install -y curl wget
```

#### UFW (Firewall):
```bash
# Ubuntu/Debian
sudo apt-get install -y ufw

# CentOS/RHEL (use firewalld instead)
sudo yum install -y firewalld

# Fedora
sudo dnf install -y firewalld
```

## 🔍 Verification

After installation, verify all components:

```bash
# Check Java
java -version
# Should show: openjdk version "17.x.x"

# Check Maven
mvn -version
# Should show: Apache Maven 3.6.x or higher

# Check MySQL
mysql --version
# Should show: mysql Ver 8.0.x

# Check Nginx
nginx -v
# Should show: nginx version: nginx/1.x.x

# Check Certbot
certbot --version
# Should show: certbot x.x.x

# Check Git
git --version
# Should show: git version 2.x.x

# Check services
sudo systemctl status mysql
sudo systemctl status nginx
```

## 🛠️ Troubleshooting

### Java Issues

**Problem:** `java: command not found`
```bash
# Check if Java is installed
which java

# If not found, reinstall
sudo apt-get install --reinstall openjdk-17-jdk
```

**Problem:** Wrong Java version
```bash
# Check all Java versions
sudo update-alternatives --config java

# Select Java 17
```

### Maven Issues

**Problem:** `mvn: command not found`
```bash
# Check if Maven is in PATH
echo $PATH

# Add Maven to PATH if needed
export PATH=$PATH:/usr/bin/mvn
```

### MySQL Issues

**Problem:** MySQL won't start
```bash
# Check logs
sudo journalctl -u mysql -n 50
# OR
sudo journalctl -u mysqld -n 50

# Check if port is in use
sudo lsof -i :3306

# Restart service
sudo systemctl restart mysql
# OR
sudo systemctl restart mysqld
```

**Problem:** Can't connect to MySQL
```bash
# Check MySQL is listening
sudo netstat -tlnp | grep 3306

# Check MySQL configuration
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Reset root password if needed
sudo mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
EXIT;
```

### Nginx Issues

**Problem:** Nginx won't start
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check if port 80 is in use
sudo lsof -i :80
```

## 📝 Post-Installation Setup

After installing prerequisites:

1. **Create directories:**
   ```bash
   sudo mkdir -p /home/webuzo/crackers-bazaar/{logs,uploads}
   sudo chown -R webuzo:webuzo /home/webuzo/crackers-bazaar
   ```

2. **Configure firewall:**
   ```bash
   # UFW (Ubuntu/Debian)
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   
   # Firewalld (CentOS/RHEL/Fedora)
   sudo firewall-cmd --permanent --add-service=ssh
   sudo firewall-cmd --permanent --add-service=http
   sudo firewall-cmd --permanent --add-service=https
   sudo firewall-cmd --reload
   ```

3. **Verify all services:**
   ```bash
   sudo systemctl status postgresql
   sudo systemctl status nginx
   ```

## ✅ Next Steps

Once all prerequisites are installed:

1. Run database setup: `sudo bash deployment/webuzo/setup-database.sh`
2. Configure environment: Copy and edit `env.production.template`
3. Deploy application: `bash deployment/webuzo/deploy.sh`
4. Setup SSL: `sudo bash deployment/webuzo/setup-ssl.sh`

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

