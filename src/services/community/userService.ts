
import { supabase } from "@/integrations/supabase/client";
import { CommunityUser } from "@/types/community";

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
