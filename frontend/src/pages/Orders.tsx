import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Eye,
  AlertCircle,
} from "lucide-react";
import { orderApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getMyOrders({ page: 0, size: 100 });
      setOrders(response.content);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await orderApi.getUserOrderStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.CONFIRMED:
      case OrderStatus.PROCESSING:
        return <Package className="h-4 w-4" />;
      case OrderStatus.SHIPPED:
        return <Truck className="h-4 w-4" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.CANCELLED:
      case OrderStatus.REFUNDED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Package className="text-primary" />
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(stats.totalSpent || 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button onClick={() => navigate("/products")}>
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          Order #{order.orderNumber}
                        </h3>
                        <Badge className={`${getStatusColor(order.status)} text-white`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </div>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>
                          Items: <strong>{order.orderItems.length}</strong>
                        </span>
                        <span>
                          Total: <strong>{formatCurrency(order.total)}</strong>
                        </span>
                        {order.trackingNumber && (
                          <span>
                            Tracking: <strong>{order.trackingNumber}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/orders/${order.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      {order.status === OrderStatus.PENDING && (
                        <Button
                          variant="destructive"
                          onClick={async () => {
                            try {
                              await orderApi.cancelOrder(
                                order.id,
                                "Cancelled by user"
                              );
                              toast({
                                title: "Success",
                                description: "Order cancelled successfully",
                              });
                              fetchOrders();
                            } catch (error: any) {
                              toast({
                                title: "Error",
                                description:
                                  error.response?.data?.error ||
                                  "Failed to cancel order",
                                variant: "destructive",
                              });
                            }
                          }}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {order.orderItems.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs truncate">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                      {order.orderItems.length > 4 && (
                        <div className="text-xs text-muted-foreground flex items-center">
                          +{order.orderItems.length - 4} more
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;

