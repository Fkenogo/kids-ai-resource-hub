
import { firebaseStorage } from "@/services/backend/firebaseClient";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getCurrentAuthUser, resolveDataUserId } from "@/services/backend/auth";
import { readMany } from "@/services/backend/firestoreDb";
import { logger } from "@/lib/logger";

const buildFilePath = (file: File) => {
  const fileExt = file.name.split('.').pop() || 'bin';
  const randomSuffix = Math.random().toString(36).slice(2, 10);
  return `resource-images/${Date.now()}-${randomSuffix}.${fileExt}`;
};

const uploadToFirebaseStorage = async (file: File) => {
  const filePath = buildFilePath(file);
  const storageRef = ref(firebaseStorage, filePath);
  const snapshot = await uploadBytes(storageRef, file, {
    contentType: file.type || undefined,
  });
  return getDownloadURL(snapshot.ref);
};

// Upload a file to the 'resource-images' bucket and return the public URL
export async function uploadResourceImage(file: File): Promise<string> {
  logger.debug("Starting upload for file:", file.name, "Size:", file.size, "Type:", file.type);
  
  // Check authentication status first
  const user = await getCurrentAuthUser();
  
  if (!user) {
    console.error("No authenticated user found");
    throw new Error("You must be logged in to upload images");
  }
  
  logger.debug("Authenticated user:", user.id);
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) {
    throw new Error("Could not resolve user identity for storage permissions");
  }
  
  // Check user role for admin/moderator access
  const userRoles = await readMany('user_roles', {
    filters: [{ field: 'user_id', op: '==', value: dataUserId }],
  });
  
  const hasAdminAccess = userRoles?.some(r => r.role === 'admin' || r.role === 'moderator');
  
  if (!hasAdminAccess) {
    console.error("User does not have admin/moderator role");
    throw new Error("You need admin or moderator permissions to upload resource images");
  }
  
  logger.debug("User has admin access, proceeding with upload");
  
  const firebaseUrl = await uploadToFirebaseStorage(file);
  logger.debug("Upload successful (Firebase):", firebaseUrl);
  return firebaseUrl;
}
