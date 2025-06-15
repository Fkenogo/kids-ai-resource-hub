import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { Resource, Review, Comment, User } from "@/types";

type Tables = Database['public']['Tables'];
type ResourceRow = Tables['resources']['Row'];
type ProfileRow = Tables['profiles']['Row'];
type ReviewRow = Tables['resource_reviews']['Row'];
type CommentRow = Tables['resource_comments']['Row'];

// Auth functions
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signUp = async (email: string, password: string, metadata?: any) => {
  // Critical: always set emailRedirectTo so Supabase can handle email verification correctly!
  const redirectUrl = `${window.location.origin}/`;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata || {},
      }
    });
    if (error) {
      console.error("signUp error:", error);
      return { error };
    }
    return { data };
  } catch (err) {
    console.error("Unexpected signUp error:", err);
    return { error: err };
  }
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateProfile = async (userId: string, updates: Partial<ProfileRow>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Resource functions
export const getResources = async (filters?: any) => {
  let query = supabase
    .from('resources')
    .select('*') // FIX: remove join to profiles

    .eq('is_approved', true);

  if (filters?.ageRanges && filters.ageRanges.length > 0) {
    query = query.overlaps('age_ranges', filters.ageRanges);
  }

  if (filters?.resourceTypes && filters.resourceTypes.length > 0) {
    query = query.in('resource_type', filters.resourceTypes);
  }

  if (filters?.costTypes && filters.costTypes.length > 0) {
    query = query.in('cost', filters.costTypes);
  }

  if (filters?.minRating && filters.minRating > 0) {
    query = query.gte('average_rating', filters.minRating);
  }

  if (filters?.searchQuery) {
    query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) {
    console.error("Supabase getResources error:", error);
    throw error;
  }
  if (!Array.isArray(data)) {
    console.error("Supabase getResources did not return array:", data);
    return [];
  }
  return data;
};

export const getResourceById = async (id: string) => {
  const { data, error } = await supabase
    .from('resources')
    .select('*') // FIX: remove join to profiles
    .eq('id', id)
    .single();

  if (error) {
    console.error("Supabase getResourceById error:", error);
    throw error;
  }
  return data;
};

export const createResource = async (resource: Omit<ResourceRow, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('resources')
    .insert(resource)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateResource = async (id: string, updates: Partial<ResourceRow>) => {
  const { data, error } = await supabase
    .from('resources')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Review functions
export const getResourceReviews = async (resourceId: string) => {
  const { data, error } = await supabase
    .from('resource_reviews')
    .select(`
      *,
      profiles!resource_reviews_user_id_fkey(username, display_name)
    `)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createReview = async (review: Omit<ReviewRow, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('resource_reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update resource average rating
  await updateResourceRating(review.resource_id);
  
  return data;
};

export const updateResourceRating = async (resourceId: string) => {
  const { data: reviews } = await supabase
    .from('resource_reviews')
    .select('rating')
    .eq('resource_id', resourceId);

  if (reviews && reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await supabase
      .from('resources')
      .update({ 
        average_rating: Number(averageRating.toFixed(2)),
        review_count: reviews.length 
      })
      .eq('id', resourceId);
  }
};

// Comment functions
export const getResourceComments = async (resourceId: string) => {
  const { data, error } = await supabase
    .from('resource_comments')
    .select(`
      *,
      profiles!resource_comments_user_id_fkey(username, display_name)
    `)
    .eq('resource_id', resourceId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const createComment = async (comment: Omit<CommentRow, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('resource_comments')
    .insert(comment)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update resource comment count
  const { data: comments } = await supabase
    .from('resource_comments')
    .select('id')
    .eq('resource_id', comment.resource_id);

  if (comments) {
    await supabase
      .from('resources')
      .update({ comment_count: comments.length })
      .eq('id', comment.resource_id);
  }
  
  return data;
};

// Engagement functions
export const toggleEngagement = async (
  targetType: string, 
  targetId: string, 
  engagementType: string
): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const { data: existing } = await supabase
    .from('user_engagements')
    .select('id')
    .eq('user_id', user.id)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('engagement_type', engagementType)
    .single();

  if (existing) {
    // Remove engagement
    await supabase
      .from('user_engagements')
      .delete()
      .eq('id', existing.id);
    
    // Update count
    await updateEngagementCount(targetType, targetId, engagementType, -1);
    return false;
  } else {
    // Add engagement
    await supabase
      .from('user_engagements')
      .insert({
        user_id: user.id,
        target_type: targetType,
        target_id: targetId,
        engagement_type: engagementType
      });
    
    // Update count
    await updateEngagementCount(targetType, targetId, engagementType, 1);
    return true;
  }
};

export const getUserEngagements = async (targetType: string, targetId: string) => {
  const user = await getCurrentUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_engagements')
    .select('engagement_type')
    .eq('user_id', user.id)
    .eq('target_type', targetType)
    .eq('target_id', targetId);

  if (error) return [];
  return data.map(e => e.engagement_type);
};

const updateEngagementCount = async (
  targetType: string, 
  targetId: string, 
  engagementType: string, 
  delta: number
) => {
  if (targetType === 'resource') {
    const columnMap: Record<string, string> = {
      'like': 'like_count',
      'save': 'save_count',
      'share': 'share_count',
      'view': 'view_count'
    };
    
    const column = columnMap[engagementType];
    if (column) {
      const { data: resource } = await supabase
        .from('resources')
        .select(column)
        .eq('id', targetId)
        .single();

      if (resource) {
        const newCount = Math.max(0, (resource[column] || 0) + delta);
        await supabase
          .from('resources')
          .update({ [column]: newCount })
          .eq('id', targetId);
      }
    }
  }
};

// Track view (no toggle, just increment)
export const trackView = async (targetType: string, targetId: string) => {
  const user = await getCurrentUser();
  if (!user) return;

  // Check if view already exists for this user/target combination
  const { data: existing } = await supabase
    .from('user_engagements')
    .select('id')
    .eq('user_id', user.id)
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('engagement_type', 'view')
    .single();

  if (!existing) {
    await supabase
      .from('user_engagements')
      .insert({
        user_id: user.id,
        target_type: targetType,
        target_id: targetId,
        engagement_type: 'view'
      });

    await updateEngagementCount(targetType, targetId, 'view', 1);
  }
};
