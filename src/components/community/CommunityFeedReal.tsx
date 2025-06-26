
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageSquare, Eye, Pin, MoreHorizontal } from 'lucide-react';
import { m } from 'framer-motion';
import { useCommunityPosts, useTogglePostLike } from '@/hooks/useCommunityData';
import { CommunityPost } from '@/types/community';

interface CommunityFeedProps {
  selectedCategory?: string;
}

export const CommunityFeedReal = ({ selectedCategory }: CommunityFeedProps) => {
  const { data: posts = [], isLoading } = useCommunityPosts(selectedCategory);
  const toggleLikeMutation = useTogglePostLike();
  
  const handleLike = (postId: string) => {
    toggleLikeMutation.mutate(postId);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'getting-started': 'bg-green-100 text-green-800',
      'age-specific': 'bg-blue-100 text-blue-800',
      'troubleshooting': 'bg-red-100 text-red-800',
      'project-showcase': 'bg-purple-100 text-purple-800',
      'curriculum-ideas': 'bg-yellow-100 text-yellow-800',
      'resource-requests': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post: CommunityPost, index: number) => (
        <m.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="bg-primary text-white w-full h-full flex items-center justify-center text-lg">
                        {post.authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{post.authorName}</h4>
                    <p className="text-sm text-muted-foreground">{post.datePosted}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {post.isSticky && <Pin className="h-4 w-4 text-primary" />}
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category.replace('-', ' ')}
                  </Badge>
                  {post.tags.map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.content}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1"
                    disabled={toggleLikeMutation.isPending}
                  >
                    <Heart className="h-4 w-4" />
                    <span>{post.likeCount}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.replyCount}</span>
                  </Button>
                  
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    <span>{post.viewCount}</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Last activity: {post.lastActivity}
                </p>
              </div>
            </CardContent>
          </Card>
        </m.div>
      ))}
      
      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No posts found in this category.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
