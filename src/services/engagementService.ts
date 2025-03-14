
import { toast } from "sonner";
import { Resource, Comment, User } from "@/types";

// Simulated local storage keys
const VIEWS_KEY = 'resource_views';
const LIKES_KEY = 'resource_likes';
const SHARES_KEY = 'resource_shares';
const SAVES_KEY = 'resource_saves';
const COMMENTS_KEY = 'resource_comments';
const CURRENT_USER_KEY = 'current_user';

// Simulate a current user (in a real app, this would come from authentication)
const getCurrentUser = (): User => {
  const storedUser = localStorage.getItem(CURRENT_USER_KEY);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  
  // Create a demo user if none exists
  const demoUser: User = {
    id: 'demo-user',
    username: 'Guest User',
    email: 'guest@example.com',
    dateJoined: new Date().toISOString(),
    isAdmin: false,
    savedResources: [],
    likedResources: []
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
  return demoUser;
};

// Update the current user
const updateCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Track a resource view
export const trackResourceView = (resourceId: string): void => {
  const viewsData = localStorage.getItem(VIEWS_KEY);
  const views = viewsData ? JSON.parse(viewsData) : {};
  
  // Increment view count for this resource
  views[resourceId] = (views[resourceId] || 0) + 1;
  
  localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
};

// Get view count for a resource
export const getResourceViewCount = (resourceId: string): number => {
  const viewsData = localStorage.getItem(VIEWS_KEY);
  if (!viewsData) return 0;
  
  const views = JSON.parse(viewsData);
  return views[resourceId] || 0;
};

// Toggle like for a resource
export const toggleResourceLike = (resourceId: string): boolean => {
  const currentUser = getCurrentUser();
  const likedResources = currentUser.likedResources || [];
  
  // Check if already liked
  const isLiked = likedResources.includes(resourceId);
  
  if (isLiked) {
    // Unlike
    currentUser.likedResources = likedResources.filter(id => id !== resourceId);
    updateCurrentUser(currentUser);
    
    // Update like count
    const likesData = localStorage.getItem(LIKES_KEY);
    const likes = likesData ? JSON.parse(likesData) : {};
    likes[resourceId] = Math.max((likes[resourceId] || 0) - 1, 0);
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    
    toast.success("Resource unliked");
    return false;
  } else {
    // Like
    currentUser.likedResources = [...likedResources, resourceId];
    updateCurrentUser(currentUser);
    
    // Update like count
    const likesData = localStorage.getItem(LIKES_KEY);
    const likes = likesData ? JSON.parse(likesData) : {};
    likes[resourceId] = (likes[resourceId] || 0) + 1;
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    
    toast.success("Resource liked");
    return true;
  }
};

// Check if resource is liked by current user
export const isResourceLiked = (resourceId: string): boolean => {
  const currentUser = getCurrentUser();
  const likedResources = currentUser.likedResources || [];
  return likedResources.includes(resourceId);
};

// Get like count for a resource
export const getResourceLikeCount = (resourceId: string): number => {
  const likesData = localStorage.getItem(LIKES_KEY);
  if (!likesData) return 0;
  
  const likes = JSON.parse(likesData);
  return likes[resourceId] || 0;
};

// Track a resource share
export const trackResourceShare = (resourceId: string): void => {
  const sharesData = localStorage.getItem(SHARES_KEY);
  const shares = sharesData ? JSON.parse(sharesData) : {};
  
  // Increment share count for this resource
  shares[resourceId] = (shares[resourceId] || 0) + 1;
  
  localStorage.setItem(SHARES_KEY, JSON.stringify(shares));
};

// Get share count for a resource
export const getResourceShareCount = (resourceId: string): number => {
  const sharesData = localStorage.getItem(SHARES_KEY);
  if (!sharesData) return 0;
  
  const shares = JSON.parse(sharesData);
  return shares[resourceId] || 0;
};

// Toggle save for a resource
export const toggleResourceSave = (resourceId: string): boolean => {
  const currentUser = getCurrentUser();
  const savedResources = currentUser.savedResources || [];
  
  // Check if already saved
  const isSaved = savedResources.includes(resourceId);
  
  if (isSaved) {
    // Unsave
    currentUser.savedResources = savedResources.filter(id => id !== resourceId);
    updateCurrentUser(currentUser);
    
    // Update save count
    const savesData = localStorage.getItem(SAVES_KEY);
    const saves = savesData ? JSON.parse(savesData) : {};
    saves[resourceId] = Math.max((saves[resourceId] || 0) - 1, 0);
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    
    toast.success("Resource removed from saved items");
    return false;
  } else {
    // Save
    currentUser.savedResources = [...savedResources, resourceId];
    updateCurrentUser(currentUser);
    
    // Update save count
    const savesData = localStorage.getItem(SAVES_KEY);
    const saves = savesData ? JSON.parse(savesData) : {};
    saves[resourceId] = (saves[resourceId] || 0) + 1;
    localStorage.setItem(SAVES_KEY, JSON.stringify(saves));
    
    toast.success("Resource saved successfully");
    return true;
  }
};

// Check if resource is saved by current user
export const isResourceSaved = (resourceId: string): boolean => {
  const currentUser = getCurrentUser();
  const savedResources = currentUser.savedResources || [];
  return savedResources.includes(resourceId);
};

// Get save count for a resource
export const getResourceSaveCount = (resourceId: string): number => {
  const savesData = localStorage.getItem(SAVES_KEY);
  if (!savesData) return 0;
  
  const saves = JSON.parse(savesData);
  return saves[resourceId] || 0;
};

// Add a comment to a resource
export const addResourceComment = (resourceId: string, content: string): Comment => {
  const currentUser = getCurrentUser();
  
  const commentsData = localStorage.getItem(COMMENTS_KEY);
  const allComments = commentsData ? JSON.parse(commentsData) : {};
  
  const resourceComments = allComments[resourceId] || [];
  
  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    resourceId,
    userId: currentUser.id,
    username: currentUser.username,
    content,
    datePosted: new Date().toISOString()
  };
  
  // Add the new comment
  allComments[resourceId] = [newComment, ...resourceComments];
  
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  
  toast.success("Comment added");
  return newComment;
};

