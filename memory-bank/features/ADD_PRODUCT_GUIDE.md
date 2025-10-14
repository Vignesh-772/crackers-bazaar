# Add Product Feature Guide

## Overview
The Add Product feature allows manufacturers to add new products to their catalog with a comprehensive multi-step form that captures all product details.

## Features

### 🎯 Multi-Step Form
The form is divided into four logical sections for better organization:
1. **Basic** - Essential product information
2. **Inventory** - Stock management and settings
3. **Details** - Physical specifications and identifiers
4. **Additional** - Policies and extra information

### ✅ Validation
- **Real-time validation** with immediate feedback
- **Required field validation**:
  - Product name (max 200 characters)
  - Price (must be greater than 0)
  - Category (predefined list)
  - Stock quantity (cannot be negative)
- **Order quantity validation**:
  - Min order >= 1
  - Max order >= Min order
- **Character limits** on all text fields
- **Number validation** for prices and quantities

### 🔄 State Management
- Form state persists across tabs
- Validation errors displayed inline
- Loading states during submission
- Success/error notifications with toast
- Image URL management (add/remove)

### 🎨 User Experience
- **4-tab interface** for organized data entry
- **Responsive design** - Works on all screen sizes
- **Switch toggles** for active/featured status
- **Image URL manager** - Add multiple product images
- **Category dropdown** - Predefined crackers categories
- **Character counters** for text fields
- **Previous/Next navigation** - Smooth tab switching

## Form Fields

### Basic Tab

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Product Name | Text | Yes | Max 200 characters |
| Description | Textarea | No | Max 1000 characters with counter |
| Price (₹) | Number | Yes | Must be > 0 |
| Brand | Text | No | Max 100 characters |
| Category | Dropdown | Yes | From predefined list |
| Subcategory | Text | No | Free text |

**Predefined Categories:**
- Sparklers
- Fountains
- Rockets
- Ground Items
- Flower Pots
- Chakkar
- Aerial Items
- Combo Packs
- Gift Boxes
- Other

### Inventory Tab

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Stock Quantity | Number | Yes | Cannot be negative |
| Min Order Quantity | Number | No | Default: 1, Min: 1 |
| Max Order Quantity | Number | No | Default: 100, Must be >= Min |
| Active Product | Switch | No | Default: true |
| Featured Product | Switch | No | Default: false |
| Product Images | URL List | No | Multiple URLs supported |

**Image Management:**
- Add multiple image URLs
- Press Enter or click "Add" to add URL
- Remove any added URL with X button
- URLs displayed in list format

### Details Tab

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Weight (kg) | Number | No | Must be >= 0 |
| Dimensions | Text | No | Format: LxWxH, Max 100 chars |
| Color | Text | No | Max 50 characters |
| Material | Text | No | Max 100 characters |
| Model Number | Text | No | Max 50 characters |
| SKU | Text | No | Max 50 characters |
| Barcode | Text | No | Max 50 characters |
| Tags | Text | No | Comma separated, Max 500 chars |

### Additional Tab

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Warranty Period | Text | No | Max 100 characters |
| Return Policy | Textarea | No | Max 500 characters |
| Shipping Info | Textarea | No | Max 500 characters |

## Usage

### For Manufacturer Users

1. **Navigate to Manufacturer Dashboard**
   ```
   /manufacturer
   ```

2. **Click "Add Product" Button**
   - Located at the top-right of the dashboard
   - Opens the multi-step form dialog

3. **Fill Basic Information** (Tab 1)
   - Enter product name (required)
   - Add detailed description
   - Set price in rupees (required)
   - Add brand name
   - Select category (required)
   - Add subcategory if applicable
   - Click "Next"

4. **Configure Inventory** (Tab 2)
   - Set stock quantity (required)
   - Configure min/max order quantities
   - Toggle active/featured status
   - Add product image URLs
   - Click "Next"

5. **Add Product Details** (Tab 3)
   - Enter weight and dimensions
   - Specify color and material
   - Add model number, SKU, barcode
   - Add search tags
   - Click "Next"

6. **Additional Information** (Tab 4)
   - Add warranty information
   - Specify return policy
   - Add shipping information
   - Click "Add Product"

