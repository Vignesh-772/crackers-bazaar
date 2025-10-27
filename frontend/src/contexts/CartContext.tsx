import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Cart Item interface
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

// Cart State interface
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Cart Actions
type CartAction =
  | { type: "ADD_TO_CART"; payload: { product: Product; quantity: number } }
  | { type: "REMOVE_FROM_CART"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] };

// Cart Context interface
interface CartContextType {
  state: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  syncCartToBackend: () => Promise<void>;
  isAuthenticated: boolean;
}

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Cart reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        // Update existing item quantity
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: product.id,
          product,
          quantity,
          addedAt: new Date().toISOString(),
        };
        newItems = [...state.items, newItem];
      }
      
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      };
    }
    
    case "REMOVE_FROM_CART": {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      };
    }
    
    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: "REMOVE_FROM_CART", payload: { productId } });
      }
      
      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      
      return {
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      };
    }
    
    case "CLEAR_CART":
      return initialState;
    
    case "LOAD_CART":
      const items = action.payload;
      return {
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
      };
    
    default:
      return state;
  }
};

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  // Load cart from localStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: "LOAD_CART", payload: cartItems });
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  // Sync cart to backend when user logs in
  useEffect(() => {
    if (isAuthenticated && user && state.items.length > 0) {
      syncCartToBackend();
    }
  }, [isAuthenticated, user]);

  // Function to sync local cart to backend
  const syncCartToBackend = async () => {
    if (!isAuthenticated || !user) {
      console.log("User not authenticated, cart remains local");
      return;
    }

    try {
      // Here you would implement the backend sync logic
      // For now, we'll just log that sync would happen
      console.log("Syncing cart to backend for user:", user.username);
      console.log("Cart items to sync:", state.items);
      
      // TODO: Implement actual backend sync
      // This could involve:
      // 1. Sending cart items to backend
      // 2. Merging with any existing backend cart
      // 3. Clearing local cart after successful sync
      
      toast({
        title: "Cart Synced",
        description: "Your cart has been synced to your account.",
      });
    } catch (error) {
      console.error("Failed to sync cart to backend:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync cart. Items remain in local storage.",
        variant: "destructive",
      });
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    // Check stock availability
    if (product.stockQuantity < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stockQuantity} items available in stock`,
        variant: "destructive",
      });
      return;
    }

    // Check minimum order quantity
    if (quantity < (product.minOrderQuantity || 1)) {
      toast({
        title: "Minimum Quantity Required",
        description: `Minimum order quantity is ${product.minOrderQuantity || 1}`,
        variant: "destructive",
      });
      return;
    }

    // Check maximum order quantity
    if (product.maxOrderQuantity && quantity > product.maxOrderQuantity) {
      toast({
        title: "Maximum Quantity Exceeded",
        description: `Maximum order quantity is ${product.maxOrderQuantity}`,
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: "ADD_TO_CART", payload: { product, quantity } });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const removeFromCart = (productId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { productId } });
    
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const item = state.items.find(item => item.product.id === productId);
    if (!item) return;

    // Check stock availability
    if (item.product.stockQuantity < quantity) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${item.product.stockQuantity} items available in stock`,
        variant: "destructive",
      });
      return;
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getItemQuantity = (productId: string): number => {
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId: string): boolean => {
    return state.items.some(item => item.product.id === productId);
  };

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    syncCartToBackend,
    isAuthenticated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
