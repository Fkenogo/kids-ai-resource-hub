
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { getBlogPostBySlug, getRecentBlogPosts } from '@/data/blogData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BlogGrid } from '@/components/BlogGrid';
import { BlogComments } from '@/components/BlogComments';
import { Calendar, Clock, ArrowLeft, Eye, Share2, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { m } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const subscribeFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  name: z.string().min(2, { message: "Please enter your name" }).optional()
});

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = getBlogPostBySlug(slug || '');
  const relatedPosts = getRecentBlogPosts(3).filter(p => p.id !== post?.id);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [openSubscribeDialog, setOpenSubscribeDialog] = useState(false);

  const form = useForm<z.infer<typeof subscribeFormSchema>>({
    resolver: zodResolver(subscribeFormSchema),
    defaultValues: {
      email: "",
      name: ""
    },
  });

  useEffect(() => {
    if (!post) {
      navigate('/blog');
    }
    
    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [post, navigate]);

  const onSubscribe = (data: z.infer<typeof subscribeFormSchema>) => {
    // This would connect to a real subscription service in production
    console.log("Subscribing email:", data.email, "Name:", data.name);
    toast.success("Thanks for subscribing to our blog updates!");
    setIsSubscribed(true);
    setOpenSubscribeDialog(false);
    form.reset();
  };

  if (!post) return null;

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Layout>
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <m.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link to="/blog" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to All Articles
            </Link>
          </Button>

          <div className="text-center mb-12">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                {post.category}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight font-serif">{post.title}</h1>

            <div className="flex items-center justify-center gap-4 mb-8">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(post.datePublished), 'MMMM d, yyyy')}
                </div>
              </div>
            </div>
          </div>

          {post.imageUrl && (
            <div className="mb-12 rounded-xl overflow-hidden shadow-medium">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto object-cover aspect-[16/9]"
              />
            </div>
          )}

          <Card className="mb-16 border-none shadow-none">
            <CardContent className="p-0">
              <div className="prose prose-lg max-w-none dark:prose-invert
                prose-headings:font-serif prose-headings:font-semibold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                prose-headings:text-foreground prose-p:text-muted-foreground prose-p:text-xl prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline 
                prose-img:rounded-lg prose-img:my-12 prose-img:shadow-medium
                prose-hr:my-8 prose-li:marker:text-primary/70">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2 mt-12 mb-16 border-t pt-6">
            {post.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Card className="mb-16 bg-secondary/30 border border-secondary p-8 rounded-xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 font-serif">Subscribe to Our Blog</h3>
              <p className="text-muted-foreground">Get the latest articles delivered right to your inbox</p>
            </div>
            
            {isSubscribed ? (
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <p className="font-medium text-primary">Thanks for subscribing!</p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => setOpenSubscribeDialog(true)}
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Subscribe to Newsletter
                </Button>
              </div>
            )}
          </Card>

          {/* Comment Section */}
          <BlogComments postId={post.id} postTitle={post.title} />

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8 font-serif text-center">Related Articles</h2>
              <BlogGrid posts={relatedPosts} columns={3} compact />
            </div>
          )}
        </m.div>
      </div>

      {/* Subscription Dialog */}
      <Dialog open={openSubscribeDialog} onOpenChange={setOpenSubscribeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Subscribe to Our Newsletter</DialogTitle>
            <DialogDescription>
              Enter your details below to receive our latest articles and updates directly in your inbox.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubscribe)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your name (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Your email address" required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end pt-4">
                <Button type="submit">Subscribe</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default BlogPost;
