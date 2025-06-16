
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useResources } from '@/hooks/useSupabaseData';
import { Resource } from '@/types';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { mapDbResourceToResource } from '@/utils/resourceTransform';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminFilters } from '@/components/admin/AdminFilters';
import { ResourceManagementCard } from '@/components/admin/ResourceManagementCard';
import { ImageManagementTab } from '@/components/admin/ImageManagementTab';
import { AnalyticsTab } from '@/components/admin/AnalyticsTab';

const AdminEnhanced = () => {
  const { data: dbResourcesRaw = [], isLoading } = useResources();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCost, setFilterCost] = useState('all');

  // Transform raw database resources to Resource type
  const resources = Array.isArray(dbResourcesRaw)
    ? dbResourcesRaw.map(mapDbResourceToResource)
    : [];

  const filteredResources = resources.filter((resource: Resource) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || resource.resourceType === filterType;
    const matchesCost = filterCost === 'all' || resource.cost === filterCost;
    
    return matchesSearch && matchesType && matchesCost;
  });

  const handleImageUpload = (resourceId: string) => {
    toast.info('Image upload feature - coming soon!');
  };

  const handleSetFeatured = (resourceId: string) => {
    toast.info('Set featured resource - coming soon!');
  };

  const handleDeleteResource = (resourceId: string) => {
    toast.info('Delete resource - coming soon!');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="text-center">Loading admin panel...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Enhanced Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage AI learning resources and platform content</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Resource
          </Button>
        </div>

        <AdminStats resources={resources} />

        <Tabs defaultValue="resources" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resources">Resource Management</TabsTrigger>
            <TabsTrigger value="images">Image Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-4">
            <AdminFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterType={filterType}
              setFilterType={setFilterType}
              filterCost={filterCost}
              setFilterCost={setFilterCost}
            />

            <div className="grid gap-4">
              {filteredResources.map((resource: Resource) => (
                <ResourceManagementCard
                  key={resource.id}
                  resource={resource}
                  onImageUpload={handleImageUpload}
                  onSetFeatured={handleSetFeatured}
                  onDeleteResource={handleDeleteResource}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <ImageManagementTab />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminEnhanced;
