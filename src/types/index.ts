
export type AgeRange = '5-7' | '8-10' | '11-13' | '14-17';

export type ResourceType = 
  | 'online_course'
  | 'book'
  | 'interactive_tool' 
  | 'game'
  | 'video'
  | 'tutorial'
  | 'activity'
  | 'camp'
  | 'ai_tool'
  | 'curriculum';

export type CostType = 'free' | 'paid' | 'subscription' | 'freemium';

export type Format = 
  | 'Video'
  | 'Interactive Tool'
  | 'Course'
  | 'Book'
  | 'Game'
  | 'Curriculum'
  | 'AI Tool'
  | 'Learning Platform'
  | 'Course/Tool'
  | 'Tutorial'
  | 'Activity'
  | 'Camp';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  ageRanges: AgeRange[];
  resourceType: ResourceType;
  format?: Format;
  cost: CostType;
  learningOutcomes?: string[];
  skillsAttained?: string[];
  keyFeatures?: string[];
  dateAdded: string;
  addedBy: string;
  averageRating: number;
  reviewCount: number;
  featuredResource: boolean;
  imageUrl?: string;
  // Engagement metrics
  viewCount: number;
  likeCount: number;
  shareCount: number;
  saveCount: number;
  commentCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  dateJoined: string;
  isAdmin: boolean;
  profileBio?: string;
  savedResources?: string[]; // IDs of saved resources
  likedResources?: string[]; // IDs of liked resources
}

export interface Review {
  id: string;
  resourceId: string;
  userId: string;
  username: string;
  rating: number;
  comment?: string;
  datePosted: string;
}

export interface Comment {
  id: string;
  resourceId: string;
  userId: string;
  username: string;
  content: string;
  datePosted: string;
}

export interface ResourceFilters {
  ageRanges: AgeRange[];
  resourceTypes: ResourceType[];
  costTypes: CostType[];
  minRating: number;
  recentlyAdded: boolean;
  searchQuery: string;
}

export type DisplayMode = 'grid' | 'table';

export type SortOption = 'date' | 'rating' | 'popularity';
