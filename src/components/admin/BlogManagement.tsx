
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedBlogPostForm } from './EnhancedBlogPostForm';
import { PostsManagement } from './blog/PostsManagement';
import { CommentsManagement } from './blog/CommentsManagement';
import { getBlogPosts, getBlogComments } from '@/services/blogService';

export const BlogManagement = () => {
  const queryClient = useQueryClient();

  const { data: allPosts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: () => getBlogPosts(true),
  });

  const { data: allComments = [] } = useQuery({
    queryKey: ['blog-comments'],
    queryFn: () => getBlogComments(undefined, true),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground">Create, edit, and manage your blog content with advanced tools</p>
        </div>
        <EnhancedBlogPostForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['blog-posts'] })} />
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Blog Posts ({allPosts.length})</TabsTrigger>
          <TabsTrigger value="comments">Comments ({allComments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <PostsManagement />
        </TabsContent>

        <TabsContent value="comments">
          <CommentsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};
