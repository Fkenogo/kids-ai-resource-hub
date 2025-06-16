
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Eye, Star, Users, CheckCircle, XCircle, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ResourceImageEditor } from '@/components/ResourceImageEditor';
import { AddResourceForm } from './AddResourceForm';
import { ResourceEditDialog } from './ResourceEditDialog';

export const ResourceManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const queryClient = useQueryClient();

  // Fetch all resources for admin
  const { data: dbResources = [], isLoading } = useQuery({
    queryKey: ['admin-resources', statusFilter],
    queryFn: async () => {
      let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
      
      if (statusFilter === 'approved') {
        query = query.eq('is_approved', true);
      } else if (statusFilter === 'pending') {
        query = query.eq('is_approved', false);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  // Filter resources based on search
  const filteredResources = dbResources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle approval status
  const toggleApprovalMutation = useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      const { error } = await supabase
        .from('resources')
        .update({ is_approved: !isApproved })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success('Resource status updated');
    },
    onError: () => {
      toast.error('Failed to update resource status');
    },
  });

  // Toggle featured status
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      const { error } = await supabase
        .from('resources')
        .update({ is_featured: !isFeatured })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success('Featured status updated');
    },
    onError: () => {
      toast.error('Failed to update featured status');
    },
  });

  // Delete resource
  const deleteResourceMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('resources').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success('Resource deleted');
    },
    onError: () => {
      toast.error('Failed to delete resource');
    },
  });

  const resourcesWithoutImages = dbResources.filter(r => !r.image_url || r.image_url.includes('/lovable-uploads/'));

  if (isLoading) {
    return <div className="text-center py-8">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resource Management</h2>
          <p className="text-muted-foreground">Manage all educational resources</p>
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <AddResourceForm onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-resources'] })} />
          </div>

          <div className="grid gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{resource.title}</h3>
                        <div className="flex gap-1">
                          {resource.is_approved ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              <XCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {resource.is_featured && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          {!resource.image_url && (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              <ImageIcon className="h-3 w-3 mr-1" />
                              No Image
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {resource.view_count || 0} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {resource.average_rating || 0} rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {resource.review_count || 0} reviews
                        </span>
                        <span>Type: {resource.resource_type}</span>
                        <span>Cost: {resource.cost}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ResourceEditDialog 
                        resource={resource} 
                        onUpdated={() => queryClient.invalidateQueries({ queryKey: ['admin-resources'] })} 
                      />
                      
                      <Button
                        variant={resource.is_approved ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleApprovalMutation.mutate({ 
                          id: resource.id, 
                          isApproved: resource.is_approved 
                        })}
                      >
                        {resource.is_approved ? 'Unapprove' : 'Approve'}
                      </Button>
                      
                      <Button
                        variant={resource.is_featured ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFeaturedMutation.mutate({ 
                          id: resource.id, 
                          isFeatured: resource.is_featured 
                        })}
                      >
                        {resource.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this resource?')) {
                            deleteResourceMutation.mutate(resource.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {resourcesWithoutImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Resources Without Images ({resourcesWithoutImages.length})
            </CardTitle>
            <CardDescription>
              Add images to these resources to improve their presentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resourcesWithoutImages.map((resource) => (
              <ResourceImageEditor
                key={resource.id}
                resource={resource}
                onUpdated={() => queryClient.invalidateQueries({ queryKey: ['admin-resources'] })}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
