
import { supabase } from "@/integrations/supabase/client";

// Upload a file to the 'resource-images' bucket and return the public URL
export async function uploadResourceImage(file: File): Promise<string> {
  console.log("Starting upload for file:", file.name, "Size:", file.size, "Type:", file.type);
  
  // Check authentication status first
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error("Authentication error:", authError);
    throw new Error(`Authentication failed: ${authError.message}`);
  }
  
  if (!user) {
    console.error("No authenticated user found");
    throw new Error("You must be logged in to upload images");
  }
  
  console.log("Authenticated user:", user.id);
  
  // Check user role for admin/moderator access
  const { data: userRoles, error: roleError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);
    
  if (roleError) {
    console.error("Role check error:", roleError);
    throw new Error(`Permission check failed: ${roleError.message}`);
  }
  
  const hasAdminAccess = userRoles?.some(r => r.role === 'admin' || r.role === 'moderator');
  
  if (!hasAdminAccess) {
    console.error("User does not have admin/moderator role");
    throw new Error("You need admin or moderator permissions to upload resource images");
  }
  
  console.log("User has admin access, proceeding with upload");
  
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
