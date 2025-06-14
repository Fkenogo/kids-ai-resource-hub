
import { CommunityPost, CommunityUser, CommunityReply } from '@/types/community';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    title: 'Best AI resources for a curious 8-year-old?',
    content: 'My daughter has been asking lots of questions about how computers can "think" and I want to introduce her to AI concepts in an age-appropriate way. She loves hands-on activities and gets bored with too much theory. Has anyone found resources that work well for kids this age?',
    category: 'getting-started',
    authorId: '1',
    authorName: 'Sarah M.',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    datePosted: '2 hours ago',
    lastActivity: '30 minutes ago',
    viewCount: 45,
    likeCount: 12,
    replyCount: 8,
    isSticky: false,
    tags: ['beginner', '8-years-old', 'hands-on', 'getting-started']
  },
  {
    id: '2',
    title: 'STICKY: Welcome New Parents! Start Here 📌',
    content: 'Welcome to our AI education community! This post contains essential information for new members. Please read through our guidelines, introduce yourself, and don\'t hesitate to ask questions. We\'re here to help each other navigate the exciting world of AI education for kids.',
    category: 'getting-started',
    authorId: '2',
    authorName: 'Community Admin',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    datePosted: '1 week ago',
    lastActivity: '1 hour ago',
    viewCount: 234,
    likeCount: 45,
    replyCount: 23,
    isSticky: true,
    tags: ['welcome', 'guidelines', 'new-members']
  },
  {
    id: '3',
    title: 'Teachable Machine vs Scratch for Cognimates - Which is better for 10-year-olds?',
    content: 'I\'m trying to decide between these two platforms for my 10-year-old son. He has some basic Scratch experience but is new to AI. Teachable Machine seems more straightforward, but Cognimates offers more programming depth. What are your experiences?',
    category: 'age-specific',
    authorId: '3',
    authorName: 'Mike T.',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    datePosted: '4 hours ago',
    lastActivity: '2 hours ago',
    viewCount: 67,
    likeCount: 15,
    replyCount: 12,
    isSticky: false,
    tags: ['10-years-old', 'teachable-machine', 'scratch', 'cognimates', 'comparison']
  },
  {
    id: '4',
    title: 'Our Family AI Art Gallery Project - Amazing Results! 🎨',
    content: 'Just finished an incredible weekend project with my kids (ages 9 and 12). We used various AI art generators to create a virtual family art gallery. Each family member contributed 3 AI-generated pieces, and we learned so much about prompting and creativity. The kids were amazed at what they could create! Happy to share our process and results.',
    category: 'project-showcase',
    authorId: '4',
    authorName: 'Jennifer L.',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    datePosted: '6 hours ago',
    lastActivity: '1 hour ago',
    viewCount: 89,
    likeCount: 28,
    replyCount: 15,
    isSticky: false,
    tags: ['project-showcase', 'ai-art', 'family-project', 'creativity', '9-years-old', '12-years-old']
  },
  {
    id: '5',
    title: 'Help! Kids lost interest in coding after trying AI tools',
    content: 'My 11 and 13-year-old were making good progress with Python and JavaScript, but after showing them AI tools like ChatGPT and Copilot, they\'ve lost motivation to code manually. They keep asking "why learn this when AI can do it?" How do I explain the importance of understanding fundamentals?',
    category: 'troubleshooting',
    authorId: '5',
    authorName: 'Alex K.',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    datePosted: '8 hours ago',
    lastActivity: '3 hours ago',
    viewCount: 123,
    likeCount: 34,
    replyCount: 22,
    isSticky: false,
    tags: ['motivation', 'coding', 'ai-tools', '11-years-old', '13-years-old', 'fundamentals']
  },
  {
    id: '6',
    title: 'Looking for AI ethics curriculum for middle schoolers',
    content: 'I want to introduce my 12-year-old to AI ethics concepts - bias in algorithms, privacy concerns, responsible AI use, etc. Are there any curricula or resources specifically designed for this age group? Most materials I find are either too elementary or too advanced.',
    category: 'resource-requests',
    authorId: '6',
    authorName: 'Dr. Lisa R.',
    authorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
    datePosted: '12 hours ago',
    lastActivity: '5 hours ago',
    viewCount: 78,
    likeCount: 19,
    replyCount: 11,
    isSticky: false,
    tags: ['ai-ethics', 'curriculum', '12-years-old', 'middle-school', 'responsible-ai']
  },
  {
    id: '7',
    title: 'Weekly AI Learning Plan for Homeschoolers',
    content: 'I\'ve created a structured weekly plan for introducing AI concepts to homeschooled kids (ages 8-14). Each week focuses on a different aspect: Week 1 - What is AI?, Week 2 - Machine Learning Basics, Week 3 - Hands-on with Teachable Machine, etc. Would love feedback and suggestions for improvements!',
    category: 'curriculum-ideas',
    authorId: '7',
    authorName: 'Maria H.',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    datePosted: '1 day ago',
    lastActivity: '4 hours ago',
    viewCount: 156,
    likeCount: 42,
    replyCount: 18,
    isSticky: false,
    tags: ['homeschool', 'curriculum', 'weekly-plan', '8-14-years', 'structured-learning']
  }
];

export const mockCommunityUsers: CommunityUser[] = [
  {
    id: '1',
    username: 'sarah_ai_mom',
    displayName: 'Sarah M.',
    bio: 'Mother of two curious kids. Software engineer turned AI educator.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    joinDate: '2023-09-15T10:30:00Z',
    postCount: 15,
    replyCount: 45,
    likeCount: 89,
    points: 350,
    badges: [
      { id: '1', name: 'Helpful Contributor', description: 'Received 50+ helpful votes', icon: '🌟', earnedDate: '2023-10-01' },
      { id: '2', name: 'Early Adopter', description: 'Joined in the first month', icon: '🚀', earnedDate: '2023-09-15' }
    ],
    following: ['2', '3', '4'],
    followers: ['2', '3', '4', '5'],
    isOnline: true,
    lastActive: '2023-11-20T10:30:00Z'
  },
  // Add more users as needed...
];

export const mockCommunityReplies: CommunityReply[] = [
  {
    id: '1',
    postId: '1',
    content: 'I highly recommend starting with Teachable Machine! My 8-year-old daughter absolutely loves it. She trained her first model to recognize our family pets and was so excited when it worked. The visual interface makes it very intuitive for kids.',
    authorId: '2',
    authorName: 'Mike T.',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    datePosted: '1 hour ago',
    likeCount: 5
  },
  {
    id: '2',
    postId: '1',
    content: 'SciShow Kids on YouTube has some great AI videos that are perfect for that age. They explain complex concepts in simple terms with fun animations.',
    authorId: '3',
    authorName: 'Jennifer L.',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    datePosted: '45 minutes ago',
    likeCount: 3
  }
];
