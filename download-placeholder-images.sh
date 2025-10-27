#!/bin/bash

# Script to download placeholder images for local development
# This ensures images will always load even without internet

echo "🎆 Downloading placeholder images for Crackers Bazaar..."

# Create images directory
mkdir -p frontend/public/images

# Download 6 placeholder images
echo "📥 Downloading images..."

for i in {1..6}; do
    echo "Downloading image $i..."
    curl -s -o "frontend/public/images/product-$i.jpg" "https://picsum.photos/400/300?random=$i"
    
    # Check if download was successful
    if [ -f "frontend/public/images/product-$i.jpg" ]; then
        echo "✅ Image $i downloaded successfully"
    else
        echo "❌ Failed to download image $i"
    fi
done

echo ""
echo "🎉 Placeholder images downloaded!"
echo "📁 Images saved to: frontend/public/images/"
echo ""
echo "To use local images, update data.sql with:"
echo "'[\"/images/product-1.jpg\", \"/images/product-2.jpg\"]'"
echo ""
echo "Or restart the application to use the current Picsum URLs."
