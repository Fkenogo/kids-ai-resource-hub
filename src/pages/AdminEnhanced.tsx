
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResources } from '@/hooks/useSupabaseData';
import { Resource } from '@/types';
import { 
  Edit, 
  Trash2, 
  Star, 
  Eye, 
  Users, 
  BookOpen, 
  TrendingUp,
  Upload,
  Image,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

// Transform database resource to Resource type (same as in Home.tsx)
const mapDbResourceToResource = (r: any): Resource => ({
  id: r.id,
  title: r.title,
  description: r.description,
  url: r.url,
  ageRanges: r.age_ranges,
  resourceType: r.resource_type,
  format: r.format ?? undefined,
  cost: r.cost,
  learningOutcomes: r.learning_outcomes ?? undefined,
  skillsAttained: r.skills_attained ?? undefined,
  keyFeatures: r.key_features ?? undefined,
  dateAdded: r.created_at,
  addedBy: r.added_by,
  averageRating: r.average_rating ?? 0,
  reviewCount: r.review_count ?? 0,
  featuredResource: r.is_featured ?? false,
  imageUrl: r.image_url ?? undefined,
  viewCount: r.view_count ?? 0,
  likeCount: r.like_count ?? 0,
  shareCount: r.share_count ?? 0,
  saveCount: r.save_count ?? 0,
  commentCount: r.comment_count ?? 0,
});

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

  const stats = {
    totalResources: resources.length,
    approvedResources: resources.filter((r: Resource) => r.featuredResource).length,
    totalViews: resources.reduce((sum: number, r: Resource) => sum + (r.viewCount || 0), 0),
    avgRating: resources.length > 0 ? 
      (resources.reduce((sum: number, r: Resource) => sum + r.averageRating, 0) / resources.length).toFixed(1) : 
      '0.0'
  };

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

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResources}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Featured Resources</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedResources}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgRating}/5.0</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="resources" className="space-y-4">
          <TabsList>
            <TabsTrigger value="resources">Resource Management</TabsTrigger>
            <TabsTrigger value="images">Image Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="resources" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="online_course">Online Course</SelectItem>
                      <SelectItem value="interactive_tool">Interactive Tool</SelectItem>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterCost} onValueChange={setFilterCost}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by cost" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Costs</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resources List */}
            <div className="grid gap-4">
              {filteredResources.map((resource: Resource) => (
                <Card key={resource.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {resource.imageUrl ? (
                            <img 
                              src={resource.imageUrl} 
                              alt={resource.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                              <Image className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold">{resource.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {resource.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline">{resource.resourceType}</Badge>
                              <Badge variant={resource.cost === 'free' ? 'success' : 'default'}>
                                {resource.cost}
                              </Badge>
                              {resource.featuredResource && (
                                <Badge variant="default">Featured</Badge>
                              )}
                              {resource.ageRanges.map(age => (
                                <Badge key={age} variant="secondary" className="text-xs">
                                  Ages {age}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {resource.averageRating.toFixed(1)} ({resource.reviewCount})
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {resource.viewCount || 0} views
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImageUpload(resource.id)}
                          className="flex items-center gap-1"
                        >
                          <Upload className="h-3 w-3" />
                          Upload Image
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetFeatured(resource.id)}
                          className="flex items-center gap-1"
                        >
                          <Star className="h-3 w-3" />
                          {resource.featuredResource ? 'Unfeature' : 'Feature'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteResource(resource.id)}
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Image Management</CardTitle>
                <CardDescription>
                  Upload and manage images for resources. Images help make resources more engaging and easier to identify.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Image Upload Feature</h3>
                  <p className="text-muted-foreground mb-4">
                    Drag and drop images here or click to browse
                  </p>
                  <Button>
                    Select Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Analytics</CardTitle>
                <CardDescription>
                  Insights into resource performance and user engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and reporting features coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminEnhanced;
