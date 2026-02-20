
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Link, FileText } from 'lucide-react';
import type { BadgeProps } from '@/components/ui/badge';

interface SEOFieldsProps {
  title: string;
  slug: string;
  excerpt: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  autoSlug: boolean;
}

export const SEOFields = ({ 
  title, 
  slug, 
  excerpt, 
  onTitleChange, 
  onSlugChange, 
  onExcerptChange 
}: SEOFieldsProps) => {
  const titleLength = title.length;
  const slugLength = slug.length;
  const excerptLength = excerpt.length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { color: 'destructive', text: 'Required' };
    if (titleLength < 30) return { color: 'warning', text: 'Too short' };
    if (titleLength > 60) return { color: 'warning', text: 'Too long' };
    return { color: 'success', text: 'Good' };
  };

  const getExcerptStatus = () => {
    if (excerptLength === 0) return { color: 'secondary', text: 'Optional' };
    if (excerptLength < 120) return { color: 'warning', text: 'Too short' };
    if (excerptLength > 160) return { color: 'warning', text: 'Too long' };
    return { color: 'success', text: 'Good' };
  };

  const toBadgeVariant = (color: string): BadgeProps['variant'] => {
    if (color === 'warning') return 'secondary';
    if (color === 'success') return 'success';
    if (color === 'destructive') return 'destructive';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          SEO & Meta Information
        </CardTitle>
        <CardDescription>
          Optimize your blog post for search engines and social media sharing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Meta Title
            </Label>
            <div className="flex items-center gap-2">
              <Badge variant={toBadgeVariant(getTitleStatus().color)}>
                {getTitleStatus().text}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {titleLength}/60
              </span>
            </div>
          </div>
          <Input
            id="seo-title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter a compelling title for search results"
            maxLength={60}
          />
          <p className="text-xs text-muted-foreground">
            This title will appear in search engine results. Keep it under 60 characters.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-slug" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL Slug
            </Label>
            <span className="text-sm text-muted-foreground">
              {slugLength} characters
            </span>
          </div>
          <Input
            id="seo-slug"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            placeholder="url-friendly-slug"
          />
          <p className="text-xs text-muted-foreground">
            The URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="seo-excerpt">Meta Description</Label>
            <div className="flex items-center gap-2">
              <Badge variant={toBadgeVariant(getExcerptStatus().color)}>
                {getExcerptStatus().text}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {excerptLength}/160
              </span>
            </div>
          </div>
          <Textarea
            id="seo-excerpt"
            value={excerpt}
            onChange={(e) => onExcerptChange(e.target.value)}
            placeholder="Write a compelling description that will appear in search results and social media shares"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">
            This description will appear in search results and when shared on social media. Aim for 120-160 characters.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
