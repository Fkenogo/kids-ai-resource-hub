
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './RichTextEditor';
import { ImageUploader } from '@/components/ImageUploader';

interface BlogContentTabProps {
  title: string;
  content: string;
  imageUrl: string;
  onTitleChange: (value: string) => void;
  onContentChange: (content: string) => void;
  onImageChange: (url: string) => void;
}

export const BlogContentTab = ({
  title,
  content,
  imageUrl,
  onTitleChange,
  onContentChange,
  onImageChange,
}: BlogContentTabProps) => {
  return (
    <div className="space-y-6 p-1">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Post Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter an engaging title for your blog post"
            className="text-lg font-semibold"
            required
          />
        </div>

        <div>
          <Label>Featured Image</Label>
          <ImageUploader
            value={imageUrl}
            onChange={onImageChange}
            label="Upload featured image for your blog post"
          />
        </div>

        <div>
          <Label>Content *</Label>
          <RichTextEditor
            content={content}
            onChange={onContentChange}
            placeholder="Start writing your amazing blog post..."
          />
        </div>
      </div>
    </div>
  );
};
