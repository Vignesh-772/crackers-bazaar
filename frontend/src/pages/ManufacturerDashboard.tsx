import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AddProductDialog from "@/components/AddProductDialog";
import { productApi, manufacturerApi } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const ManufacturerDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);

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

  // Calculate stats from products
  const totalProducts = productsData?.totalElements || 0;
  const activeProducts = products.filter((p) => p.isActive && p.stockQuantity > 0).length;
  const lowStockProducts = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 10).length;
  const outOfStockProducts = products.filter((p) => p.stockQuantity === 0).length;

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

  const handleToggleStatus = (id: number) => {
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
      </div>
    </div>
  );
};

export default ManufacturerDashboard;
