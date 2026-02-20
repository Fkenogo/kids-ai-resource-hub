import { createOne, readMany, removeOne, upsertOne, readOneById } from './firestoreDb';

type ToggleParams = {
  userId: string;
  targetType: string;
  targetId: string;
  engagementType: string;
};

const getResourceCounterField = (engagementType: string) => {
  const map: Record<string, string> = {
    like: 'like_count',
    save: 'save_count',
    share: 'share_count',
    view: 'view_count',
  };
  return map[engagementType];
};

const updateResourceCounter = async (targetId: string, engagementType: string, delta: number) => {
  const field = getResourceCounterField(engagementType);
  if (!field) return;
  const resource = await readOneById('resources', targetId);
  const current = Number(resource?.[field] || 0);
  const next = Math.max(0, current + delta);
  await upsertOne('resources', targetId, { [field]: next, updated_at: new Date().toISOString() });
};

const updateCommunityLikeCounter = async (postId: string, delta: number) => {
  const post = await readOneById('community_posts', postId);
  const current = Number(post?.like_count || 0);
  const next = Math.max(0, current + delta);
  await upsertOne('community_posts', postId, { like_count: next, updated_at: new Date().toISOString() });
};

const findExisting = async (params: ToggleParams) => {
  const rows = await readMany('user_engagements', {
    filters: [
      { field: 'user_id', op: '==', value: params.userId },
      { field: 'target_type', op: '==', value: params.targetType },
      { field: 'target_id', op: '==', value: params.targetId },
      { field: 'engagement_type', op: '==', value: params.engagementType },
    ],
    limit: 1,
  });
  return rows[0] || null;
};

export const toggleEngagementFromBackend = async (params: ToggleParams): Promise<boolean> => {
  const existing = await findExisting(params);
  if (existing) {
    await removeOne('user_engagements', String(existing.id));
    if (params.targetType === 'resource') await updateResourceCounter(params.targetId, params.engagementType, -1);
    if (params.targetType === 'community_post' && params.engagementType === 'like') {
      await updateCommunityLikeCounter(params.targetId, -1);
    }
    return false;
  }

  await createOne('user_engagements', {
    user_id: params.userId,
    target_type: params.targetType,
    target_id: params.targetId,
    engagement_type: params.engagementType,
    created_at: new Date().toISOString(),
  });
  if (params.targetType === 'resource') await updateResourceCounter(params.targetId, params.engagementType, 1);
  if (params.targetType === 'community_post' && params.engagementType === 'like') {
    await updateCommunityLikeCounter(params.targetId, 1);
  }
  return true;
};

export const getUserEngagementsFromBackend = async (params: {
  userId: string;
  targetType: string;
  targetId: string;
}) => {
  const rows = await readMany('user_engagements', {
    filters: [
      { field: 'user_id', op: '==', value: params.userId },
      { field: 'target_type', op: '==', value: params.targetType },
      { field: 'target_id', op: '==', value: params.targetId },
    ],
  });
  return rows.map((row: Record<string, unknown>) => String(row.engagement_type || ''));
};

export const trackViewFromBackend = async (params: {
  userId: string;
  targetType: string;
  targetId: string;
}) => {
  const existing = await findExisting({
    ...params,
    engagementType: 'view',
  });
  if (!existing) {
    await toggleEngagementFromBackend({
      ...params,
      engagementType: 'view',
    });
  }
};
