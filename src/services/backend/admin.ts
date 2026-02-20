import { countMany, createOne, readMany, removeOne, updateOne } from './firestoreDb';
import { upsertOne } from './firestoreDb';
type BackendRow = Record<string, unknown>;

export const getAdminCounts = async () => {
  const [resources, products, users, communityPosts] = await Promise.all([
    countMany('resources'),
    countMany('products'),
    countMany('profiles'),
    countMany('community_posts'),
  ]);
  return { resources, products, users, communityPosts };
};

export const getAdminResources = async (statusFilter: 'all' | 'approved' | 'pending') => {
  const rows = await readMany('resources', { orderBy: { field: 'created_at', direction: 'desc' } });
  if (statusFilter === 'approved') return rows.filter((r: BackendRow) => r.is_approved === true);
  if (statusFilter === 'pending') return rows.filter((r: BackendRow) => r.is_approved === false);
  return rows;
};

export const setResourceApproval = async (id: string, isApproved: boolean) => {
  await updateOne('resources', id, { is_approved: isApproved, updated_at: new Date().toISOString() });
};

export const setResourceFeatured = async (id: string, isFeatured: boolean) => {
  await updateOne('resources', id, { is_featured: isFeatured, updated_at: new Date().toISOString() });
};

export const deleteResource = async (id: string) => {
  await removeOne('resources', id);
};

export const createResourceAdmin = async (data: Record<string, unknown>) => {
  const now = new Date().toISOString();
  return createOne('resources', { ...data, is_approved: true, created_at: now, updated_at: now }, data.id);
};

export const updateResourceAdmin = async (id: string, updates: Record<string, unknown>) => {
  await updateOne('resources', id, { ...updates, updated_at: new Date().toISOString() });
};

export const updateResourceImageAdmin = async (id: string, imageUrl: string) => {
  await upsertOne('resources', id, { image_url: imageUrl, updated_at: new Date().toISOString() });
};

export const setCommunityPostSticky = async (postId: string, sticky: boolean) => {
  await updateOne('community_posts', postId, { is_sticky: sticky, updated_at: new Date().toISOString() });
};

export const setCommunityPostLocked = async (postId: string, locked: boolean) => {
  await updateOne('community_posts', postId, { is_locked: locked, updated_at: new Date().toISOString() });
};

export const deleteCommunityPost = async (postId: string) => {
  await removeOne('community_posts', postId);
};

export const deleteCommunityReply = async (replyId: string) => {
  await removeOne('community_replies', replyId);
};
