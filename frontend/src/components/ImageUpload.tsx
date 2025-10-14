import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { uploadApi } from "@/lib/api";
import { toast } from "sonner";

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  maxFiles?: number;
  existingImages?: string[];
  onRemoveImage?: (url: string) => void;
}

interface UploadedImage {
  url: string;
  file?: File;
  uploading?: boolean;
  error?: string;
  originalSize?: number;
  compressedSize?: number;
}

const ImageUpload = ({ 
  onImageUploaded, 
  maxFiles = 5, 
  existingImages = [],
  onRemoveImage 
}: ImageUploadProps) => {
  const [images, setImages] = useState<UploadedImage[]>(
    existingImages.map(url => ({ url }))
  );
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    const mb = kb / 1024;
    return mb.toFixed(1) + " MB";
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Check if we're at max capacity
    if (images.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add files with uploading state
    const newImages: UploadedImage[] = validFiles.map((file) => ({
      url: URL.createObjectURL(file), // Temporary preview URL
      file,
      uploading: true,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Upload each file
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const imageIndex = images.length + i;

      try {
        setUploadProgress((i / validFiles.length) * 100);

        const result = await uploadApi.uploadTempImage(file);
        
        // Construct full URL (proxy URL from backend)
        const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:8080';
        const fullUrl = `${API_BASE}${result.url}`;
        
        // Update image with uploaded URL
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex
              ? {
                  ...img,
                  url: fullUrl,
                  uploading: false,
                  originalSize: result.originalSize,
                  compressedSize: file.size, // Would need backend to return this
                }
              : img
          )
        );

        // Notify parent component with proxy URL
        onImageUploaded(fullUrl);

        // Show compression info
        const sizeMB = result.originalSize / (1024 * 1024);
        if (sizeMB > 2) {
          toast.success(`Image uploaded and compressed: ${file.name}`);
        } else {
          toast.success(`Image uploaded: ${file.name}`);
        }
      } catch (error: any) {
        console.error("Upload error:", error);
        const errorMsg = error.response?.data?.error || "Upload failed";
        
        setImages((prev) =>
          prev.map((img, idx) =>
            idx === imageIndex
              ? {
                  ...img,
                  uploading: false,
                  error: errorMsg,
                }
              : img
          )
        );

        toast.error(`Failed to upload ${file.name}: ${errorMsg}`);
      }
    }

    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 1000);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const imageToRemove = images[index];
    
    // Revoke object URL if it's a local preview
    if (imageToRemove.url.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Call parent's remove handler
    if (onRemoveImage && !imageToRemove.file) {
      onRemoveImage(imageToRemove.url);
    }

    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={images.length >= maxFiles}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        Upload Images ({images.length}/{maxFiles})
      </Button>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">Uploading and compressing...</p>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative bg-muted">
                {image.uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : image.error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center">
                    <AlertCircle className="h-8 w-8 text-destructive mb-2" />
                    <p className="text-xs text-destructive">{image.error}</p>
                  </div>
                ) : (
                  <>
                    <img
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemove(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {image.originalSize && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 text-center">
                        {formatFileSize(image.originalSize)}
                        {image.originalSize > 2097152 && " (compressed)"}
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• Supported formats: JPEG, PNG, GIF, WebP</p>
        <p>• Maximum file size: 10 MB per image</p>
        <p>• Images larger than 2 MB will be automatically compressed</p>
        <p>• Large images will be resized to max 1920x1920px</p>
      </div>
    </div>
  );
};

export default ImageUpload;

