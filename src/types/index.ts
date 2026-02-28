
export type AgeRange = '4-7' | '8-10' | '11-13' | '14-17';

export type ResourceType = 
  | 'online_courses_platforms'
  | 'books_reading_materials'
  | 'interactive_tools_apps'
  | 'ai_powered_games_simulations'
  | 'youtube_channels_video_resources'
  | 'hands_on_ai_projects_activities'
  | 'ai_camps_webinars_live_classes'
  | string;

export type CostType = 'free' | 'paid' | 'subscription' | 'freemium';

export type Format = 
  | 'Online Course'
  | 'Book'
  | 'Interactive Tool'
  | 'Game'
  | 'Video'
  | 'Tutorial'
  | 'Activity'
  | 'Camp'
  | 'Live Class'
  | 'Webinar'
  | 'App'
  | 'Web Tool'
  | 'Worksheet'
  | string;

// Firestore-compatible Resource type (snake_case)
export interface Resource {
  // Core fields
  id: string;
  title: string;
  description: string;
  url: string;
  age_ranges: AgeRange[];
  resource_type: ResourceType;
  format?: Format;
  cost: CostType;
  
  // Content fields
  learning_outcomes?: string[];
  skills_attained?: string[];
  key_features?: string[];
  
  // Metadata
  image_url?: string;
  added_by: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  
  // Engagement metrics
  average_rating: number;
  review_count: number;
  featured_resource: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  save_count: number;
  comment_count: number;
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
  formats: string[];
  costTypes: CostType[];
  minRating: number;
  recentlyAdded: boolean;
  searchQuery: string;
}

export type DisplayMode = 'grid' | 'table';

export type SortOption = 'date' | 'rating' | 'popularity';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  datePublished: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  readTime: number; // in minutes
  viewCount: number;
  featured: boolean;
}
