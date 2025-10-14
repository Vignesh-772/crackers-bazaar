# LocalStack S3 Setup Guide - Simulate AWS S3 Locally

## Overview
LocalStack provides a fully functional AWS S3 emulator that runs locally in Docker. This allows you to develop and test S3 integration without using real AWS resources or incurring costs.

## ✅ What is LocalStack?

LocalStack is a cloud service emulator that runs in a single container on your local machine. It provides:
- ✅ **AWS S3 API compatibility** - Works exactly like real S3
- ✅ **No AWS account needed** - Completely local
- ✅ **No costs** - Free and open source
- ✅ **Fast development** - No network latency
- ✅ **Isolated testing** - No production interference
- ✅ **Same code** - Use same code for dev and prod

## 🎯 Benefits

### For Development
✅ **No AWS Account Required** - Start developing immediately  
✅ **Zero Costs** - No AWS charges  
✅ **Faster Iteration** - Local = faster  
✅ **Isolated Environment** - No production data  
✅ **Offline Development** - No internet required  
✅ **Consistent State** - Reset anytime  

### For Testing
✅ **Realistic Testing** - Same API as AWS  
✅ **Repeatable** - Clean slate every run  
✅ **Fast** - Local network speed  
✅ **No Cleanup** - Just restart container  

### For CI/CD
✅ **Automated Testing** - In pipeline  
✅ **No AWS Keys** - No secrets in CI  
✅ **Fast Execution** - Local is faster  
✅ **Reliable** - No external dependencies  

## 🚀 Quick Setup (5 minutes)

### Option 1: Using Docker Compose (Easiest)

```bash
# 1. Start all services including LocalStack
docker-compose up -d

# 2. Wait for LocalStack to initialize (~10 seconds)
docker logs crackers-bazaar-localstack

# Should see:
# "LocalStack S3 initialization complete!"
# "Bucket: crackers-bazaar-images"
# "Endpoint: http://localhost:4566"

# 3. Verify S3 bucket created
docker exec crackers-bazaar-localstack \
  awslocal s3 ls

# Should show:
# crackers-bazaar-images

# 4. Configure backend for LocalStack
# Edit backend/.env:
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_S3_LOCALSTACK_ENABLED=true
AWS_S3_LOCALSTACK_ENDPOINT=http://localhost:4566

# 5. Start backend
cd backend
mvn spring-boot:run

# Should see in logs:
# "LocalStack S3 Configuration"
# "Endpoint: http://localhost:4566"
# "Mode: DEVELOPMENT (Simulating AWS S3 locally)"

# 6. Test it!
# Upload an image via frontend
# Check LocalStack logs:
docker logs -f crackers-bazaar-localstack
```

### Option 2: Manual Docker Run

```bash
# Run LocalStack container
docker run -d \
  --name localstack-s3 \
  -p 4566:4566 \
  -e SERVICES=s3 \
  -e DEBUG=1 \
  -e AWS_ACCESS_KEY_ID=test \
  -e AWS_SECRET_ACCESS_KEY=test \
  localstack/localstack

# Create S3 bucket
aws --endpoint-url=http://localhost:4566 \
    s3 mb s3://crackers-bazaar-images

# List buckets
aws --endpoint-url=http://localhost:4566 s3 ls
```

## ⚙️ Configuration

### Development (LocalStack)

**File**: `backend/.env`

```bash
# Use LocalStack S3
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test
AWS_S3_LOCALSTACK_ENABLED=true
AWS_S3_LOCALSTACK_ENDPOINT=http://localhost:4566
```

### Production (Real AWS S3)

**File**: `backend/.env`

```bash
# Use Real AWS S3
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=prod-crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=AKIA... # Real AWS key
AWS_SECRET_KEY=... # Real AWS secret
AWS_S3_LOCALSTACK_ENABLED=false
```

## 🔄 How It Works

### LocalStack S3 Configuration

```java
@Configuration
@ConditionalOnProperty(
    name = "aws.s3.localstack.enabled", 
    havingValue = "true"
)
public class LocalStackS3Config {
    
    @Bean
    @Primary  // Takes precedence over regular S3Config
    public S3Client localStackS3Client() {
        return S3Client.builder()
            .endpointOverride(URI.create("http://localhost:4566"))
            .region(Region.US_EAST_1)
            .credentialsProvider(StaticCredentialsProvider.create(
                AwsBasicCredentials.create("test", "test")
            ))
            .serviceConfiguration(S3Configuration.builder()
                .pathStyleAccessEnabled(true)  // LocalStack requires this
                .build())
            .build();
    }
}
```