7. **Success**
   - Toast notification confirms success
   - Dialog closes automatically
   - Product list refreshes
   - Statistics update

### Error Handling

**Common Errors:**

1. **Missing Required Fields**
   - Error: Field-specific error messages
   - Solution: Fill all required fields (marked with *)

2. **Invalid Price**
   - Error: "Price must be greater than 0"
   - Solution: Enter a positive price value

3. **Invalid Order Quantities**
   - Error: "Maximum must be greater than minimum"
   - Solution: Ensure max order > min order

4. **Network Errors**
   - Error: "Failed to add product"
   - Solution: Check backend connection and try again

5. **Validation Errors**
   - Toast: "Please fix all form errors"
   - Solution: Review and fix all inline errors

## Backend Integration

### API Endpoint
```
POST /api/products
```

### Authentication
Requires JWT token with MANUFACTURER role

### Request Body
```json
{
  "name": "Deluxe Sparklers Box",
  "description": "Premium quality sparklers perfect for celebrations...",
  "price": 299.00,
  "category": "Sparklers",
  "subcategory": "Premium",
  "stockQuantity": 100,
  "minOrderQuantity": 1,
  "maxOrderQuantity": 50,
  "weight": 0.5,
  "dimensions": "10x5x15 cm",
  "color": "Golden",
  "material": "Gunpowder, Paper",
  "brand": "ABC Crackers",
  "modelNumber": "SPK-001",
  "sku": "ABC-SPK-001",
  "barcode": "123456789012",
  "isActive": true,
  "isFeatured": false,
  "tags": "festive, diwali, celebration",
  "warrantyPeriod": "30 days replacement",
  "returnPolicy": "Returns accepted within 7 days",
  "shippingInfo": "Free shipping on orders above ₹500",
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}
```

### Response (Success)
```json
{
  "id": 123,
  "name": "Deluxe Sparklers Box",
  "price": 299.00,
  "category": "Sparklers",
  "stockQuantity": 100,
  "isActive": true,
  "isFeatured": false,
  "manufacturerId": 1,
  "manufacturerName": "ABC Crackers Ltd",
  "createdAt": "2025-10-14T10:30:00",
  ...
}
```

### Response (Error)
```json
{
  "error": "Product name is required"
}
```

## Component Architecture

### File Structure
```
frontend/src/
├── components/
│   └── AddProductDialog.tsx        # Main dialog component (600+ lines)
├── pages/
│   └── ManufacturerDashboard.tsx   # Integrates the dialog
├── lib/
│   └── api.ts                      # API call: productApi.createProduct
└── types/
    └── index.ts                    # ProductRequest interface
```

### Component Props
```typescript
// AddProductDialog has no props
// It's a self-contained dialog component
<AddProductDialog />
```

### State Management
```typescript
const [open, setOpen] = useState(false);              // Dialog visibility
const [currentTab, setCurrentTab] = useState("basic"); // Current tab
const [formData, setFormData] = useState<ProductRequest>({...}); // Form data
const [imageUrlInput, setImageUrlInput] = useState(""); // Image URL input
const [errors, setErrors] = useState<Record<string, string>>({}); // Validation errors
```

## Workflow Diagram

