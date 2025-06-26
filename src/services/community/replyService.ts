
import { supabase } from "@/integrations/supabase/client";
import { CommunityReply } from "@/types/community";
import { formatTimeAgo } from "./utils";

export const getCommunityReplies = async (postId: string) => {
  try {
    const { data: replies, error } = await supabase
      .from('community_replies')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching community replies:', error);
      return [];
    }

    if (!replies || replies.length === 0) return [];

    // Fetch profiles separately
    const authorIds = [...new Set(replies.map(reply => reply.author_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url')
      .in('id', authorIds);

    const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

    return replies.map((reply): CommunityReply => {
      const profile = profileMap.get(reply.author_id);
      return {
        id: reply.id,
        postId: reply.post_id,
        content: reply.content,
        authorId: reply.author_id,
        authorName: profile?.display_name || profile?.username || 'Anonymous',
        authorAvatar: profile?.avatar_url,
        datePosted: formatTimeAgo(reply.created_at),
        likeCount: reply.like_count || 0,
        parentReplyId: reply.parent_reply_id
      };
    });
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

  // Update post reply count manually by fetching current count and incrementing
  const { data: currentPost } = await supabase
    .from('community_posts')
    .select('reply_count')
    .eq('id', reply.postId)
    .single();

  const newReplyCount = (currentPost?.reply_count || 0) + 1;

  const { error: updateError } = await supabase
    .from('community_posts')
    .update({ 
      reply_count: newReplyCount,
      last_activity: new Date().toISOString()
    })
    .eq('id', reply.postId);

  if (updateError) console.error('Error updating reply count:', updateError);

  return data;
};
