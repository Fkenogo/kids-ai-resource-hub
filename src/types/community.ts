
export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: CommunityCategory;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  datePosted: string;
  lastActivity: string;
  viewCount: number;
  likeCount: number;
  replyCount: number;
  isSticky?: boolean;
  tags: string[];
  images?: string[];
}

export interface CommunityReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  datePosted: string;
  likeCount: number;
  parentReplyId?: string; // For nested replies
}

export type CommunityCategory = 
  | 'getting-started'
  | 'age-specific'
  | 'troubleshooting'
  | 'project-showcase'
  | 'curriculum-ideas'
  | 'resource-requests';

export interface CommunityUser {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  joinDate: string;
  postCount: number;
  replyCount: number;
  likeCount: number;
  points: number;
  badges: Badge[];
  following: string[];
  followers: string[];
  isOnline: boolean;
  lastActive: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'reply' | 'like' | 'follow' | 'mention' | 'badge';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // post/user id
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  points: number;
  rank: number;
  badges: Badge[];
}
