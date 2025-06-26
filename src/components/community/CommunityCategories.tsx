
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  AlertCircle, 
  Lightbulb, 
  GraduationCap, 
  HelpCircle,
  Hash
} from 'lucide-react';

interface CommunityCategoriesProps {
  onCategoryChange?: (category: string | undefined) => void;
}

export const CommunityCategories = ({ onCategoryChange }: CommunityCategoriesProps) => {
  const categories = [
    {
      id: 'all',
      name: 'All Posts',
      icon: Hash,
      description: 'View all community posts',
      color: 'text-blue-600',
      count: 0
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: BookOpen,
      description: 'New to AI education? Start here!',
      color: 'text-green-600',
      count: 15
    },
    {
      id: 'age-specific',
      name: 'Age-Specific',
      icon: Users,
      description: 'Discussions for specific age groups',
      color: 'text-blue-600',
      count: 12
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: AlertCircle,
      description: 'Get help with problems and challenges',
      color: 'text-red-600',
      count: 8
    },
    {
      id: 'project-showcase',
      name: 'Project Showcase',
      icon: Lightbulb,
      description: 'Share your amazing projects!',
      color: 'text-purple-600',
      count: 18
    },
    {
      id: 'curriculum-ideas',
      name: 'Curriculum Ideas',
      icon: GraduationCap,
      description: 'Teaching plans and curriculum sharing',
      color: 'text-yellow-600',
      count: 6
    },
    {
      id: 'resource-requests',
      name: 'Resource Requests',
      icon: HelpCircle,
      description: 'Looking for specific resources?',
      color: 'text-indigo-600',
      count: 4
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'all') {
      onCategoryChange?.(undefined);
    } else {
      onCategoryChange?.(categoryId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Button
              key={category.id}
              variant="ghost"
              className="w-full justify-start h-auto p-3 flex-col items-start"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-2">
                  <IconComponent className={`h-4 w-4 ${category.color}`} />
                  <span className="font-medium">{category.name}</span>
                </div>
                {category.count > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground text-left mt-1">
                {category.description}
              </p>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
