import { ResourceFilters } from '@/types';
import { readMany, readOneById, createOne, upsertOne } from './firestoreDb';
import { resolveDataUserId } from './auth';
import { getPublicProfilesMap } from './publicProfiles';
import { normalizeResourceType, parseFormatTags } from '@/utils/resourceTaxonomy';
type BackendRow = Record<string, unknown>;

const applyClientFilters = (rows: BackendRow[], filters?: ResourceFilters) => {
  if (!filters) return rows;
  return rows.filter((row) => {
    if (filters.ageRanges.length > 0) {
      const ages = Array.isArray(row.age_ranges) ? row.age_ranges : [];
      if (!ages.some((age) => filters.ageRanges.includes(String(age) as ResourceFilters['ageRanges'][number]))) return false;
    }
    const normalizedType = normalizeResourceType(String(row.resource_type || ''));
    if (filters.resourceTypes.length > 0 && !filters.resourceTypes.includes(normalizedType as ResourceFilters['resourceTypes'][number])) return false;
    if (filters.formats.length > 0) {
      const rowFormats = parseFormatTags((row.format as string | undefined) || '');
      const hasMatchingFormat = rowFormats.some((format) => filters.formats.includes(format));
      if (!hasMatchingFormat) return false;
    }
    if (filters.costTypes.length > 0 && !filters.costTypes.includes(String(row.cost) as ResourceFilters['costTypes'][number])) return false;
    if (filters.minRating > 0 && Number(row.average_rating || 0) < filters.minRating) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const title = String(row.title || '').toLowerCase();
      const description = String(row.description || '').toLowerCase();
      if (!title.includes(q) && !description.includes(q)) return false;
    }
    return true;
  });
};

const calculateReviewAggregate = async (resourceId: string) => {
  const reviews = await readMany('resource_reviews', { filters: [{ field: 'resource_id', op: '==', value: resourceId }] });
  if (reviews.length === 0) return { average: 0, count: 0 };
  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return { average: Number((total / reviews.length).toFixed(2)), count: reviews.length };
};

const calculateCommentCount = async (resourceId: string) => {
  const comments = await readMany('resource_comments', { filters: [{ field: 'resource_id', op: '==', value: resourceId }] });
  return comments.length;
};

export const getResourcesFromBackend = async (filters?: ResourceFilters) => {
  const rows = await readMany('resources', {
    filters: [{ field: 'is_approved', op: '==', value: true }],
    orderBy: { field: 'created_at', direction: 'desc' },
  });
  return applyClientFilters(rows, filters);
};

export const getResourceByIdFromBackend = async (id: string) => {
  return readOneById('resources', id);
};

export const getResourceReviewsFromBackend = async (resourceId: string) => {
  const rows = await readMany('resource_reviews', {
    filters: [{ field: 'resource_id', op: '==', value: resourceId }],
    orderBy: { field: 'created_at', direction: 'desc' },
  });
  const userIds = [...new Set(rows.map((row: BackendRow) => String(row.user_id || '')))].filter(Boolean);
  const profilesMap = await getPublicProfilesMap(userIds);
  return rows.map((row: BackendRow) => ({
    ...row,
    profiles: profilesMap.get(String(row.user_id || ''))
      ? {
          username: profilesMap.get(String(row.user_id || ''))?.username,
          display_name: profilesMap.get(String(row.user_id || ''))?.display_name,
        }
      : null,
  }));
};

export const getResourceCommentsFromBackend = async (resourceId: string) => {
  const rows = await readMany('resource_comments', {
    filters: [{ field: 'resource_id', op: '==', value: resourceId }],
    orderBy: { field: 'created_at', direction: 'desc' },
  });
  const userIds = [...new Set(rows.map((row: BackendRow) => String(row.user_id || '')))].filter(Boolean);
  const profilesMap = await getPublicProfilesMap(userIds);
  return rows.map((row: BackendRow) => ({
    ...row,
    profiles: profilesMap.get(String(row.user_id || ''))
      ? {
          username: profilesMap.get(String(row.user_id || ''))?.username,
          display_name: profilesMap.get(String(row.user_id || ''))?.display_name,
        }
      : null,
  }));
};

export const createReviewFromBackend = async (review: {
  resource_id: string;
  user_id: string;
  rating: number;
  comment?: string | null;
}) => {
  const userId = (await resolveDataUserId()) || review.user_id;
  const duplicate = await readMany('resource_reviews', {
    filters: [
      { field: 'resource_id', op: '==', value: review.resource_id },
      { field: 'user_id', op: '==', value: userId },
    ],
    limit: 1,
  });
  if (duplicate.length > 0) {
    throw new Error('duplicate key value violates unique constraint');
  }

  const now = new Date().toISOString();
  const created = await createOne('resource_reviews', {
    resource_id: review.resource_id,
    user_id: userId,
    rating: review.rating,
    comment: review.comment ?? null,
    helpful_count: 0,
    is_verified_purchase: false,
    created_at: now,
    updated_at: now,
  });

  const aggregate = await calculateReviewAggregate(review.resource_id);
  await upsertOne('resources', review.resource_id, {
    average_rating: aggregate.average,
    review_count: aggregate.count,
    updated_at: now,
  });

  return created;
};

export const createCommentFromBackend = async (comment: {
  resource_id: string;
  user_id: string;
  content: string;
}) => {
  const userId = (await resolveDataUserId()) || comment.user_id;
  const now = new Date().toISOString();
  const created = await createOne('resource_comments', {
    resource_id: comment.resource_id,
    user_id: userId,
    content: comment.content,
    like_count: 0,
    is_pinned: false,
    parent_comment_id: null,
    created_at: now,
    updated_at: now,
  });

  const commentCount = await calculateCommentCount(comment.resource_id);
  await upsertOne('resources', comment.resource_id, {
    comment_count: commentCount,
    updated_at: now,
  });

  return created;
};

export const updateResourceRatingFromBackend = async (resourceId: string) => {
  const aggregate = await calculateReviewAggregate(resourceId);
  await upsertOne('resources', resourceId, {
    average_rating: aggregate.average,
    review_count: aggregate.count,
    updated_at: new Date().toISOString(),
  });
};

export const getBrokenResourceImagesFromBackend = async () => {
  const rows = await readMany('resources', { orderBy: { field: 'created_at', direction: 'asc' } });
  return rows
    .filter((row: BackendRow) => typeof row.image_url === 'string' && row.image_url.startsWith('/lovable-uploads/'))
    .map((row: BackendRow) => ({
      id: String(row.id),
      title: String(row.title || ''),
      image_url: String(row.image_url || ''),
    }));
};

export const updateResourceImageUrlFromBackend = async (resourceId: string, imageUrl: string) => {
  await upsertOne('resources', resourceId, {
    image_url: imageUrl,
    updated_at: new Date().toISOString(),
  });
};
