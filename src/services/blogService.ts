
import {
  createBlogCommentFromBackend,
  deleteBlogCommentFromBackend,
  getBlogCommentsFromBackend,
  getBlogPostBySlugFromBackend,
  getBlogPostsFromBackend,
  updateBlogCommentFromBackend,
} from "@/services/backend/blog";
import { getCurrentAuthUser } from "@/services/backend/auth";
import { createOne, removeOne, updateOne, readOneById } from "@/services/backend/firestoreDb";

type BlogPostPayload = Record<string, unknown> & { id?: string };
type BlogCommentPayload = {
  post_id: string;
  content: string;
  author_id?: string;
  is_approved?: boolean;
  like_count?: number;
  parent_comment_id?: string | null;
  created_at?: string;
};

// Blog Posts
export const getBlogPosts = async (includeUnpublished = false) => {
  return getBlogPostsFromBackend(includeUnpublished);
};

export const getBlogPostBySlug = async (slug: string) => {
  return getBlogPostBySlugFromBackend(slug);
};

export const createBlogPost = async (post: BlogPostPayload) => {
  return createOne('blog_posts', post, post.id);
};

export const updateBlogPost = async (id: string, updates: Record<string, unknown>) => {
  await updateOne('blog_posts', id, updates);
  return readOneById('blog_posts', id);
};

export const deleteBlogPost = async (id: string) => {
  await removeOne('blog_posts', id);
};

// Blog Comments
export const getBlogComments = async (postId?: string, includeUnapproved = false) => {
  return getBlogCommentsFromBackend(postId, includeUnapproved);
};

export const createBlogComment = async (comment: BlogCommentPayload) => {
  return createBlogCommentFromBackend(comment);
};

export const updateBlogComment = async (id: string, updates: Record<string, unknown>) => {
  return updateBlogCommentFromBackend(id, updates);
};

export const deleteBlogComment = async (id: string) => {
  await deleteBlogCommentFromBackend(id);
};

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// Get current user with better error handling
export const getCurrentUserForBlog = async () => {
  try {
    const user = await getCurrentAuthUser();
    if (!user) {
      throw new Error('No authenticated user found');
    }
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};