```
┌─────────────────────────────────────────────┐
│      Manufacturer Dashboard                  │
│  ┌────────────────────────────────────┐    │
│  │  [Add Product] Button              │    │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ Click
                   ▼
┌─────────────────────────────────────────────┐
│     Add Product Dialog                      │
│  ┌────────────────────────────────────┐    │
│  │ Tab 1: Basic Information           │    │
│  │  - Product Name *                  │    │
│  │  - Description                     │    │
│  │  - Price *                         │    │
│  │  - Brand                           │    │
│  │  - Category *                      │    │
│  │  - Subcategory                     │    │
│  │                    [Cancel] [Next] │    │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ Next
                   ▼
┌─────────────────────────────────────────────┐
│  ┌────────────────────────────────────┐    │
│  │ Tab 2: Inventory                   │    │
│  │  - Stock Quantity *                │    │
│  │  - Min/Max Order Qty               │    │
│  │  - Active/Featured Toggles         │    │
│  │  - Image URLs                      │    │
│  │            [Previous] [Cancel] [Next]   │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ Next
                   ▼
┌─────────────────────────────────────────────┐
│  ┌────────────────────────────────────┐    │
│  │ Tab 3: Details                     │    │
│  │  - Weight & Dimensions             │    │
│  │  - Color & Material                │    │
│  │  - Model/SKU/Barcode               │    │
│  │  - Tags                            │    │
│  │            [Previous] [Cancel] [Next]   │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ Next
                   ▼
┌─────────────────────────────────────────────┐
│  ┌────────────────────────────────────┐    │
│  │ Tab 4: Additional Info             │    │
│  │  - Warranty Period                 │    │
│  │  - Return Policy                   │    │
│  │  - Shipping Info                   │    │
│  │  [Previous] [Cancel] [Add Product] │    │
│  └────────────────────────────────────┘    │
└──────────────────┬──────────────────────────┘
                   │ Submit
                   ▼
┌─────────────────────────────────────────────┐
│          Validation Check                   │
│  ┌────────────────────────────────────┐    │
│  │ All required fields valid?         │    │
│  └────────────────────────────────────┘    │
└──────┬──────────────────────────┬───────────┘
       │ No                       │ Yes
       ▼                          ▼
┌─────────────┐      ┌──────────────────────────┐
│ Show Errors │      │  POST /api/products      │
│ Toast       │      │  (with JWT token)        │
└─────────────┘      └──────────┬───────────────┘
                                │
                     ┌──────────┴──────────┐
                     │ Success            │ Error
                     ▼                    ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ Success Toast    │  │ Error Toast      │
          │ Close Dialog     │  │ Keep Dialog Open │
          │ Refresh List     │  │ Show Error       │
          │ Update Stats     │  └──────────────────┘
          └──────────────────┘
```

## Testing

### Manual Testing Checklist

**Basic Form Functionality:**
- [ ] Dialog opens on button click
- [ ] All 4 tabs are accessible
- [ ] Form fields are editable
- [ ] Previous/Next navigation works
- [ ] Cancel button closes dialog and resets
- [ ] Dialog closes on successful submission

**Validation Testing:**
- [ ] Empty product name shows error
- [ ] Zero/negative price shows error
- [ ] Empty category shows error
- [ ] Negative stock shows error
- [ ] Max < Min order quantity shows error
- [ ] Errors clear when user types
- [ ] Character counters work correctly

**Feature Testing:**
- [ ] Category dropdown shows all options
- [ ] Active switch toggles correctly
- [ ] Featured switch toggles correctly
- [ ] Image URLs can be added
- [ ] Image URLs can be removed
- [ ] Enter key adds image URL
- [ ] Multiple images supported

**Integration Testing:**
- [ ] Product is created in backend
- [ ] Product appears with manufacturer ID
- [ ] Success toast appears
- [ ] Product list refreshes
- [ ] Statistics update
- [ ] New product appears in table
- [ ] Stock quantity displayed correctly

**Error Testing:**
- [ ] Network errors handled gracefully
- [ ] Backend validation errors display
- [ ] Invalid data rejected
- [ ] Character limits enforced

### Test Data

**Minimal Valid Data:**
```javascript
{
  name: "Test Sparklers",
  price: 99,
  category: "Sparklers",
  stockQuantity: 50
}
```

**Complete Valid Data:**
```javascript
{
  name: "Premium Sparklers Box",
  description: "High quality sparklers for celebrations",
  price: 299,
  brand: "ABC Crackers",
  category: "Sparklers",
  subcategory: "Premium",
  stockQuantity: 100,
  minOrderQuantity: 1,
  maxOrderQuantity: 50,
  weight: 0.5,
  dimensions: "10x5x15 cm",
  color: "Golden",
  material: "Gunpowder, Paper",
  modelNumber: "SPK-001",
  sku: "ABC-SPK-001",
  barcode: "123456789012",
  isActive: true,
  isFeatured: false,
  tags: "festive, diwali, celebration",
  warrantyPeriod: "30 days",
  returnPolicy: "7 days return",
  shippingInfo: "Ships in 2-3 days",
  imageUrls: ["https://example.com/image1.jpg"]
}
```

## UI/UX Highlights

