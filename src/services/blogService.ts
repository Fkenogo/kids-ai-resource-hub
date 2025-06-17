
import { supabase } from "@/integrations/supabase/client";

// Blog Posts
export const getBlogPosts = async (includeUnpublished = false) => {
  let query = supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey(username, display_name)
    `)
    .order('created_at', { ascending: false });

  if (!includeUnpublished) {
    query = query.eq('is_published', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      profiles!blog_posts_author_id_fkey(username, display_name)
    `)
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
};

export const createBlogPost = async (post: any) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert(post)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateBlogPost = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteBlogPost = async (id: string) => {
  const { error } = await supabase
    .from('blog_posts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Blog Comments
export const getBlogComments = async (postId?: string, includeUnapproved = false) => {
  let query = supabase
    .from('blog_comments')
    .select(`
      *,
      profiles!blog_comments_author_id_fkey(username, display_name),
      blog_posts!blog_comments_post_id_fkey(title, slug)
    `)
    .order('created_at', { ascending: false });

  if (postId) {
    query = query.eq('post_id', postId);
  }

  if (!includeUnapproved) {
    query = query.eq('is_approved', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createBlogComment = async (comment: any) => {
  const { data, error } = await supabase
    .from('blog_comments')
    .insert(comment)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateBlogComment = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('blog_comments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteBlogComment = async (id: string) => {
  const { error } = await supabase
    .from('blog_comments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};
