
import { AgeRange, Resource, ResourceType, CostType, Review, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'parent123',
    email: 'parent@example.com',
    dateJoined: '2023-09-15T10:30:00Z',
    isAdmin: false,
    profileBio: 'Parent of two curious kids interested in AI and technology.',
  },
  {
    id: '2',
    username: 'tech_educator',
    email: 'educator@example.com',
    dateJoined: '2023-08-20T14:15:00Z',
    isAdmin: true,
    profileBio: 'Computer science teacher with a passion for introducing AI concepts to children.',
  },
  {
    id: '3',
    username: 'ai_parent',
    email: 'aiparent@example.com',
    dateJoined: '2023-10-05T09:45:00Z',
    isAdmin: false,
    profileBio: 'Working in the AI industry and looking for resources to teach my kids.',
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'AI for Kids: Interactive Course',
    description: 'A fun, interactive online course designed to introduce children to the basics of artificial intelligence through games and activities.',
    url: 'https://example.com/ai-kids-course',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'online_course',
    cost: 'freemium',
    learningOutcomes: ['Understanding AI concepts', 'Basic programming skills', 'Critical thinking'],
    skillsAttained: ['Problem solving', 'Logical reasoning', 'Technology literacy'],
    dateAdded: '2023-10-01T10:30:00Z',
    addedBy: '2',
    averageRating: 4.7,
    reviewCount: 24,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Machine Learning for Young Minds',
    description: 'An illustrated book explaining machine learning concepts in simple terms for children, with colorful diagrams and real-world examples.',
    url: 'https://example.com/ml-young-minds',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'book',
    cost: 'paid',
    learningOutcomes: ['Machine learning basics', 'Data patterns recognition', 'AI ethics introduction'],
    skillsAttained: ['Analytical thinking', 'Pattern recognition', 'Ethical considerations'],
    dateAdded: '2023-09-15T15:45:00Z',
    addedBy: '2',
    averageRating: 4.9,
    reviewCount: 32,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2673&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Code Your Own AI Assistant',
    description: 'A step-by-step tutorial teaching kids how to build a simple AI assistant using child-friendly programming tools.',
    url: 'https://example.com/code-ai-assistant',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'tutorial',
    cost: 'free',
    learningOutcomes: ['Basic coding skills', 'Understanding of AI assistants', 'Project management'],
    skillsAttained: ['Coding', 'Project planning', 'Testing and debugging'],
    dateAdded: '2023-11-03T09:20:00Z',
    addedBy: '1',
    averageRating: 4.5,
    reviewCount: 18,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'AI Pet Simulator Game',
    description: 'A game where children can create and train virtual pets using basic AI concepts, learning about reinforcement learning in a fun way.',
    url: 'https://example.com/ai-pet-game',
    ageRanges: ['5-7', '8-10'],
    resourceType: 'game',
    cost: 'freemium',
    learningOutcomes: ['Reinforcement learning concepts', 'Basic training algorithms', 'Pet care principles'],
    skillsAttained: ['Decision making', 'Cause and effect understanding', 'Digital pet care'],
    dateAdded: '2023-10-20T11:15:00Z',
    addedBy: '3',
    averageRating: 4.2,
    reviewCount: 45,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Picture Recognition Workshop',
    description: 'An interactive workshop where kids learn how computers recognize images through hands-on activities and experiments.',
    url: 'https://example.com/picture-workshop',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'activity',
    cost: 'paid',
    learningOutcomes: ['Computer vision basics', 'Image recognition understanding', 'AI limitations awareness'],
    skillsAttained: ['Visual pattern recognition', 'Critical analysis', 'Technology limitations understanding'],
    dateAdded: '2023-08-12T14:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 29,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '6',
    title: 'Summer AI Camp for Teens',
    description: 'A week-long summer camp where teenagers learn about AI through programming challenges, robotics, and creative projects.',
    url: 'https://example.com/ai-summer-camp',
    ageRanges: ['14-17'],
    resourceType: 'camp',
    cost: 'paid',
    learningOutcomes: ['Comprehensive AI understanding', 'Programming skills', 'Robotics basics', 'Creative AI applications'],
    skillsAttained: ['Advanced programming', 'Project collaboration', 'Public speaking', 'Critical thinking'],
    dateAdded: '2023-07-05T08:45:00Z',
    addedBy: '1',
    averageRating: 4.8,
    reviewCount: 37,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
  },
  {
    id: '7',
    title: 'AI Ethics for Young Thinkers',
    description: 'A series of videos discussing AI ethics and responsible technology use in terms children can understand and relate to.',
    url: 'https://example.com/ai-ethics-videos',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'video',
    cost: 'free',
    learningOutcomes: ['AI ethics understanding', 'Responsible technology use', 'Critical evaluation of AI'],
    skillsAttained: ['Ethical reasoning', 'Digital citizenship', 'Critical media consumption'],
    dateAdded: '2023-09-28T13:10:00Z',
    addedBy: '3',
    averageRating: 4.4,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1599687266725-0d4e8e0ed2ad?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '8',
    title: 'Build Your Own Smart Robot',
    description: 'An interactive tool that guides children through the process of programming a simple robot with AI capabilities.',
    url: 'https://example.com/smart-robot-builder',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'interactive_tool',
    cost: 'subscription',
    learningOutcomes: ['Robotics basics', 'Simple programming', 'AI for automation'],
    skillsAttained: ['Technical skills', 'Problem solving', 'Computational thinking'],
    dateAdded: '2023-11-14T16:20:00Z',
    addedBy: '2',
    averageRating: 4.3,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
  },
];

