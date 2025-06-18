
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { RichTextEditor } from './RichTextEditor';
import { SEOFields } from './SEOFields';
import { CategoryTagsManager } from './CategoryTagsManager';
import { PublishingOptions } from './PublishingOptions';
import { ImageUploader } from '@/components/ImageUploader';
import { createBlogPost, updateBlogPost, generateSlug } from '@/services/blogService';
import { getCurrentUser } from '@/services/supabaseService';

interface EnhancedBlogPostFormProps {
  post?: any;
  onSuccess: () => void;
}

export const EnhancedBlogPostForm = ({ post, onSuccess }: EnhancedBlogPostFormProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [autoSlug, setAutoSlug] = useState(!post);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentPostId, setCurrentPostId] = useState(post?.id || null);
  
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || '',
    tags: post?.tags || [],
    image_url: post?.image_url || '',
    read_time: post?.read_time || 5,
    is_featured: post?.is_featured || false,
    is_published: post?.is_published || false,
    is_pinned: post?.is_pinned || false,
    scheduled_date: post?.scheduled_date || '',
  });

  const queryClient = useQueryClient();

  // Auto-save functionality
  useEffect(() => {
    if (!open) return;
    
    const autoSaveInterval = setInterval(() => {
      if (formData.title || formData.content) {
        handleAutoSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [open, formData]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const postData = {
        ...data,
        author_id: user.id,
        slug: data.slug || generateSlug(data.title),
      };

      if (currentPostId) {
        return updateBlogPost(currentPostId, postData);
      } else {
        return createBlogPost(postData);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      
      // Update currentPostId if this was a new post
      if (!currentPostId) {
        setCurrentPostId(data.id);
      }
      
      setLastSaved(new Date());
      
      // Only close dialog and show success message for publish actions
      if (data.is_published) {
        toast.success(post ? 'Post updated successfully' : 'Post created successfully');
        if (!post) {
          setOpen(false);
          onSuccess();
        }
      } else {
        toast.success('Draft saved successfully');
      }
    },
    onError: (error) => {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    },
  });

  const handleAutoSave = () => {
    if (formData.title || formData.content) {
      // Always save as draft for auto-save
      mutation.mutate({ ...formData, is_published: false });
    }
  };

  const handleSaveDraft = () => {
    if (!formData.title) {
      toast.error('Please enter a title to save as draft');
      return;
    }
    // Explicitly save as draft
    mutation.mutate({ ...formData, is_published: false });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate(formData);
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      ...(autoSlug && { slug: generateSlug(value) })
    }));
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Calculate estimated read time based on content
  useEffect(() => {
    if (formData.content) {
      const wordsPerMinute = 200;
      const textContent = formData.content.replace(/<[^>]*>/g, ''); // Strip HTML
      const wordCount = textContent.split(/\s+/).length;
      const estimatedTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
      
      if (estimatedTime !== formData.read_time) {
        updateFormData({ read_time: estimatedTime });
      }
    }
  }, [formData.content]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {post ? 'Edit Post' : 'Create Blog Post'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {post ? 'Edit Blog Post' : 'Create New Blog Post'}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-between">
            <span>
              {post ? 'Update your blog post with the enhanced editor' : 'Create engaging content with our comprehensive editing tools'}
            </span>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
            <TabsTrigger value="categories">Categories & Tags</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="content" className="space-y-6 p-1">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Post Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter an engaging title for your blog post"
                    className="text-lg font-semibold"
                    required
                  />
                </div>

                <div>
                  <Label>Featured Image</Label>
                  <ImageUploader
                    value={formData.image_url}
                    onChange={(url) => updateFormData({ image_url: url })}
                    label="Upload featured image for your blog post"
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => updateFormData({ content })}
                    placeholder="Start writing your amazing blog post..."
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6 p-1">
              <SEOFields
                title={formData.title}
                slug={formData.slug}
                excerpt={formData.excerpt}
                onTitleChange={(title) => handleTitleChange(title)}
                onSlugChange={(slug) => updateFormData({ slug })}
                onExcerptChange={(excerpt) => updateFormData({ excerpt })}
                autoSlug={autoSlug}
              />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6 p-1">
              <CategoryTagsManager
                category={formData.category}
                tags={formData.tags}
                onCategoryChange={(category) => updateFormData({ category })}
                onTagsChange={(tags) => updateFormData({ tags })}
              />
            </TabsContent>

            <TabsContent value="publishing" className="space-y-6 p-1">
              <PublishingOptions
                isPublished={formData.is_published}
                isFeatured={formData.is_featured}
                isPinned={formData.is_pinned}
                scheduledDate={formData.scheduled_date}
                readTime={formData.read_time}
                onPublishedChange={(is_published) => updateFormData({ is_published })}
                onFeaturedChange={(is_featured) => updateFormData({ is_featured })}
                onPinnedChange={(is_pinned) => updateFormData({ is_pinned })}
                onScheduledDateChange={(scheduled_date) => updateFormData({ scheduled_date })}
                onReadTimeChange={(read_time) => updateFormData({ read_time })}
              />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSaveDraft} 
              disabled={mutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button type="button" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
