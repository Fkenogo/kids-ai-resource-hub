
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Eye, 
  MessageSquare, 
  Heart, 
  Pin, 
  Lock, 
  Trash2, 
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCommunityPosts, useCommunityReplies } from '@/hooks/useCommunityData';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

export const CommunityManagement = () => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: 'post' | 'reply' } | null>(null);

  const { data: posts = [], isLoading: postsLoading } = useCommunityPosts();
  const { data: replies = [] } = useCommunityReplies(selectedPostId || '');
  const queryClient = useQueryClient();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggleSticky = async (postId: string, isSticky: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_sticky: !isSticky })
        .eq('id', postId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success(isSticky ? 'Post unpinned' : 'Post pinned');
    } catch (error) {
      console.error('Error toggling sticky:', error);
      toast.error('Failed to update post');
    }
  };

  const handleToggleLock = async (postId: string, isLocked: boolean) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ is_locked: !isLocked })
        .eq('id', postId);

      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast.success(isLocked ? 'Post unlocked' : 'Post locked');
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast.error('Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'post') {
        const { error } = await supabase
          .from('community_posts')
          .delete()
          .eq('id', deleteTarget.id);

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      } else {
        const { error } = await supabase
          .from('community_replies')
          .delete()
          .eq('id', deleteTarget.id);

        if (error) throw error;
        queryClient.invalidateQueries({ queryKey: ['community-replies'] });
      }

      toast.success(`${deleteTarget.type} deleted successfully`);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error(`Failed to delete ${deleteTarget.type}`);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'getting-started': 'bg-green-100 text-green-800',
      'age-specific': 'bg-blue-100 text-blue-800',
      'troubleshooting': 'bg-red-100 text-red-800',
      'project-showcase': 'bg-purple-100 text-purple-800',
      'curriculum-ideas': 'bg-yellow-100 text-yellow-800',
      'resource-requests': 'bg-indigo-100 text-indigo-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Management</h2>
          <p className="text-muted-foreground">Manage posts, replies, and community interactions</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="getting-started">Getting Started</option>
              <option value="age-specific">Age Specific</option>
              <option value="troubleshooting">Troubleshooting</option>
              <option value="project-showcase">Project Showcase</option>
              <option value="curriculum-ideas">Curriculum Ideas</option>
              <option value="resource-requests">Resource Requests</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">Posts Management</TabsTrigger>
          <TabsTrigger value="replies">Replies Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Posts</CardTitle>
              <CardDescription>
                Manage community posts, pin important ones, and moderate content
              </CardDescription>
            </CardHeader>
            <CardContent>
              {postsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar>
                              {post.authorAvatar ? (
                                <img src={post.authorAvatar} alt={post.authorName} />
                              ) : (
                                <div className="bg-primary text-white w-full h-full flex items-center justify-center text-sm">
                                  {post.authorName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{post.authorName}</p>
                              <p className="text-sm text-muted-foreground">{post.datePosted}</p>
                            </div>
                            {post.isSticky && (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Pin className="h-3 w-3" />
                                Pinned
                              </Badge>
                            )}
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                          <p className="text-muted-foreground mb-3 line-clamp-2">{post.content}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <Badge className={getCategoryColor(post.category)}>
                              {post.category.replace('-', ' ')}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {post.likeCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {post.replyCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.viewCount}
                            </span>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedPostId(post.id)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Replies
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleSticky(post.id, post.isSticky)}>
                              <Pin className="h-4 w-4 mr-2" />
                              {post.isSticky ? 'Unpin' : 'Pin'} Post
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleLock(post.id, false)}>
                              <Lock className="h-4 w-4 mr-2" />
                              Lock Post
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setDeleteTarget({ id: post.id, type: 'post' });
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Post
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {filteredPosts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No posts found matching your criteria.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="replies" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Replies Management</CardTitle>
              <CardDescription>
                {selectedPostId ? 'Viewing replies for selected post' : 'Select a post to view its replies'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPostId ? (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <div key={reply.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar>
                              {reply.authorAvatar ? (
                                <img src={reply.authorAvatar} alt={reply.authorName} />
                              ) : (
                                <div className="bg-primary text-white w-full h-full flex items-center justify-center text-sm">
                                  {reply.authorName.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-medium">{reply.authorName}</p>
                              <p className="text-sm text-muted-foreground">{reply.datePosted}</p>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{reply.content}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {reply.likeCount}
                            </span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => {
                            setDeleteTarget({ id: reply.id, type: 'reply' });
                            setShowDeleteDialog(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {replies.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No replies found for this post.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Select a post from the Posts tab to view its replies.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {deleteTarget?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
