
import { useState } from 'react';
import { Resource, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { m } from 'framer-motion';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { useResourceComments, useCreateComment } from '@/hooks/useSupabaseData';
import { toast } from 'sonner';

interface ResourceCommentsProps {
  resource: Resource;
}

interface CommentWithProfile {
  id: string;
  resource_id: string;
  user_id: string;
  parent_comment_id: string | null;
  content: string;
  like_count: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    display_name: string;
  } | null;
}

export const ResourceComments = ({ resource }: ResourceCommentsProps) => {
  const { isAuthenticated, user } = useAuthContext();
  const { data: commentsData = [], refetch } = useResourceComments(resource.id);
  const createCommentMutation = useCreateComment();
  const [commentText, setCommentText] = useState<string>('');
  
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    
    try {
      await createCommentMutation.mutateAsync({
        resource_id: resource.id,
        user_id: user.id,
        content: commentText.trim()
      });
      
      setCommentText('');
      refetch();
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to post comment');
    }
  };
  
  const formatCommentDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  // Type guard to ensure we have proper comment data
  const typedComments = (commentsData as CommentWithProfile[]) || [];
  
  return (
    <m.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({typedComments.length})
        </h3>
        
        {isAuthenticated ? (
          <>
            <div className="flex gap-4">
              <div className="flex-grow">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts on this resource..."
                  className="min-h-[100px] resize-none"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment} 
                disabled={!commentText.trim() || createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 bg-muted rounded-lg">
            <p className="text-muted-foreground mb-2">Sign in to share your thoughts on this resource</p>
            <Button variant="outline" asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        )}
      </div>
      
      {typedComments.length > 0 ? (
        <div className="space-y-6 pt-4">
          {typedComments.map((comment, index) => (
            <m.div 
              key={comment.id}
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Avatar>
                <div className="bg-primary text-white w-full h-full flex items-center justify-center text-lg">
                  {comment.profiles?.display_name?.charAt(0).toUpperCase() || 
                   comment.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-medium">
                    {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {formatCommentDate(comment.created_at)}
                  </span>
                </div>
                <p className="text-base">{comment.content}</p>
              </div>
            </m.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </m.div>
  );
};
