
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Tag } from 'lucide-react';

interface BlogPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    title: string;
    content: string;
    excerpt: string;
    image_url: string;
    category: string;
    tags: string[];
    read_time: number;
    is_featured: boolean;
  };
}

export const BlogPreview = ({ open, onOpenChange, formData }: BlogPreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Blog Post Preview</DialogTitle>
        </DialogHeader>
        
        <article className="prose prose-lg max-w-none">
          {formData.image_url && (
            <img
              src={formData.image_url}
              alt={formData.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <header className="mb-8">
            {formData.is_featured && (
              <Badge variant="secondary" className="mb-2">
                Featured
              </Badge>
            )}
            
            <h1 className="text-4xl font-bold mb-4 leading-tight">{formData.title || 'Untitled Post'}</h1>
            
            {formData.excerpt && (
              <p className="text-xl text-muted-foreground mb-4 leading-relaxed">{formData.excerpt}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>Author</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formData.read_time} min read</span>
              </div>
              
              {formData.category && (
                <div className="flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  <Badge variant="outline">{formData.category}</Badge>
                </div>
              )}
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>
          
          <div 
            dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content available...</p>' }}
            className="prose-headings:font-bold prose-a:text-primary prose-strong:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed [&_p]:mb-4 [&_h1]:mb-6 [&_h2]:mb-4 [&_h3]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_blockquote]:mb-4"
          />
        </article>
      </DialogContent>
    </Dialog>
  );
};
