import { resolveDataUserId, getCurrentAuthUser, signInWithEmail, signOutAuth, signUpWithEmail } from '@/services/backend/auth';
import {
  createCommentFromBackend,
  createReviewFromBackend,
  getResourceByIdFromBackend,
  getResourceCommentsFromBackend,
  getResourceReviewsFromBackend,
  getResourcesFromBackend,
  updateResourceRatingFromBackend,
} from '@/services/backend/resources';
import { getUserEngagementsFromBackend, toggleEngagementFromBackend, trackViewFromBackend } from '@/services/backend/engagement';
import { createOne, readOneById, updateOne } from '@/services/backend/firestoreDb';
import { syncPublicProfile } from '@/services/backend/publicProfiles';
import { ResourceFilters } from '@/types';
import { logger } from '@/lib/logger';

export const getCurrentUser = async () => {
  try {
    return await getCurrentAuthUser();
  } catch (err) {
    console.error('Unexpected error in getCurrentUser:', err);
    return null;
  }
};

export const signUp = async (
  email: string,
  password: string,
  metadata?: { display_name?: string; username?: string },
) => {
  logger.debug('Signing up user:', email);
  return signUpWithEmail(email, password, metadata);
};

export const signIn = async (email: string, password: string) => {
  logger.debug('Attempting to sign in with email:', email);
  return signInWithEmail(email, password);
};

export const signOut = async () => {
  logger.debug('Signing out...');
  return signOutAuth();
};

export const getProfile = async (userId: string) => {
  const data = await readOneById('profiles', userId);
  if (!data) {
    throw new Error('Profile not found');
  }
  return data;
};

export const updateProfile = async (userId: string, updates: Record<string, unknown>) => {
  // Always stamp the edit so the backfill can compare freshness against the
  // projection's last write time without guessing.
  await updateOne('profiles', userId, { ...updates, updated_at: new Date().toISOString() });
  const updated = await readOneById('profiles', userId);
  if (updated) {
    await syncPublicProfile(userId, updated);
  }
  return updated;
};

export const getResources = async (filters?: ResourceFilters) => {
  return getResourcesFromBackend(filters);
};

export const getResourceById = async (id: string) => {
  return getResourceByIdFromBackend(id);
};

export const createResource = async (resource: Record<string, unknown>) => {
  const now = new Date().toISOString();
  return createOne(
    'resources',
    { ...resource, created_at: (resource.created_at as string | undefined) || now, updated_at: now },
    resource.id as string | undefined,
  );
};

export const updateResource = async (id: string, updates: Record<string, unknown>) => {
  await updateOne('resources', id, { ...updates, updated_at: new Date().toISOString() });
  return readOneById('resources', id);
};

export const getResourceReviews = async (resourceId: string) => {
  try {
    const data = await getResourceReviewsFromBackend(resourceId);
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getResourceReviews:', err);
    return [];
  }
};

export const createReview = async (review: {
  resource_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
}) => {
  return createReviewFromBackend(review);
};

export const updateResourceRating = async (resourceId: string) => {
  await updateResourceRatingFromBackend(resourceId);
};

export const getResourceComments = async (resourceId: string) => {
  try {
    const data = await getResourceCommentsFromBackend(resourceId);
    return data || [];
  } catch (err) {
    console.error('Unexpected error in getResourceComments:', err);
    return [];
  }
};

export const createComment = async (comment: {
  resource_id: string;
  user_id: string;
  content: string;
}) => {
  return createCommentFromBackend(comment);
};

export const toggleEngagement = async (targetType: string, targetId: string, engagementType: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) throw new Error('Unable to resolve authenticated user');

  return toggleEngagementFromBackend({
    userId: dataUserId,
    targetType,
    targetId,
    engagementType,
  });
};

export const getUserEngagements = async (targetType: string, targetId: string) => {
  const user = await getCurrentUser();
  if (!user) return [];
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) return [];

  return getUserEngagementsFromBackend({
    userId: dataUserId,
    targetType,
    targetId,
  });
};

export const trackView = async (targetType: string, targetId: string) => {
  const user = await getCurrentUser();
  if (!user) return;
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) return;

  await trackViewFromBackend({
    userId: dataUserId,
    targetType,
    targetId,
  });
};
