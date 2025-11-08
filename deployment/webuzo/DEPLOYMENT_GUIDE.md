# Webuzo Deployment Guide for Crackers Bazaar

This guide provides step-by-step instructions for deploying the Crackers Bazaar application on Webuzo hosting control panel.

## 📋 Prerequisites

Before starting deployment, ensure you have all prerequisites installed:

**Quick Installation:**
```bash
sudo bash deployment/webuzo/install-prerequisites.sh
```

**Required Components:**
- Webuzo control panel installed and accessible
- Root or sudo access to the server
- Domain name configured (e.g., `api.yourdomain.com`)
- MySQL 8.0+ installed or accessible (Webuzo supports MySQL internally)
- Java 17+ installed
- Maven 3.6+ installed
- Nginx installed (for load balancing)
- Certbot installed (for SSL certificates)
- Git (optional but recommended)

**For detailed installation instructions, see [PREREQUISITES_GUIDE.md](./PREREQUISITES_GUIDE.md)**

## 🏗️ Architecture Overview

```
Internet
    ↓
Nginx Load Balancer (Port 80/443)
    ↓
┌─────────────┬─────────────┐
│ Backend 1   │ Backend 2   │ (Multiple instances for load balancing)
│ Port 8080   │ Port 8081   │
└─────────────┴─────────────┘
    ↓
PostgreSQL Database (Port 5432)
```

## 📦 Step 1: Prepare Deployment Directory

```bash
# Create deployment directory in Webuzo
mkdir -p /home/webuzo/crackers-bazaar
cd /home/webuzo/crackers-bazaar

# Clone or upload your project
git clone <your-repo-url> .
# OR upload via Webuzo File Manager
```

## 🗄️ Step 2: Database Setup

### 2.1 Create MySQL Database

**Option A: Via Webuzo MySQL Manager (Recommended)**
- Log into Webuzo control panel
- Navigate to MySQL Databases
- Create new database: `crackers_bazaar`
- Create new user: `crackers_user`
- Grant all privileges to user on database
- Note the database password

**Option B: Via Command Line**
```bash
# Login to MySQL as root
sudo mysql -u root -p

# In MySQL prompt:
CREATE DATABASE crackers_bazaar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'crackers_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON crackers_bazaar.* TO 'crackers_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2.2 Initialize Database Schema

```bash
cd /home/webuzo/crackers-bazaar
mysql -u crackers_user -p crackers_bazaar < backend/src/main/resources/schema-uuid.sql
mysql -u crackers_user -p crackers_bazaar < backend/src/main/resources/data.sql
```

Or use the automated script:
```bash
bash deployment/webuzo/setup-database.sh
```

## ⚙️ Step 3: Configure Environment Variables

```bash
# Copy environment template
cp deployment/webuzo/.env.production /home/webuzo/crackers-bazaar/.env

# Edit with your values
nano /home/webuzo/crackers-bazaar/.env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `DATABASE_USERNAME`: Database user
- `DATABASE_PASSWORD`: Database password
- `JWT_SECRET`: Strong secret key (min 32 characters)
- `AWS_S3_*`: AWS S3 credentials (if using S3)
- `STORAGE_TYPE`: `s3` or `local`

## 🔨 Step 4: Build Backend Application

```bash
cd /home/webuzo/crackers-bazaar/backend

# Build JAR file
mvn clean package -DskipTests

# The JAR will be in: target/crackers-bazaar-backend-1.0.0.jar
```

## 🚀 Step 5: Setup Systemd Service

```bash
# Copy systemd service file
sudo cp deployment/webuzo/crackers-bazaar-backend.service /etc/systemd/system/

# Edit service file with your paths
sudo nano /etc/systemd/system/crackers-bazaar-backend.service

# Reload systemd and start service
sudo systemctl daemon-reload
sudo systemctl enable crackers-bazaar-backend
sudo systemctl start crackers-bazaar-backend

# Check status
sudo systemctl status crackers-bazaar-backend
```

For multiple instances (load balancing):
```bash
sudo cp deployment/webuzo/crackers-bazaar-backend@.service /etc/systemd/system/
sudo systemctl enable crackers-bazaar-backend@1
sudo systemctl enable crackers-bazaar-backend@2
sudo systemctl start crackers-bazaar-backend@1
sudo systemctl start crackers-bazaar-backend@2
```

## ⚖️ Step 6: Configure Nginx Load Balancer

```bash
# Copy Nginx configuration
sudo cp deployment/webuzo/nginx-loadbalancer.conf /etc/nginx/sites-available/crackers-bazaar-api

# Create symlink
sudo ln -s /etc/nginx/sites-available/crackers-bazaar-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🔒 Step 7: Setup SSL Certificate

### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is set up automatically
```

### Option B: Manual SSL

```bash
# Place your SSL certificates in:
# /etc/nginx/ssl/api.yourdomain.com.crt
# /etc/nginx/ssl/api.yourdomain.com.key

# Update Nginx config to use SSL paths
sudo nano /etc/nginx/sites-available/crackers-bazaar-api
```

## 📊 Step 8: Monitoring & Logs

### View Application Logs

```bash
# Systemd logs
sudo journalctl -u crackers-bazaar-backend -f

# Application logs (if configured)
tail -f /home/webuzo/crackers-bazaar/logs/application.log
```

### Health Check

```bash
# Check backend health
curl http://localhost:8080/api/health

# Check through load balancer
curl https://api.yourdomain.com/api/health
```

## 🔄 Step 9: Deployment Automation

Use the automated deployment script:

```bash
bash deployment/webuzo/deploy.sh
```

This script will:
1. Pull latest code
2. Build backend
3. Run database migrations
4. Restart services
5. Verify deployment

## 🛠️ Maintenance Commands

### Restart Backend
```bash
sudo systemctl restart crackers-bazaar-backend
```

### Stop Backend
```bash
sudo systemctl stop crackers-bazaar-backend
```

### View Logs
```bash
sudo journalctl -u crackers-bazaar-backend -n 100
```

### Update Application
```bash
cd /home/webuzo/crackers-bazaar
git pull
cd backend
mvn clean package -DskipTests
sudo systemctl restart crackers-bazaar-backend
```

## 🔍 Troubleshooting

### Backend won't start
1. Check logs: `sudo journalctl -u crackers-bazaar-backend`
2. Verify Java version: `java -version` (should be 17+)
3. Check database connection
4. Verify environment variables

### Database connection errors
1. Check MySQL is running: `sudo systemctl status mysql` or `sudo systemctl status mysqld`
2. Verify credentials in `.env`
3. Check firewall rules
4. Verify MySQL user has proper privileges: `mysql -u root -p -e "SHOW GRANTS FOR 'crackers_user'@'localhost';"`

### Nginx errors
1. Test config: `sudo nginx -t`
2. Check error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify backend is running on configured ports

### Port conflicts
```bash
# Check what's using port 8080
sudo lsof -i :8080

# Change port in systemd service file if needed
```

## 📈 Performance Optimization

### Enable Gzip Compression
Already configured in Nginx config

### Database Connection Pooling
Configured in `application.yml` (HikariCP)

### JVM Tuning
Edit systemd service file to add JVM options:
```
JAVA_OPTS="-Xms512m -Xmx2048m -XX:+UseG1GC"
```

## 🔐 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Database password is secure
- [ ] SSL certificate installed
- [ ] Firewall configured (only allow 80, 443, 22)
- [ ] Regular backups configured
- [ ] Log rotation enabled
- [ ] Environment variables secured (not in git)

## 📞 Support

For issues, check:
- Application logs: `/var/log/crackers-bazaar/`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u crackers-bazaar-backend`

