
import React, { useState, useEffect } from "react";
import { uploadResourceImage } from "@/services/storageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, CheckCircle, XCircle, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

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
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  useEffect(() => {
    setPreview(value);
    setUploadSuccess(!!value);
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    logger.debug("File selected:", file.name, file.size, file.type);
    
    // Reset previous states
    setUploadSuccess(false);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      logger.error("Invalid file type:", file.type);
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      logger.error("File too large:", file.size);
      toast.error("File size must be less than 5MB");
      return;
    }

    setUploading(true);
    
    try {
      logger.debug("Starting upload...");
      const url = await uploadResourceImage(file);
      logger.debug("Upload successful, URL:", url);
      
      setPreview(url);
      onChange(url);
      setUploadSuccess(true);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      logger.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      toast.error(errorMessage);
      setUploadSuccess(false);
    } finally {
      setUploading(false);
      // Clear the input so the same file can be selected again if needed
      e.target.value = '';
    }
  };

  const handleUrlInput = (url: string) => {
    if (!url.trim()) {
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (error) {
      return; // Don't set invalid URLs
    }

    // Set the URL directly without validation - let the admin save it with the form
    logger.debug("URL image set for form:", url);
    setPreview(url);
    onChange(url);
    setUploadSuccess(true);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'upload' | 'url')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
          <TabsTrigger value="url" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
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
        </TabsContent>

        <TabsContent value="url">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="Enter image URL (e.g., https://ibb.co/8DjtHhMt)"
                value={urlInput}
                onChange={(e) => {
                  const url = e.target.value;
                  setUrlInput(url);
                  setPreview(url);
                }}
                disabled={uploading}
              />
               <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (urlInput.trim()) {
                    try {
                      new URL(urlInput);
                      onChange(urlInput);
                      setUploadSuccess(true);
                    } catch (error) {
                      toast.error("Invalid URL");
                    }
                  }
                }}
              >
                Set URL
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Enter URL and click "Set URL" to update the image.
            </p>
            <p className="text-xs text-muted-foreground">
              Please provide a direct image link (e.g., ending in .png, .jpg).
            </p>
            {urlInput && (
              <div className="text-xs text-blue-600">
                ✓ URL ready to save with form
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {preview && (
        <div className="mt-2">
          <img 
            src={preview} 
            alt="Preview"
            className="w-40 h-32 rounded object-cover border"
            onError={(e) => {
              logger.error("Preview image failed to load:", preview);
              toast.error("Failed to load image preview");
            }}
            onLoad={() => {
              logger.debug("Preview image loaded successfully:", preview);
            }}
          />
        </div>
      )}
      
      {uploading && (
        <span className="text-xs text-muted-foreground">Processing image...</span>
      )}
    </div>
  );
};
