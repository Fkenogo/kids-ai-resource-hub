
import { supabase } from "@/integrations/supabase/client";

// Upload a file to the 'resource-images' bucket and return the public URL
export async function uploadResourceImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 8)}.${fileExt}`;
  const filePath = `${fileName}`;
  const { data, error } = await supabase.storage
    .from("resource-images")
    .upload(filePath, file, {
      upsert: false,
      cacheControl: "3600",
    });

  if (error) {
    console.error("Image upload error:", error);
    return null;
  }

  // Generate public URL
  const { data: urlData } = supabase.storage
    .from("resource-images")
    .getPublicUrl(data.path);

  return urlData?.publicUrl ?? null;
}
