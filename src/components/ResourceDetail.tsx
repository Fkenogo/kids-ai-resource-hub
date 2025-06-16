import { useState, useEffect } from 'react';
import { Resource, Review } from '@/types';
import { RatingStars } from './RatingStars';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { m } from 'framer-motion';
import { ResourceEngagement } from './ResourceEngagement';
import { ResourceComments } from './ResourceComments';
import { ResourceReviews } from './ResourceReviews';
import { SocialShare } from './SocialShare';
import { trackResourceView } from '@/services/engagementService';

interface ResourceDetailProps {
  resource: Resource;
  reviews: Review[];
}

export const ResourceDetail = ({ resource, reviews }: ResourceDetailProps) => {
  // Track view when component mounts
  useEffect(() => {
    trackResourceView(resource.id);
  }, [resource.id]);

  const getResourceTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getCostLabel = (cost: string) => {
    return cost.charAt(0).toUpperCase() + cost.slice(1);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const resourceUrl = `/resources/${resource.id}`;

  return (
    <div className="space-y-8">
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-panel rounded-xl overflow-hidden shadow-medium"
      >
        <div className="md:flex">
          <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
            {resource.imageUrl ? (
              <img 
                src={resource.imageUrl} 
                alt={resource.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Resource image failed to load:", resource.imageUrl);
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log("Resource image loaded successfully:", resource.imageUrl);
                }}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
          </div>
          
          <div className="p-6 md:w-3/5">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">
                {getResourceTypeLabel(resource.resourceType)}
              </Badge>
              <Badge variant="outline">
                {getCostLabel(resource.cost)}
              </Badge>
              {resource.featuredResource && (
                <Badge className="bg-accent text-white">Featured</Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-medium mb-4">{resource.title}</h1>
            
            <div className="flex items-center mb-4">
              <RatingStars rating={resource.averageRating} size="lg" />
              <span className="ml-2 text-lg">{resource.averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-2">
                ({resource.reviewCount} {resource.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
            
            <p className="text-lg mb-4">
              {resource.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {resource.ageRanges.map(age => (
                <Badge key={age} variant="secondary">
                  Ages {age}
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-3 mb-6">
              <Button 
                className="gap-2" 
                onClick={() => window.open(resource.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
                Visit Resource
              </Button>
              
              <SocialShare 
                url={resourceUrl}
                title={resource.title}
                description={resource.description}
              />
            </div>
            
            <ResourceEngagement resource={resource} />
          </div>
        </div>
      </m.div>
      
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-panel rounded-xl p-6 shadow-medium"
      >
        <h2 className="text-2xl font-medium mb-4">About this resource</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Learning Outcomes</h3>
            {resource.learningOutcomes && resource.learningOutcomes.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {resource.learningOutcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No learning outcomes specified</p>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Skills Attained</h3>
            {resource.skillsAttained && resource.skillsAttained.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {resource.skillsAttained.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No skills specified</p>
            )}
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Added on {formatDate(resource.dateAdded)}
          </div>
        </div>
      </m.div>
      
      {/* Reviews Section */}
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-panel rounded-xl p-6 shadow-medium"
      >
        <ResourceReviews resource={resource} />
      </m.div>
      
      {/* Comments Section */}
      <m.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="glass-panel rounded-xl p-6 shadow-medium"
      >
        <ResourceComments resource={resource} />
      </m.div>
    </div>
  );
};
