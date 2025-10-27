# Placeholder Images for Testing

## Image Sources Used

### 1. Lorem Picsum (Primary)
- **URL Pattern:** `https://picsum.photos/400/300?random=X`
- **Reliability:** High - Lorem Picsum is a reliable service
- **Features:** Random images, consistent sizing
- **Usage:** All product images in test data

### 2. Fallback Options

#### **Option A: Local Placeholder Images**
Create local placeholder images in `frontend/public/images/`:
```
frontend/public/images/
├── product-1.jpg
├── product-2.jpg
├── product-3.jpg
├── product-4.jpg
├── product-5.jpg
└── product-6.jpg
```

#### **Option B: Alternative CDN Services**
- **Placeholder.com:** `https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=Product+1`
- **DummyImage.com:** `https://dummyimage.com/400x300/4ECDC4/FFFFFF&text=Product+1`

### 3. Current Implementation

#### **Product Images:**
- Product 1: `https://picsum.photos/400/300?random=1`
- Product 2: `https://picsum.photos/400/300?random=2`
- Product 3: `https://picsum.photos/400/300?random=3`
- Product 4: `https://picsum.photos/400/300?random=4`
- Product 5: `https://picsum.photos/400/300?random=5`
- Product 6: `https://picsum.photos/400/300?random=6`

#### **Order Item Images:**
- Order 1 Item 1: `https://picsum.photos/400/300?random=6`
- Order 1 Item 2: `https://picsum.photos/400/300?random=5`
- Order 2 Item 1: `https://picsum.photos/400/300?random=5`
- Order 2 Item 2: `https://picsum.photos/400/300?random=6`
- Order 3 Item 1: `https://picsum.photos/400/300?random=5`
- Order 3 Item 2: `https://picsum.photos/400/300?random=6`

## Troubleshooting Image Loading

### 1. Check Network Connectivity
```bash
# Test if Picsum is accessible
curl -I https://picsum.photos/400/300?random=1
```

### 2. Browser Console Errors
- Check for CORS errors
- Check for network errors
- Check for 404 errors

### 3. Alternative Solutions

#### **Local Images (Recommended for Development)**
1. Download 6 placeholder images
2. Save them in `frontend/public/images/`
3. Update data.sql to use local paths:
   ```sql
   '["/images/product-1.jpg", "/images/product-2.jpg"]'
   ```

#### **Base64 Encoded Images**
For completely offline testing, use base64 encoded images:
```sql
'["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."]'
```

## Image Requirements

### **Dimensions:**
- **Width:** 400px
- **Height:** 300px
- **Aspect Ratio:** 4:3

### **Format:**
- **Preferred:** JPEG
- **Alternative:** PNG, WebP

### **File Size:**
- **Target:** < 100KB per image
- **Maximum:** < 500KB per image

## Testing Image Loading

### 1. Frontend Testing
```javascript
// Test image loading in browser console
const img = new Image();
img.onload = () => console.log('Image loaded successfully');
img.onerror = () => console.log('Image failed to load');
img.src = 'https://picsum.photos/400/300?random=1';
```

### 2. Network Testing
```bash
# Test multiple image URLs
for i in {1..6}; do
  echo "Testing image $i:"
  curl -I "https://picsum.photos/400/300?random=$i"
done
```

## Production Considerations

### 1. Image CDN
- Use a reliable CDN service
- Implement image optimization
- Add fallback mechanisms

### 2. Fallback Images
```javascript
// Implement fallback in React components
const handleImageError = (e) => {
  e.target.src = '/images/placeholder.jpg';
};
```

### 3. Lazy Loading
```javascript
// Implement lazy loading for better performance
<img 
  src={product.imageUrl} 
  loading="lazy"
  onError={handleImageError}
  alt={product.name}
/>
```

## Quick Fix for Development

If images are still not loading, create local placeholder images:

1. **Create directory:**
   ```bash
   mkdir -p frontend/public/images
   ```

2. **Download placeholder images:**
   ```bash
   # Download 6 placeholder images
   for i in {1..6}; do
     curl -o "frontend/public/images/product-$i.jpg" "https://picsum.photos/400/300?random=$i"
   done
   ```

3. **Update data.sql:**
   ```sql
   -- Replace all Picsum URLs with local paths
   '["/images/product-1.jpg", "/images/product-2.jpg"]'
   ```

This ensures images will always load in your local development environment!
