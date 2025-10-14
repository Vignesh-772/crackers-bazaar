#!/bin/bash

echo "Initializing LocalStack S3..."

# Wait for LocalStack to be ready
until aws --endpoint-url=http://localhost:4566 s3 ls 2>/dev/null; do
  echo "Waiting for LocalStack S3 to be ready..."
  sleep 2
done

# Create S3 bucket
echo "Creating S3 bucket: crackers-bazaar-images"
aws --endpoint-url=http://localhost:4566 s3 mb s3://crackers-bazaar-images

# Verify bucket created
echo "Verifying bucket..."
aws --endpoint-url=http://localhost:4566 s3 ls

# Create folder structure
echo "Creating folder structure..."
aws --endpoint-url=http://localhost:4566 s3api put-object \
  --bucket crackers-bazaar-images \
  --key temp/ \
  --content-length 0

aws --endpoint-url=http://localhost:4566 s3api put-object \
  --bucket crackers-bazaar-images \
  --key products/ \
  --content-length 0

echo "LocalStack S3 initialization complete!"
echo "Bucket: crackers-bazaar-images"
echo "Endpoint: http://localhost:4566"
echo "Access Key: test"
echo "Secret Key: test"

