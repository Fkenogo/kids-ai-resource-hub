import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { MessageSquare } from 'lucide-react';
import { m } from 'framer-motion';

const commentSchema = z.object({
  comment: z.string().min(3, { message: "Comment must be at least 3 characters long" })
});

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  avatarFallback: string;
}

interface BlogCommentsProps {
  postId: string;
  postTitle: string;
}

export const BlogComments = ({ postId, postTitle }: BlogCommentsProps) => {
  // In a real application, you would fetch comments from a database
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Jane Cooper',
      content: 'This article was exactly what I needed! I\'ve been looking for resources to help my daughter learn about AI.',
      date: '2 days ago',
      avatarFallback: 'JC'
    },
    {
      id: '2',
      author: 'Alex Morgan',
      content: 'Great overview! Are there any specific resources you would recommend for a 10-year-old who is just getting started?',
      date: '1 day ago',
      avatarFallback: 'AM'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      comment: "",
    },
  });

  const onSubmitComment = (data: z.infer<typeof commentSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call to store comment
    setTimeout(() => {
      const newComment: Comment = {
        id: Date.now().toString(),
        author: 'Guest User', // In a real application, this would be the logged in user
        content: data.comment,
        date: 'Just now',
        avatarFallback: 'GU'
      };
      
      setComments(prev => [newComment, ...prev]);
      form.reset();
      setIsSubmitting(false);
      toast.success("Comment added successfully!");
    }, 500);
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="mt-16">
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-3xl font-bold font-serif">Comments ({comments.length})</h2>
      </div>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-4">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your thoughts on this article..." 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {comments.length > 0 && (
        <m.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {comments.map((comment) => (
            <m.div key={comment.id} variants={item}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{comment.avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{comment.author}</h4>
                          <p className="text-sm text-muted-foreground">{comment.date}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </m.div>
          ))}
        </m.div>
      )}
    </div>
  );
};
