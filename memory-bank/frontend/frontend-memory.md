# Frontend Module Memory Bank

## Overview
React TypeScript frontend for Crackers Bazaar e-commerce platform with authentication, routing, and modern UI components.

## Technology Stack
- **Framework**: React 18
- **Language**: TypeScript 4.9.5
- **Routing**: React Router DOM 7.9.3
- **HTTP Client**: Axios 1.12.2
- **Build Tool**: Create React App
- **Styling**: CSS3

## Project Structure
```
frontend/
├── src/
│   ├── components/         # React components
│   │   ├── About.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.tsx
│   ├── types/             # TypeScript definitions
│   │   ├── api.ts
│   │   └── user.ts
│   ├── App.tsx            # Main application
│   ├── App.css            # Global styles
│   ├── index.tsx          # Application entry point
│   └── index.css          # Base styles
├── public/                # Static assets
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── package.json
└── tsconfig.json
```

## Core Components

### 1. Main Application
**File**: `App.tsx`
- React Router setup with BrowserRouter
- Route configuration for all pages
- AuthProvider context wrapper
- Main layout with Header and Footer

### 2. Authentication Context
**File**: `contexts/AuthContext.tsx`
- Global authentication state management
- JWT token handling with localStorage
- Axios interceptor for automatic token attachment
- Login, register, logout functions
- User profile fetching
- Loading state management

### 3. User Type Definitions
**File**: `types/user.ts`
- Role enum: RETAILER, DASHBOARD_ADMIN, ADMIN, MANUFACTURER
- User interface with all profile fields
- LoginRequest and RegisterRequest interfaces
- JwtResponse interface
- AuthContextType interface

### 4. API Type Definitions
**File**: `types/api.ts`
- API response type definitions
- Request/response interfaces
- Error handling types

## Page Components

### 1. Home Page
**File**: `components/Home.tsx`
- Landing page with welcome message
- Navigation to other sections
- Public access (no authentication required)

### 2. About Page
**File**: `components/About.tsx`
- Information about the platform
- Company details and features
- Public access

### 3. Login Page
**File**: `components/Login.tsx`
- User authentication form
- Username and password fields
- Error handling and validation
- Demo credentials display
- Navigation to registration

### 4. Registration Page
**File**: `components/Register.tsx`
- User registration form
- Complete profile fields
- Role selection (Retailer only for self-registration)
- Form validation
- Navigation to login

### 5. Dashboard Page
**File**: `components/Dashboard.tsx`
- Protected user dashboard
- Role-based content display
- User profile information
- Navigation and logout functionality

### 6. Header Component
**File**: `components/Header.tsx`
- Navigation bar
- Authentication status display
- User role-based menu items
- Responsive design

### 7. Footer Component
**File**: `components/Footer.tsx`
- Site footer with links
- Copyright information
- Additional navigation

## Authentication System

### State Management
- **User State**: Current logged-in user data
- **Token State**: JWT token for API authentication
- **Loading State**: Authentication process status
- **Error Handling**: Login/registration error messages

### Token Management
- Automatic token storage in localStorage
- Axios interceptor for token attachment
- Token validation and refresh
- Automatic logout on token expiration

### API Integration
- Base URL: http://localhost:8080
- Authentication endpoints integration
- User profile management
- Error handling and user feedback

## Routing Configuration

### Public Routes
- `/` - Home page
- `/about` - About page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)

### Navigation
- React Router DOM for client-side routing
- Programmatic navigation
- Route protection based on authentication status

## Styling and UI

### CSS Architecture
- Global styles in `App.css` and `index.css`
- Component-specific styling
- Responsive design principles
- Modern UI components

### Form Styling
- Input field styling
- Button components
- Error message display
- Loading states
- Form validation feedback

## Development Features

### TypeScript Integration
- Strict type checking
- Interface definitions for all data structures
- Type-safe API calls
- Component prop typing

### Development Tools
- React Scripts for development server
- Hot reloading
- TypeScript compilation
- ESLint configuration

## Build Configuration

### Package.json Scripts
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

### Dependencies
- React 18 with hooks
- React Router DOM for routing
- Axios for HTTP requests
- TypeScript for type safety
- Testing libraries (Jest, React Testing Library)

## API Integration

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### User Endpoints
- `GET /api/users/profile` - Get user profile

### Error Handling
- Network error handling
- Authentication error display
- User-friendly error messages
- Loading state management

## User Experience Features

### Authentication Flow
- Seamless login/logout experience
- Automatic token management
- Session persistence
- Role-based UI rendering

### Form Validation
- Client-side validation
- Real-time error feedback
- Required field validation
- Email format validation

### Responsive Design
- Mobile-friendly interface
- Desktop optimization
- Cross-browser compatibility
- Modern UI components

## Development Workflow

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

### Environment Configuration
- Development server on port 3000
- API base URL configuration
- Environment-specific settings

## Key Features

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Session management
- Role-based access control

### User Interface
- Modern React components
- TypeScript type safety
- Responsive design
- Form validation

### API Integration
- Axios HTTP client
- Automatic token attachment
- Error handling
- Loading states

---

*Last Updated: [Current Date]*
*Module: Frontend*
*Status: Active Development*
