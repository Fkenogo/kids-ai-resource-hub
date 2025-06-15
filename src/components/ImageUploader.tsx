
import React, { useState } from "react";
import { uploadResourceImage } from "@/services/storageService";
import { Button } from "@/components/ui/button";

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
    setUploading(true);
    const url = await uploadResourceImage(file);
    if (url) {
      onChange(url);
      setPreview(url);
    }
    setUploading(false);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="font-medium">{label}</label>}
      <input 
        type="file" 
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block"
      />
      {preview && (
        <img 
          src={preview} 
          alt="Preview"
          className="mt-2 w-40 h-32 rounded object-cover border"
        />
      )}
      {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
    </div>
  );
};
