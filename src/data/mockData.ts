
import { Review, User } from '../types';

// All dummy/mock resource data removed - use only real resources from Supabase

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

export const getReviewsForResource = (resourceId: string): Review[] => {
  return mockReviews.filter(review => review.resourceId === resourceId);
};

