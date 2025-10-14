# S3 Setup Quickstart Guide

## 🚀 Quick Setup (10 minutes)

### Prerequisites
- AWS Account
- AWS CLI installed
- Backend application ready

## Step-by-Step Setup

### 1. Create S3 Bucket (2 minutes)

```bash
# Login to AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json

# Create S3 bucket
aws s3 mb s3://crackers-bazaar-images --region us-east-1

# Verify bucket created
aws s3 ls
# Should show: crackers-bazaar-images
```

**Or use AWS Console:**
1. Go to https://console.aws.amazon.com/s3
2. Click "Create bucket"
3. Bucket name: `crackers-bazaar-images`
4. Region: `us-east-1`
5. **Block all public access**: ✅ Keep checked (important!)
6. Click "Create bucket"

### 2. Create IAM User (3 minutes)

```bash
# Using AWS CLI
aws iam create-user --user-name crackers-bazaar-app

# Create access key
aws iam create-access-key --user-name crackers-bazaar-app
```

**Or use AWS Console:**
1. Go to https://console.aws.amazon.com/iam
2. Click "Users" → "Create user"
3. Username: `crackers-bazaar-app`
4. Click "Next"
5. Select "Attach policies directly"
6. Click "Create policy" (see below)
7. After policy created, attach it
8. Create user
9. Go to "Security credentials"
10. Click "Create access key"
11. Choose "Application running on AWS compute service"
12. **Save the Access Key ID and Secret Access Key!**

### 3. Create IAM Policy (2 minutes)

**Policy Name:** `CrackersBazaarS3Access`

**Policy JSON:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::crackers-bazaar-images",
        "arn:aws:s3:::crackers-bazaar-images/*"
      ]
    }
  ]
}
```

**Using AWS CLI:**
```bash
# Save policy to file: s3-policy.json
# Then create:
aws iam create-policy \
  --policy-name CrackersBazaarS3Access \
  --policy-document file://s3-policy.json

# Attach to user
aws iam attach-user-policy \
  --user-name crackers-bazaar-app \
  --policy-arn arn:aws:iam::YOUR-ACCOUNT-ID:policy/CrackersBazaarS3Access
```

### 4. Configure Backend (2 minutes)

**Create/Update `.env` file in backend directory:**

```bash
# Copy from example
cp .env.example .env

# Edit .env file
nano .env
```

**Set these values:**
```bash
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=AKIA... # Your access key
AWS_SECRET_KEY=... # Your secret key
```

### 5. Test the Setup (1 minute)

```bash
# Start backend
cd backend
mvn spring-boot:run

# Check logs - should see:
# "S3Client configured for bucket: crackers-bazaar-images"
# "Static file serving configured"

# Test S3 connection
curl -X POST http://localhost:8080/api/upload/temp-image \
  -H "Authorization: Bearer {your-jwt-token}" \
  -F "file=@test-image.jpg"

# Response should include:
# {
#   "message": "Image uploaded to S3 successfully",
#   "url": "/api/images?key=temp/uuid-xxx.jpg",
#   "storageType": "s3"
# }

# Verify in S3
aws s3 ls s3://crackers-bazaar-images/temp/
# Should show the uploaded file
```

## 🔧 Configuration Options

### Use Local Storage (Development)

```yaml
# In application.yml or .env
STORAGE_TYPE=local
```

**Benefits:**
- No AWS account needed
- No costs
- Faster for local testing
- Simpler setup

### Use S3 Storage (Production)

```yaml
# In application.yml or .env
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=your-key
AWS_SECRET_KEY=your-secret
```

**Benefits:**
- Scalable storage
- No disk space limits
- Automatic backups
- Production-ready

## 🎯 Verification Checklist

- [ ] S3 bucket created
- [ ] Bucket is private (not public)
- [ ] IAM user created
- [ ] IAM policy attached
- [ ] Access key generated
- [ ] Secret key saved securely
- [ ] .env file configured
- [ ] Backend starts without errors
- [ ] Can upload image via API
- [ ] Image appears in S3 bucket
- [ ] Image accessible via proxy URL
- [ ] Compression working (check logs)
- [ ] Frontend can display images

## 🚨 Troubleshooting

### Issue: "Access Denied" when uploading

**Solution:**
```bash
# Check IAM policy is attached
aws iam list-attached-user-policies --user-name crackers-bazaar-app

# Verify bucket exists
aws s3 ls s3://crackers-bazaar-images

# Test credentials
aws s3 ls --profile default
```

### Issue: Backend can't connect to S3

**Solution:**
```bash
# Verify credentials in .env
cat backend/.env | grep AWS

# Test AWS CLI with same credentials
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
aws s3 ls

# Check region matches
echo $AWS_S3_REGION
```

### Issue: Images not displaying

**Solution:**
```bash
# Test proxy endpoint directly
curl http://localhost:8080/api/images?key=temp/test.jpg

# Check if image exists in S3
aws s3 ls s3://crackers-bazaar-images/temp/

# Verify proxy controller is loaded
curl http://localhost:8080/api/images/health
```

### Issue: Compression not working

**Solution:**
```bash
# Check thumbnailator dependency
mvn dependency:tree | grep thumbnailator

# Verify compression settings
cat application.yml | grep -A 5 "upload:"

# Check logs for compression messages
tail -f logs/app.log | grep "compressed"
```

## 💡 Pro Tips

### 1. **Use IAM Roles** (Production)
Instead of access keys, use IAM roles:
- More secure
- Automatic credential rotation
- No keys to manage

### 2. **Enable S3 Versioning**
```bash
aws s3api put-bucket-versioning \
  --bucket crackers-bazaar-images \
  --versioning-configuration Status=Enabled
```
Benefits: Accidental delete recovery

### 3. **Set Lifecycle Rules**
```bash
# Auto-delete temp files after 7 days
# Move old images to Glacier after 90 days
```

### 4. **Add CloudFront**
- Global CDN
- Faster delivery
- Lower bandwidth costs
- Easy to add later

### 5. **Enable Encryption**
```bash
aws s3api put-bucket-encryption \
  --bucket crackers-bazaar-images \
  --server-side-encryption-configuration \
  '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
```

## 📋 Quick Reference

### Environment Variables
```bash
STORAGE_TYPE=s3
AWS_S3_BUCKET_NAME=crackers-bazaar-images
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY=AKIA...
AWS_SECRET_KEY=...
```

### API Endpoints
```
POST /api/upload/temp-image        # Upload temp image
POST /api/upload/product-images    # Upload product images
GET  /api/images?key={s3Key}       # Get image via proxy
DELETE /api/upload/image           # Delete image
```

### AWS Commands
```bash
# List files
aws s3 ls s3://crackers-bazaar-images/temp/

# Check bucket size
aws s3 ls --summarize --human-readable --recursive \
  s3://crackers-bazaar-images

# Download image (for debugging)
aws s3 cp s3://crackers-bazaar-images/temp/test.jpg ./
```

## ✅ Success!

If all steps completed successfully, you now have:
- ✅ S3 bucket for image storage
- ✅ IAM user with proper permissions
- ✅ Backend configured for S3
- ✅ Automatic compression working
- ✅ Proxy delivery functional
- ✅ Images secure and private

**Next:** Upload a product image and watch it compress and store in S3! 🎉

---

**Setup Time:** ~10 minutes  
**Difficulty:** Easy  
**AWS Cost:** ~$1-2/month for small scale  
**Status:** ✅ Production Ready

