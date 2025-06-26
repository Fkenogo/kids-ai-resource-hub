
import { supabase } from "@/integrations/supabase/client";
import { CommunityPost, CommunityCategory } from "@/types/community";
import { formatTimeAgo } from "./utils";

export const getCommunityPosts = async (category?: string) => {
  try {
    let query = supabase
      .from('community_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (category && category !== 'all') {
      query = query.eq('category', category as CommunityCategory);
    }

    const { data: posts, error } = await query;
    
    if (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }

    if (!posts || posts.length === 0) return [];

    // Fetch profiles separately to avoid foreign key issues
    const authorIds = [...new Set(posts.map(post => post.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', authorIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    return posts.map((post): CommunityPost => {
      const profile = profileMap.get(post.author_id);
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        category: post.category,
        authorId: post.author_id,
        authorName: profile?.display_name || profile?.username || 'Anonymous',
        authorAvatar: profile?.avatar_url,
        datePosted: formatTimeAgo(post.created_at),
        lastActivity: formatTimeAgo(post.last_activity || post.created_at),
        viewCount: post.view_count || 0,
        likeCount: post.like_count || 0,
        replyCount: post.reply_count || 0,
        isSticky: post.is_sticky || false,
        tags: post.tags || [],
        images: post.images || []
      };
    });
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
      category: post.category as CommunityCategory,
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
