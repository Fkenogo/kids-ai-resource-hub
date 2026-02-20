
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createBlogPost, updateBlogPost, generateSlug, getCurrentUserForBlog } from '@/services/blogService';
import { logger } from '@/lib/logger';

interface BlogPostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  image_url: string;
  read_time: number;
  is_featured: boolean;
  is_published: boolean;
  is_pinned: boolean;
  scheduled_date: string;
}

interface ExistingBlogPost extends Partial<BlogPostFormData> {
  id: string;
}

export const useBlogPostForm = (post?: ExistingBlogPost, onSuccess?: () => void) => {
  const [formData, setFormData] = useState<BlogPostFormData>({
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

  const [autoSlug, setAutoSlug] = useState(!post);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [currentPostId, setCurrentPostId] = useState(post?.id || null);
  const queryClient = useQueryClient();

  // Update formData when post prop changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        category: post.category || '',
        tags: post.tags || [],
        image_url: post.image_url || '',
        read_time: post.read_time || 5,
        is_featured: post.is_featured || false,
        is_published: post.is_published || false,
        is_pinned: post.is_pinned || false,
        scheduled_date: post.scheduled_date || '',
      });
      setCurrentPostId(post.id);
    }
  }, [post]);

  // Calculate estimated read time based on content
  useEffect(() => {
    if (formData.content) {
      const wordsPerMinute = 200;
      const textContent = formData.content.replace(/<[^>]*>/g, '');
      const wordCount = textContent.split(/\s+/).filter(word => word.length > 0).length;
      const estimatedTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
      
      if (estimatedTime !== formData.read_time) {
        setFormData(prev => ({ ...prev, read_time: estimatedTime }));
      }
    }
  }, [formData.content, formData.read_time]);

  const mutation = useMutation({
    mutationFn: async (data: BlogPostFormData & { is_published: boolean }) => {
      try {
        const user = await getCurrentUserForBlog();
        logger.debug('Saving blog post for user:', user.id);

        // Clean the scheduled_date - convert empty string to null
        const cleanScheduledDate = data.scheduled_date && data.scheduled_date.trim() !== '' 
          ? data.scheduled_date 
          : null;

        const postData = {
          ...data,
          author_id: user.id,
          slug: data.slug || generateSlug(data.title),
          scheduled_date: cleanScheduledDate,
          updated_at: new Date().toISOString(),
        };

        if (currentPostId) {
          return updateBlogPost(currentPostId, postData);
        } else {
          return createBlogPost(postData);
        }
      } catch (authError) {
        console.error('Authentication failed:', authError);
        throw new Error('You must be logged in to save blog posts. Please refresh the page and try again.');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      
      if (!currentPostId) {
        setCurrentPostId(data.id);
      }
      
      setLastSaved(new Date());
      
      if (data.is_published) {
        toast.success(currentPostId ? 'Post updated and published successfully' : 'Post created and published successfully');
        onSuccess?.();
      } else {
        toast.success('Draft saved successfully');
      }
    },
    onError: (error: unknown) => {
      console.error('Error saving post:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save post. Please try again.';
      toast.error(errorMessage);
    },
  });

  const updateFormData = (updates: Partial<BlogPostFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleTitleChange = (value: string) => {
    const updates: Partial<BlogPostFormData> = {
      title: value,
      ...(autoSlug && { slug: generateSlug(value) })
    };
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleAutoSave = () => {
    if ((formData.title || formData.content) && !mutation.isPending) {
      mutation.mutate({ ...formData, is_published: false });
    }
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title to save as draft');
      return;
    }
    mutation.mutate({ ...formData, is_published: false });
  };

  const handlePublish = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category.trim()) {
      toast.error('Please fill in title, content, and category before publishing');
      return;
    }
    mutation.mutate({ ...formData, is_published: true });
  };

  const handleUpdate = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    mutation.mutate(formData);
  };

  return {
    formData,
    updateFormData,
    handleTitleChange,
    handleAutoSave,
    handleSaveDraft,
    handlePublish,
    handleUpdate,
    autoSlug,
    setAutoSlug,
    lastSaved,
    currentPostId,
    isLoading: mutation.isPending,
  };
};
