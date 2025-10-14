import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2, X, Link2 } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { productApi } from "@/lib/api";
import { ProductRequest } from "@/types";
import { toast } from "sonner";

const CATEGORIES = [
  "Sparklers",
  "Fountains",
  "Rockets",
  "Ground Items",
  "Flower Pots",
  "Chakkar",
  "Aerial Items",
  "Combo Packs",
  "Gift Boxes",
  "Other",
];

const AddProductDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");

  // Form state
  const [formData, setFormData] = useState<ProductRequest>({
    name: "",
    description: "",
    price: 0,
    category: "",
    subcategory: "",
    stockQuantity: 0,
    minOrderQuantity: 1,
    maxOrderQuantity: 100,
    weight: 0,
    dimensions: "",
    color: "",
    material: "",
    brand: "",
    modelNumber: "",
    sku: "",
    barcode: "",
    isActive: true,
    isFeatured: false,
    tags: "",
    warrantyPeriod: "",
    returnPolicy: "",
    shippingInfo: "",
    imageUrls: [],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUploadMode, setImageUploadMode] = useState<"upload" | "url">("upload");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create product mutation
  const createMutation = useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturerProducts"] });
      toast.success("Product added successfully!");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to add product";
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      category: "",
      subcategory: "",
      stockQuantity: 0,
      minOrderQuantity: 1,
      maxOrderQuantity: 100,
      weight: 0,
      dimensions: "",
      color: "",
      material: "",
      brand: "",
      modelNumber: "",
      sku: "",
      barcode: "",
      isActive: true,
      isFeatured: false,
      tags: "",
      warrantyPeriod: "",
      returnPolicy: "",
      shippingInfo: "",
      imageUrls: [],
    });
    setImageUrlInput("");
    setErrors({});
    setCurrentTab("basic");
  };

  const handleChange = (field: keyof ProductRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        imageUrls: [...(prev.imageUrls || []), imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls?.filter((_, i) => i !== index) || [],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (formData.stockQuantity === undefined || formData.stockQuantity < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }
    if (formData.minOrderQuantity && formData.minOrderQuantity < 1) {
      newErrors.minOrderQuantity = "Minimum order quantity must be at least 1";
    }
    if (
      formData.maxOrderQuantity &&
      formData.minOrderQuantity &&
      formData.maxOrderQuantity < formData.minOrderQuantity
    ) {
      newErrors.maxOrderQuantity = "Maximum must be greater than minimum";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all form errors");
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Deluxe Sparklers Box"
                  maxLength={200}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Premium quality sparklers perfect for celebrations..."
                  rows={4}
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.description?.length || 0}/1000 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price (₹) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange("price", parseFloat(e.target.value) || 0)}
                    placeholder="299.00"
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange("brand", e.target.value)}
                    placeholder="ABC Crackers"
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => handleChange("subcategory", e.target.value)}
                    placeholder="Premium Grade"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4 mt-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stockQuantity">
                    Stock Quantity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="stockQuantity"
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => handleChange("stockQuantity", parseInt(e.target.value) || 0)}
                    placeholder="100"
                  />
                  {errors.stockQuantity && (
                    <p className="text-sm text-destructive">{errors.stockQuantity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                  <Input
                    id="minOrderQuantity"
                    type="number"
                    min="1"
                    value={formData.minOrderQuantity}
                    onChange={(e) =>
                      handleChange("minOrderQuantity", parseInt(e.target.value) || 1)
                    }
                    placeholder="1"
                  />
                  {errors.minOrderQuantity && (
                    <p className="text-sm text-destructive">{errors.minOrderQuantity}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOrderQuantity">Max Order Quantity</Label>
                  <Input
                    id="maxOrderQuantity"
                    type="number"
                    min="1"
                    value={formData.maxOrderQuantity}
                    onChange={(e) =>
                      handleChange("maxOrderQuantity", parseInt(e.target.value) || 100)
                    }
                    placeholder="100"
                  />
                  {errors.maxOrderQuantity && (
                    <p className="text-sm text-destructive">{errors.maxOrderQuantity}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-8 p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleChange("isActive", checked)}
                  />
                  <Label htmlFor="isActive">Active Product</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleChange("isFeatured", checked)}
                  />
                  <Label htmlFor="isFeatured">Featured Product</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Product Images</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={imageUploadMode === "upload" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageUploadMode("upload")}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Upload Files
                    </Button>
                    <Button
                      type="button"
                      variant={imageUploadMode === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageUploadMode("url")}
                    >
                      <Link2 className="mr-1 h-3 w-3" />
                      Add URL
                    </Button>
                  </div>
                </div>

                {imageUploadMode === "upload" ? (
                  <ImageUpload
                    onImageUploaded={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: [...(prev.imageUrls || []), url],
                      }));
                    }}
                    existingImages={formData.imageUrls || []}
                    onRemoveImage={(url) => {
                      setFormData((prev) => ({
                        ...prev,
                        imageUrls: prev.imageUrls?.filter((u) => u !== url) || [],
                      }));
                    }}
                    maxFiles={5}
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddImageUrl} variant="outline">
                        Add
                      </Button>
                    </div>
                    {formData.imageUrls && formData.imageUrls.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {formData.imageUrls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                            <span className="text-sm flex-1 truncate">{url}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveImageUrl(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => handleChange("weight", parseFloat(e.target.value) || 0)}
                    placeholder="0.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (LxWxH)</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => handleChange("dimensions", e.target.value)}
                    placeholder="10x5x15 cm"
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                    placeholder="Golden"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    value={formData.material}
                    onChange={(e) => handleChange("material", e.target.value)}
                    placeholder="Gunpowder, Paper"
                    maxLength={100}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modelNumber">Model Number</Label>
                  <Input
                    id="modelNumber"
                    value={formData.modelNumber}
                    onChange={(e) => handleChange("modelNumber", e.target.value)}
                    placeholder="SPK-001"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                    placeholder="ABC-SPK-001"
                    maxLength={50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                    placeholder="123456789012"
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleChange("tags", e.target.value)}
                  placeholder="festive, diwali, celebration"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  Add tags to help customers find your product
                </p>
              </div>
            </TabsContent>

            {/* Additional Information Tab */}
            <TabsContent value="additional" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="warrantyPeriod">Warranty Period</Label>
                <Input
                  id="warrantyPeriod"
                  value={formData.warrantyPeriod}
                  onChange={(e) => handleChange("warrantyPeriod", e.target.value)}
                  placeholder="30 days replacement guarantee"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return Policy</Label>
                <Textarea
                  id="returnPolicy"
                  value={formData.returnPolicy}
                  onChange={(e) => handleChange("returnPolicy", e.target.value)}
                  placeholder="Returns accepted within 7 days of purchase..."
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingInfo">Shipping Information</Label>
                <Textarea
                  id="shippingInfo"
                  value={formData.shippingInfo}
                  onChange={(e) => handleChange("shippingInfo", e.target.value)}
                  placeholder="Free shipping on orders above ₹500..."
                  rows={3}
                  maxLength={500}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6 pt-4 border-t">
            <div>
              {currentTab === "inventory" && (
                <Button type="button" variant="outline" onClick={() => setCurrentTab("basic")}>
                  Previous
                </Button>
              )}
              {currentTab === "details" && (
                <Button type="button" variant="outline" onClick={() => setCurrentTab("inventory")}>
                  Previous
                </Button>
              )}
              {currentTab === "additional" && (
                <Button type="button" variant="outline" onClick={() => setCurrentTab("details")}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              {currentTab === "basic" && (
                <Button type="button" onClick={() => setCurrentTab("inventory")}>
                  Next
                </Button>
              )}
              {currentTab === "inventory" && (
                <Button type="button" onClick={() => setCurrentTab("details")}>
                  Next
                </Button>
              )}
              {currentTab === "details" && (
                <Button type="button" onClick={() => setCurrentTab("additional")}>
                  Next
                </Button>
              )}
              {currentTab === "additional" && (
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;

