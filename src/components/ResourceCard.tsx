
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Resource } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  index?: number;
}

export const ResourceCard = ({ resource, index = 0 }: ResourceCardProps) => {
  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const getResourceTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getCostLabel = (cost: string) => {
    return cost.charAt(0).toUpperCase() + cost.slice(1);
  };

  const STAGGER_DELAY = 0.05;
  const initialDelay = index * STAGGER_DELAY;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1],
        delay: initialDelay
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Link to={`/resources/${resource.id}`}>
        <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col shadow-soft transition-all duration-300 hover:shadow-medium">
          <div className="relative h-44 overflow-hidden">
            {resource.imageUrl ? (
              <img 
                src={resource.imageUrl} 
                alt={resource.title} 
                className="w-full h-full object-cover transform transition-transform duration-400 hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image available</span>
              </div>
            )}
            {resource.featuredResource && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-accent text-white">Featured</Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-grow p-5">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="outline" className="font-normal text-xs">
                {getResourceTypeLabel(resource.resourceType)}
              </Badge>
              <Badge variant="outline" className="font-normal text-xs">
                {getCostLabel(resource.cost)}
              </Badge>
            </div>
            
            <h3 className="text-xl font-medium mb-2 line-clamp-1">{resource.title}</h3>
            
            <p className="text-muted-foreground mb-4 text-sm line-clamp-2">
              {resource.description}
            </p>
            
            <div className="mt-auto flex flex-wrap gap-2 mb-3">
              {resource.ageRanges.map(age => (
                <Badge key={age} variant="secondary" className="text-xs">
                  Ages {age}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span>{resource.averageRating.toFixed(1)}</span>
                <span className="text-muted-foreground ml-1">({resource.reviewCount})</span>
              </div>
              <span className="text-muted-foreground text-xs">
                {formatDate(resource.dateAdded)}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