### Configuration Priority

```
If AWS_S3_LOCALSTACK_ENABLED=true:
    ✅ Use LocalStackS3Config
    ✅ Endpoint: http://localhost:4566
    ✅ Credentials: test/test
    ✅ Mode: Development
Else:
    ✅ Use S3Config  
    ✅ Endpoint: AWS S3 endpoints
    ✅ Credentials: Real AWS keys
    ✅ Mode: Production
```

## 📊 Comparison

| Aspect | LocalStack S3 | Real AWS S3 |
|--------|---------------|-------------|
| **Cost** | ✅ Free | ⚠️ Pay per use |
| **Speed** | ✅ Local (instant) | ⚠️ Network latency |
| **Setup** | ✅ Docker compose | ⚠️ AWS account needed |
| **Reliability** | ⚠️ Dev only | ✅ Production SLA |
| **Scalability** | ⚠️ Limited | ✅ Unlimited |
| **Persistence** | ⚠️ Container restart loses data | ✅ Permanent storage |
| **Best For** | ✅ Development | ✅ Production |

## 🧪 Testing with LocalStack

### Upload Image

```bash
# 1. Upload via API
curl -X POST http://localhost:8080/api/upload/temp-image \
  -H "Authorization: Bearer {jwt-token}" \
  -F "file=@test-image.jpg"

# Backend logs should show:
# "Image compressed: 5.0 MB -> 1.2 MB (76% reduction)"
# "Image uploaded to S3: temp/uuid-xxx.jpg"
# But it's actually in LocalStack, not real AWS!

# 2. Verify in LocalStack
docker exec crackers-bazaar-localstack \
  awslocal s3 ls s3://crackers-bazaar-images/temp/

# Should show: uuid-xxx.jpg

# 3. Download from LocalStack (verify)
docker exec crackers-bazaar-localstack \
  awslocal s3 cp s3://crackers-bazaar-images/temp/uuid-xxx.jpg /tmp/test.jpg

# 4. Test proxy endpoint
curl http://localhost:8080/api/images?key=temp/uuid-xxx.jpg \
  --output downloaded.jpg

# Image should be identical!
```

### Verify Compression

```bash
# Check original vs compressed size
ls -lh test-image.jpg
# Original: 5.0 MB

# Download from LocalStack
docker exec crackers-bazaar-localstack \
  awslocal s3 cp s3://crackers-bazaar-images/temp/uuid-xxx.jpg /tmp/
  
docker cp crackers-bazaar-localstack:/tmp/uuid-xxx.jpg ./compressed.jpg

ls -lh compressed.jpg
# Compressed: ~1.2 MB

# Compression worked! 76% reduction ✨
```

## 🔧 Advanced LocalStack Commands

### AWS CLI with LocalStack

```bash
# Alias for convenience
alias awslocal="aws --endpoint-url=http://localhost:4566"

# List buckets
awslocal s3 ls

# List objects in bucket
awslocal s3 ls s3://crackers-bazaar-images/temp/

# Get object
awslocal s3 cp s3://crackers-bazaar-images/temp/test.jpg ./

# Delete object
awslocal s3 rm s3://crackers-bazaar-images/temp/test.jpg

# Get bucket size
awslocal s3 ls --recursive --human-readable --summarize \
  s3://crackers-bazaar-images
```

### LocalStack Container Commands

```bash
# Check LocalStack logs
docker logs crackers-bazaar-localstack

# Follow logs in real-time
docker logs -f crackers-bazaar-localstack

# Restart LocalStack (clears all data)
docker restart crackers-bazaar-localstack

# Stop LocalStack
docker stop crackers-bazaar-localstack

# Start LocalStack
docker start crackers-bazaar-localstack

# Remove LocalStack (complete cleanup)
docker rm -f crackers-bazaar-localstack
```

### Check LocalStack Health

```bash
# Health check endpoint
curl http://localhost:4566/_localstack/health

# Should return:
{
  "services": {
    "s3": "running"
  }
}
```

## 📁 Data Persistence

### LocalStack Volume

