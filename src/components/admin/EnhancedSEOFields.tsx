
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Link, FileText, TrendingUp, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { BadgeProps } from '@/components/ui/badge';

interface EnhancedSEOFieldsProps {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  onTitleChange: (value: string) => void;
  onSlugChange: (value: string) => void;
  onExcerptChange: (value: string) => void;
  autoSlug: boolean;
}

export const EnhancedSEOFields = ({ 
  title, 
  slug, 
  excerpt, 
  content,
  onTitleChange, 
  onSlugChange, 
  onExcerptChange 
}: EnhancedSEOFieldsProps) => {
  const titleLength = title.length;
  const slugLength = slug.length;
  const excerptLength = excerpt.length;
  const contentLength = content.replace(/<[^>]*>/g, '').length;

  const getTitleStatus = () => {
    if (titleLength === 0) return { color: 'destructive', text: 'Required', icon: XCircle };
    if (titleLength < 30) return { color: 'warning', text: 'Too short', icon: AlertTriangle };
    if (titleLength > 60) return { color: 'warning', text: 'Too long', icon: AlertTriangle };
    return { color: 'success', text: 'Good', icon: CheckCircle };
  };

  const getExcerptStatus = () => {
    if (excerptLength === 0) return { color: 'secondary', text: 'Missing', icon: AlertTriangle };
    if (excerptLength < 120) return { color: 'warning', text: 'Too short', icon: AlertTriangle };
    if (excerptLength > 160) return { color: 'warning', text: 'Too long', icon: AlertTriangle };
    return { color: 'success', text: 'Good', icon: CheckCircle };
  };

  const getSlugStatus = () => {
    if (slugLength === 0) return { color: 'destructive', text: 'Required', icon: XCircle };
    if (slug.includes(' ')) return { color: 'destructive', text: 'Contains spaces', icon: XCircle };
    if (slug !== slug.toLowerCase()) return { color: 'warning', text: 'Use lowercase', icon: AlertTriangle };
    if (slugLength > 75) return { color: 'warning', text: 'Too long', icon: AlertTriangle };
    return { color: 'success', text: 'Excellent', icon: CheckCircle };
  };

  const getContentAnalysis = () => {
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    return {
      wordCount,
      readingTime,
      status: wordCount < 300 ? 'short' : wordCount > 2000 ? 'long' : 'good'
    };
  };

  const getSEOScore = () => {
    let score = 0;
    const titleStatus = getTitleStatus();
    const excerptStatus = getExcerptStatus();
    const slugStatus = getSlugStatus();
    const contentAnalysis = getContentAnalysis();

    if (titleStatus.color === 'success') score += 25;
    else if (titleStatus.color === 'warning') score += 15;

    if (excerptStatus.color === 'success') score += 25;
    else if (excerptStatus.color === 'warning') score += 15;

    if (slugStatus.color === 'success') score += 25;
    else if (slugStatus.color === 'warning') score += 15;

    if (contentAnalysis.status === 'good') score += 25;
    else if (contentAnalysis.status === 'short' || contentAnalysis.status === 'long') score += 15;

    return score;
  };

  const titleStatus = getTitleStatus();
  const excerptStatus = getExcerptStatus();
  const slugStatus = getSlugStatus();
  const contentAnalysis = getContentAnalysis();
  const seoScore = getSEOScore();

  const toBadgeVariant = (color: string): BadgeProps['variant'] => {
    if (color === 'warning') return 'secondary';
    if (color === 'success') return 'success';
    if (color === 'destructive') return 'destructive';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Insights
          </CardTitle>
          <CardDescription>
            Real-time analysis of your post's SEO performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">SEO Score</span>
                <span className="text-sm text-muted-foreground">{seoScore}/100</span>
              </div>
              <Progress value={seoScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {seoScore >= 80 ? 'Excellent SEO optimization!' : 
                 seoScore >= 60 ? 'Good SEO, room for improvement' : 
                 'Poor SEO, needs attention'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <titleStatus.icon className="h-4 w-4" />
                <span className="text-sm">Title Length: {titleStatus.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <excerptStatus.icon className="h-4 w-4" />
                <span className="text-sm">Meta Description: {excerptStatus.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <slugStatus.icon className="h-4 w-4" />
                <span className="text-sm">Slug Readability: {slugStatus.text}</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm">Content: {contentAnalysis.wordCount} words ({contentAnalysis.readingTime} min read)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <Badge variant={toBadgeVariant(titleStatus.color)}>
                  {titleStatus.text}
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
              This title will appear in search engine results. Keep it under 60 characters for best results.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="seo-slug" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                URL Slug
              </Label>
              <div className="flex items-center gap-2">
                <Badge variant={toBadgeVariant(slugStatus.color)}>
                  {slugStatus.text}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {slugLength} characters
                </span>
              </div>
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
                <Badge variant={toBadgeVariant(excerptStatus.color)}>
                  {excerptStatus.text}
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
    </div>
  );
};
