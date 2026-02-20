import { CommunityCategory, CommunityPost, CommunityReply, CommunityUser, LeaderboardEntry } from '@/types/community';
import { formatTimeAgo } from '@/services/community/utils';
import { createOne, readMany, readOneById, upsertOne, countMany } from './firestoreDb';
import { getCurrentAuthUser, resolveDataUserId } from './auth';
type BackendRow = Record<string, unknown>;

const getProfileMap = async (ids: string[]) => {
  const map = new Map<string, BackendRow | null>();
  await Promise.all(
    ids.map(async (id) => {
      const profile = await readOneById('profiles', id);
      map.set(id, profile || null);
    }),
  );
  return map;
};

export const getCommunityPostsFromBackend = async (category?: string): Promise<CommunityPost[]> => {
  const rows = await readMany('community_posts', { orderBy: { field: 'created_at', direction: 'desc' } });
  const filtered = rows.filter((row: BackendRow) => !category || category === 'all' || row.category === category);
  const authorIds = [...new Set(filtered.map((post: BackendRow) => String(post.author_id || '')))].filter(Boolean);
  const profiles = await getProfileMap(authorIds);

  return filtered.map((post: BackendRow): CommunityPost => {
    const profile = profiles.get(String(post.author_id || ''));
    return {
      id: String(post.id),
      title: String(post.title || ''),
      content: String(post.content || ''),
      category: (post.category || 'getting-started') as CommunityCategory,
      authorId: String(post.author_id || ''),
      authorName: profile?.display_name || profile?.username || 'Anonymous',
      authorAvatar: profile?.avatar_url,
      datePosted: formatTimeAgo(String(post.created_at || new Date().toISOString())),
      lastActivity: formatTimeAgo(String(post.last_activity || post.created_at || new Date().toISOString())),
      viewCount: Number(post.view_count || 0),
      likeCount: Number(post.like_count || 0),
      replyCount: Number(post.reply_count || 0),
      isSticky: !!post.is_sticky,
      tags: Array.isArray(post.tags) ? post.tags : [],
      images: Array.isArray(post.images) ? post.images : [],
    };
  });
};

export const getCommunityRepliesFromBackend = async (postId: string): Promise<CommunityReply[]> => {
  const rows = await readMany('community_replies', {
    filters: [{ field: 'post_id', op: '==', value: postId }],
    orderBy: { field: 'created_at', direction: 'asc' },
  });
  const authorIds = [...new Set(rows.map((reply: BackendRow) => String(reply.author_id || '')))].filter(Boolean);
  const profiles = await getProfileMap(authorIds);

  return rows.map((reply: BackendRow): CommunityReply => {
    const profile = profiles.get(String(reply.author_id || ''));
    return {
      id: String(reply.id),
      postId: String(reply.post_id || ''),
      content: String(reply.content || ''),
      authorId: String(reply.author_id || ''),
      authorName: profile?.display_name || profile?.username || 'Anonymous',
      authorAvatar: profile?.avatar_url,
      datePosted: formatTimeAgo(String(reply.created_at || new Date().toISOString())),
      likeCount: Number(reply.like_count || 0),
      parentReplyId: reply.parent_reply_id || undefined,
    };
  });
};

export const getCommunityUsersFromBackend = async (): Promise<CommunityUser[]> => {
  const rows = await readMany('profiles', { orderBy: { field: 'created_at', direction: 'desc' } });
  return Promise.all(
    rows.map(async (user: BackendRow): Promise<CommunityUser> => {
      const [postCount, replyCount] = await Promise.all([
        countMany('community_posts', [{ field: 'author_id', op: '==', value: user.id }]),
        countMany('community_replies', [{ field: 'author_id', op: '==', value: user.id }]),
      ]);
      const points = postCount * 10 + replyCount * 5;
      const createdAt = String(user.created_at || new Date().toISOString());
      return {
        id: String(user.id),
        username: String(user.username || ''),
        displayName: String(user.display_name || user.username || ''),
        bio: user.bio || undefined,
        avatar: user.avatar_url || undefined,
        joinDate: createdAt,
        postCount,
        replyCount,
        likeCount: 0,
        points,
        badges: [],
        following: [],
        followers: [],
        isOnline: false,
        lastActive: createdAt,
      };
    }),
  );
};

export const getLeaderboardFromBackend = async (leaderboardLimit = 10): Promise<LeaderboardEntry[]> => {
  const users = await getCommunityUsersFromBackend();
  return users
    .sort((a, b) => b.points - a.points)
    .slice(0, leaderboardLimit)
    .map((user, index) => ({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      points: user.points,
      rank: index + 1,
      badges: user.badges,
    }));
};

export const createCommunityPostFromBackend = async (post: {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  images?: string[];
}) => {
  const user = await getCurrentAuthUser();
  if (!user) throw new Error('User not authenticated');
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) throw new Error('Unable to resolve authenticated user');

  const now = new Date().toISOString();
  return createOne('community_posts', {
    title: post.title,
    content: post.content,
    category: post.category as CommunityCategory,
    author_id: dataUserId,
    tags: post.tags || [],
    images: post.images || [],
    view_count: 0,
    like_count: 0,
    reply_count: 0,
    is_sticky: false,
    is_locked: false,
    last_activity: now,
    created_at: now,
    updated_at: now,
  });
};

export const createCommunityReplyFromBackend = async (reply: {
  postId: string;
  content: string;
  parentReplyId?: string;
}) => {
  const user = await getCurrentAuthUser();
  if (!user) throw new Error('User not authenticated');
  const dataUserId = await resolveDataUserId(user);
  if (!dataUserId) throw new Error('Unable to resolve authenticated user');

  const now = new Date().toISOString();
  const created = await createOne('community_replies', {
    post_id: reply.postId,
    content: reply.content,
    author_id: dataUserId,
    parent_reply_id: reply.parentReplyId || null,
    like_count: 0,
    is_solution: false,
    created_at: now,
    updated_at: now,
  });

  const post = await readOneById('community_posts', reply.postId);
  const nextReplyCount = Number(post?.reply_count || 0) + 1;
  await upsertOne('community_posts', reply.postId, {
    reply_count: nextReplyCount,
    last_activity: now,
    updated_at: now,
  });

  return created;
};
