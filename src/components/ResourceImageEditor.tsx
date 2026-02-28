
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { toast } from "sonner";
import { updateResourceImageAdmin } from "@/services/backend/admin";
import { logger } from "@/lib/logger";

interface ResourceImageEditorProps {
  resource: {
    id: string;
    title: string;
    image_url?: string;
  };
  onUpdated?: () => void;
  onUrlChange?: (url: string) => void;
}

export const ResourceImageEditor: React.FC<ResourceImageEditorProps> = ({
  resource,
  onUpdated,
  onUrlChange,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | undefined>(undefined);

  const handleImageChange = (url: string) => {
    logger.debug("New image uploaded:", url);
    setNewImageUrl(url);
    setPendingUrl(undefined); // Clear any pending URL
  };

  const handleUrlChange = (url: string) => {
    logger.debug("URL input changed:", url);
    setPendingUrl(url);
    setNewImageUrl(undefined); // Clear any uploaded image
  };

  const handleSave = async () => {
    const imageUrlToSave = newImageUrl || pendingUrl;
    
    if (!imageUrlToSave) {
      toast.error("Please upload an image or enter a URL first");
      return;
    }
    
    setSaving(true);
    logger.debug("Saving image URL:", imageUrlToSave, "for resource:", resource.id);
    
    try {
      await updateResourceImageAdmin(resource.id, imageUrlToSave);
      logger.debug("Image updated successfully in database");
      toast.success(`Image updated for "${resource.title}"`);
      setNewImageUrl(undefined); // Reset the upload state
      setPendingUrl(undefined); // Reset the pending URL
      onUpdated?.();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    logger.debug("Cancelling image upload");
    setNewImageUrl(undefined);
    setPendingUrl(undefined);
  };

  // Show new image if uploaded, otherwise show current image
  const displayImageUrl = newImageUrl || pendingUrl || resource.image_url;
  const hasNewImage = !!newImageUrl || !!pendingUrl;

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
      <div className="w-32 h-24 flex items-center justify-center bg-muted border rounded overflow-hidden">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={`${resource.title} image`}
            className="object-cover w-full h-full"
            onError={(e) => {
              logger.error("Image failed to load:", displayImageUrl);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              logger.debug("Resource image loaded successfully:", displayImageUrl);
            }}
          />
        ) : (
          <span className="text-xs text-gray-500">No image</span>
        )}
      </div>
      
      <div className="flex-1 w-full">
        <div className="font-semibold mb-2">{resource.title}</div>
        <ImageUploader
          value={newImageUrl}
          onChange={handleImageChange}
          onUrlChange={handleUrlChange}
          label="Upload New Image"
        />
        {hasNewImage && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            ✓ Image ready to save
          </p>
        )}
      </div>
      
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={!hasNewImage || saving}
          className="w-28"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
        {hasNewImage && (
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-28"
            disabled={saving}
          >
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
};
