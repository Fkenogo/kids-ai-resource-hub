
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { m } from 'framer-motion';

const projectShowcases = [
  {
    id: '1',
    title: 'My 8-year-old built a pet classifier!',
    description: 'Using Teachable Machine, my daughter trained an AI to recognize different dog breeds. She had so much fun showing it pictures of our neighbor\'s pets!',
    author: 'Sarah M.',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    age: '8 years old',
    tool: 'Teachable Machine',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
    likes: 23,
    comments: 8,
    tags: ['beginner', 'image-recognition', 'pets']
  },
  {
    id: '2',
    title: 'Family AI Art Gallery Project',
    description: 'We spent the weekend using AI art generators to create a virtual family art gallery. Each family member contributed their own AI-generated masterpiece!',
    author: 'Mike T.',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    age: '10-12 years old',
    tool: 'DALL-E & Midjourney',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400',
    likes: 45,
    comments: 15,
    tags: ['creative', 'family-project', 'art']
  },
  {
    id: '3',
    title: 'Voice Assistant for Grandma',
    description: 'My 14-year-old created a simple voice assistant using Scratch for Cognimates to help his grandmother with daily reminders. It was his first real AI project!',
    author: 'Jennifer L.',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    age: '14 years old',
    tool: 'Cognimates',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=400',
    likes: 67,
    comments: 22,
    tags: ['intermediate', 'voice-ai', 'helpful']
  }
];

export const ProjectShowcase = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Showcase</h2>
        <Button variant="outline">Submit Project</Button>
      </div>
      
      <div className="grid gap-6">
        {projectShowcases.map((project, index) => (
          <m.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    {project.tool}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={project.authorAvatar} />
                    <AvatarFallback>{project.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                    <p className="text-muted-foreground mb-3">{project.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                      <span>by {project.author}</span>
                      <span>•</span>
                      <span>{project.age}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{project.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{project.comments}</span>
                        </Button>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </m.div>
        ))}
      </div>
    </div>
  );
};
