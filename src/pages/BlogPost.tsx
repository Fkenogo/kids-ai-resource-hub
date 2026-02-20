import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Calendar, Clock, Eye, ArrowLeft, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { getBlogPostBySlug, getBlogComments, createBlogComment, getBlogPosts } from '@/services/blogService';
import { getCurrentUser } from '@/services/backendService';
import { useAuthContext } from '@/components/auth/AuthProvider';
import { SocialShareBar } from '@/components/SocialShareBar';
import { useMemo, useState } from 'react';
import { sanitizeHtml } from '@/lib/sanitizeHtml';

const commentSchema = z.object({
  content: z.string().min(3, { message: "Comment must be at least 3 characters long" })
});

interface BlogCommentItem {
  id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name?: string;
    username?: string;
  } | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: post, isLoading: postLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['blog-posts-navigation'],
    queryFn: () => getBlogPosts(false),
  });

  const { data: comments = [] } = useQuery<BlogCommentItem[]>({
    queryKey: ['blog-comments', post?.id],
    queryFn: async () => (await getBlogComments(post!.id, false)) as BlogCommentItem[],
    enabled: !!post?.id,
  });

  const sanitizedContent = useMemo(() => sanitizeHtml(post?.content || ''), [post?.content]);

  // Find previous and next posts
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const previousPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof commentSchema>) => {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      return createBlogComment({
        post_id: post!.id,
        author_id: user.id,
        content: data.content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-comments', post?.id] });
      form.reset();
      setIsSubmitting(false);
      toast.success("Comment submitted for review!");
    },
    onError: () => {
      setIsSubmitting(false);
      toast.error("Failed to submit comment");
    },
  });

  const onSubmitComment = (data: z.infer<typeof commentSchema>) => {
    setIsSubmitting(true);
    createCommentMutation.mutate(data);
  };

  if (postLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Post not found</h1>
              <Link to="/blog">
                <Button>Back to Blog</Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const publishedDate = new Date(post.published_at || post.created_at);
  const currentUrl = `${window.location.origin}/blog/${post.slug}`;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Sticky Social Share Bar */}
        <SocialShareBar 
          url={currentUrl}
          title={post.title}
          description={post.excerpt}
          sticky={true}
        />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link to="/blog" className="inline-flex items-center text-primary hover:text-primary/80 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>

            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline">{post.category}</Badge>
                {post.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold font-serif mb-6">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-xl text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback>
                      {(post.profiles?.display_name || post.profiles?.username || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {post.profiles?.display_name || post.profiles?.username || 'Admin'}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDistanceToNow(publishedDate, { addSuffix: true })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.read_time} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.view_count || 0} views
                      </span>
                    </div>
                  </div>
                </div>
                <SocialShareBar 
                  url={currentUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </header>

            {/* Featured Image */}
            {post.image_url && (
              <div className="mb-8">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Content */}
            <div 
              className="article-content prose prose-lg max-w-none mb-16"
              dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Navigation Between Posts */}
            <div className="flex justify-between items-center mb-16 pb-8 border-b">
              {previousPost ? (
                <Link to={`/blog/${previousPost.slug}`} className="flex items-center gap-2 text-primary hover:text-primary/80">
                  <ChevronLeft className="h-4 w-4" />
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Previous</p>
                    <p className="font-medium line-clamp-1">{previousPost.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {nextPost ? (
                <Link to={`/blog/${nextPost.slug}`} className="flex items-center gap-2 text-primary hover:text-primary/80 text-right">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Next</p>
                    <p className="font-medium line-clamp-1">{nextPost.title}</p>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : <div />}
            </div>

            {/* Comments Section */}
            <div className="mt-16">
              <div className="flex items-center gap-2 mb-8">
                <MessageSquare className="h-5 w-5" />
                <h2 className="text-3xl font-bold">Comments ({comments.length})</h2>
              </div>
              
              {/* Comment Form */}
              {isAuthenticated ? (
                <Card className="mb-8">
                  <CardContent className="pt-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmitComment)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="content"
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
              ) : (
                <Card className="mb-8">
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground mb-4">Please sign in to leave a comment.</p>
                    <Link to="/login">
                      <Button>Sign In</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
              
              {/* Comments List */}
              {comments.length > 0 && (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="pt-6">
                        <div className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {(comment.profiles?.display_name || comment.profiles?.username || 'U').charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium">
                                  {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <p className="text-muted-foreground">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </m.div>
        </article>
      </div>
    </Layout>
  );
};

export default BlogPost;
