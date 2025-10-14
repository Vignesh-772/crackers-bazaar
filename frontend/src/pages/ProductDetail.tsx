import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, ArrowLeft, Star, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import { productApi } from "@/lib/api";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch product data
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");
      return await productApi.getProductById(parseInt(id));
    },
    enabled: !!id,
  });

  if (error) {
    toast.error("Failed to load product details");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="h-[500px] w-full rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">Product not found</p>
            <Button asChild className="mt-4">
              <Link to="/products">Back to Products</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const inStock = product.stockQuantity > 0;
  const imageUrl = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls[0] 
    : "https://images.unsplash.com/photo-1484503369366-c546e5814e13?w=800";

  // Parse features from description or tags
  const features = product.description 
    ? product.description.split('.').filter(f => f.trim().length > 0)
    : [];

  const rating = 4.5; // Placeholder - would come from reviews system
  const reviews = 128; // Placeholder - would come from reviews system

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-[500px] object-cover"
              />
              {!inStock && (
                <Badge className="absolute top-4 right-4 bg-destructive">Out of Stock</Badge>
              )}
              {product.isFeatured && (
                <Badge className="absolute top-4 left-4 bg-primary">Featured</Badge>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground mb-4">by {product.manufacturerName}</p>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? "fill-primary text-primary"
                          : "text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating} ({reviews} reviews)
                </span>
              </div>

              <p className="text-4xl font-bold text-primary mb-4">₹{product.price}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Stock: {product.stockQuantity} units</span>
                </div>
                {product.brand && (
                  <span>Brand: {product.brand}</span>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                
                {features.length > 0 && (
                  <>
                    <h3 className="font-semibold mb-3">Features</h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {feature.trim()}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                {product.tags && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {product.shippingInfo && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Shipping Info</h3>
                    <p className="text-sm text-muted-foreground">{product.shippingInfo}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                disabled={!inStock}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" disabled={!inStock}>
                Buy Now
              </Button>
            </div>

            {!inStock && (
              <p className="text-destructive text-center">
                This product is currently out of stock
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
