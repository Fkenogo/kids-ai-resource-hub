
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  Upload,
  Image
} from 'lucide-react';
import { Resource } from '@/types';

interface ResourceManagementCardProps {
  resource: Resource;
  onImageUpload: (resourceId: string) => void;
  onSetFeatured: (resourceId: string) => void;
  onDeleteResource: (resourceId: string) => void;
}

export const ResourceManagementCard = ({
  resource,
  onImageUpload,
  onSetFeatured,
  onDeleteResource
}: ResourceManagementCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-start gap-4">
              {resource.imageUrl ? (
                <img 
                  src={resource.imageUrl} 
                  alt={resource.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                  <Image className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {resource.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline">{resource.resourceType}</Badge>
                  <Badge variant={resource.cost === 'free' ? 'success' : 'default'}>
                    {resource.cost}
                  </Badge>
                  {resource.featuredResource && (
                    <Badge variant="default">Featured</Badge>
                  )}
                  {resource.ageRanges.map(age => (
                    <Badge key={age} variant="secondary" className="text-xs">
                      Ages {age}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {resource.averageRating.toFixed(1)} ({resource.reviewCount})
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {resource.viewCount || 0} views
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onImageUpload(resource.id)}
              className="flex items-center gap-1"
            >
              <Upload className="h-3 w-3" />
              Upload Image
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSetFeatured(resource.id)}
              className="flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              {resource.featuredResource ? 'Unfeature' : 'Feature'}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <Edit className="h-3 w-3" />
              Edit
            </Button>
            
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onDeleteResource(resource.id)}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
