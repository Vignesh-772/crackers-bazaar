import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import CheckoutDialog from "@/components/CheckoutDialog";
import LoginRequiredDialog from "@/components/LoginRequiredDialog";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const Cart = () => {
  const { toast } = useToast();
  const { state, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  const cartItems = state.items;
  const subtotal = state.totalPrice;
  const shipping = 50;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckoutSuccess = () => {
    toast({
      title: "Order Placed Successfully",
      description: "Your order has been placed and is being processed.",
    });
    clearCart();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <ShoppingBag className="text-primary" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.product.imageUrls?.[0] || "https://images.unsplash.com/photo-1484503369366-c546e5814e13?w=200"}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.product.name}</h3>
                      <p className="text-primary font-bold mb-4">₹{item.product.price}</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {item.product.manufacturerName}
                      </p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border rounded-md">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stockQuantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {cartItems.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button asChild>
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold">₹{shipping}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{total}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Input placeholder="Enter coupon code" />
                  <Button variant="outline" className="w-full">Apply Coupon</Button>
                  
                  {isAuthenticated ? (
                    <CheckoutDialog
                      cartItems={cartItems.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        image: item.product.imageUrls?.[0]
                      }))}
                      subtotal={subtotal}
                      shippingCost={shipping}
                      total={total}
                      onSuccess={handleCheckoutSuccess}
                    />
                  ) : (
                    <Button 
                      onClick={() => setShowLoginDialog(true)}
                      className="w-full"
                    >
                      Login to Checkout
                    </Button>
                  )}
                </div>

                <div className="mt-6 text-center">
                  <Button asChild variant="link">
                    <Link to="/products">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <LoginRequiredDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        title="Login Required for Checkout"
        description="You need to be logged in to place an order. Your cart items will be saved and synced to your account after login."
        onLoginSuccess={() => {
          toast({
            title: "Welcome back!",
            description: "Your cart has been synced to your account.",
          });
        }}
      />
    </div>
  );
};

export default Cart;
