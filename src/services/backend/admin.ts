import { countMany, createIfAbsent, createOne, readMany, readOneById, removeOne, updateOne } from './firestoreDb';
import { upsertOne } from './firestoreDb';
import { getResourcePublicationErrors, type ImportedResourceDraft } from '../resourceImportService';
type BackendRow = Record<string, unknown>;
export type AdminResourceRecord = BackendRow & {
  id: string;
  title: string;
  description: string;
  resource_type: string;
  cost?: string;
  is_approved?: boolean;
  is_featured?: boolean;
  image_url?: string;
  view_count?: number;
  average_rating?: number;
  review_count?: number;
  created_at?: string;
};

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
  const rows = await readMany('resources') as unknown as AdminResourceRecord[];
  rows.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
  if (statusFilter === 'approved') return rows.filter((r) => r.is_approved !== false);
  if (statusFilter === 'pending') return rows.filter((r) => r.is_approved === false);
  return rows;
};

export const setResourceApproval = async (id: string, isApproved: boolean) => {
  if (isApproved) {
    const resource = await readOneById('resources', id) as unknown as AdminResourceRecord | null;
    if (!resource) throw new Error('Resource no longer exists.');
    const errors = getResourcePublicationErrors(resource);
    if (errors.length) throw new Error(`Complete the resource before publishing: ${errors.join(' ')}`);
  }
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
  return createOne('resources', { ...data, is_approved: false, created_at: now, updated_at: now }, typeof data.id === 'string' ? data.id : undefined);
};

export const createImportedResourceDraft = async (data: ImportedResourceDraft) => {
  const now = new Date().toISOString();
  const resource = {
    ...data,
    is_approved: false,
    created_at: now,
    updated_at: now,
    date_added: now,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    average_rating: 0,
    review_count: 0,
  };
  const created = await createIfAbsent('resources', data.id, resource);
  return created ? 'created' : 'already_exists';
};

export const updateResourceAdmin = async (id: string, updates: Record<string, unknown>) => {
  const existing = await readOneById('resources', id) as unknown as AdminResourceRecord | null;
  if (!existing) throw new Error('Resource no longer exists.');
  if (existing.is_approved === true) {
    const errors = getResourcePublicationErrors({ ...existing, ...updates });
    if (errors.length) throw new Error(`Published resources must remain complete: ${errors.join(' ')}`);
  }
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
