import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * AuthGuard component that validates authentication on every page load
 * and automatically redirects to login if token is invalid
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const { isAuthenticated, validateToken } = useAuth();
  const validationInProgress = useRef(false);
  
  // Validate token on component mount if user appears to be authenticated
  useEffect(() => {
    const checkAuth = async () => {
      // Prevent multiple simultaneous validations
      if (validationInProgress.current) {
        return;
      }
      
      if (isAuthenticated) {
        validationInProgress.current = true;
        try {
          const isValid = await validateToken();
          if (!isValid) {
            console.log('Token validation failed, user will be redirected to login');
          }
        } finally {
          validationInProgress.current = false;
        }
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
};

/**
 * Higher-order component that wraps any component with authentication validation
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  requireAuth: boolean = false
) => {
  return (props: P) => (
    <AuthGuard requireAuth={requireAuth}>
      <Component {...props} />
    </AuthGuard>
  );
};

export default AuthGuard;
