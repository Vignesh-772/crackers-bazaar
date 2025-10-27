import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Package, ShoppingCart, TrendingUp, DollarSign, Search, Filter, Eye, Truck, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AddProductDialog from "@/components/AddProductDialog";
import { productApi, manufacturerApi, orderApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ManufacturerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [ordersPage, setOrdersPage] = useState(0);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("ALL");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");

  // Fetch manufacturer profile for the authenticated user
  const { data: manufacturerProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["manufacturerProfile"],
    queryFn: manufacturerApi.getMyProfile,
    enabled: !!user,
  });

  const manufacturerId = manufacturerProfile?.id;

  // Fetch products for this manufacturer
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["manufacturerProducts", manufacturerId, page],
    queryFn: async () => {
      if (!manufacturerId) return null;
      return await productApi.getProductsByManufacturer({
        manufacturerId,
        page,
        size: 20,
      });
    },
    enabled: !!manufacturerId,
  });

  const products = productsData?.content || [];
  const totalPages = productsData?.totalPages || 0;

  // Fetch orders for this manufacturer
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["manufacturerOrders", manufacturerId, ordersPage, orderStatusFilter],
    queryFn: async () => {
      if (!manufacturerId) return null;
      return await orderApi.getManufacturerOrders({
        page: ordersPage,
        size: 10,
      });
    },
    enabled: !!manufacturerId,
  });

  const orders = ordersData?.content || [];
  const ordersTotalPages = ordersData?.totalPages || 0;

  // Calculate stats from products
  const totalProducts = productsData?.totalElements || 0;
  const activeProducts = products.filter((p) => p.isActive && p.stockQuantity > 0).length;
  const lowStockProducts = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 10).length;
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0).length;

  // Order status update mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status, trackingNumber }: { orderId: number; status: OrderStatus; trackingNumber?: string }) =>
      orderApi.updateOrderStatus(orderId, { status, trackingNumber }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturerOrders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to update order status");
    },
  });

  const handleUpdateOrderStatus = (orderId: number, status: OrderStatus, trackingNumber?: string) => {
    updateOrderStatusMutation.mutate({ orderId, status, trackingNumber });
  };

  // Toggle product status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: productApi.toggleProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturerProducts"] });
      toast.success("Product status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update product status");
    },
  });

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  // Show loading state while fetching profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      </div>
    );
  }

  // Show error if manufacturer profile not found
  if (!manufacturerProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Manufacturer profile not found. Please contact admin.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">{manufacturerProfile.companyName}</h1>
            <p className="text-muted-foreground">Manage your products and orders</p>
          </div>
          <AddProductDialog />
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">

        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalProducts}</div>
                <p className="text-xs text-primary mt-1">{activeProducts} active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Low Stock
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{lowStockProducts}</div>
                <p className="text-xs text-destructive mt-1">Needs attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{outOfStockProducts}</div>
                <p className="text-xs text-destructive mt-1">Restock needed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Rate
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0}%
                </div>
                <p className="text-xs text-primary mt-1">Product availability</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const inStock = product.stockQuantity > 0;
                      const lowStock = product.stockQuantity > 0 && product.stockQuantity < 10;

                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>₹{product.price}</TableCell>
                          <TableCell>
                            <span className={lowStock ? "text-destructive font-semibold" : ""}>
                              {product.stockQuantity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.isActive && inStock ? "default" : "destructive"}>
                              {product.isActive
                                ? inStock
                                  ? "Active"
                                  : "Out of Stock"
                                : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.isFeatured && <Badge variant="outline">Featured</Badge>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(product.id)}
                              >
                                {product.isActive ? "Deactivate" : "Activate"}
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link to={`/product/${product.id}`}>View</Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {!productsLoading && products.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No products found. Add your first product to get started!
                  </div>
                )}
                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {page + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Orders
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Orders</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                                <Badge variant={
                                  order.status === OrderStatus.PENDING ? "secondary" :
                                  order.status === OrderStatus.CONFIRMED ? "default" :
                                  order.status === OrderStatus.PROCESSING ? "default" :
                                  order.status === OrderStatus.SHIPPED ? "default" :
                                  order.status === OrderStatus.DELIVERED ? "default" :
                                  "destructive"
                                }>
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Customer: {order.userName} ({order.userEmail})
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Total: ₹{order.total} • {order.orderItems.length} items
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Placed: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              {order.trackingNumber && (
                                <p className="text-sm text-muted-foreground">
                                  Tracking: {order.trackingNumber}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <Link to={`/orders/${order.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Link>
                              </Button>
                              {order.status === OrderStatus.CONFIRMED && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.PROCESSING)}
                                  disabled={updateOrderStatusMutation.isPending}
                                >
                                  <Clock className="h-4 w-4 mr-2" />
                                  Process
                                </Button>
                              )}
                              {order.status === OrderStatus.PROCESSING && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const trackingNumber = prompt("Enter tracking number:");
                                    if (trackingNumber) {
                                      handleUpdateOrderStatus(order.id, OrderStatus.SHIPPED, trackingNumber);
                                    }
                                  }}
                                  disabled={updateOrderStatusMutation.isPending}
                                >
                                  <Truck className="h-4 w-4 mr-2" />
                                  Ship
                                </Button>
                              )}
                              {order.status === OrderStatus.SHIPPED && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.DELIVERED)}
                                  disabled={updateOrderStatusMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Deliver
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="font-medium mb-2">Order Items:</h4>
                            <div className="space-y-2">
                              {order.orderItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-2">
                                    {item.imageUrl && (
                                      <img
                                        src={item.imageUrl}
                                        alt={item.productName}
                                        className="w-8 h-8 object-cover rounded"
                                      />
                                    )}
                                    <span>{item.productName}</span>
                                    <span className="text-muted-foreground">x{item.quantity}</span>
                                  </div>
                                  <span className="font-medium">₹{item.totalPrice}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                    {ordersTotalPages > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOrdersPage((p) => Math.max(0, p - 1))}
                          disabled={ordersPage === 0}
                        >
                          Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">
                          Page {ordersPage + 1} of {ordersTotalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages - 1, p + 1))}
                          disabled={ordersPage >= ordersTotalPages - 1}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
