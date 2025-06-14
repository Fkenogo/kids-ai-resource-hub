
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Image, Tag } from 'lucide-react';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
}

const categories = [
  { value: 'getting-started', label: 'Getting Started' },
  { value: 'age-specific', label: 'Age-Specific' },
  { value: 'troubleshooting', label: 'Troubleshooting' },
  { value: 'project-showcase', label: 'Project Showcase' },
  { value: 'curriculum-ideas', label: 'Curriculum Ideas' },
  { value: 'resource-requests', label: 'Resource Requests' },
];

export const CreatePostDialog = ({ open, onClose }: CreatePostDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    // Handle post submission here
    console.log({ title, content, category, tags });
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your question or topic?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>
          
          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Content */}
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Share your question, experience, or project details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 min-h-32"
            />
          </div>
          
          {/* Tags */}
          <div>
            <Label>Tags</Label>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Add tags (press Enter)"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
              >
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                    <span>#{tag}</span>
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          {/* Image Upload */}
          <div>
            <Label>Images (Optional)</Label>
            <div className="mt-1 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop images here, or click to browse
              </p>
              <Button variant="outline" size="sm" className="mt-2">
                Choose Files
              </Button>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || !category}
            >
              Create Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
