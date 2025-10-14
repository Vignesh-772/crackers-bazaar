# Frontend-Backend Integration Summary

## Overview
This document describes the complete integration between the CrackersBazaar frontend (React + TypeScript) and backend (Spring Boot) applications.

## ✅ Completed Integrations

### 1. **API Service Layer & Type Definitions**
- **Location**: `frontend/src/lib/api.ts` & `frontend/src/types/index.ts`
- **Features**:
  - Centralized Axios client with JWT token interceptors
  - Automatic token injection in request headers
  - 401 unauthorized handling (auto-logout on token expiry)
  - Comprehensive TypeScript types matching backend DTOs
  - API modules: `authApi`, `productApi`, `manufacturerApi`

### 2. **Authentication System**
- **Context**: `frontend/src/contexts/AuthContext.tsx`
- **Features**:
  - JWT-based authentication
  - Login/Register/Logout functionality
  - User state management with localStorage persistence
  - Role-based access control helpers
  - Auto-redirect based on user role after login
  - Token stored in localStorage and auto-loaded on app start

### 3. **Protected Routes**
- **Component**: `frontend/src/components/ProtectedRoute.tsx`
- **Features**:
  - Role-based route protection
  - Automatic redirect to `/auth` for unauthenticated users
  - Loading state while checking authentication
  - Prevents unauthorized access to dashboards

### 4. **Pages Integration**

#### **Auth Page** (`/auth`)
- ✅ Login with username/password
- ✅ Register new RETAILER accounts
- ✅ Form validation (password matching, minimum length)
- ✅ Error handling with toast notifications
- ✅ Auto-redirect after successful authentication

#### **Products Page** (`/products`)
- ✅ Fetches all products from backend API
- ✅ Real-time search with debouncing (500ms)
- ✅ Pagination support (12 products per page)
- ✅ Loading skeletons for better UX
- ✅ Displays product details: name, price, stock, manufacturer, category
- ✅ Featured badge for featured products
- ✅ Out of stock indicators

#### **Product Detail Page** (`/product/:id`)
- ✅ Fetches single product by ID
- ✅ Displays full product information
- ✅ Shows stock quantity
- ✅ Brand and category information
- ✅ Product tags display
- ✅ Shipping information
- ✅ Loading state and error handling
- ✅ 404 handling for non-existent products

#### **Admin Dashboard** (`/admin`)
- ✅ Protected route (ADMIN, DASHBOARD_ADMIN only)
- ✅ Real-time manufacturer statistics
- ✅ Manufacturer listing with pagination
- ✅ Status filtering (All, Pending, Approved, Active, etc.)
- ✅ Approve/Reject/Activate/Suspend manufacturers
- ✅ Verification status indicators
- ✅ Loading states and error handling

#### **Manufacturer Dashboard** (`/manufacturer`)
- ✅ Protected route (MANUFACTURER only)
- ✅ Product management interface
- ✅ Statistics: Total products, Low stock, Out of stock, Active rate
- ✅ Product listing with pagination
- ✅ Activate/Deactivate products
- ✅ Stock level indicators (red for low stock)
- ✅ Featured product badges
- ✅ Quick links to product details

#### **User Dashboard** (`/dashboard`)
- ✅ Protected route (RETAILER only)
- ✅ Mock order data (ready for order API integration)

### 5. **Enhanced Navbar**
- **Component**: `frontend/src/components/Navbar.tsx`
- **Features**:
  - Conditional rendering based on authentication state
  - User dropdown menu with profile info
  - Role-based navigation links
  - Logout functionality
  - Dynamic dashboard link based on user role

## 🔧 Configuration

### Environment Variables
Create `.env` file in `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend Configuration
Ensure backend is running on `http://localhost:8080` with the following endpoints accessible:

**Authentication**:
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`

**Products**:
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/search/name` - Search products
- `GET /api/products/manufacturer/{id}` - Get products by manufacturer
- `PUT /api/products/{id}/toggle-status` - Toggle product status
- Other CRUD operations for MANUFACTURER role

**Admin/Manufacturers**:
- `GET /api/admin/manufacturers` - Get all manufacturers
- `GET /api/admin/manufacturers/status/{status}` - Get by status
- `PUT /api/admin/manufacturers/{id}/verify` - Verify manufacturer
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 🚀 Running the Application

### 1. Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 2. Start Frontend
```bash
cd frontend
npm install  # First time only
npm run dev
```

### 3. Access Application
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## 👥 User Roles & Access

### RETAILER
- Can browse products
- Can view product details
- Can manage cart and orders
- Can access user dashboard

### MANUFACTURER
- Can view their products
- Can activate/deactivate products
- Can manage stock levels
- Can view product statistics

