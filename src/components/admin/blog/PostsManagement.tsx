
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Search, Eye, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EnhancedBlogPostForm } from '../EnhancedBlogPostForm';
import { getBlogPosts, updateBlogPost, deleteBlogPost } from '@/services/blogService';
import { formatDistanceToNow } from 'date-fns';

export const PostsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const queryClient = useQueryClient();

  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => getBlogPosts(true),
  });

  const filteredPosts = allPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      updateBlogPost(id, { is_published: !isPublished }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post status updated');
    },
    onError: () => toast.error('Failed to update post status'),
  });

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      updateBlogPost(id, { is_featured: !isFeatured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Featured status updated');
    },
    onError: () => toast.error('Failed to update featured status'),
  });

  const deletePostMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts by title, category, or excerpt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {paginatedPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <div className="flex gap-1">
                      {post.is_published ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Draft
                        </Badge>
                      )}
                      {post.is_featured && (
                        <Badge variant="outline" className="bg-purple-100 text-purple-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt || post.content.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Category: {post.category}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.view_count || 0} views
                    </span>
                    <span>By: {post.profiles?.display_name || post.profiles?.username}</span>
                    <span>Created: {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <EnhancedBlogPostForm 
                    post={post} 
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: ['blog-posts'] })} 
                  />
                  
                  <Button
                    variant={post.is_published ? "outline" : "default"}
                    size="sm"
                    onClick={() => togglePublishMutation.mutate({ 
                      id: post.id, 
                      isPublished: post.is_published 
                    })}
                  >
                    {post.is_published ? 'Unpublish' : 'Publish'}
                  </Button>
                  
                  <Button
                    variant={post.is_featured ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFeaturedMutation.mutate({ 
                      id: post.id, 
                      isFeatured: post.is_featured 
                    })}
                  >
                    {post.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this post?')) {
                        deletePostMutation.mutate(post.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
