
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getResources, 
  getResourceById, 
  getResourceReviews, 
  getResourceComments,
  createResource,
  createReview,
  createComment,
  toggleEngagement,
  getUserEngagements,
  trackView
} from '@/services/backendService';
import { ResourceFilters } from '@/types';
import { toast } from 'sonner';

// Resources
export const useResources = (filters?: ResourceFilters) => {
  return useQuery({
    queryKey: ['resources', filters],
    // Let React Query retain request failures as errors. Returning [] here
    // makes permission/index/network failures indistinguishable from a valid
    // empty directory.
    queryFn: () => getResources(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useResource = (id: string) => {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: async () => {
      try {
        return await getResourceById(id);
      } catch (err) {
        console.error('useResource error:', err);
        return null;
      }
    },
    enabled: !!id,
  });
};

export const useCreateResource = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast.success('Resource created successfully');
    },
    onError: (error) => {
      console.error('Error creating resource:', error);
      toast.error('Failed to create resource');
    },
  });
};

// Reviews
export const useResourceReviews = (resourceId: string) => {
  return useQuery({
    queryKey: ['resource-reviews', resourceId],
    queryFn: () => getResourceReviews(resourceId),
    enabled: !!resourceId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createReview,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resource-reviews', data.resource_id] });
      queryClient.invalidateQueries({ queryKey: ['resource', data.resource_id] });
      toast.success('Review added successfully');
    },
    onError: (error) => {
      console.error('Error creating review:', error);
      toast.error('Failed to add review');
    },
  });
};

// Comments
export const useResourceComments = (resourceId: string) => {
  return useQuery({
    queryKey: ['resource-comments', resourceId],
    queryFn: () => getResourceComments(resourceId),
    enabled: !!resourceId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resource-comments', data.resource_id] });
      toast.success('Comment added successfully');
    },
    onError: (error) => {
      console.error('Error creating comment:', error);
      toast.error('Failed to add comment');
    },
  });
};

// Engagements
export const useToggleEngagement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ targetType, targetId, engagementType }: {
      targetType: string;
      targetId: string;
      engagementType: string;
    }) => toggleEngagement(targetType, targetId, engagementType),
    onSuccess: (isEngaged, variables) => {
      queryClient.invalidateQueries({ queryKey: ['resource', variables.targetId] });
      queryClient.invalidateQueries({ queryKey: ['user-engagements', variables.targetType, variables.targetId] });
      
      const action = isEngaged ? 'added' : 'removed';
      toast.success(`${variables.engagementType} ${action}`);
    },
    onError: (error) => {
      console.error('Error toggling engagement:', error);
      toast.error('Failed to update engagement');
    },
  });
};

export const useUserEngagements = (targetType: string, targetId: string) => {
  return useQuery({
    queryKey: ['user-engagements', targetType, targetId],
    queryFn: () => getUserEngagements(targetType, targetId),
    enabled: !!targetType && !!targetId,
  });
};

export const useTrackView = () => {
  return useMutation({
    mutationFn: ({ targetType, targetId }: {
      targetType: string;
      targetId: string;
    }) => trackView(targetType, targetId),
    onError: (error) => {
      console.error('Error tracking view:', error);
    },
  });
};