### ADMIN / DASHBOARD_ADMIN
- Can approve/reject manufacturers
- Can view all manufacturers
- Can manage manufacturer statuses
- Can view dashboard statistics

## 🔐 Authentication Flow

1. **Login**: 
   - User submits username/password
   - Backend validates and returns JWT token
   - Token stored in localStorage
   - User redirected to role-specific dashboard

2. **Auto-Login**:
   - On app load, check localStorage for token
   - If valid token exists, restore user session
   - No need to login again

3. **Protected Routes**:
   - Check if user is authenticated
   - Check if user has required role
   - Redirect to `/auth` if not authenticated
   - Redirect to `/` if role not allowed

4. **Logout**:
   - Clear token from localStorage
   - Clear user state
   - Redirect to login page

## 📊 Data Flow Example: Viewing Products

1. User navigates to `/products`
2. React Query fetches data from `GET /api/products`
3. Axios interceptor adds JWT token to request headers
4. Backend validates token and returns products
5. Frontend displays products with loading/error states
6. Search triggers new API call with debouncing
7. Pagination updates trigger new API calls

## 🛠️ Key Technologies

### Frontend
- **React 18**: UI framework
- **TypeScript**: Type safety
- **React Query**: Server state management
- **Axios**: HTTP client
- **React Router**: Routing
- **shadcn/ui**: UI components
- **Tailwind CSS**: Styling
- **Sonner**: Toast notifications

### Backend
- **Spring Boot**: Framework
- **Spring Security**: Authentication/Authorization
- **JWT**: Token-based auth
- **PostgreSQL**: Database
- **JPA/Hibernate**: ORM

## 🔍 Testing the Integration

### Test Authentication
1. Register a new user at `/auth`
2. Login with credentials
3. Verify JWT token in localStorage (DevTools > Application > Local Storage)
4. Check that user is redirected to appropriate dashboard

### Test Products
1. Navigate to `/products`
2. Search for products (observe debouncing)
3. Click pagination (observe API calls in Network tab)
4. Click "View Details" on any product

### Test Admin Features
1. Login as ADMIN user
2. Navigate to `/admin`
3. View manufacturer statistics
4. Filter manufacturers by status
5. Approve/Reject pending manufacturers

### Test Manufacturer Features
1. Login as MANUFACTURER user
2. Navigate to `/manufacturer`
3. View product statistics
4. Toggle product status
5. View products with pagination

## 📝 Notes

### Current Limitations
1. **Cart functionality**: Frontend UI exists but needs Order/Cart backend APIs
2. **Manufacturer ID**: ManufacturerDashboard uses hardcoded ID (needs manufacturer profile API)
3. **Image uploads**: No file upload implementation yet
4. **Reviews/Ratings**: Mock data (needs reviews API)

### Future Enhancements
1. Add Order management APIs and integrate with Cart
2. Add Manufacturer profile API to get manufacturer ID from user
3. Implement image upload functionality
4. Add reviews and ratings system
5. Add real-time notifications
6. Add analytics and reporting

## 🐛 Troubleshooting

### CORS Issues
Ensure backend has CORS configured for frontend origin:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
```

### 401 Unauthorized
- Check if JWT token is valid
- Verify token is being sent in Authorization header
- Check backend security configuration

### Network Errors
- Ensure backend is running on port 8080
- Check VITE_API_BASE_URL in `.env`
- Verify network connectivity

### Type Errors
- Ensure frontend types match backend DTOs
- Check that all required fields are included
- Verify enum values match between frontend/backend

## 📚 Code Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn components
│   │   ├── Navbar.tsx       # Navigation with auth state
│   │   └── ProtectedRoute.tsx # Route guard component
│   ├── contexts/
│   │   └── AuthContext.tsx  # Authentication context
│   ├── lib/
│   │   ├── api.ts          # API client & endpoints
│   │   └── utils.ts        # Utility functions
│   ├── pages/
│   │   ├── Auth.tsx        # Login/Register
│   │   ├── Products.tsx    # Product listing
│   │   ├── ProductDetail.tsx # Product details
│   │   ├── AdminDashboard.tsx # Admin panel
│   │   ├── ManufacturerDashboard.tsx # Manufacturer panel
│   │   └── UserDashboard.tsx # User panel
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── App.tsx             # Main app with routes
└── .env                    # Environment variables
```

## ✨ Summary

The frontend and backend are now fully integrated with:
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Product browsing and search
- ✅ Admin manufacturer management
- ✅ Manufacturer product management
- ✅ Responsive UI with loading states
- ✅ Error handling and validation
- ✅ Type-safe API calls

The application is ready for development and testing. The architecture supports easy addition of new features like order management, reviews, and advanced analytics.

