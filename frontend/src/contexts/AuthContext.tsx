import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/lib/api";
import type { JwtResponse, LoginRequest, RegisterRequest, User, Role } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user and token from localStorage on mount and validate token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Validate token with backend
          const validationResult = await authApi.validateToken();
          
          if (validationResult.valid && validationResult.isActive) {
            // Token is valid, update user data if needed
            const userData: User = {
              id: validationResult.userId!,
              username: validationResult.username!,
              email: validationResult.email!,
              firstName: validationResult.firstName!,
              lastName: validationResult.lastName!,
              role: validationResult.role as Role,
            };
            
            setToken(storedToken);
            setUser(userData);
            
            // Update localStorage with fresh user data
            localStorage.setItem("user", JSON.stringify(userData));
          } else {
            // Token is invalid or user is inactive, clear auth data
            console.warn("Token validation failed:", validationResult.message);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response: JwtResponse = await authApi.login(credentials);
      
      const userData: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
      };

      setToken(response.token);
      setUser(userData);
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(userData));

      toast.success(`Welcome back, ${userData.firstName}!`);

      // Check if there's a redirect location from the auth page
      const from = sessionStorage.getItem('authRedirect');
      if (from && from !== '/auth') {
        sessionStorage.removeItem('authRedirect');
        navigate(from, { replace: true });
        return;
      }

      // Navigate based on role if no redirect location
      switch (userData.role) {
        case "ADMIN":
        case "DASHBOARD_ADMIN":
          navigate("/admin");
          break;
        case "MANUFACTURER":
          navigate("/manufacturer");
          break;
        case "RETAILER":
          navigate("/dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      await authApi.register(data);
      toast.success("Registration successful! Please login with your credentials.");
      // Don't auto-login, let user login manually
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("You have been logged out.");
    navigate("/auth");
  };

  const hasRole = (role: Role | Role[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const validateToken = async (): Promise<boolean> => {
    try {
      const validationResult = await authApi.validateToken();
      
      if (validationResult.valid && validationResult.isActive) {
        // Update user data if needed
        const userData: User = {
          id: validationResult.userId!,
          username: validationResult.username!,
          email: validationResult.email!,
          firstName: validationResult.firstName!,
          lastName: validationResult.lastName!,
          role: validationResult.role as Role,
        };
        
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return true;
      } else {
        // Token is invalid, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    validateToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

