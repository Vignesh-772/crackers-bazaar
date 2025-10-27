import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LoginRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onLoginSuccess?: () => void;
}

export const LoginRequiredDialog: React.FC<LoginRequiredDialogProps> = ({
  open,
  onOpenChange,
  title = "Login Required",
  description = "You need to be logged in to place an order. Please login to continue.",
  onLoginSuccess,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleLogin = () => {
    onOpenChange(false);
    navigate('/auth', { 
      state: { 
        from: window.location.pathname,
        message: "Please login to place your order"
      } 
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Close dialog if user becomes authenticated
  React.useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
      onLoginSuccess?.();
    }
  }, [isAuthenticated, open, onOpenChange, onLoginSuccess]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleLogin}>
            Login
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
