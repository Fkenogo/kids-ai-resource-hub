
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, ExternalLink, Plus } from 'lucide-react';
import { m } from 'framer-motion';
import { useState } from 'react';
import { logger } from '@/lib/logger';

interface ShowcaseProject {
  id: string;
  title: string;
  description: string;
  image: string;
  tool: string;
  author: string;
  authorAvatar?: string;
  age: string;
  tags?: string[];
  likes: number;
  comments: number;
}

export const ProjectShowcase = () => {
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // No dummy data - will be populated with real user projects
  const projects: ShowcaseProject[] = [];

  const handleSubmitProject = () => {
    setShowSubmitForm(true);
    // TODO: Implement project submission functionality
    logger.debug('Submit project clicked');
  };

  const handleLike = (projectId: string) => {
    // TODO: Implement like functionality
    logger.debug('Like clicked for project:', projectId);
  };

  const handleComment = (projectId: string) => {
    // TODO: Implement comment functionality
    logger.debug('Comment clicked for project:', projectId);
  };

  const handleViewDetails = (projectId: string) => {
    // TODO: Implement view details functionality
    logger.debug('View details clicked for project:', projectId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Showcase</h2>
        <Button onClick={handleSubmitProject} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Submit Project</span>
        </Button>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to share your amazing AI project with the community!
            </p>
            <Button onClick={handleSubmitProject}>
              <Plus className="h-4 w-4 mr-2" />
              Submit Your Project
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project, index) => (
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
                        {project.tags?.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleLike(project.id)}
                          >
                            <Heart className="h-4 w-4" />
                            <span>{project.likes}</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex items-center space-x-1"
                            onClick={() => handleComment(project.id)}
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{project.comments}</span>
                          </Button>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(project.id)}
                        >
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
      )}

      {showSubmitForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Submit Your Project</h3>
            <p className="text-muted-foreground mb-4">
              Project submission functionality will be implemented soon. Stay tuned!
            </p>
            <Button onClick={() => setShowSubmitForm(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