// Get comments for a resource
export const getResourceComments = (resourceId: string): Comment[] => {
  const commentsData = localStorage.getItem(COMMENTS_KEY);
  if (!commentsData) return [];
  
  const allComments = JSON.parse(commentsData);
  return allComments[resourceId] || [];
};

// Get comment count for a resource
export const getResourceCommentCount = (resourceId: string): number => {
  return getResourceComments(resourceId).length;
};

// Get the most popular resources based on different metrics
export const getPopularResources = (
  resources: Resource[], 
  metric: 'views' | 'likes' | 'shares' | 'saves' | 'comments' | 'ratings' = 'views',
  limit: number = 5
): Resource[] => {
  const sortedResources = [...resources].sort((a, b) => {
    switch (metric) {
      case 'views':
        return getResourceViewCount(b.id) - getResourceViewCount(a.id);
      case 'likes':
        return getResourceLikeCount(b.id) - getResourceLikeCount(a.id);
      case 'shares':
        return getResourceShareCount(b.id) - getResourceShareCount(a.id);
      case 'saves':
        return getResourceSaveCount(b.id) - getResourceSaveCount(a.id);
      case 'comments':
        return getResourceCommentCount(b.id) - getResourceCommentCount(a.id);
      case 'ratings':
        return b.averageRating - a.averageRating;
      default:
        return 0;
    }
  });
  
  return sortedResources.slice(0, limit);
};

// Get total engagement score (combined metric)
export const getResourceEngagementScore = (resourceId: string): number => {
  return (
    getResourceViewCount(resourceId) +
    getResourceLikeCount(resourceId) * 2 +
    getResourceShareCount(resourceId) * 3 +
    getResourceSaveCount(resourceId) * 2 +
    getResourceCommentCount(resourceId) * 2
  );
};

// Native share functionality
export const shareResource = (resource: Resource): void => {
  if (navigator.share) {
    navigator.share({
      title: resource.title,
      text: `Check out ${resource.title} on Teach Your Kid AI`,
      url: window.location.href
    })
    .then(() => {
      trackResourceShare(resource.id);
      toast.success("Resource shared successfully");
    })
    .catch((error) => {
      console.error('Error sharing:', error);
      // Fall back to clipboard
      copyToClipboard(window.location.href);
    });
  } else {
    // Fall back to clipboard
    copyToClipboard(window.location.href);
    trackResourceShare(resource.id);
  }
};

// Helper function to copy to clipboard
const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text);
  toast.success("Link copied to clipboard");
};