export const mockReviews: Review[] = [
  {
    id: '101',
    resourceId: '1',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'My kids loved this course! It made AI concepts so accessible and fun.',
    datePosted: '2023-10-15T09:30:00Z',
  },
  {
    id: '102',
    resourceId: '1',
    userId: '1',
    username: 'parent123',
    rating: 4,
    comment: 'Great content, though some sections were a bit advanced for my 9-year-old.',
    datePosted: '2023-10-18T14:45:00Z',
  },
  {
    id: '103',
    resourceId: '2',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'Excellent book! The illustrations really help explain complex concepts.',
    datePosted: '2023-09-20T11:15:00Z',
  },
  {
    id: '104',
    resourceId: '3',
    userId: '1',
    username: 'parent123',
    rating: 4,
    comment: 'My teenager found this very engaging. Would recommend for coding enthusiasts.',
    datePosted: '2023-11-07T16:30:00Z',
  },
  {
    id: '105',
    resourceId: '5',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'Worth every penny! The hands-on approach was perfect for my visual learner.',
    datePosted: '2023-08-30T10:00:00Z',
  },
];

// Helper functions for working with mock data
export const getResourceById = (id: string): Resource | undefined => {
  return mockResources.find(resource => resource.id === id);
};

export const getReviewsForResource = (resourceId: string): Review[] => {
  return mockReviews.filter(review => review.resourceId === resourceId);
};

export const getRecentResources = (count: number = 4): Resource[] => {
  return [...mockResources]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, count);
};

export const getTopRatedResources = (count: number = 4): Resource[] => {
  return [...mockResources]
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, count);
};

export const getFeaturedResources = (count: number = 3): Resource[] => {
  return mockResources.filter(r => r.featuredResource).slice(0, count);
};

export const filterResources = (filters: {
  ageRanges?: AgeRange[];
  resourceTypes?: ResourceType[];
  costTypes?: CostType[];
  minRating?: number;
  recentlyAdded?: boolean;
  searchQuery?: string;
}): Resource[] => {
  let filtered = [...mockResources];
  
  // Filter by age ranges
  if (filters.ageRanges && filters.ageRanges.length > 0) {
    filtered = filtered.filter(resource => 
      resource.ageRanges.some(age => filters.ageRanges?.includes(age))
    );
  }
  
  // Filter by resource types
  if (filters.resourceTypes && filters.resourceTypes.length > 0) {
    filtered = filtered.filter(resource => 
      filters.resourceTypes?.includes(resource.resourceType)
    );
  }
  
  // Filter by cost types
  if (filters.costTypes && filters.costTypes.length > 0) {
    filtered = filtered.filter(resource => 
      filters.costTypes?.includes(resource.cost)
    );
  }
  
  // Filter by minimum rating
  if (filters.minRating !== undefined) {
    filtered = filtered.filter(resource => 
      resource.averageRating >= filters.minRating
    );
  }
  
  // Filter by recently added (last 30 days)
  if (filters.recentlyAdded) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    filtered = filtered.filter(resource => 
      new Date(resource.dateAdded) >= thirtyDaysAgo
    );
  }
  
  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(resource => 
      resource.title.toLowerCase().includes(query) || 
      resource.description.toLowerCase().includes(query)
    );
  }
  
  return filtered;
};
