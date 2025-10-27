import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, CreditCard } from "lucide-react";
import { orderApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CheckoutDialogProps {
  cartItems: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  onSuccess: () => void;
}

const CheckoutDialog = ({
  cartItems,
  subtotal,
  shippingCost,
  total,
  onSuccess,
}: CheckoutDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingPincode: "",
    shippingCountry: "India",
    contactEmail: user?.email || "",
    contactPhone: "",
    paymentMethod: "COD",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingAddress || !formData.shippingCity || !formData.shippingState || !formData.shippingPincode) {
      toast({
        title: "Error",
        description: "Please fill in all required shipping address fields",
        variant: "destructive",
      });
      return;
    }

    if (!formData.contactEmail || !formData.contactPhone) {
      toast({
        title: "Error",
        description: "Please fill in all required contact information",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      console.log(cartItems)

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        shippingCity: formData.shippingCity,
        shippingState: formData.shippingState,
        shippingPincode: formData.shippingPincode,
        shippingCountry: formData.shippingCountry,
        billingAddress: formData.shippingAddress, // Using same as shipping for now
        billingCity: formData.shippingCity,
        billingState: formData.shippingState,
        billingPincode: formData.shippingPincode,
        billingCountry: formData.shippingCountry,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        shippingCost: shippingCost,
      };

      const order = await orderApi.createOrder(orderData);

      toast({
        title: "Success",
        description: `Order placed successfully! Order #${order.orderNumber}`,
      });

      setOpen(false);
      onSuccess();
      
      // Navigate to orders page after a short delay
      setTimeout(() => {
        navigate(`/orders/${order.id}`);
      }, 500);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.error || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg" disabled={cartItems.length === 0}>
          Proceed to Checkout
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Checkout
          </DialogTitle>
          <DialogDescription>
            Complete your order by filling in the details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <div>
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>₹{shippingCost.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold mb-3">Shipping Address</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="shippingAddress">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  placeholder="Enter your full address"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCity">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="shippingCity"
                    name="shippingCity"
                    placeholder="City"
                    value={formData.shippingCity}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingState">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="shippingState"
                    name="shippingState"
                    placeholder="State"
                    value={formData.shippingState}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingPincode">
                    Pincode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="shippingPincode"
                    name="shippingPincode"
                    placeholder="Pincode"
                    value={formData.shippingPincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    maxLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shippingCountry">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="shippingCountry"
                    name="shippingCountry"
                    placeholder="Country"
                    value={formData.shippingCountry}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3">Contact Information</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  placeholder="Email address"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Method */}
          <div>
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COD">Cash on Delivery</SelectItem>
                <SelectItem value="ONLINE">Online Payment</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="CARD">Credit/Debit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <h3 className="font-semibold mb-3">Order Notes (Optional)</h3>
            <Textarea
              name="notes"
              placeholder="Any special instructions for your order..."
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;

