
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { CheckCircle, XCircle, Trash2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { getBlogComments, updateBlogComment, deleteBlogComment } from '@/services/blogService';
import { formatDistanceToNow } from 'date-fns';

export const CommentsManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 10;
  const queryClient = useQueryClient();

  const { data: allComments = [], isLoading } = useQuery({
    queryKey: ['blog-comments'],
    queryFn: () => getBlogComments(undefined, true),
  });

  const totalPages = Math.ceil(allComments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = allComments.slice(startIndex, startIndex + commentsPerPage);

  const approveCommentMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      updateBlogComment(id, { is_approved: !isApproved }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments'] });
      toast.success('Comment status updated');
    },
    onError: () => toast.error('Failed to update comment status'),
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteBlogComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments'] });
      toast.success('Comment deleted');
    },
    onError: () => toast.error('Failed to delete comment'),
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {paginatedComments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {comment.profiles?.display_name || comment.profiles?.username}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      on "{comment.blog_posts?.title}"
                    </span>
                    {comment.is_approved ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm">{comment.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {comment.like_count || 0} likes
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant={comment.is_approved ? "outline" : "default"}
                    size="sm"
                    onClick={() => approveCommentMutation.mutate({ 
                      id: comment.id, 
                      isApproved: comment.is_approved 
                    })}
                  >
                    {comment.is_approved ? 'Unapprove' : 'Approve'}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this comment?')) {
                        deleteCommentMutation.mutate(comment.id);
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
