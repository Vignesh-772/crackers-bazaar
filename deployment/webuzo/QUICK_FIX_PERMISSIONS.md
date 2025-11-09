# Quick Fix for Permission Denied Error

## Error
```
crackers-bazaar-backend.service: Changing to the requested working directory failed: Permission denied
Failed at step CHDIR spawning /usr/bin/java: Permission denied
```

## Immediate Fix

Run these commands to fix permissions:

```bash
# 1. Create directories if they don't exist
sudo mkdir -p /home/dhana/git/crackers-bazaar/backend
sudo mkdir -p /home/dhana/git/crackers-bazaar/logs
sudo mkdir -p /home/dhana/git/crackers-bazaar/uploads

# 2. Set ownership to webuzo user
sudo chown -R webuzo:webuzo /home/dhana/git/crackers-bazaar

# 3. Set proper permissions
sudo chmod 755 /home/dhana/git/crackers-bazaar
sudo chmod 755 /home/dhana/git/crackers-bazaar/backend
sudo chmod 755 /home/dhana/git/crackers-bazaar/logs
sudo chmod 755 /home/dhana/git/crackers-bazaar/uploads

# 4. Make JAR file executable
sudo chmod 755 /home/dhana/git/crackers-bazaar/backend/target/*.jar

# 5. Reload systemd and restart service
sudo systemctl daemon-reload
sudo systemctl restart crackers-bazaar-backend

# 6. Check status
sudo systemctl status crackers-bazaar-backend
```

## Automated Fix

Use the permissions fix script:

```bash
sudo bash deployment/webuzo/fix-permissions.sh
```

## Verify User Exists

If the `webuzo` user doesn't exist:

```bash
# Check if user exists
id webuzo

# If not, create user
sudo useradd -m -s /bin/bash webuzo

# Add to appropriate group
sudo usermod -aG webuzo webuzo
```

## Alternative: Use Current User

If you want to use a different user (like `dhana`):

```bash
# Edit service file
sudo nano /etc/systemd/system/crackers-bazaar-backend.service

# Change:
# User=webuzo
# Group=webuzo
# To:
# User=dhana
# Group=dhana

# Then fix ownership
sudo chown -R dhana:dhana /home/dhana/git/crackers-bazaar

# Reload and restart
sudo systemctl daemon-reload
sudo systemctl restart crackers-bazaar-backend
```

## Check Permissions

```bash
# Check directory ownership
ls -la /home/dhana/git/crackers-bazaar

# Check if user can access
sudo -u webuzo ls /home/dhana/git/crackers-bazaar/backend

# Check JAR file
ls -la /home/dhana/git/crackers-bazaar/backend/target/*.jar
```

