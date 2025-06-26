
import { supabase } from "@/integrations/supabase/client";
import { CommunityPost, CommunityReply, CommunityUser } from "@/types/community";

// Community Posts
export const getCommunityPosts = async (category?: string) => {
  try {
    let query = supabase
      .from('community_posts')
      .select(`
        *,
        profiles!community_posts_author_id_fkey(username, display_name, avatar_url)
      `)
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }

    return data?.map((post): CommunityPost => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      authorId: post.author_id,
      authorName: post.profiles?.display_name || post.profiles?.username || 'Anonymous',
      authorAvatar: post.profiles?.avatar_url,
      datePosted: formatTimeAgo(post.created_at),
      lastActivity: formatTimeAgo(post.last_activity || post.created_at),
      viewCount: post.view_count || 0,
      likeCount: post.like_count || 0,
      replyCount: post.reply_count || 0,
      isSticky: post.is_sticky || false,
      tags: post.tags || [],
      images: post.images || []
    })) || [];
  } catch (err) {
    console.error('Unexpected error fetching community posts:', err);
    return [];
  }
};

export const createCommunityPost = async (post: {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  images?: string[];
}) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      title: post.title,
      content: post.content,
      category: post.category,
      author_id: user.data.user.id,
      tags: post.tags || [],
      images: post.images || [],
      view_count: 0,
      like_count: 0,
      reply_count: 0,
      is_sticky: false,
      is_locked: false,
      last_activity: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Community Replies
export const getCommunityReplies = async (postId: string) => {
  try {
    const { data, error } = await supabase
      .from('community_replies')
      .select(`
        *,
        profiles!community_replies_author_id_fkey(username, display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching community replies:', error);
      return [];
    }

    return data?.map((reply): CommunityReply => ({
      id: reply.id,
      postId: reply.post_id,
      content: reply.content,
      authorId: reply.author_id,
      authorName: reply.profiles?.display_name || reply.profiles?.username || 'Anonymous',
      authorAvatar: reply.profiles?.avatar_url,
      datePosted: formatTimeAgo(reply.created_at),
      likeCount: reply.like_count || 0,
      parentReplyId: reply.parent_reply_id
    })) || [];
  } catch (err) {
    console.error('Unexpected error fetching community replies:', err);
    return [];
  }
};

export const createCommunityReply = async (reply: {
  postId: string;
  content: string;
  parentReplyId?: string;
}) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('community_replies')
    .insert({
      post_id: reply.postId,
      content: reply.content,
      author_id: user.data.user.id,
      parent_reply_id: reply.parentReplyId || null,
      like_count: 0,
      is_solution: false
    })
    .select()
    .single();

  if (error) throw error;

  // Update post reply count
  await supabase.rpc('increment', {
    table_name: 'community_posts',
    row_id: reply.postId,
    column_name: 'reply_count'
  });

  return data;
};

// Community Users & Stats
export const getCommunityUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        display_name,
        bio,
        avatar_url,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching community users:', error);
      return [];
    }

    // Get post and reply counts for each user
    const usersWithStats = await Promise.all(
      (data || []).map(async (user): Promise<CommunityUser> => {
        const [postsResult, repliesResult] = await Promise.all([
          supabase.from('community_posts').select('id', { count: 'exact' }).eq('author_id', user.id),
          supabase.from('community_replies').select('id', { count: 'exact' }).eq('author_id', user.id)
        ]);

        const postCount = postsResult.count || 0;
        const replyCount = repliesResult.count || 0;
        const points = postCount * 10 + replyCount * 5; // Simple point system

        return {
          id: user.id,
          username: user.username,
          displayName: user.display_name || user.username,
          bio: user.bio,
          avatar: user.avatar_url,
          joinDate: user.created_at,
          postCount,
          replyCount,
          likeCount: 0, // Will be calculated from post likes
          points,
          badges: [], // Will be populated when badge system is implemented
          following: [],
          followers: [],
          isOnline: false, // Will be implemented with real-time presence
          lastActive: user.created_at
        };
      })
    );

    return usersWithStats;
  } catch (err) {
    console.error('Unexpected error fetching community users:', err);
    return [];
  }
};

export const getLeaderboard = async (limit = 10) => {
  const users = await getCommunityUsers();
  return users
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((user, index) => ({
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      points: user.points,
      rank: index + 1,
      badges: user.badges
    }));
};

// Engagement functions
export const togglePostLike = async (postId: string) => {
  const user = await supabase.auth.getUser();
  if (!user.data.user) throw new Error('User not authenticated');

  // Check if user already liked this post
  const { data: existing } = await supabase
    .from('user_engagements')
    .select('id')
    .eq('user_id', user.data.user.id)
    .eq('target_id', postId)
    .eq('target_type', 'community_post')
    .eq('engagement_type', 'like')
    .single();

  if (existing) {
    // Remove like
    await supabase.from('user_engagements').delete().eq('id', existing.id);
    await supabase.rpc('decrement', {
      table_name: 'community_posts',
      row_id: postId,
      column_name: 'like_count'
    });
    return false;
  } else {
    // Add like
    await supabase.from('user_engagements').insert({
      user_id: user.data.user.id,
      target_id: postId,
      target_type: 'community_post',
      engagement_type: 'like'
    });
    await supabase.rpc('increment', {
      table_name: 'community_posts',
      row_id: postId,
      column_name: 'like_count'
    });
    return true;
  }
};

// Helper function
const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInHours / 24;

  if (diffInHours < 1) {
    return `${Math.floor(diffInMs / (1000 * 60))} minutes ago`;
  } else if (diffInHours < 24) {
    return `${Math.floor(diffInHours)} hours ago`;
  } else if (diffInDays < 7) {
    return `${Math.floor(diffInDays)} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};
