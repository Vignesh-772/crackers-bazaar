import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component that validates authentication and role-based access
 * Automatically validates token on mount and redirects if invalid
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireAuth = true,
}) => {
  const { user, isAuthenticated, isLoading, validateToken } = useAuth();
  const location = useLocation();
  
  // Store the current location for redirect after login
  useEffect(() => {
    if (requireAuth && !isAuthenticated && location.pathname !== '/auth') {
      sessionStorage.setItem('authRedirect', location.pathname);
    }
  }, [requireAuth, isAuthenticated, location.pathname]);

  // Show loading spinner while validating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have required role
  if (isAuthenticated && allowedRoles && user) {
    const hasRequiredRole = allowedRoles.includes(user.role);
    if (!hasRequiredRole) {
      // Redirect based on user role
      switch (user.role) {
        case 'ADMIN':
        case 'DASHBOARD_ADMIN':
          return <Navigate to="/admin" replace />;
        case 'MANUFACTURER':
          return <Navigate to="/manufacturer" replace />;
        case 'RETAILER':
          return <Navigate to="/dashboard" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return <>{children}</>;
};

/**
 * Higher-order component for protecting routes
 */
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: Role[]
) => {
  return (props: P) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

/**
 * Hook for checking if current user can access a route
 */
export const useCanAccess = (allowedRoles?: Role[]): boolean => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated || !user) {
    return false;
  }
  
  if (!allowedRoles) {
    return true;
  }
  
  return allowedRoles.includes(user.role);
};

// Default export for backward compatibility
export default ProtectedRoute;