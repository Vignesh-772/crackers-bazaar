# LocalStack S3 Quickstart - 5 Minute Setup

## 🚀 Get Started in 5 Minutes

LocalStack provides AWS S3 emulation locally, allowing you to test production S3 features without AWS costs!

## ✅ Prerequisites

- Docker installed and running
- Docker Compose installed
- AWS CLI installed (optional, for testing)

## 📋 Quick Setup Steps

### Step 1: Start LocalStack (1 minute)

```bash
# Start all development services including LocalStack
docker-compose -f docker-compose.dev.yml up -d

# Or start just LocalStack
docker-compose up -d localstack

# Check logs
docker logs crackers-bazaar-localstack

# Should see:
# "LocalStack S3 initialization complete!"
# "Bucket: crackers-bazaar-images"
# "Endpoint: http://localhost:4566"
```

### Step 2: Configure Backend (1 minute)

**Create/Edit `backend/.env`:**

```bash
cd backend
cp .env.example .env

# Edit .env and set:
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_S3_LOCALSTACK_ENABLED=true
AWS_S3_LOCALSTACK_ENDPOINT=http://localhost:4566
```

### Step 3: Start Application (2 minutes)

```bash
# Terminal 1: Backend
cd backend
mvn spring-boot:run

# Wait for startup, should see:
# "LocalStack S3 Configuration"
# "Endpoint: http://localhost:4566"
# "Mode: DEVELOPMENT (Simulating AWS S3 locally)"

# Terminal 2: Frontend
cd frontend
npm run dev

# Access: http://localhost:5173
```

### Step 4: Test Upload (1 minute)

```bash
# 1. Login as manufacturer
http://localhost:5173/auth

# 2. Navigate to manufacturer dashboard
http://localhost:5173/manufacturer

# 3. Click "Add Product"
# 4. Go to "Inventory" tab
# 5. Upload an image

# Should see:
# - Progress bar
# - Image compressed
# - Success toast
# - Image preview

# 6. Verify in LocalStack
docker exec crackers-bazaar-localstack \
  awslocal s3 ls s3://crackers-bazaar-images/temp/

# Should show your uploaded file!
```

## ✅ Verification Checklist

- [ ] Docker is running
- [ ] LocalStack container started
- [ ] LocalStack health check passes
- [ ] S3 bucket created automatically
- [ ] Backend .env configured
- [ ] Backend connects to LocalStack
- [ ] Can upload images
- [ ] Images appear in LocalStack S3
- [ ] Images display via proxy
- [ ] Compression working

## 🧪 Quick Tests

### Test 1: Check LocalStack is Running

```bash
# Health check
curl http://localhost:4566/_localstack/health

# Response:
{
  "services": {
    "s3": "running"
  }
}
```

### Test 2: List S3 Buckets

```bash
# Using AWS CLI
aws --endpoint-url=http://localhost:4566 s3 ls

# Or using Docker
docker exec crackers-bazaar-localstack awslocal s3 ls

# Should show: crackers-bazaar-images
```

### Test 3: Upload and Verify

```bash
# Upload via backend API (need JWT token)
# OR use frontend to upload

# Then verify
docker exec crackers-bazaar-localstack \
  awslocal s3 ls s3://crackers-bazaar-images/ --recursive

# Should show uploaded files with paths like:
# temp/uuid-xxx.jpg
# products/1/uuid-yyy.jpg
```

## 🔧 Configuration Reference

### Docker Compose

```yaml
localstack:
  image: localstack/localstack:latest
  ports:
    - "4566:4566"  # S3 API endpoint
  environment:
    - SERVICES=s3            # Only S3 service
    - AWS_ACCESS_KEY_ID=test # Fixed credentials
    - AWS_SECRET_ACCESS_KEY=test
    - AWS_DEFAULT_REGION=us-east-1
  volumes:
    - localstack_data:/tmp/localstack          # Persistent storage
    - ./scripts/localstack-init.sh:/etc/localstack/init/ready.d/init.sh
```

### Backend .env (LocalStack)

```bash
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_S3_LOCALSTACK_ENABLED=true
AWS_S3_LOCALSTACK_ENDPOINT=http://localhost:4566
```

## 🎯 When to Use LocalStack

### ✅ Perfect For:

- **Local Development** - No AWS account needed
- **Integration Testing** - Test S3 features
- **CI/CD Pipelines** - Automated testing
- **Offline Development** - No internet required
- **Learning** - Understand S3 API
- **Cost-Free** - No AWS charges

### ❌ Not For:

- Production deployment
- Load testing (limited resources)
- Long-term storage (container restart loses data without volumes)
- Public access needs
- High availability requirements

## 🚨 Important Notes

### 1. **Credentials**
- LocalStack uses fixed credentials: `test` / `test`
- These work only with LocalStack
- Don't use in production!

### 2. **Endpoint**
- LocalStack: `http://localhost:4566`
- AWS S3: `https://s3.amazonaws.com`
- Must configure endpoint override for LocalStack

### 3. **Path Style Access**
- LocalStack requires path-style access
- Configured in LocalStackS3Config.java
- Not needed for real AWS S3

### 4. **Data Persistence**
- Data stored in Docker volume `localstack_data`
- Survives container restarts
- Lost if volume is deleted

### 5. **Initialization**
- Bucket created automatically on startup
- Via init script: `localstack-init.sh`
- Idempotent (safe to run multiple times)

## 🎉 Summary

### What You Get

✅ **LocalStack S3** - AWS S3 emulator running locally  
✅ **Docker Integration** - Easy to start/stop  
✅ **Auto-initialization** - Bucket created automatically  
✅ **Same API** - Compatible with AWS SDK  
✅ **Zero Cost** - Completely free  
✅ **Fast** - Local network speed  
✅ **Offline** - No internet needed  

### Quick Commands

```bash
# Start LocalStack
docker-compose up -d localstack

# Check status
docker ps | grep localstack

# View logs
docker logs -f crackers-bazaar-localstack

# List buckets
docker exec crackers-bazaar-localstack awslocal s3 ls

# Stop LocalStack
docker-compose stop localstack

# Remove LocalStack (clean slate)
docker-compose down localstack
docker volume rm crackers-bazaar_localstack_data
```

### Result

You can now:
- ✅ Develop with simulated AWS S3 locally
- ✅ Test all S3 features offline
- ✅ Use same code for dev and production
- ✅ No AWS costs during development
- ✅ Fast iteration and testing

---

**Setup Time:** 5 minutes  
**Cost:** $0 (Free!)  
**Complexity:** Low (Docker Compose)  
**Production-like:** ✅ Yes  
**Status:** ✅ Ready to Use  

🎊 **LocalStack S3 is now available for local development!**

**Simulate production S3 behavior without any AWS costs!** 🚀

