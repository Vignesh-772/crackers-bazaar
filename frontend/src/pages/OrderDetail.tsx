import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { orderApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrderById(Number(id));
      setOrder(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch order details",
        variant: "destructive",
      });
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="h-5 w-5" />;
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
        return <Package className="h-5 w-5" />;
      case OrderStatus.SHIPPED:
        return <Truck className="h-5 w-5" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="h-5 w-5" />;
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-500";
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
        return "bg-blue-500";
      case OrderStatus.SHIPPED:
        return "bg-purple-500";
      case OrderStatus.DELIVERED:
        return "bg-green-500";
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    try {
      await orderApi.cancelOrder(order.id, "Cancelled by user");
      toast({
        title: "Success",
        description: "Order cancelled successfully",
      });
      fetchOrder();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to cancel order",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">Order not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Order #{order.orderNumber}
              </h1>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Badge className={`${getStatusColor(order.status)} text-white text-lg px-4 py-2`}>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </Badge>
              {order.status === OrderStatus.PENDING && (
                <Button variant="destructive" onClick={handleCancelOrder}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.productName}</h3>
                      {item.productSku && (
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.productSku}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p>{order.shippingAddress}</p>
                    <p>
                      {order.shippingCity}, {order.shippingState} {order.shippingPincode}
                    </p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{order.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{order.contactPhone}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Status */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.tax && order.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(order.tax)}</span>
                  </div>
                )}
                {order.shippingCost && order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                )}
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">Order Placed</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                {order.shippedAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.shippedAt)}
                    </p>
                    {order.trackingNumber && (
                      <p className="text-sm">
                        Tracking: <strong>{order.trackingNumber}</strong>
                      </p>
                    )}
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.deliveredAt)}
                    </p>
                  </div>
                )}
                {order.cancelledAt && (
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">Cancelled</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.cancelledAt)}
                    </p>
                    {order.cancellationReason && (
                      <p className="text-sm">Reason: {order.cancellationReason}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {order.paymentMethod && (
                  <div className="flex justify-between">
                    <span>Method</span>
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </div>
                )}
                {order.paymentStatus && (
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                      {order.paymentStatus}
                    </Badge>
                  </div>
                )}
                {order.paymentTransactionId && (
                  <div className="flex justify-between">
                    <span className="text-sm">Transaction ID</span>
                    <span className="text-sm font-mono">
                      {order.paymentTransactionId}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

