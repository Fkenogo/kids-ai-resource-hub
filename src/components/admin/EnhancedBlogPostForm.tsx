
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText } from 'lucide-react';
import { useBlogPostForm } from '@/hooks/useBlogPostForm';
import { useAutoSave } from '@/hooks/useAutoSave';
import { EnhancedSEOFields } from './EnhancedSEOFields';
import { CategoryTagsManager } from './CategoryTagsManager';
import { PublishingOptions } from './PublishingOptions';
import { BlogPreview } from './BlogPreview';
import { BlogFormActions } from './BlogFormActions';
import { BlogContentTab } from './BlogContentTab';

interface EnhancedBlogPostFormProps {
  post?: {
    id: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    tags?: string[];
    image_url?: string;
    read_time?: number;
    is_featured?: boolean;
    is_published?: boolean;
    is_pinned?: boolean;
    scheduled_date?: string;
  };
  onSuccess: () => void;
}

export const EnhancedBlogPostForm = ({ post, onSuccess }: EnhancedBlogPostFormProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    formData,
    updateFormData,
    handleTitleChange,
    handleAutoSave,
    handleSaveDraft,
    handlePublish,
    handleUpdate,
    autoSlug,
    lastSaved,
    currentPostId,
    isLoading,
  } = useBlogPostForm(post, () => {
    setOpen(false);
    onSuccess();
  });

  useAutoSave({
    enabled: open,
    formData,
    onAutoSave: handleAutoSave,
  });

  return (
    <>
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
              <TabsContent value="content">
                <BlogContentTab
                  title={formData.title}
                  content={formData.content}
                  imageUrl={formData.image_url}
                  onTitleChange={handleTitleChange}
                  onContentChange={(content) => updateFormData({ content })}
                  onImageChange={(image_url) => updateFormData({ image_url })}
                />
              </TabsContent>

              <TabsContent value="seo" className="space-y-6 p-1">
                <EnhancedSEOFields
                  title={formData.title}
                  slug={formData.slug}
                  excerpt={formData.excerpt}
                  content={formData.content}
                  onTitleChange={handleTitleChange}
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

          <BlogFormActions
            isEditing={!!post}
            isLoading={isLoading}
            onSaveDraft={handleSaveDraft}
            onPreview={() => setShowPreview(true)}
            onCancel={() => setOpen(false)}
            onPublish={handlePublish}
            onUpdate={handleUpdate}
          />
        </DialogContent>
      </Dialog>

      <BlogPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        formData={formData}
      />
    </>
  );
};
