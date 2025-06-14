
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  HelpCircle, 
  Trophy, 
  Lightbulb, 
  Search 
} from 'lucide-react';

const categories = [
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Beginner questions and first steps',
    icon: BookOpen,
    postCount: 145,
    color: 'text-green-600'
  },
  {
    id: 'age-specific',
    name: 'Age-Specific',
    description: 'Discussions around specific age groups',
    icon: Users,
    postCount: 89,
    color: 'text-blue-600'
  },
  {
    id: 'troubleshooting',
    name: 'Troubleshooting',
    description: 'Technical support and help',
    icon: HelpCircle,
    postCount: 67,
    color: 'text-red-600'
  },
  {
    id: 'project-showcase',
    name: 'Project Showcase',
    description: 'Share AI projects and achievements',
    icon: Trophy,
    postCount: 234,
    color: 'text-purple-600'
  },
  {
    id: 'curriculum-ideas',
    name: 'Curriculum Ideas',
    description: 'Lesson plans and learning activities',
    icon: Lightbulb,
    postCount: 78,
    color: 'text-yellow-600'
  },
  {
    id: 'resource-requests',
    name: 'Resource Requests',
    description: 'Ask for specific recommendations',
    icon: Search,
    postCount: 56,
    color: 'text-orange-600'
  }
];

export const CommunityCategories = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Discussion Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {categories.map(category => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
            >
              <div className="flex items-center space-x-3 w-full">
                <IconComponent className={`h-5 w-5 ${category.color}`} />
                <div className="flex-1 text-left">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1">
                    {category.description}
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.postCount}
                </Badge>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