### Visual Features
- **Clean tabbed interface** for organized data entry
- **Color-coded fields** - Required fields marked with *
- **Switch toggles** for boolean values
- **Character counters** for text fields with limits
- **Image URL manager** with add/remove functionality
- **Responsive grid layout** for form fields
- **Loading spinner** during submission
- **Toast notifications** for feedback

### Accessibility
- **Keyboard navigation** fully supported
- **Tab key** moves between fields
- **Enter key** submits image URLs
- **Screen reader friendly** labels
- **Focus management** within dialog
- **Error messages** associated with fields

### Performance
- **Efficient re-renders** with proper state management
- **Optimized validation** checks
- **Query cache invalidation** for immediate updates
- **Lazy validation** - only on submit/blur
- **Minimal API calls**

## Best Practices

### For Manufacturers

1. **Fill All Required Fields**
   - Product Name, Price, Category, Stock are mandatory
   - Other fields enhance product discoverability

2. **Write Clear Descriptions**
   - Use 1000 characters wisely
   - Mention key features and benefits
   - Use proper grammar and formatting

3. **Add Multiple Images**
   - First image is the primary display image
   - Add 3-5 images for better customer experience
   - Use high-quality image URLs

4. **Use Relevant Tags**
   - Add comma-separated tags
   - Include: occasion, features, type
   - Example: "diwali, premium, golden, bright"

5. **Set Realistic Stock**
   - Keep stock levels updated
   - Set appropriate min/max order quantities
   - Mark as inactive if out of stock

6. **Provide Complete Policies**
   - Clear warranty information
   - Detailed return policy
   - Accurate shipping details

## Future Enhancements

### Potential Improvements

1. **Image Upload**
   - Direct file upload instead of URLs
   - Image cropping and resizing
   - Multiple image upload at once
   - Image preview before submission

2. **Rich Text Editor**
   - Formatted product descriptions
   - Bullet points and lists
   - Bold, italic, underline text

3. **Advanced Features**
   - Product variations (size, color, etc.)
   - Bulk product import (CSV/Excel)
   - Product templates for quick creation
   - Duplicate product feature

4. **Enhanced Validation**
   - Real-time SKU uniqueness check
   - Barcode format validation
   - Image URL validation (check if image exists)
   - Price comparison with similar products

5. **Better UX**
   - Auto-save draft
   - Form progress indicator
   - Quick add mode (minimal fields)
   - Product preview before submission

## Security Considerations

1. **Authentication Required**
   - Only MANUFACTURER role can add products
   - JWT token verified on backend
   - Protected route on frontend

2. **Data Validation**
   - Frontend validation for UX
   - Backend validation for security
   - SQL injection prevention
   - XSS protection

3. **Input Sanitization**
   - HTML tags stripped from text
   - Special characters handled
   - Maximum length enforced
   - Number validation

4. **Authorization**
   - Product linked to authenticated manufacturer
   - Cannot add products for other manufacturers
   - Manufacturer ID from backend session

## Troubleshooting

### Issue: Dialog doesn't open
**Solution:** 
- Check if component is imported
- Verify ManufacturerDashboard renders it
- Check browser console for errors

### Issue: Form submission fails
**Solution:**
- Verify backend is running
- Check JWT token in localStorage
- Ensure all required fields filled
- Check network tab for errors

### Issue: Images don't add
**Solution:**
- Ensure URL format is correct
- Press Enter or click Add button
- Check if imageUrls array updating

### Issue: Validation errors persist
**Solution:**
- Check handleChange function
- Verify error state management
- Ensure validation logic correct

### Issue: Product list doesn't refresh
**Solution:**
- Check React Query cache invalidation
- Verify queryKey matches
- Check network for API response

## Summary

The Add Product feature provides manufacturers with a comprehensive, intuitive interface to add products to their catalog. With organized tabs, extensive validation, and seamless backend integration, it ensures high data quality while maintaining excellent user experience.

**Key Benefits:**
- ✅ Organized 4-tab interface
- ✅ Comprehensive field coverage
- ✅ Real-time validation
- ✅ Image URL management
- ✅ Active/Featured toggles
- ✅ Character counters
- ✅ Mobile responsive
- ✅ Professional UX
- ✅ Production ready

The feature is fully functional and ready for production use, with room for future enhancements like image upload and bulk import capabilities.

