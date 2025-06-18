
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Save } from 'lucide-react';

interface BlogFormActionsProps {
  isEditing: boolean;
  isLoading: boolean;
  onSaveDraft: () => void;
  onPreview: () => void;
  onCancel: () => void;
  onPublish: () => void;
  onUpdate: () => void;
}

export const BlogFormActions = ({
  isEditing,
  isLoading,
  onSaveDraft,
  onPreview,
  onCancel,
  onPublish,
  onUpdate,
}: BlogFormActionsProps) => {
  return (
    <div className="flex justify-between items-center pt-4 border-t">
      <div className="flex items-center gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onSaveDraft} 
          disabled={isLoading}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={onPreview}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        {isEditing ? (
          <Button onClick={onUpdate} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Post'}
          </Button>
        ) : (
          <Button onClick={onPublish} disabled={isLoading}>
            {isLoading ? 'Publishing...' : 'Publish Post'}
          </Button>
        )}
      </div>
    </div>
  );
};
