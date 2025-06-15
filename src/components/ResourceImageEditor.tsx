
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
  const [uploadUrl, setUploadUrl] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!uploadUrl) return;
    setSaving(true);
    const { error } = await supabase
      .from("resources")
      .update({ image_url: uploadUrl })
      .eq("id", resource.id);

    setSaving(false);
    if (error) {
      toast.error(`Failed to update image for "${resource.title}": ${error.message}`);
    } else {
      toast.success(`Image updated for "${resource.title}"`);
      onUpdated?.();
    }
  };

  // Shows the broken image (for reference)
  const previewUrl = uploadUrl || resource.image_url;

  return (
    <div className="border rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
      <div className="w-32 h-24 flex items-center justify-center bg-muted border rounded overflow-hidden">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={`${resource.title} image`}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="text-xs text-gray-500">No image</span>
        )}
      </div>
      <div className="flex-1 w-full">
        <div className="font-semibold mb-2">{resource.title}</div>
        <ImageUploader
          value={uploadUrl}
          onChange={setUploadUrl}
          label="Upload New Image"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={handleSave}
          disabled={!uploadUrl || saving}
          className="w-28"
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};
