
import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Eye, Share2, Pin } from 'lucide-react';
import { motion } from 'framer-motion';
import { CommunityPost } from '@/types/community';
import { mockCommunityPosts } from '@/data/communityData';

export const CommunityFeed = () => {
  const [posts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'getting-started': 'bg-green-100 text-green-800',
      'age-specific': 'bg-blue-100 text-blue-800',
      'troubleshooting': 'bg-red-100 text-red-800',
      'project-showcase': 'bg-purple-100 text-purple-800',
      'curriculum-ideas': 'bg-yellow-100 text-yellow-800',
      'resource-requests': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      'getting-started': 'Getting Started',
      'age-specific': 'Age-Specific',
      'troubleshooting': 'Troubleshooting',
      'project-showcase': 'Project Showcase',
      'curriculum-ideas': 'Curriculum Ideas',
      'resource-requests': 'Resource Requests',
    };
    return labels[category as keyof typeof labels] || category;
  };

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.authorAvatar} />
                    <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{post.authorName}</h3>
                      {post.isSticky && <Pin className="h-4 w-4 text-orange-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{post.datePosted}</p>
                  </div>
                </div>
                <Badge className={getCategoryColor(post.category)}>
                  {getCategoryLabel(post.category)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.replyCount}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-1 ${
                      likedPosts.has(post.id) ? 'text-red-600' : ''
                    }`}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        likedPosts.has(post.id) ? 'fill-current' : ''
                      }`} 
                    />
                    <span>{post.likeCount + (likedPosts.has(post.id) ? 1 : 0)}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
