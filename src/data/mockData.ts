import { AgeRange, Resource, ResourceType, CostType, Review, User, Format } from '../types';

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
  // Featured Resources
  {
    id: '1',
    title: 'Machine Learning for Kids',
    description: 'A friendly introduction to AI and machine learning for kids, with real projects to try.',
    url: 'https://machinelearningforkids.co.uk/',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['No coding needed', 'Guided projects', 'Visual interfaces'],
    learningOutcomes: ['Machine learning basics', 'Model training concepts', 'AI applications'],
    skillsAttained: ['Machine learning understanding', 'Problem identification', 'Critical thinking'],
    dateAdded: '2023-10-01T10:30:00Z',
    addedBy: '2',
    averageRating: 4.7,
    reviewCount: 24,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'NoviLabs',
    description: 'Hands-on AI learning with focus on exploring prompting concepts in a guided environment.',
    url: 'https://novilabs.com',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['No coding needed', 'Progressive learning system', 'Responsible AI usage'],
    learningOutcomes: ['Understanding AI capabilities', 'Prompt engineering basics', 'Ethics of AI'],
    skillsAttained: ['Data literacy', 'AI interaction', 'Critical evaluation'],
    dateAdded: '2023-09-15T15:45:00Z',
    addedBy: '2',
    averageRating: 4.9,
    reviewCount: 32,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2673&auto=format&fit=crop',
  },
  
  // 5-7 Age Range (Early Learning)
  {
    id: '3',
    title: 'Curious AI by YouTube',
    description: 'Child-friendly videos explaining AI applications and examples.',
    url: 'https://youtube.com/playlist?list=curious-ai-kids',
    ageRanges: ['5-7'],
    resourceType: 'video',
    format: 'Video',
    cost: 'free',
    keyFeatures: ['Engaging animations', 'Simple beginner content', 'Real-life examples'],
    learningOutcomes: ['Understanding AI basics', 'Simple AI examples', 'Ethics for kids'],
    skillsAttained: ['AI awareness', 'Digital literacy', 'Curiosity'],
    dateAdded: '2023-11-03T09:20:00Z',
    addedBy: '1',
    averageRating: 4.5,
    reviewCount: 18,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop',
  },
  {
    id: '4',
    title: 'ABCs of AI',
    description: 'An illustrated book introducing AI concepts in an accessible way for young children.',
    url: 'https://abcsofai.com',
    ageRanges: ['5-7'],
    resourceType: 'book',
    format: 'Book',
    cost: 'paid',
    keyFeatures: ['AI applications in everyday life', 'Colorful illustrations', 'Simple vocabulary'],
    learningOutcomes: ['Basic understanding of AI', 'AI in everyday objects', 'Technology awareness'],
    skillsAttained: ['Digital literacy', 'Tech awareness', 'Critical thinking'],
    dateAdded: '2023-10-20T11:15:00Z',
    addedBy: '3',
    averageRating: 4.2,
    reviewCount: 45,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2670&auto=format&fit=crop',
  },
  {
    id: '5',
    title: 'Quick, Draw!',
    description: 'A fun drawing game that uses AI to recognize sketches, perfect for introducing young children to AI concepts.',
    url: 'https://quickdraw.withgoogle.com/',
    ageRanges: ['5-7'],
    resourceType: 'game',
    format: 'Game',
    cost: 'free',
    keyFeatures: ['Fun interactive gameplay', 'Visual learning', 'Simple pattern recognition concepts'],
    learningOutcomes: ['Understanding AI recognition', 'Pattern matching', 'Visual input for AI'],
    skillsAttained: ['Creativity', 'Digital drawing', 'Understanding AI limitations'],
    dateAdded: '2023-08-12T14:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 29,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2670&auto=format&fit=crop',
  },
  
  // 8-10 Age Range (Beginner AI Learning)
  {
    id: '6',
    title: 'Code.org AI for Kids',
    description: 'Coding introduction with AI concepts for beginners, using block-based programming to teach AI principles.',
    url: 'https://code.org/ai',
    ageRanges: ['8-10'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'free',
    keyFeatures: ['Fun challenges using coding blocks', 'Step-by-step lessons', 'Real world applications'],
    learningOutcomes: ['Learn AI basics', 'Build simple coding projects', 'Understand ethical considerations'],
    skillsAttained: ['Logic', 'Problem-solving', 'Computational thinking'],
    dateAdded: '2023-07-05T08:45:00Z',
    addedBy: '1',
    averageRating: 4.8,
    reviewCount: 37,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
  },
  {
    id: '7',
    title: 'AI for Kids Academy',
    description: 'AI fundamentals course with fun, supervised activities and games for children.',
    url: 'https://aiforkidsacademy.com',
    ageRanges: ['8-10'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'free',
    keyFeatures: ['Gamified learning', 'Guided activities', 'Interactive challenges'],
    learningOutcomes: ['Learn how AI is used', 'Basic AI concepts', 'Safety guidelines'],
    skillsAttained: ['Tech literacy', 'AI awareness', 'Digital citizenship'],
    dateAdded: '2023-09-28T13:10:00Z',
    addedBy: '3',
    averageRating: 4.4,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1599687266725-0d4e8e0ed2ad?q=80&w=2670&auto=format&fit=crop',
  },
  
  // 11-13 Age Range (Hands-on AI & Coding)
  {
    id: '8',
    title: 'Scratch + AI Extension',
    description: 'Visual block-based programming with AI capabilities for middle school students.',
    url: 'https://scratch.mit.edu/ai',
    ageRanges: ['11-13'],
    resourceType: 'interactive_tool',
    format: 'Course/Tool',
    cost: 'free',
    keyFeatures: ['Live instruction', 'Project-based learning', 'Create interactive projects'],
    learningOutcomes: ['AI integration basics', 'Visual block programming', 'Creative problem solving'],
    skillsAttained: ['Python coding', 'Pattern recognition', 'Project planning'],
    dateAdded: '2023-11-14T16:20:00Z',
    addedBy: '2',
    averageRating: 4.3,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
  },
  {
    id: '9',
    title: 'NVIDIA AI Education',
    description: 'AI curriculum tailored for middle school students, focusing on deep learning basics.',
    url: 'https://nvidia.com/en-us/education',
    ageRanges: ['11-13'],
    resourceType: 'curriculum',
    format: 'Curriculum',
    cost: 'free',
    keyFeatures: ['Teacher resources', 'Structured activities', 'Hands-on projects'],
    learningOutcomes: ['Deep learning basics', 'AI model training', 'Applied machine learning'],
    skillsAttained: ['Critical thinking', 'AI applications', 'Technical concepts'],
    dateAdded: '2023-08-30T10:00:00Z',
    addedBy: '3',
    averageRating: 4.5,
    reviewCount: 15,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
  },
  {
    id: '10',
    title: 'RunwayML',
    description: 'AI-powered creative tool for generating images, video, and animations without coding.',
    url: 'https://runwayml.com',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'ai_tool',
    format: 'AI Tool',
    cost: 'freemium',
    keyFeatures: ['No code AI tools', 'Creative applications', 'Visual creation'],
    learningOutcomes: ['Learn how AI generates content', 'Creative AI usage', 'Ethical considerations'],
    skillsAttained: ['AI content creation', 'Digital art', 'Tool mastery'],
    dateAdded: '2023-10-22T09:15:00Z',
    addedBy: '1',
    averageRating: 4.7,
    reviewCount: 31,
    featuredResource: false,
    imageUrl: null,
  },
  
  // 14-17 Age Range (Advanced AI & Career Readiness)
  {
    id: '11',
    title: 'AI Learning Path by Coursera',
    description: 'Online course series covering AI fundamentals through advanced concepts for high school students.',
    url: 'https://coursera.org/ai-learning-path',
    ageRanges: ['14-17'],
    resourceType: 'online_course',
    format: 'Learning Platform',
    cost: 'paid',
    keyFeatures: ['Full course curriculum', 'Interactive exercises', 'Expert instruction'],
    learningOutcomes: ['AI foundations', 'Programming skills', 'Real-world applications'],
    skillsAttained: ['AI concepts', 'Technical skills', 'Critical thinking'],
    dateAdded: '2023-06-15T11:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 48,
    featuredResource: true,
    imageUrl: null,
  },
  {
    id: '12',
    title: 'Kaggle for Teens',
    description: 'Data science and AI competitions specifically designed for teenage students.',
    url: 'https://kaggle.com/teens',
    ageRanges: ['14-17'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'paid',
    keyFeatures: ['Real-world datasets', 'Community challenges', 'Interactive programming environment'],
    learningOutcomes: ['Data science skills', 'Machine learning applications', 'Collaborative problem solving'],
    skillsAttained: ['Python coding', 'Machine learning', 'Data analysis'],
    dateAdded: '2023-09-05T14:20:00Z',
    addedBy: '3',
    averageRating: 4.3,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: null,
  },
  {
    id: '13',
    title: 'The AI Education Playground',
    description: 'Interactive resources for AI learning, featuring multiple tools and simulations to explore AI concepts.',
    url: 'https://aieducationplayground.org',
    ageRanges: ['14-17'],
    resourceType: 'ai_tool',
    format: 'AI Tool',
    cost: 'free',
    keyFeatures: ['Interactive demonstrations', 'Multiple AI concepts', 'Beginner-friendly interfaces'],
    learningOutcomes: ['Deep understanding of ML algorithms', 'See how neural networks function', 'Model building'],
    skillsAttained: ['Advanced AI concepts', 'Neural networks', 'Model debugging'],
    dateAdded: '2023-11-20T08:40:00Z',
    addedBy: '1',
    averageRating: 4.1,
    reviewCount: 17,
    featuredResource: false,
    imageUrl: null,
  }
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
