
import { supabase } from "@/integrations/supabase/client";

// Upload a file to the 'resource-images' bucket and return the public URL
export async function uploadResourceImage(file: File): Promise<string> {
  console.log("Starting upload for file:", file.name, "Size:", file.size, "Type:", file.type);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
  const filePath = `${fileName}`;
  
  console.log("Upload path:", filePath);
  
  const { data, error } = await supabase.storage
    .from("resource-images")
    .upload(filePath, file, {
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  if (!data) {
    console.error("No data returned from upload");
    throw new Error("Upload failed: No data returned");
  }

  console.log("Upload successful, data:", data);

  // Generate public URL
  const { data: urlData } = supabase.storage
    .from("resource-images")
    .getPublicUrl(data.path);

  console.log("Public URL data:", urlData);

  if (!urlData?.publicUrl) {
    console.error("Failed to generate public URL");
    throw new Error("Upload failed: Could not generate public URL");
  }

  console.log("Final public URL:", urlData.publicUrl);
  return urlData.publicUrl;
}
