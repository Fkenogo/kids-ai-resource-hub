
import { useState } from 'react';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Share2, Bookmark, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  toggleResourceLike, 
  isResourceLiked,
  getResourceLikeCount,
  toggleResourceSave,
  isResourceSaved,
  getResourceSaveCount,
  getResourceViewCount,
  getResourceShareCount,
  getResourceCommentCount,
  shareResource
} from '@/services/engagementService';

interface ResourceEngagementProps {
  resource: Resource;
  compact?: boolean;
}

export const ResourceEngagement = ({ resource, compact = false }: ResourceEngagementProps) => {
  const [liked, setLiked] = useState<boolean>(isResourceLiked(resource.id));
  const [saved, setSaved] = useState<boolean>(isResourceSaved(resource.id));
  const [likeCount, setLikeCount] = useState<number>(getResourceLikeCount(resource.id));
  const [saveCount, setSaveCount] = useState<number>(getResourceSaveCount(resource.id));
  const [viewCount] = useState<number>(getResourceViewCount(resource.id));
  const [shareCount, setShareCount] = useState<number>(getResourceShareCount(resource.id));
  const [commentCount] = useState<number>(getResourceCommentCount(resource.id));
  
  const handleLike = () => {
    const isLiked = toggleResourceLike(resource.id);
    setLiked(isLiked);
    setLikeCount(getResourceLikeCount(resource.id));
  };
  
  const handleSave = () => {
    const isSaved = toggleResourceSave(resource.id);
    setSaved(isSaved);
    setSaveCount(getResourceSaveCount(resource.id));
  };
  
  const handleShare = () => {
    shareResource(resource);
    setShareCount(getResourceShareCount(resource.id));
  };
  
  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1" title="Views">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span>{viewCount}</span>
        </div>
        <div className="flex items-center gap-1" title="Likes">
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center gap-1" title="Comments">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span>{commentCount}</span>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="flex flex-wrap gap-3 md:gap-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleLike}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
        {liked ? 'Liked' : 'Like'}
        {likeCount > 0 && (
          <Badge variant="secondary" className="ml-1 py-0 px-1.5 h-5 text-xs">
            {likeCount}
          </Badge>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleSave}
      >
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : ''}`} />
        {saved ? 'Saved' : 'Save'}
        {saveCount > 0 && (
          <Badge variant="secondary" className="ml-1 py-0 px-1.5 h-5 text-xs">
            {saveCount}
          </Badge>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        Share
        {shareCount > 0 && (
          <Badge variant="secondary" className="ml-1 py-0 px-1.5 h-5 text-xs">
            {shareCount}
          </Badge>
        )}
      </Button>
      
      <div className="flex items-center gap-2 ml-auto text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>{viewCount} views</span>
      </div>
    </motion.div>
  );
};
