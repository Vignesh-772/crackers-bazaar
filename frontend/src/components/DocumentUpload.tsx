import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Loader2, CheckCircle } from "lucide-react";
import { uploadApi } from "@/lib/api";
import { toast } from "sonner";

interface DocumentUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  required?: boolean;
}

const DocumentUpload = ({
  label,
  value,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  required = false,
}: DocumentUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const allowedExtensions = accept.split(",").map((ext) => ext.replace(".", "").trim());
    if (fileExtension && !allowedExtensions.includes(fileExtension)) {
      toast.error(`File type not allowed. Accepted: ${accept}`);
      return;
    }

    setUploading(true);
    try {
      // Use the temp image upload endpoint (works for PDFs too)
      const result = await uploadApi.uploadTempImage(file);
      const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:8080";
      const fullUrl = `${API_BASE}${result.url}`;
      onChange(fullUrl);
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Upload failed";
      toast.error(`Failed to upload document: ${errorMsg}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        {value ? (
          <div className="flex items-center gap-2 flex-1 p-2 border rounded-md bg-muted">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm flex-1 truncate">
              {value.split("/").pop() || "Document uploaded"}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </>
            )}
          </Button>
        )}
      </div>
      {value && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          View Document
        </a>
      )}
    </div>
  );
};

export default DocumentUpload;

