# Admin Module Memory Bank

## Overview
Comprehensive admin module for Crackers Bazaar platform enabling manufacturer onboarding, management, and verification workflows. Built with Spring Boot backend and React TypeScript frontend.

## Module Purpose
- **Manufacturer Onboarding**: Complete manufacturer registration and profile management
- **Verification Workflow**: Admin approval process for manufacturer applications
- **Dashboard Analytics**: Statistics and insights for admin users
- **Role-Based Access**: Secure admin-only operations

## Backend Implementation

### Core Entities

#### Manufacturer Entity
**File**: `backend/src/main/java/com/crackersbazaar/entity/Manufacturer.java`
- **Primary Fields**: id, companyName, contactPerson, email, phoneNumber
- **Address Fields**: address, city, state, pincode, country
- **Business Fields**: gstNumber, panNumber, licenseNumber, licenseValidity
- **Status Fields**: status, verified, verificationNotes, verifiedBy, verifiedAt
- **Timestamps**: createdAt, updatedAt
- **Validation**: Comprehensive validation annotations for data integrity

#### Manufacturer Status Enum
**File**: `backend/src/main/java/com/crackersbazaar/entity/ManufacturerStatus.java`
- **Statuses**: PENDING, APPROVED, REJECTED, SUSPENDED, ACTIVE, INACTIVE
- **Lifecycle Management**: Complete manufacturer status workflow

### Data Transfer Objects

#### ManufacturerRequest
**File**: `backend/src/main/java/com/crackersbazaar/dto/ManufacturerRequest.java`
- Input validation for manufacturer creation
- Required fields: companyName, contactPerson, email, phoneNumber, address, city, state, pincode, country
- Optional fields: gstNumber, panNumber, licenseNumber, licenseValidity
- Comprehensive validation annotations

#### ManufacturerResponse
**File**: `backend/src/main/java/com/crackersbazaar/dto/ManufacturerResponse.java`
- Complete manufacturer data for API responses
- Constructor from Manufacturer entity
- All fields including status and verification information

#### ManufacturerVerificationRequest
**File**: `backend/src/main/java/com/crackersbazaar/dto/ManufacturerVerificationRequest.java`
- Admin verification workflow
- Status update and verification notes
- Required for approval/rejection process

### Repository Layer

#### ManufacturerRepository
**File**: `backend/src/main/java/com/crackersbazaar/repository/ManufacturerRepository.java`
- **Custom Queries**: Search by company name, city, state
- **Status Filtering**: Find manufacturers by status
- **Pagination Support**: Pageable queries for large datasets
- **Statistics Queries**: Count by status and verification status
- **Email Uniqueness**: Check for duplicate manufacturer emails

### Service Layer

#### ManufacturerService
**File**: `backend/src/main/java/com/crackersbazaar/service/ManufacturerService.java`
- **CRUD Operations**: Create, read, update, delete manufacturers
- **Validation Logic**: Email uniqueness, data validation
- **Status Management**: Manufacturer status workflow
- **Search Functionality**: Company name, city, state searches
- **Verification Process**: Admin verification with notes and status updates
- **Statistics Generation**: Dashboard statistics and counts

### Controller Layer

#### AdminController
**File**: `backend/src/main/java/com/crackersbazaar/controller/AdminController.java`
- **Manufacturer Management**:
  - `POST /api/admin/manufacturers` - Create manufacturer
  - `GET /api/admin/manufacturers` - Get all manufacturers (paginated)
  - `GET /api/admin/manufacturers/{id}` - Get manufacturer by ID
  - `PUT /api/admin/manufacturers/{id}` - Update manufacturer
  - `DELETE /api/admin/manufacturers/{id}` - Delete manufacturer
- **Search and Filtering**:
  - `GET /api/admin/manufacturers/status/{status}` - Filter by status
  - `GET /api/admin/manufacturers/search/company` - Search by company name
  - `GET /api/admin/manufacturers/search/city` - Filter by city
  - `GET /api/admin/manufacturers/search/state` - Filter by state
- **Verification Workflow**:
  - `PUT /api/admin/manufacturers/{id}/verify` - Verify manufacturer
- **Dashboard Analytics**:
  - `GET /api/admin/dashboard/stats` - Get statistics
  - `GET /api/admin/dashboard/pending-approvals` - Get pending approvals
- **Security**: Role-based access control (ADMIN, DASHBOARD_ADMIN only)

### Security Configuration
**File**: `backend/src/main/java/com/crackersbazaar/config/SecurityConfig.java`
- **Admin Endpoints**: Protected with `hasAnyRole("ADMIN", "DASHBOARD_ADMIN")`
- **JWT Authentication**: Required for all admin operations
- **CORS Configuration**: Frontend integration support

## Frontend Implementation

### Type Definitions

#### Manufacturer Types
**File**: `frontend/src/types/manufacturer.ts`
- **ManufacturerStatus**: Enum matching backend statuses
- **Manufacturer**: Complete manufacturer interface
- **ManufacturerRequest**: Form data interface
- **ManufacturerVerificationRequest**: Verification form interface
- **DashboardStats**: Statistics interface

### Core Components

#### AdminDashboard
**File**: `frontend/src/components/AdminDashboard.tsx`
- **Role-Based Access**: ADMIN and DASHBOARD_ADMIN only
- **Tabbed Interface**: Dashboard, Manufacturers, Add Manufacturer, Pending Approvals
- **Statistics Display**: Real-time dashboard statistics
- **Navigation**: Seamless tab switching
- **Responsive Design**: Mobile-friendly interface

