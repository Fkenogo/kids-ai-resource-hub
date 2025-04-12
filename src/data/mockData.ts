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
    title: 'Teachable Machine (Google)',
    description: 'A beginner-friendly AI tool where kids can train models for image/sound recognition.',
    url: 'https://teachablemachine.withgoogle.com/',
    ageRanges: ['8-10', '11-13', '14-17'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['No coding required', 'Instant AI training', 'Works in-browser'],
    learningOutcomes: ['Understand AI training models', 'Recognize bias in AI', 'Create custom recognition models'],
    skillsAttained: ['Data training', 'Classification', 'Real-world AI applications'],
    dateAdded: '2023-10-01T10:30:00Z',
    addedBy: '2',
    averageRating: 4.7,
    reviewCount: 24,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop',
    viewCount: 1250,
    likeCount: 348,
    shareCount: 89,
    saveCount: 167,
    commentCount: 32
  },
  {
    id: '2',
    title: 'Create & Learn AI Explorers',
    description: 'A structured course covering AI concepts with hands-on projects.',
    url: 'https://www.create-learn.us/ai-for-kids/ai-explorers',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'paid',
    keyFeatures: ['Live instructor-led classes', 'Interactive challenges', 'Project-based learning'],
    learningOutcomes: ['Build AI projects', 'Understand AI ethics', 'Apply AI in creative projects'],
    skillsAttained: ['AI coding', 'Image recognition', 'Chatbot design'],
    dateAdded: '2023-09-15T15:45:00Z',
    addedBy: '2',
    averageRating: 4.9,
    reviewCount: 32,
    featuredResource: true,
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2673&auto=format&fit=crop',
    viewCount: 980,
    likeCount: 412,
    shareCount: 120,
    saveCount: 203,
    commentCount: 45
  },
  
  // 5-7 Age Range (Early Learning)
  {
    id: '3',
    title: 'SciShow Kids YouTube',
    description: 'Engaging animated videos introducing AI in simple terms.',
    url: 'https://www.youtube.com/@SciShowKids',
    ageRanges: ['5-7'],
    resourceType: 'video',
    format: 'Video',
    cost: 'free',
    keyFeatures: ['Fun visuals', 'Bite-sized explanations', 'Beginner-friendly'],
    learningOutcomes: ['Understand AI basics', 'Learn about chatbots & voice assistants', 'How AI helps in daily life'],
    skillsAttained: ['Basic AI awareness', 'Curiosity', 'Pattern recognition'],
    dateAdded: '2023-11-03T09:20:00Z',
    addedBy: '1',
    averageRating: 4.5,
    reviewCount: 18,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2669&auto=format&fit=crop',
    viewCount: 756,
    likeCount: 189,
    shareCount: 65,
    saveCount: 98,
    commentCount: 22
  },
  {
    id: '4',
    title: 'ABCs of Artificial Intelligence',
    description: 'A colorful illustrated book introducing AI terms for young kids.',
    url: 'https://newbookrecommendation.com/books-on-ai-for-kids/',
    ageRanges: ['5-7'],
    resourceType: 'book',
    format: 'Book',
    cost: 'paid',
    keyFeatures: ['Easy explanations', 'Fun illustrations', 'Interactive exercises'],
    learningOutcomes: ['Learn AI-related words', 'AI concepts through storytelling', 'Technology awareness'],
    skillsAttained: ['Vocabulary development', 'Early AI literacy', 'Critical thinking'],
    dateAdded: '2023-10-20T11:15:00Z',
    addedBy: '3',
    averageRating: 4.2,
    reviewCount: 45,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=2670&auto=format&fit=crop',
    viewCount: 623,
    likeCount: 142,
    shareCount: 48,
    saveCount: 89,
    commentCount: 18
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
    viewCount: 1430,
    likeCount: 567,
    shareCount: 256,
    saveCount: 345,
    commentCount: 38
  },
  
  // 8-10 Age Range (Beginner AI Learning)
  {
    id: '6',
    title: 'Khan Academy Kids AI Basics',
    description: 'Simple lessons on AI fundamentals with fun activities.',
    url: 'https://www.khanacademy.org/',
    ageRanges: ['8-10'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'free',
    keyFeatures: ['Gamified quizzes', 'Real-world AI examples', 'Interactive learning'],
    learningOutcomes: ['Learn what AI does', 'How AI is used in daily life', 'Basic AI concepts'],
    skillsAttained: ['AI comprehension', 'Tech awareness', 'Digital literacy'],
    dateAdded: '2023-07-05T08:45:00Z',
    addedBy: '1',
    averageRating: 4.8,
    reviewCount: 37,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop',
    viewCount: 876,
    likeCount: 234,
    shareCount: 87,
    saveCount: 156,
    commentCount: 25
  },
  {
    id: '7',
    title: 'Cognimates',
    description: 'An AI-powered coding platform that allows kids to train AI models and create interactive projects using Scratch-based programming.',
    url: 'https://www.media.mit.edu/projects/cognimates/overview/',
    ageRanges: ['8-10'],
    resourceType: 'interactive_tool',
    format: 'Course/Tool',
    cost: 'free',
    keyFeatures: ['AI training tools', 'Scratch-based coding', 'AI chatbot creation', 'Hands-on ML experiments'],
    learningOutcomes: ['Understand how AI models work', 'Train AI with real data', 'AI-powered storytelling and games'],
    skillsAttained: ['Coding with Scratch', 'Machine learning basics', 'Logical & computational thinking'],
    dateAdded: '2023-09-28T13:10:00Z',
    addedBy: '3',
    averageRating: 4.4,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1599687266725-0d4e8e0ed2ad?q=80&w=2670&auto=format&fit=crop',
    viewCount: 542,
    likeCount: 121,
    shareCount: 43,
    saveCount: 78,
    commentCount: 15
  },
  
  // 11-13 Age Range (Hands-on AI & Coding)
  {
    id: '8',
    title: 'iD Tech AI Camp',
    description: 'A structured AI boot camp teaching kids how to build AI models.',
    url: 'https://www.idtech.com/',
    ageRanges: ['11-13'],
    resourceType: 'camp',
    format: 'Camp',
    cost: 'paid',
    keyFeatures: ['Live instruction', 'Hands-on AI training', 'Project-based learning'],
    learningOutcomes: ['Learn Python AI basics', 'Build real-world AI projects', 'Understand AI applications'],
    skillsAttained: ['Python coding', 'Data science', 'AI applications'],
    dateAdded: '2023-11-14T16:20:00Z',
    addedBy: '2',
    averageRating: 4.3,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
    viewCount: 389,
    likeCount: 87,
    shareCount: 32,
    saveCount: 64,
    commentCount: 11
  },
  {
    id: '9',
    title: 'AI4K12 Initiative',
    description: 'AI lesson plans aligned with school curriculum standards.',
    url: 'https://ai4k12.org/',
    ageRanges: ['11-13'],
    resourceType: 'curriculum',
    format: 'Curriculum',
    cost: 'free',
    keyFeatures: ['Teacher-designed activities', 'Structured learning', 'Curriculum integration'],
    learningOutcomes: ['Gain AI literacy across subjects', 'Understand AI fundamentals', 'Explore AI ethics'],
    skillsAttained: ['AI applications', 'Critical thinking', 'Data analysis'],
    dateAdded: '2023-08-30T10:00:00Z',
    addedBy: '3',
    averageRating: 4.5,
    reviewCount: 15,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=2606&auto=format&fit=crop',
    viewCount: 475,
    likeCount: 98,
    shareCount: 42,
    saveCount: 67,
    commentCount: 14
  },
  {
    id: '10',
    title: 'RunwayML',
    description: 'AI-powered creative tools for making art, videos, and music.',
    url: 'https://runwayml.com',
    ageRanges: ['11-13', '14-17'],
    resourceType: 'ai_tool',
    format: 'AI Tool',
    cost: 'freemium',
    keyFeatures: ['No-code AI', 'Instant creative AI generation', 'Media creation tools'],
    learningOutcomes: ['Learn how AI generates content', 'Creative AI usage', 'Ethical considerations'],
    skillsAttained: ['AI content creation', 'Digital art', 'Video editing', 'Storytelling'],
    dateAdded: '2023-10-22T09:15:00Z',
    addedBy: '1',
    averageRating: 4.7,
    reviewCount: 31,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?q=80&w=2670&auto=format&fit=crop',
    viewCount: 925,
    likeCount: 287,
    shareCount: 134,
    saveCount: 203,
    commentCount: 28
  },
  
  // 14-17 Age Range (Advanced AI & Career Readiness)
  {
    id: '11',
    title: 'Kubrio AI Learning',
    description: 'A gamified AI learning platform focusing on creative projects.',
    url: 'https://www.kubrio.com/',
    ageRanges: ['14-17'],
    resourceType: 'online_course',
    format: 'Learning Platform',
    cost: 'paid',
    keyFeatures: ['Project-based', 'Self-paced', 'Interactive learning'],
    learningOutcomes: ['Learn AI through storytelling & games', 'Create AI-powered applications', 'Explore advanced AI concepts'],
    skillsAttained: ['AI creativity', 'Logic', 'Project-based learning'],
    dateAdded: '2023-06-15T11:30:00Z',
    addedBy: '2',
    averageRating: 4.6,
    reviewCount: 48,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1581089781785-603411fa81e5?q=80&w=2670&auto=format&fit=crop',
    viewCount: 843,
    likeCount: 256,
    shareCount: 87,
    saveCount: 142,
    commentCount: 32
  },
  {
    id: '12',
    title: 'Tynker AI Coding',
    description: 'Teaches AI coding through interactive modules.',
    url: 'https://www.tynker.com/',
    ageRanges: ['14-17'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'paid',
    keyFeatures: ['AI-driven programming lessons', 'Interactive projects', 'Guided learning'],
    learningOutcomes: ['Develop AI-based projects using Python', 'Understand core AI algorithms', 'Create practical applications'],
    skillsAttained: ['Python', 'AI application design', 'Computational thinking'],
    dateAdded: '2023-09-05T14:20:00Z',
    addedBy: '3',
    averageRating: 4.3,
    reviewCount: 22,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=2574&auto=format&fit=crop',
    viewCount: 567,
    likeCount: 123,
    shareCount: 45,
    saveCount: 87,
    commentCount: 19
  },
  {
    id: '13',
    title: 'TensorFlow Playground',
    description: 'A web tool to visualize AI neural networks.',
    url: 'https://playground.tensorflow.org/',
    ageRanges: ['14-17'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['Interactive neural network training', 'Visual learning', 'Hands-on experimentation'],
    learningOutcomes: ['Understand AI model training', 'Neural network behavior', 'Model optimization'],
    skillsAttained: ['AI development', 'Machine learning fundamentals', 'Neural network concepts'],
    dateAdded: '2023-11-20T08:40:00Z',
    addedBy: '1',
    averageRating: 4.1,
    reviewCount: 17,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1677442135968-6bd86a41e5fa?q=80&w=2670&auto=format&fit=crop',
    viewCount: 704,
    likeCount: 154,
    shareCount: 67,
    saveCount: 112,
    commentCount: 21
  },
  // Age 8-14 (Beginner to Intermediate)
  {
    id: '14',
    title: 'AI Kids Academy',
    description: 'AI Kids Academy offers interactive courses and creative workshops designed to make AI learning engaging for children.',
    url: 'https://aikids-academy.com/',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'online_course',
    format: 'Course',
    cost: 'paid',
    keyFeatures: ['Interactive AI courses', 'Creative workshops', 'Teacher training programs'],
    learningOutcomes: ['Understand fundamental AI concepts', 'Apply AI knowledge in projects', 'Develop creativity through AI'],
    skillsAttained: ['AI comprehension', 'Coding skills', 'Problem-solving', 'Collaboration'],
    dateAdded: '2023-08-15T13:20:00Z',
    addedBy: '2',
    averageRating: 4.5,
    reviewCount: 26,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2670&auto=format&fit=crop',
    viewCount: 612,
    likeCount: 145,
    shareCount: 52,
    saveCount: 94,
    commentCount: 23
  },
  {
    id: '15',
    title: 'Scratch AI Projects',
    description: 'A collection of user-generated projects on Scratch that introduce and explore artificial intelligence concepts through interactive games and simulations.',
    url: 'https://scratch.mit.edu/search/projects?q=AI',
    ageRanges: ['8-10', '11-13'],
    resourceType: 'interactive_tool',
    format: 'Interactive Tool',
    cost: 'free',
    keyFeatures: ['Diverse AI-themed projects', 'Community engagement', 'Remixing opportunities'],
    learningOutcomes: ['Understand basic AI concepts', 'Develop problem-solving skills', 'Enhance creativity'],
    skillsAttained: ['Coding fundamentals', 'Logical thinking', 'Community collaboration'],
    dateAdded: '2023-07-10T09:15:00Z',
    addedBy: '1',
    averageRating: 4.2,
    reviewCount: 19,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2670&auto=format&fit=crop',
    viewCount: 823,
    likeCount: 219,
    shareCount: 78,
    saveCount: 132,
    commentCount: 27
  },
  {
    id: '16',
    title: 'Kaggle Learn Courses',
    description: 'Kaggle Learn offers a series of micro-courses designed to enhance data science and machine learning skills with hands-on coding exercises and real-world datasets.',
    url: 'https://www.kaggle.com/learn',
    ageRanges: ['14-17'],
    resourceType: 'online_course',
    format: 'Learning Platform',
    cost: 'free',
    keyFeatures: ['Interactive lessons', 'Hands-on coding exercises', 'Real-world datasets', 'Community discussions'],
    learningOutcomes: ['Develop data science foundation', 'Gain Python proficiency', 'Understand ML algorithms'],
    skillsAttained: ['Python programming', 'Data analysis', 'Machine learning development', 'Feature engineering'],
    dateAdded: '2023-10-25T14:50:00Z',
    addedBy: '3',
    averageRating: 4.8,
    reviewCount: 34,
    featuredResource: false,
    imageUrl: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?q=80&w=2671&auto=format&fit=crop',
    viewCount: 934,
    likeCount: 278,
    shareCount: 109,
    saveCount: 184,
    commentCount: 42
  }
];

export const mockReviews: Review[] = [
  {
    id: '101',
    resourceId: '1',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'My kids loved this platform! Teachable Machine made AI concepts so accessible and fun.',
    datePosted: '2023-10-15T09:30:00Z',
  },
  {
    id: '102',
    resourceId: '1',
    userId: '1',
    username: 'parent123',
    rating: 4,
    comment: 'Great tool, though some sections were a bit advanced for my 9-year-old. Perfect with some parental guidance.',
    datePosted: '2023-10-18T14:45:00Z',
  },
  {
    id: '103',
    resourceId: '2',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'Excellent courses! The live instruction really helps keep my child engaged with AI learning.',
    datePosted: '2023-09-20T11:15:00Z',
  },
  {
    id: '104',
    resourceId: '3',
    userId: '1',
    username: 'parent123',
    rating: 4,
    comment: 'SciShow Kids has wonderful AI explainers that my 6-year-old can understand and enjoy.',
    datePosted: '2023-11-07T16:30:00Z',
  },
  {
    id: '105',
    resourceId: '8',
    userId: '3',
    username: 'ai_parent',
    rating: 5,
    comment: 'The iD Tech camp was worth every penny! My daughter learned so much about AI in just one week.',
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
