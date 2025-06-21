
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createBlogPost, updateBlogPost, generateSlug, getCurrentUserForBlog } from '@/services/blogService';

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

export const useBlogPostForm = (post?: any, onSuccess?: () => void) => {
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
      console.log('Saving blog post with data:', data);
      
      try {
        const user = await getCurrentUserForBlog();
        console.log('User authenticated:', user.id);

        const postData = {
          ...data,
          author_id: user.id,
          slug: data.slug || generateSlug(data.title),
          updated_at: new Date().toISOString(),
        };

        console.log('Final post data:', postData);

        if (currentPostId) {
          console.log('Updating existing post:', currentPostId);
          return updateBlogPost(currentPostId, postData);
        } else {
          console.log('Creating new post');
          return createBlogPost(postData);
        }
      } catch (authError) {
        console.error('Authentication failed:', authError);
        throw new Error('You must be logged in to save blog posts. Please refresh the page and try again.');
      }
    },
    onSuccess: (data) => {
      console.log('Blog post saved successfully:', data);
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
    onError: (error: any) => {
      console.error('Error saving post:', error);
      const errorMessage = error?.message || 'Failed to save post. Please try again.';
      toast.error(errorMessage);
    },
  });

  const updateFormData = (updates: Partial<BlogPostFormData>) => {
    console.log('Updating form data:', updates);
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
      console.log('Auto-saving draft...');
      mutation.mutate({ ...formData, is_published: false });
    }
  };

  const handleSaveDraft = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title to save as draft');
      return;
    }
    console.log('Saving draft manually...');
    mutation.mutate({ ...formData, is_published: false });
  };

  const handlePublish = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category.trim()) {
      toast.error('Please fill in title, content, and category before publishing');
      return;
    }
    console.log('Publishing post...');
    mutation.mutate({ ...formData, is_published: true });
  };

  const handleUpdate = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.category.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    console.log('Updating post...');
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
