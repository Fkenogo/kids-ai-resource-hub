
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Star, Pin, Eye } from 'lucide-react';

interface PublishingOptionsProps {
  isPublished: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  scheduledDate: string;
  readTime: number;
  onPublishedChange: (checked: boolean) => void;
  onFeaturedChange: (checked: boolean) => void;
  onPinnedChange: (checked: boolean) => void;
  onScheduledDateChange: (date: string) => void;
  onReadTimeChange: (time: number) => void;
}

export const PublishingOptions = ({
  isPublished,
  isFeatured,
  isPinned,
  scheduledDate,
  readTime,
  onPublishedChange,
  onFeaturedChange,
  onPinnedChange,
  onScheduledDateChange,
  onReadTimeChange
}: PublishingOptionsProps) => {
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);
  const isScheduled = scheduledDate && new Date(scheduledDate) > now;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Publishing Options
        </CardTitle>
        <CardDescription>
          Control when and how your blog post is published
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Publish Status */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Publish Post
            </Label>
            <p className="text-sm text-muted-foreground">
              Make this post visible to readers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isPublished}
              onCheckedChange={onPublishedChange}
            />
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
        </div>

        {/* Scheduled Publishing */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Schedule Publication
          </Label>
          <Input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => onScheduledDateChange(e.target.value)}
            min={minDateTime}
          />
          {isScheduled && (
            <Badge variant="outline" className="text-xs">
              Scheduled for {new Date(scheduledDate).toLocaleString()}
            </Badge>
          )}
          <p className="text-xs text-muted-foreground">
            Leave empty to publish immediately when the post is set to published
          </p>
        </div>

        {/* Featured Post */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Featured Post
            </Label>
            <p className="text-sm text-muted-foreground">
              Highlight this post in featured sections
            </p>
          </div>
          <Switch
            checked={isFeatured}
            onCheckedChange={onFeaturedChange}
          />
        </div>

        {/* Pinned Post */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <Pin className="h-4 w-4" />
              Pinned Post
            </Label>
            <p className="text-sm text-muted-foreground">
              Keep this post at the top of the blog
            </p>
          </div>
          <Switch
            checked={isPinned}
            onCheckedChange={onPinnedChange}
          />
        </div>

        {/* Read Time */}
        <div className="space-y-2">
          <Label>Estimated Read Time (minutes)</Label>
          <Input
            type="number"
            value={readTime}
            onChange={(e) => onReadTimeChange(parseInt(e.target.value) || 5)}
            min="1"
            max="60"
          />
          <p className="text-xs text-muted-foreground">
            This will be displayed to readers as "X min read"
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
