
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getCommunityPosts, 
  createCommunityPost,
  getCommunityReplies,
  createCommunityReply,
  getCommunityUsers,
  getLeaderboard,
  togglePostLike
} from '@/services/communityService';
import { toast } from 'sonner';

// Posts
export const useCommunityPosts = (category?: string) => {
  return useQuery({
    queryKey: ['community-posts', category],
    queryFn: () => getCommunityPosts(category),
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCommunityPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error) => {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    },
  });
};

// Replies
export const useCommunityReplies = (postId: string) => {
  return useQuery({
    queryKey: ['community-replies', postId],
    queryFn: () => getCommunityReplies(postId),
    enabled: !!postId,
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createCommunityReply,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['community-replies', variables.postId] });
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success('Reply posted successfully!');
    },
    onError: (error) => {
      console.error('Error creating reply:', error);
      toast.error('Failed to post reply');
    },
  });
};

// Users and Leaderboard
export const useCommunityUsers = () => {
  return useQuery({
    queryKey: ['community-users'],
    queryFn: getCommunityUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['community-leaderboard'],
    queryFn: () => getLeaderboard(10),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Engagement
export const useTogglePostLike = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: togglePostLike,
    onSuccess: (isLiked) => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success(isLiked ? 'Post liked!' : 'Like removed');
    },
    onError: (error) => {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    },
  });
};
