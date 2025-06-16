
import React, { useState, useEffect } from "react";
import { uploadResourceImage } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = "Upload Image"
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.size, file.type);
    
    // Reset previous states
    setUploadSuccess(false);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type:", file.type);
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large:", file.size);
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    
    try {
      console.log("Starting upload...");
      const url = await uploadResourceImage(file);
      console.log("Upload result:", url);
      
      if (url) {
        setPreview(url);
        onChange(url);
        setUploadSuccess(true);
        toast.success("Image uploaded successfully!");
        console.log("Image upload successful:", url);
      } else {
        console.error("Upload failed: No URL returned");
        toast.error("Upload failed: No URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Upload failed: ${error}`);
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          className="relative overflow-hidden"
          asChild
        >
          <label className="cursor-pointer flex items-center gap-2">
            {uploading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                Upload Another
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                {label}
              </>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </Button>
        
        {uploadSuccess && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            Ready to save
          </div>
        )}
      </div>
      
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Preview"
            className="w-40 h-32 rounded object-cover border"
            onError={(e) => {
              console.error("Preview image failed to load:", preview);
              toast.error("Failed to load image preview");
            }}
            onLoad={() => {
              console.log("Preview image loaded successfully:", preview);
            }}
          />
        </div>
      )}
      
      {uploading && (
        <span className="text-xs text-muted-foreground">Uploading image...</span>
      )}
    </div>
  );
};
