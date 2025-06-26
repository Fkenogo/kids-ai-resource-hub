
import { supabase } from "@/integrations/supabase/client";

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
    
    // Get current like count and decrease it
    const { data: currentPost } = await supabase
      .from('community_posts')
      .select('like_count')
      .eq('id', postId)
      .single();
    
    const newLikeCount = Math.max(0, (currentPost?.like_count || 0) - 1);
    
    const { error: decrementError } = await supabase
      .from('community_posts')
      .update({ like_count: newLikeCount })
      .eq('id', postId);
    
    if (decrementError) console.error('Error decrementing like count:', decrementError);
    return false;
  } else {
    // Add like
    await supabase.from('user_engagements').insert({
      user_id: user.data.user.id,
      target_id: postId,
      target_type: 'community_post',
      engagement_type: 'like'
    });
    
    // Get current like count and increase it
    const { data: currentPost } = await supabase
      .from('community_posts')
      .select('like_count')
      .eq('id', postId)
      .single();
    
    const newLikeCount = (currentPost?.like_count || 0) + 1;
    
    const { error: incrementError } = await supabase
      .from('community_posts')
      .update({ like_count: newLikeCount })
      .eq('id', postId);
    
    if (incrementError) console.error('Error incrementing like count:', incrementError);
    return true;
  }
};
