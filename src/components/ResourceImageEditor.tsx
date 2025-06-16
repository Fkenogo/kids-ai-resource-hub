
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ImageUploader";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ResourceImageEditorProps {
  resource: {
    id: string;
    title: string;
    image_url?: string;
  };
  onUpdated?: () => void;
}

export const ResourceImageEditor: React.FC<ResourceImageEditorProps> = ({
  resource,
  onUpdated,
}) => {
  const [newImageUrl, setNewImageUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (url: string) => {
    console.log("New image uploaded:", url);
    setNewImageUrl(url);
  };

  const handleSave = async () => {
    if (!newImageUrl) {
      toast.error("Please upload an image first");
      return;
    }
    
    setSaving(true);
    console.log("Saving image URL:", newImageUrl, "for resource:", resource.id);
    
    try {
      const { error } = await supabase
        .from("resources")
        .update({ image_url: newImageUrl })
        .eq("id", resource.id);

      if (error) {
        console.error("Database update error:", error);
        toast.error(`Failed to update image for "${resource.title}": ${error.message}`);
      } else {
        console.log("Image updated successfully in database");
        toast.success(`Image updated for "${resource.title}"`);
        setNewImageUrl(undefined); // Reset the upload state
        onUpdated?.();
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    console.log("Cancelling image upload");
    setNewImageUrl(undefined);
  };

  // Show new image if uploaded, otherwise show current image
  const displayImageUrl = newImageUrl || resource.image_url;
  const hasNewImage = !!newImageUrl;

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
      <div className="w-32 h-24 flex items-center justify-center bg-muted border rounded overflow-hidden">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={`${resource.title} image`}
            className="object-cover w-full h-full"
            onError={(e) => {
              console.error("Image failed to load:", displayImageUrl);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log("Resource image loaded successfully:", displayImageUrl);
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
          label="Upload New Image"
        />
        {hasNewImage && (
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            ✓ New image ready to save
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
