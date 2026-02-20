
import {
  createCommunityPostFromBackend,
  getCommunityPostsFromBackend,
} from "@/services/backend/community";

export const getCommunityPosts = async (category?: string) => {
  return getCommunityPostsFromBackend(category);
};

export const createCommunityPost = async (post: {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  images?: string[];
}) => {
  return createCommunityPostFromBackend(post);
};
