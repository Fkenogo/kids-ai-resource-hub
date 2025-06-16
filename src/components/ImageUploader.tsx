
import React, { useState } from "react";
import { uploadResourceImage } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.size, file.type);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type:", file.type);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File too large:", file.size);
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
        console.log("Image upload successful:", url);
      } else {
        console.error("Upload failed: No URL returned");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
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
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : label}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </label>
        </Button>
      </div>
      
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Preview"
            className="w-40 h-32 rounded object-cover border"
            onError={(e) => {
              console.error("Preview image failed to load:", preview);
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