Data is stored in Docker volume:
```bash
# List LocalStack data
docker volume inspect crackers-bazaar_localstack_data

# Location: /var/lib/docker/volumes/crackers-bazaar_localstack_data/_data

# Backup LocalStack data (optional)
docker run --rm -v crackers-bazaar_localstack_data:/data \
  -v $(pwd):/backup ubuntu \
  tar czf /backup/localstack-backup.tar.gz /data

# Restore LocalStack data
docker run --rm -v crackers-bazaar_localstack_data:/data \
  -v $(pwd):/backup ubuntu \
  tar xzf /backup/localstack-backup.tar.gz -C /
```

### Clear LocalStack Data

```bash
# Stop and remove container
docker-compose down

# Remove volume (clears all data)
docker volume rm crackers-bazaar_localstack_data

# Start fresh
docker-compose up -d localstack
```

## 🎯 Development Workflow

### Daily Development

```bash
# Morning: Start services
docker-compose up -d

# Develop and test
# - Upload images
# - Test compression
# - Verify proxy delivery
# - All using LocalStack!

# Evening: Stop services (optional)
docker-compose down
# Or keep running for next day
```

### Switching Between LocalStack and AWS

**Development (LocalStack):**
```bash
# .env
AWS_S3_LOCALSTACK_ENABLED=true
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test

# Restart backend
mvn spring-boot:run
```

**Production (Real AWS):**
```bash
# .env
AWS_S3_LOCALSTACK_ENABLED=false
AWS_ACCESS_KEY=AKIA...  # Real key
AWS_SECRET_KEY=...       # Real secret

# Restart backend
mvn spring-boot:run
```

**Same code, different endpoint!** ✨

## 🔍 Troubleshooting

### Issue: LocalStack not starting

**Solution:**
```bash
# Check Docker is running
docker ps

# Check LocalStack logs
docker logs crackers-bazaar-localstack

# Check port 4566 is not in use
lsof -i :4566

# Restart LocalStack
docker-compose restart localstack
```

### Issue: Bucket not created

**Solution:**
```bash
# Check init script ran
docker logs crackers-bazaar-localstack | grep "initialization complete"

# Manually create bucket
docker exec crackers-bazaar-localstack \
  awslocal s3 mb s3://crackers-bazaar-images

# Verify
docker exec crackers-bazaar-localstack \
  awslocal s3 ls
```

### Issue: Backend can't connect to LocalStack

**Solution:**
```bash
# Check LocalStack is running
curl http://localhost:4566/_localstack/health

# Verify endpoint in .env
cat backend/.env | grep LOCALSTACK

# Should be: http://localhost:4566
# NOT: https://s3.amazonaws.com

# Check backend logs
tail -f backend/logs/app.log | grep "LocalStack"
```

### Issue: Images not persisting

**Solution:**
```bash
# LocalStack data is in Docker volume
# If container is removed, data is lost unless volume persists

# Check volume exists
docker volume ls | grep localstack

# Verify volume mounted
docker inspect crackers-bazaar-localstack | grep -A 5 "Mounts"
```

## 📊 LocalStack Features

### What LocalStack Provides

✅ **S3 API** - Full S3 compatibility  
✅ **Bucket Operations** - Create, delete, list  
✅ **Object Operations** - Put, get, delete  
✅ **Metadata** - Content-Type, Cache-Control  
✅ **Multipart Upload** - Large file support  
✅ **Access Control** - Simulated IAM  

### What LocalStack Doesn't Provide

