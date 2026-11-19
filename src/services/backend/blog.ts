import { createOne, readMany, readOneById, removeOne, updateOne } from './firestoreDb';
import { resolveDataUserId } from './auth';
import { getPublicProfile, getPublicProfilesMap } from './publicProfiles';
type BackendRow = Record<string, unknown>;

export const getBlogPostsFromBackend = async (includeUnpublished = false) => {
  const rows = await readMany('blog_posts', { orderBy: { field: 'created_at', direction: 'desc' } });
  const filtered = includeUnpublished ? rows : rows.filter((row: BackendRow) => row.is_published === true);
  const authorIds = [...new Set(filtered.map((row: BackendRow) => String(row.author_id || '')))].filter(Boolean);
  const profileMap = await getPublicProfilesMap(authorIds);
  return filtered.map((row: BackendRow) => ({
    ...row,
    profiles: profileMap.get(String(row.author_id || ''))
      ? {
          username: profileMap.get(String(row.author_id || ''))?.username,
          display_name: profileMap.get(String(row.author_id || ''))?.display_name,
        }
      : null,
  }));
};

export const getBlogPostBySlugFromBackend = async (slug: string) => {
  const matches = await readMany('blog_posts', {
    filters: [{ field: 'slug', op: '==', value: slug }],
    limit: 1,
  });
  if (matches.length === 0) return null;
  const row = matches[0];
  const profile = row.author_id ? await getPublicProfile(String(row.author_id)) : null;
  return {
    ...row,
    profiles: profile
      ? {
          username: profile.username,
          display_name: profile.display_name,
        }
      : null,
  };
};

export const getBlogCommentsFromBackend = async (postId?: string, includeUnapproved = false) => {
  const rows = await readMany('blog_comments', { orderBy: { field: 'created_at', direction: 'desc' } });
  const filtered = rows.filter((row: BackendRow) => {
    if (postId && row.post_id !== postId) return false;
    if (!includeUnapproved && row.is_approved !== true) return false;
    return true;
  });

  const authorIds = [...new Set(filtered.map((row: BackendRow) => String(row.author_id || '')))].filter(Boolean);
  const profileMap = await getPublicProfilesMap(authorIds);

  return filtered.map((row: BackendRow) => ({
    ...row,
    profiles: profileMap.get(String(row.author_id || ''))
      ? {
          username: profileMap.get(String(row.author_id || ''))?.username,
          display_name: profileMap.get(String(row.author_id || ''))?.display_name,
        }
      : null,
  }));
};

export const createBlogCommentFromBackend = async (
  comment: {
    author_id?: string;
    content: string;
    post_id: string;
    is_approved?: boolean;
    like_count?: number;
    parent_comment_id?: string | null;
    created_at?: string;
  },
) => {
  const authorId = (await resolveDataUserId()) || comment.author_id;
  const now = new Date().toISOString();
  return createOne('blog_comments', {
    ...comment,
    author_id: authorId,
    is_approved: comment.is_approved ?? false,
    like_count: comment.like_count ?? 0,
    parent_comment_id: comment.parent_comment_id ?? null,
    created_at: comment.created_at || now,
    updated_at: now,
  });
};

export const updateBlogCommentFromBackend = async (id: string, updates: Record<string, unknown>) => {
  await updateOne('blog_comments', id, { ...updates, updated_at: new Date().toISOString() });
  return readOneById('blog_comments', id);
};

export const deleteBlogCommentFromBackend = async (id: string) => {
  await removeOne('blog_comments', id);
};
