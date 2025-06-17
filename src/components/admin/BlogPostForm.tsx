
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from '@/components/ImageUploader';
import { createBlogPost, updateBlogPost, generateSlug } from '@/services/blogService';
import { getCurrentUser } from '@/services/supabaseService';

interface BlogPostFormProps {
  post?: any;
  onSuccess: () => void;
}

const categories = [
  'AI Education',
  'Programming for Kids',
  'Technology News',
  'Learning Resources',
  'Parent Guides',
  'Product Reviews'
];

export const BlogPostForm = ({ post, onSuccess }: BlogPostFormProps) => {
  const [open, setOpen] = useState(false);
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
  });
  const [newTag, setNewTag] = useState('');
  const [autoSlug, setAutoSlug] = useState(!post);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not authenticated');

      const postData = {
        ...data,
        author_id: user.id,
        slug: data.slug || generateSlug(data.title),
      };

      if (post) {
        return updateBlogPost(post.id, postData);
      } else {
        return createBlogPost(postData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast.success(post ? 'Post updated successfully' : 'Post created successfully');
      setOpen(false);
      onSuccess();
    },
    onError: (error) => {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    },
  });

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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {post ? 'Edit Post' : 'Add Blog Post'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
          <DialogDescription>
            {post ? 'Update the blog post details' : 'Fill in the details to create a new blog post'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                  required
                />
                <Switch
                  checked={autoSlug}
                  onCheckedChange={setAutoSlug}
                />
                <Label>Auto-generate</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Brief description of the post"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your blog post content here..."
                rows={10}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="read_time">Read Time (minutes)</Label>
                <Input
                  id="read_time"
                  type="number"
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 5 }))}
                  min="1"
                  max="60"
                />
              </div>
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex items-center gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X className="h-3 w-3 ml-1" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label>Featured Image</Label>
              <ImageUploader
                value={formData.image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                label="Upload blog post image"
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                />
                <Label htmlFor="is_featured">Featured Post</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="is_published">Publish Post</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
