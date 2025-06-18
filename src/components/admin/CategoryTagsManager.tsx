
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus, Tag, Folder } from 'lucide-react';

interface CategoryTagsManagerProps {
  category: string;
  tags: string[];
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
}

const predefinedCategories = [
  'AI Education',
  'Programming for Kids',
  'Technology News',
  'Learning Resources',
  'Parent Guides',
  'Product Reviews',
  'STEM Activities',
  'Digital Literacy',
  'Coding Tutorials',
  'Educational Tools'
];

const suggestedTags = [
  'artificial intelligence', 'machine learning', 'kids coding', 'STEM education',
  'educational technology', 'programming', 'robotics', 'digital skills',
  'computer science', 'learning games', 'interactive learning', 'coding for kids',
  'AI tools', 'educational apps', 'online learning', 'tech literacy'
];

export const CategoryTagsManager = ({ 
  category, 
  tags, 
  onCategoryChange, 
  onTagsChange 
}: CategoryTagsManagerProps) => {
  const [newTag, setNewTag] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setNewTag('');
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag);
    }
  };

  const filteredSuggestions = suggestedTags.filter(
    tag => !tags.includes(tag) && tag.toLowerCase().includes(newTag.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Category
          </CardTitle>
          <CardDescription>
            Select the primary category for your blog post
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="custom-category">Custom Category</Label>
            <Input
              id="custom-category"
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              placeholder="Enter custom category"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Quick Select</Label>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
              {predefinedCategories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "ghost"}
                  size="sm"
                  className="justify-start h-8"
                  onClick={() => onCategoryChange(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags
          </CardTitle>
          <CardDescription>
            Add relevant tags to improve discoverability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="new-tag">Add Tags</Label>
            <div className="relative">
              <Input
                id="new-tag"
                value={newTag}
                onChange={(e) => {
                  setNewTag(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyPress={handleKeyPress}
                placeholder="Type a tag and press Enter"
                onFocus={() => setShowSuggestions(newTag.length > 0)}
              />
              <Button
                type="button"
                size="sm"
                className="absolute right-1 top-1 h-7"
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim()}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            {/* Tag Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="border rounded-md p-2 bg-background max-h-32 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {filteredSuggestions.slice(0, 8).map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => addTag(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Tags */}
          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Tags ({tags.length})</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer">
                    {tag}
                    <X 
                      className="h-3 w-3 ml-1 hover:text-destructive" 
                      onClick={() => removeTag(tag)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
