import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that validates authentication token on page load
 * and redirects to login if token is invalid
 */
export const useAuthValidation = (redirectToLogin: boolean = true) => {
  const { isAuthenticated, validateToken, isLoading } = useAuth();
  const navigate = useNavigate();
  const hasValidated = useRef(false);
  const validationInProgress = useRef(false);

  useEffect(() => {
    const validateAuth = async () => {
      // Prevent multiple simultaneous validations
      if (validationInProgress.current) {
        return;
      }

      // Only validate if we haven't already validated and we're not loading
      if (!hasValidated.current && !isLoading) {
        hasValidated.current = true;
        validationInProgress.current = true;
        
        try {
          // If user appears to be authenticated, validate the token
          if (isAuthenticated) {
            const isValid = await validateToken();
            
            if (!isValid && redirectToLogin) {
              console.log('Token validation failed, redirecting to login');
              navigate('/auth', { replace: true });
            }
          } else if (redirectToLogin) {
            // If not authenticated and we should redirect, go to login
            navigate('/auth', { replace: true });
          }
        } finally {
          validationInProgress.current = false;
        }
      }
    };

    validateAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    hasValidated: hasValidated.current,
  };
};

/**
 * Hook for validating authentication on protected routes
 * Automatically redirects to login if not authenticated
 */
export const useProtectedRoute = () => {
  return useAuthValidation(true);
};

/**
 * Hook for validating authentication without automatic redirect
 * Useful for components that need to check auth status
 */
export const useAuthCheck = () => {
  return useAuthValidation(false);
};
