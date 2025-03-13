
export type AgeRange = '5-7' | '8-10' | '11-13' | '14-17';

export type ResourceType = 
  | 'online_course'
  | 'book'
  | 'interactive_tool'
  | 'game'
  | 'video'
  | 'tutorial'
  | 'activity'
  | 'camp';

export type CostType = 'free' | 'paid' | 'subscription' | 'freemium';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  ageRanges: AgeRange[];
  resourceType: ResourceType;
  cost: CostType;
  learningOutcomes?: string[];
  skillsAttained?: string[];
  dateAdded: string;
  addedBy: string;
  averageRating: number;
  reviewCount: number;
  featuredResource: boolean;
  imageUrl?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  dateJoined: string;
  isAdmin: boolean;
  profileBio?: string;
}

export interface Review {
  id: string;
  resourceId: string;
  userId: string;
  username: string; // Added for display purposes
  rating: number;
  comment?: string;
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