❌ **Durability** - Not production-grade  
❌ **Scalability** - Limited to local resources  
❌ **Global Access** - Only accessible locally  
❌ **CDN** - No CloudFront integration  
❌ **Billing** - No cost tracking (it's free!)  

## 🎯 Use Cases

### Perfect For:
- ✅ Local development
- ✅ Unit testing
- ✅ Integration testing
- ✅ CI/CD pipelines
- ✅ Learning S3 API
- ✅ Cost-free prototyping

### Not Suitable For:
- ❌ Production deployment
- ❌ Load testing (at scale)
- ❌ Public access
- ❌ Long-term storage
- ❌ High availability needs

## 🔄 Complete Development Setup

### docker-compose.yml Structure

```yaml
services:
  postgres:
    # PostgreSQL database
    ports: ["5432:5432"]
  
  pgadmin:
    # Database admin UI
    ports: ["5050:80"]
  
  localstack:
    # AWS S3 emulator
    image: localstack/localstack:latest
    ports: ["4566:4566"]
    environment:
      - SERVICES=s3
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    volumes:
      - localstack_data:/tmp/localstack
      - ./scripts/localstack-init.sh:/etc/localstack/init/ready.d/init.sh
```

### Backend Configuration

```yaml
# application.yml
aws:
  s3:
    bucket-name: crackers-bazaar-images
    region: us-east-1
    access-key: test
    secret-key: test
    localstack:
      enabled: true                       # Enable LocalStack
      endpoint: http://localhost:4566     # LocalStack endpoint
```

### Application Startup

```bash
# 1. Start Docker services
docker-compose up -d

# Services started:
# ✅ PostgreSQL (port 5432)
# ✅ pgAdmin (port 5050)
# ✅ LocalStack S3 (port 4566)

# 2. Initialize LocalStack (automatic)
# Script runs on container ready
# Creates bucket: crackers-bazaar-images

# 3. Start Backend
cd backend
mvn spring-boot:run

# 4. Start Frontend
cd frontend
npm run dev

# 5. Test Complete Flow
# - Login as manufacturer
# - Add product
# - Upload images
# - Images go to LocalStack S3
# - Served via proxy
# - Everything works like real AWS!
```

## 📋 Service URLs

### Development Services

```
Frontend:       http://localhost:5173
Backend API:    http://localhost:8080
PostgreSQL:     localhost:5432
pgAdmin:        http://localhost:5050
LocalStack S3:  http://localhost:4566

Image Proxy:    http://localhost:8080/api/images?key={s3Key}
```

### LocalStack Endpoints

```
S3 API:         http://localhost:4566
Health Check:   http://localhost:4566/_localstack/health
Dashboard:      http://localhost:4566/_localstack/dashboard (Pro only)
```

## 🧪 Testing Scenarios

### Test 1: Basic Upload

```bash
# Upload via frontend
# /manufacturer → Add Product → Upload Image

# Verify in LocalStack
docker exec crackers-bazaar-localstack \
  awslocal s3 ls s3://crackers-bazaar-images/temp/

# Output: 2025-10-14 10:30:00  1234567 uuid-xxx.jpg
```

### Test 2: Compression

```bash
# Upload 5 MB image
# Check backend logs:
tail -f logs/app.log | grep "compressed"

# Output:
# Image compressed: 5.0 MB -> 1.2 MB (76.0% reduction)
# Image uploaded to S3: temp/uuid-xxx.jpg

# Download from LocalStack and verify size
docker exec crackers-bazaar-localstack \
  awslocal s3 cp s3://crackers-bazaar-images/temp/uuid-xxx.jpg /tmp/

# File size should be ~1.2 MB ✅
```

### Test 3: Proxy Delivery

```bash
# Get image via proxy
curl http://localhost:8080/api/images?key=temp/uuid-xxx.jpg \
  -I  # Headers only

# Response:
HTTP/1.1 200 OK
Content-Type: image/jpeg
Cache-Control: public, max-age=31536000
Content-Length: 1234567

# Full image
curl http://localhost:8080/api/images?key=temp/uuid-xxx.jpg \
  --output test-download.jpg

# Verify downloaded image
open test-download.jpg  # Should display correctly
```

### Test 4: Multiple Uploads

```bash
# Upload 5 images at once
# Check LocalStack:
docker exec crackers-bazaar-localstack \
  awslocal s3 ls s3://crackers-bazaar-images/products/1/

# Should show all 5 images
# All compressed if > 2 MB
```

## 🎯 Migration to Production

### Easy Transition

**Step 1: Develop with LocalStack**
```bash
# Use LocalStack for all development
AWS_S3_LOCALSTACK_ENABLED=true
```

**Step 2: Test with Real AWS (Staging)**
```bash
# Switch to real AWS for testing
AWS_S3_LOCALSTACK_ENABLED=false
AWS_ACCESS_KEY=AKIA...  # Staging AWS key
AWS_S3_BUCKET_NAME=staging-crackers-bazaar
```

**Step 3: Deploy to Production**
```bash
# Use production AWS credentials
AWS_S3_LOCALSTACK_ENABLED=false
AWS_ACCESS_KEY=AKIA...  # Production AWS key
AWS_S3_BUCKET_NAME=prod-crackers-bazaar
```

**No code changes needed!** ✨

## 💡 Pro Tips

### 1. **Use Docker Compose Profiles**

```yaml
# docker-compose.yml
services:
  localstack:
    profiles: ["dev"]  # Only start in dev profile

# Start with profile
docker-compose --profile dev up -d
```

### 2. **Script for Easy Switching**

Create `scripts/use-localstack.sh`:
```bash
#!/bin/bash
echo "Configuring for LocalStack..."
export AWS_S3_LOCALSTACK_ENABLED=true
export AWS_ACCESS_KEY=test
export AWS_SECRET_KEY=test
echo "LocalStack configured!"
```

Create `scripts/use-aws.sh`:
```bash
#!/bin/bash
echo "Configuring for AWS..."
export AWS_S3_LOCALSTACK_ENABLED=false
export AWS_ACCESS_KEY=$PROD_AWS_ACCESS_KEY
export AWS_SECRET_KEY=$PROD_AWS_SECRET_KEY
echo "AWS configured!"
```

### 3. **LocalStack Web UI** (Pro Feature)

```bash
# LocalStack Pro includes web UI
# View buckets, objects, logs in browser
# http://localhost:4566/_localstack/dashboard
```

### 4. **Automated Bucket Creation**

The init script (`localstack-init.sh`) automatically:
- Creates S3 bucket
- Creates folder structure
- Runs on container startup
- Idempotent (safe to run multiple times)

## ✨ Summary

### What You Get with LocalStack

✅ **Free AWS S3 Emulation** - No costs  
✅ **Local Development** - Fast and reliable  
✅ **Same Code** - Works with real AWS  
✅ **Docker Integration** - Easy setup  
✅ **Auto-initialization** - Bucket created automatically  
✅ **Full S3 API** - Compatible with AWS SDK  
✅ **Compression Testing** - Test image processing  
✅ **Proxy Testing** - Test delivery flow  

### Complete Development Stack

```
docker-compose up -d
    ↓
Starts:
  ✅ PostgreSQL (Database)
  ✅ pgAdmin (Database UI)
  ✅ LocalStack S3 (AWS S3 Emulator)
    ↓
Backend connects to:
  ✅ PostgreSQL (localhost:5432)
  ✅ LocalStack S3 (localhost:4566)
    ↓
Upload images:
  ✅ Compressed automatically
  ✅ Stored in LocalStack S3
  ✅ Served via proxy
    ↓
Same code works in production with real AWS! ✨
```

### Files Created

1. ✅ `docker-compose.yml` - Added LocalStack service
2. ✅ `scripts/localstack-init.sh` - Auto-initialization script
3. ✅ `backend/config/LocalStackS3Config.java` - LocalStack configuration
4. ✅ Updated `backend/.env.example` - LocalStack settings
5. ✅ Updated `backend/application.yml` - LocalStack configuration

### Configuration

```yaml
# Development with LocalStack
STORAGE_TYPE=s3
AWS_S3_LOCALSTACK_ENABLED=true
AWS_ACCESS_KEY=test
AWS_SECRET_KEY=test

# Production with Real AWS
STORAGE_TYPE=s3
AWS_S3_LOCALSTACK_ENABLED=false
AWS_ACCESS_KEY=AKIA...
AWS_SECRET_KEY=...
```

### Quick Start

```bash
# 1. Start services
docker-compose up -d

# 2. Configure backend
cd backend
cp .env.example .env
# Edit: Set AWS_S3_LOCALSTACK_ENABLED=true

# 3. Start backend
mvn spring-boot:run

# 4. Start frontend
cd ../frontend
npm run dev

# 5. Test upload
# Login → Add Product → Upload Images
# Images stored in LocalStack!

# 6. Verify
docker exec crackers-bazaar-localstack awslocal s3 ls s3://crackers-bazaar-images/temp/
```

---

**Implementation Date:** October 14, 2025  
**Status:** ✅ Complete  
**Storage Options:** 3 (Local, LocalStack S3, Real AWS S3)  
**Cost for Development:** $0 (LocalStack is free!)  
**Production Ready:** ✅ Yes  

🎉 **LocalStack S3 is now integrated for local development!**

**Now you can simulate production S3 behavior locally without any AWS costs!** 🚀

