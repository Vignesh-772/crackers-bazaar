# Webuzo Deployment Package

This directory contains all the necessary files and scripts for deploying Crackers Bazaar on Webuzo hosting control panel.

## 📁 Files Overview

### Documentation
- **DEPLOYMENT_GUIDE.md** - Complete step-by-step deployment guide
- **README.md** - This file

### Scripts
- **setup-database.sh** - Automated PostgreSQL database setup
- **deploy.sh** - Automated deployment script
- **setup-ssl.sh** - SSL certificate setup with Let's Encrypt

### Configuration Files
- **nginx-loadbalancer.conf** - Nginx load balancer configuration
- **crackers-bazaar-backend.service** - Systemd service file (single instance)
- **crackers-bazaar-backend@.service** - Systemd service file (multiple instances)
- **env.production.template** - Environment variables template

## 🚀 Quick Start

1. **Read the deployment guide:**
   ```bash
   cat DEPLOYMENT_GUIDE.md
   ```

2. **Setup database:**
   ```bash
   sudo bash setup-database.sh
   ```

3. **Configure environment:**
   ```bash
   cp env.production.template /home/webuzo/crackers-bazaar/.env
   nano /home/webuzo/crackers-bazaar/.env
   ```

4. **Deploy application:**
   ```bash
   bash deploy.sh
   ```

5. **Setup SSL:**
   ```bash
   sudo bash setup-ssl.sh
   ```

## 📋 Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] Webuzo control panel access
- [ ] Root/sudo access
- [ ] Domain name configured
- [ ] PostgreSQL 15+ installed
- [ ] Java 17+ installed
- [ ] Maven 3.6+ installed
- [ ] Nginx installed
- [ ] Git access (if using version control)

## 🔧 Configuration Steps

### 1. Database Setup
```bash
# Run database setup script
sudo bash setup-database.sh

# Or manually:
# - Create database via Webuzo PostgreSQL Manager
# - Run schema-uuid.sql
# - Run data.sql
```

### 2. Environment Variables
```bash
# Copy template
cp env.production.template /home/webuzo/crackers-bazaar/.env

# Edit with your values
nano /home/webuzo/crackers-bazaar/.env
```

### 3. Build Application
```bash
cd /home/webuzo/crackers-bazaar/backend
mvn clean package -DskipTests
```

### 4. Systemd Service
```bash
# Single instance
sudo cp crackers-bazaar-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable crackers-bazaar-backend
sudo systemctl start crackers-bazaar-backend

# Multiple instances (load balancing)
sudo cp crackers-bazaar-backend@.service /etc/systemd/system/
sudo systemctl enable crackers-bazaar-backend@1
sudo systemctl enable crackers-bazaar-backend@2
sudo systemctl start crackers-bazaar-backend@1
sudo systemctl start crackers-bazaar-backend@2
```

### 5. Nginx Load Balancer
```bash
# Copy configuration
sudo cp nginx-loadbalancer.conf /etc/nginx/sites-available/crackers-bazaar-api

# Edit domain name
sudo nano /etc/nginx/sites-available/crackers-bazaar-api

# Enable site
sudo ln -s /etc/nginx/sites-available/crackers-bazaar-api /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL Certificate
```bash
sudo bash setup-ssl.sh
```

## 🔄 Load Balancing Setup

For high availability, run multiple backend instances:

1. **Enable multiple instances:**
   ```bash
   sudo systemctl enable crackers-bazaar-backend@1
   sudo systemctl enable crackers-bazaar-backend@2
   sudo systemctl start crackers-bazaar-backend@1
   sudo systemctl start crackers-bazaar-backend@2
   ```

2. **Update Nginx config** to include all instances:
   ```nginx
   upstream crackers_bazaar_backend {
       server 127.0.0.1:8080;
       server 127.0.0.1:8081;
       server 127.0.0.1:8082;
   }
   ```

## 📊 Monitoring

### Check Service Status
```bash
sudo systemctl status crackers-bazaar-backend
```

### View Logs
```bash
# Systemd logs
sudo journalctl -u crackers-bazaar-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/crackers-bazaar-api-error.log
```

### Health Check
```bash
curl http://localhost:8080/api/health
```

## 🔐 Security Best Practices

1. **Strong Passwords:**
   - Database password (32+ characters)
   - JWT secret (32+ characters)

2. **Firewall:**
   ```bash
   # Allow only necessary ports
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **SSL/TLS:**
   - Use Let's Encrypt for free SSL
   - Enable HSTS
   - Use strong cipher suites

4. **File Permissions:**
   ```bash
   chmod 600 /home/webuzo/crackers-bazaar/.env
   chown webuzo:webuzo /home/webuzo/crackers-bazaar/.env
   ```

## 🛠️ Troubleshooting

### Service Won't Start
```bash
# Check logs
sudo journalctl -u crackers-bazaar-backend -n 50

# Check Java version
java -version

# Verify environment file
cat /home/webuzo/crackers-bazaar/.env
```

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U crackers_user -d crackers_bazaar -h localhost
```

### Nginx Errors
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

For detailed instructions, see **DEPLOYMENT_GUIDE.md**

For issues:
1. Check application logs
2. Check Nginx logs
3. Check system logs
4. Verify all services are running

