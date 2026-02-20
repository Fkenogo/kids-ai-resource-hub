
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Eye, Clock, Pin, Plus } from 'lucide-react';
import { mockCommunityPosts } from '@/data/communityData';
import { m } from 'framer-motion';
import { logger } from '@/lib/logger';

interface CommunityFeedProps {
  selectedCategory?: string;
}

export const CommunityFeed = ({ selectedCategory }: CommunityFeedProps) => {
  // Filter posts by category - since mockCommunityPosts is empty, this will always be empty
  const filteredPosts = selectedCategory && selectedCategory !== 'all' 
    ? mockCommunityPosts.filter(post => post.category === selectedCategory)
    : mockCommunityPosts;

  const handleLike = (postId: string) => {
    logger.debug('Like post:', postId);
  };

  const handleReply = (postId: string) => {
    logger.debug('Reply to post:', postId);
  };

  return (
    <div className="space-y-6">
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory && selectedCategory !== 'all' 
                ? `No posts found in the ${selectedCategory.replace('-', ' ')} category.`
                : 'Be the first to start a conversation in our community!'
              }
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Post
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <m.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={post.authorAvatar} />
                        <AvatarFallback>{post.authorName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-lg">{post.title}</h3>
                          {post.isSticky && (
                            <Pin className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{post.authorName}</span>
                          <span>•</span>
                          <span>{post.datePosted}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {post.category.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Last activity {post.lastActivity}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart className="h-4 w-4" />
                        <span>{post.likeCount}</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center space-x-1"
                        onClick={() => handleReply(post.id)}
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.replyCount}</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </div>
      )}
    </div>
  );
};