#### ManufacturerList
**File**: `frontend/src/components/ManufacturerList.tsx`
- **Pagination**: Handle large manufacturer datasets
- **Search Functionality**: Company name search
- **Status Filtering**: Filter by manufacturer status
- **Card Display**: Manufacturer information cards
- **Action Buttons**: View and edit capabilities

#### ManufacturerForm
**File**: `frontend/src/components/ManufacturerForm.tsx`
- **Complete Form**: All manufacturer fields
- **Validation**: Client-side form validation
- **Business Information**: GST, PAN, License fields
- **Success Handling**: Form submission feedback
- **Navigation**: Automatic redirect after success

#### ManufacturerVerification
**File**: `frontend/src/components/ManufacturerVerification.tsx`
- **Pending Approvals**: Display manufacturers awaiting verification
- **Detailed View**: Complete manufacturer information
- **Verification Form**: Status update and notes
- **Approval Workflow**: Approve/reject/suspend options
- **Real-time Updates**: Refresh after verification

### Styling

#### AdminDashboard.css
- **Modern Design**: Gradient headers and card layouts
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Interactive Elements**: Hover effects and transitions
- **Status Badges**: Color-coded status indicators
- **Form Styling**: Professional form design

#### ManufacturerList.css
- **Card Layout**: Clean manufacturer information display
- **Search Interface**: Intuitive search and filter controls
- **Pagination**: User-friendly pagination controls
- **Status Indicators**: Visual status representation
- **Action Buttons**: Clear call-to-action buttons

#### ManufacturerForm.css
- **Sectioned Layout**: Organized form sections
- **Validation Styling**: Error and success message styling
- **Responsive Design**: Mobile-optimized form layout
- **Professional Appearance**: Business-appropriate styling

#### ManufacturerVerification.css
- **Split Layout**: List and detail view side-by-side
- **Verification Panel**: Dedicated verification interface
- **Status Management**: Clear status update controls
- **Information Display**: Comprehensive manufacturer details

## API Endpoints Summary

### Manufacturer Management
- `POST /api/admin/manufacturers` - Create manufacturer
- `GET /api/admin/manufacturers` - List manufacturers (paginated)
- `GET /api/admin/manufacturers/{id}` - Get manufacturer details
- `PUT /api/admin/manufacturers/{id}` - Update manufacturer
- `DELETE /api/admin/manufacturers/{id}` - Delete manufacturer

### Search and Filtering
- `GET /api/admin/manufacturers/status/{status}` - Filter by status
- `GET /api/admin/manufacturers/search/company` - Search by company
- `GET /api/admin/manufacturers/search/city` - Filter by city
- `GET /api/admin/manufacturers/search/state` - Filter by state

### Verification Workflow
- `PUT /api/admin/manufacturers/{id}/verify` - Verify manufacturer
- Headers: `X-Admin-Id` for verification tracking

### Dashboard Analytics
- `GET /api/admin/dashboard/stats` - Get statistics
- `GET /api/admin/dashboard/pending-approvals` - Get pending approvals

## Security Features

### Authentication
- JWT token-based authentication required
- Role-based access control
- Admin-only endpoint protection

### Authorization
- ADMIN and DASHBOARD_ADMIN roles only
- Verification tracking with admin ID
- Secure manufacturer data handling

### Data Protection
- Input validation on all endpoints
- SQL injection prevention via JPA
- XSS protection through proper encoding

## Workflow Process

### Manufacturer Onboarding
1. **Admin Creates Manufacturer**: Complete manufacturer profile
2. **Initial Status**: Set to PENDING
3. **Verification Required**: Admin review process
4. **Status Update**: APPROVED, REJECTED, or SUSPENDED
5. **Active Status**: Move to ACTIVE after approval

### Verification Process
1. **Pending Review**: Manufacturers awaiting verification
2. **Admin Review**: Detailed manufacturer information
3. **Status Decision**: Approve, reject, or suspend
4. **Verification Notes**: Admin comments and reasoning
5. **Status Update**: Final status assignment

### Dashboard Analytics
1. **Real-time Statistics**: Count by status and verification
2. **Pending Alerts**: Manufacturers requiring attention
3. **Status Distribution**: Overview of manufacturer statuses
4. **Verification Tracking**: Admin verification history

## Key Features

### Backend Features
- Complete manufacturer lifecycle management
- Comprehensive validation and error handling
- Role-based security and access control
- Search and filtering capabilities
- Dashboard statistics and analytics
- Verification workflow with audit trail

### Frontend Features
- Intuitive admin dashboard interface
- Real-time statistics and analytics
- Comprehensive manufacturer management
- Search and filtering capabilities
- Responsive design for all devices
- Role-based access control

### Integration Features
- Seamless backend-frontend communication
- JWT authentication integration
- Real-time data updates
- Error handling and user feedback
- Mobile-responsive design

## Development Notes

### Database Schema
- Manufacturer table with comprehensive fields
- Status tracking and verification fields
- Audit trail with timestamps
- Foreign key relationships for verification

### Performance Considerations
- Pagination for large datasets
- Efficient search and filtering
- Database indexing for performance
- Caching for dashboard statistics

### Scalability Features
- Role-based access control
- Modular component design
- RESTful API architecture
- Responsive frontend design

---

*Last Updated: [Current Date]*
*Module: Admin*
*Status: Complete Implementation*
*Components: Backend + Frontend*
