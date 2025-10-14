# Quick Start Guide - CrackersBazaar

## 🚀 Quick Setup (5 minutes)

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Step 1: Database Setup
```bash
# Start PostgreSQL and create database
psql -U postgres
CREATE DATABASE crackers_bazaar;
\q
```

### Step 2: Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will be available at: `http://localhost:8080`

### Step 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 🧪 Testing the Integration

### 1. Create Test Users

The backend should have a DataInitializer that creates default users. If not, register through the UI:

**Register a Retailer** (can be done via UI at `/auth`):
- Username: `retailer1`
- Email: `retailer@example.com`
- Password: `password123`
- Role: RETAILER (automatically assigned)

**For Admin/Manufacturer users**, you'll need to create them via backend or database directly.

### 2. Test Authentication Flow

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Click Login**: Go to `/auth`
3. **Login with credentials**:
   - Username: Use your created user
   - Password: Your password
4. **Verify**:
   - You should be redirected to appropriate dashboard
   - Check localStorage for `token` and `user` items
   - Navbar should show your name

### 3. Test Product Browsing

1. **Navigate to Products**: Click "Products" in navbar
2. **Search**: Type in search box (notice 500ms debounce)
3. **View Details**: Click "View Details" on any product
4. **Pagination**: Try navigating pages if >12 products

### 4. Test Admin Dashboard (if you have admin access)

1. **Login as Admin**
2. **Navigate to `/admin`**
3. **View Stats**: See manufacturer statistics
4. **Filter Manufacturers**: Try different status filters
5. **Approve/Reject**: Test manufacturer approval workflow

### 5. Test Manufacturer Dashboard (if you have manufacturer access)

1. **Login as Manufacturer**
2. **Navigate to `/manufacturer`**
3. **View Products**: See your product statistics
4. **Toggle Status**: Activate/Deactivate products
5. **Check Stock Levels**: Low stock items are highlighted in red

## 📋 Default Test Data

If you have DataInitializer configured, you should have:
- Sample manufacturers
- Sample products
- Admin user

Check `backend/src/main/java/com/crackersbazaar/config/DataInitializer.java`

## 🔑 API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `GET /api/products/search/name?name={query}` - Search products
- `POST /api/auth/register` - Register new retailer
- `POST /api/auth/login` - Login

### Protected Endpoints (Auth Required)

**Manufacturer Only:**
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `PUT /api/products/{id}/toggle-status` - Toggle active status

**Admin Only:**
- `GET /api/admin/manufacturers` - List manufacturers
- `PUT /api/admin/manufacturers/{id}/verify` - Approve/reject manufacturer
- `GET /api/admin/dashboard/stats` - Dashboard statistics

## 🐛 Common Issues

### Issue: CORS Error
**Solution**: Ensure backend has CORS configuration for `http://localhost:5173`

### Issue: 401 Unauthorized
**Solution**: 
1. Check if you're logged in
2. Check localStorage for valid token
3. Try logging out and back in

### Issue: Connection Refused
**Solution**:
1. Ensure backend is running on port 8080
2. Check `.env` file in frontend has correct API URL
3. Verify no firewall blocking the connection

### Issue: Empty Product List
**Solution**:
1. Check backend logs for errors
2. Verify database has products
3. Check network tab in browser DevTools
4. Ensure products are active and have stock

### Issue: Can't Access Dashboard
**Solution**:
1. Verify you're logged in
2. Check user role matches route requirement
3. Clear localStorage and login again

## 📊 Checking Integration Status

### Check Backend Health
```bash
curl http://localhost:8080/api/health
```

### Check Frontend Build
```bash
cd frontend
npm run build
```

### View API Calls
Open browser DevTools > Network tab > Filter by "Fetch/XHR"

### Check Authentication
Browser DevTools > Application > Local Storage > `http://localhost:5173`
- Should see `token` key with JWT
- Should see `user` key with user object

## 🎯 Quick Test Checklist

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can access homepage (`/`)
- [ ] Can view products page (`/products`)
- [ ] Can search products
- [ ] Can view product details
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Token stored in localStorage
- [ ] Navbar shows user info after login
- [ ] Can access role-specific dashboard
- [ ] Protected routes block unauthorized access
- [ ] Can logout successfully

## 🎨 UI Components

The frontend uses shadcn/ui components with Tailwind CSS. All components are pre-configured and ready to use.

## 📦 Environment Configuration

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### Backend `application.yml`
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/crackers_bazaar
    username: postgres
    password: password

jwt:
  secret: mySecretKey123456789012345678901234567890
  expiration: 86400  # 24 hours
```

## 🆘 Need Help?

1. Check `FRONTEND_BACKEND_INTEGRATION.md` for detailed documentation
2. Check backend logs: `backend/logs/` or console output
3. Check browser console for frontend errors
4. Check Network tab in DevTools for API call details
5. Verify all services are running: PostgreSQL, Backend, Frontend

## 🎉 Success!

If all tests pass, you have successfully integrated the frontend with the backend! 

**Next Steps:**
- Add more products through manufacturer dashboard
- Test all CRUD operations
- Explore different user roles
- Customize the UI to match your brand
- Add additional features like orders, cart, reviews

## 📞 Support

For issues or questions:
1. Check the integration documentation
2. Review API endpoints in backend controllers
3. Check console logs for errors
4. Verify database state

