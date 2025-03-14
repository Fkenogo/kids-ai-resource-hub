
import { useState } from 'react';
import { Resource, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { addResourceComment, getResourceComments } from '@/services/engagementService';

interface ResourceCommentsProps {
  resource: Resource;
}

export const ResourceComments = ({ resource }: ResourceCommentsProps) => {
  const [comments, setComments] = useState<Comment[]>(getResourceComments(resource.id));
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    
    setIsSubmitting(true);
    try {
      const newComment = addResourceComment(resource.id, commentText);
      setComments([newComment, ...comments]);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCommentDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="space-y-4">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </h3>
        
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
            disabled={!commentText.trim() || isSubmitting}
          >
            Post Comment
          </Button>
        </div>
      </div>
      
      {comments.length > 0 ? (
        <div className="space-y-6 pt-4">
          {comments.map((comment, index) => (
            <motion.div 
              key={comment.id}
              className="flex gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Avatar>
                <div className="bg-primary text-white w-full h-full flex items-center justify-center text-lg">
                  {comment.username.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              <div className="flex-grow">
                <div className="flex items-baseline justify-between mb-1">
                  <h4 className="font-medium">{comment.username}</h4>
                  <span className="text-sm text-muted-foreground">
                    {formatCommentDate(comment.datePosted)}
                  </span>
                </div>
                <p className="text-base">{comment.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </motion.div>
  );
};
