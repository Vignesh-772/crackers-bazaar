# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "Unit crackers-bazaar-backend.service not found"

**Cause:** The service file hasn't been installed or systemd hasn't been reloaded.

**Solution:**

```bash
# Step 1: Copy service file to systemd directory
sudo cp crackers-bazaar-backend.service /etc/systemd/system/

# Step 2: Reload systemd daemon (CRITICAL!)
sudo systemctl daemon-reload

# Step 3: Enable and start service
sudo systemctl enable crackers-bazaar-backend
sudo systemctl start crackers-bazaar-backend

# Or use the automated script
sudo bash deployment/webuzo/setup-service.sh
```

**Verify:**
```bash
# Check if service file exists
ls -la /etc/systemd/system/crackers-bazaar-backend.service

# Check if systemd recognizes it
systemctl list-unit-files | grep crackers-bazaar-backend
```

---

### Issue: Service fails to start

**Check logs:**
```bash
sudo journalctl -u crackers-bazaar-backend -n 50
```

**Common causes:**
1. **JAR file not found**
   ```bash
   # Check if JAR exists
   ls -la /home/webuzo/crackers-bazaar/backend/target/*.jar
   
   # Build if missing
   cd /home/webuzo/crackers-bazaar/backend
   mvn clean package -DskipTests
   ```

2. **Java not found**
   ```bash
   # Check Java installation
   which java
   java -version
   
   # Update service file with correct Java path
   sudo nano /etc/systemd/system/crackers-bazaar-backend.service
   # Change: ExecStart=/usr/bin/java
   # To: ExecStart=$(which java)
   ```

3. **Environment file missing**
   ```bash
   # Check if .env exists
   ls -la /home/webuzo/crackers-bazaar/.env
   
   # Create from template
   cp deployment/webuzo/env.production.template /home/webuzo/crackers-bazaar/.env
   nano /home/webuzo/crackers-bazaar/.env
   ```

4. **Database connection failed**
   ```bash
   # Check MySQL is running
   sudo systemctl status mysql
   
   # Test connection
   mysql -u crackers_user -p crackers_bazaar
   
   # Verify credentials in .env file
   grep DATABASE /home/webuzo/crackers-bazaar/.env
   ```

5. **Permission issues**
   ```bash
   # Check file permissions
   ls -la /home/webuzo/crackers-bazaar/backend/target/*.jar
   
   # Fix ownership
   sudo chown webuzo:webuzo /home/webuzo/crackers-bazaar/backend/target/*.jar
   ```

---

### Issue: Service starts but immediately stops

**Check logs:**
```bash
sudo journalctl -u crackers-bazaar-backend -f
```

**Common causes:**
- Application crashes on startup
- Database connection timeout
- Port already in use
- Missing environment variables

**Debug:**
```bash
# Run JAR manually to see errors
cd /home/webuzo/crackers-bazaar/backend
java -jar target/crackers-bazaar-backend-1.0.0.jar
```

---

### Issue: Port 8080 already in use

**Check what's using the port:**
```bash
sudo lsof -i :8080
sudo netstat -tlnp | grep 8080
```

**Solutions:**
1. Stop the conflicting service
2. Change port in service file:
   ```bash
   sudo nano /etc/systemd/system/crackers-bazaar-backend.service
   # Add: -Dserver.port=8081
   ```
3. Update Nginx config to use new port

---

### Issue: Can't connect to database

**Check MySQL:**
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Test connection
mysql -u crackers_user -p crackers_bazaar

# Check MySQL is listening
sudo netstat -tlnp | grep 3306
```

**Verify credentials:**
```bash
# Check .env file
cat /home/webuzo/crackers-bazaar/.env | grep DATABASE
```

**Common fixes:**
- MySQL not running: `sudo systemctl start mysql`
- Wrong credentials: Update `.env` file
- User doesn't exist: Run `setup-database.sh`
- Firewall blocking: Check firewall rules

---

### Issue: Permission denied errors

**Fix file ownership:**
```bash
# Set correct ownership
sudo chown -R webuzo:webuzo /home/webuzo/crackers-bazaar

# Set correct permissions
chmod 644 /home/webuzo/crackers-bazaar/.env
chmod 755 /home/webuzo/crackers-bazaar/backend/target/*.jar
```

---

### Issue: Service won't restart

**Force restart:**
```bash
# Stop service
sudo systemctl stop crackers-bazaar-backend

# Kill any remaining processes
sudo pkill -f crackers-bazaar-backend

# Start again
sudo systemctl start crackers-bazaar-backend
```

---

### Issue: Logs not showing

**Check journald:**
```bash
# View all logs
sudo journalctl -u crackers-bazaar-backend

# Follow logs
sudo journalctl -u crackers-bazaar-backend -f

# Last 100 lines
sudo journalctl -u crackers-bazaar-backend -n 100
```

**If logs are empty:**
- Check service is actually running
- Verify StandardOutput/StandardError in service file
- Check systemd journal is working: `sudo journalctl -p err`

---

## Quick Diagnostic Commands

```bash
# Service status
sudo systemctl status crackers-bazaar-backend

# Check if service is enabled
systemctl is-enabled crackers-bazaar-backend

# Check if service is active
systemctl is-active crackers-bazaar-backend

# View recent logs
sudo journalctl -u crackers-bazaar-backend --since "10 minutes ago"

# Check Java process
ps aux | grep java

# Check port
sudo lsof -i :8080

# Test health endpoint
curl http://localhost:8080/api/health

# Check file permissions
ls -la /home/webuzo/crackers-bazaar/backend/target/*.jar
ls -la /home/webuzo/crackers-bazaar/.env
```

---

## Getting Help

If issues persist:

1. **Collect information:**
   ```bash
   # Service status
   sudo systemctl status crackers-bazaar-backend > service-status.txt
   
   # Recent logs
   sudo journalctl -u crackers-bazaar-backend -n 100 > service-logs.txt
   
   # System info
   uname -a > system-info.txt
   java -version > java-version.txt
   ```

2. **Check service file:**
   ```bash
   cat /etc/systemd/system/crackers-bazaar-backend.service
   ```

3. **Verify all paths exist:**
   ```bash
   ls -la /home/webuzo/crackers-bazaar/backend/target/*.jar
   ls -la /home/webuzo/crackers-bazaar/.env
   which java
   ```

