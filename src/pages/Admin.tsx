
import { Suspense, lazy } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Database, Users, Package, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAdminAccess } from '@/hooks/useAdminAccess';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getAdminCounts } from '@/services/backend/admin';

const ResourceManagement = lazy(() =>
  import('@/components/admin/ResourceManagement').then((module) => ({
    default: module.ResourceManagement,
  })),
);
const CommunityManagement = lazy(() =>
  import('@/components/admin/CommunityManagement').then((module) => ({
    default: module.CommunityManagement,
  })),
);
const BlogManagement = lazy(() =>
  import('@/components/admin/BlogManagement').then((module) => ({
    default: module.BlogManagement,
  })),
);
const SQLTemplateGenerator = lazy(() =>
  import('@/components/admin/SQLTemplateGenerator').then((module) => ({
    default: module.SQLTemplateGenerator,
  })),
);

const Admin = () => {
  const { isAuthenticated, hasAccess, isCheckingAccess } = useAdminAccess();

  const { data: counts } = useQuery({
    queryKey: ['admin-counts'],
    enabled: hasAccess,
    queryFn: getAdminCounts,
  });

  if (isCheckingAccess) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-8">
          <Card>
            <CardHeader>
              <CardTitle>Checking access</CardTitle>
              <CardDescription>Verifying admin permissions...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || !hasAccess) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto p-8">
          <Card>
            <CardHeader>
              <CardTitle>Access denied</CardTitle>
              <CardDescription>You need an admin or moderator account to open this page.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              {!isAuthenticated ? (
                <Button asChild>
                  <Link to="/login">Log in</Link>
                </Button>
              ) : null}
              <Button variant="outline" asChild>
                <Link to="/">Go to home</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
              <Shield className="h-10 w-10" />
              Admin Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your Kids AI Resources platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts?.resources ?? 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Educational resources in database
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts?.users ?? 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community Posts</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts?.communityPosts ?? 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Community discussions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{counts?.products ?? 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Available for purchase
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="resources">Resource Management</TabsTrigger>
              <TabsTrigger value="community">Community Management</TabsTrigger>
              <TabsTrigger value="blog">Blog Management</TabsTrigger>
              <TabsTrigger value="sql-generator">SQL Generator</TabsTrigger>
            </TabsList>

            <Suspense fallback={<div className="mt-6 text-sm text-muted-foreground">Loading admin module...</div>}>
              <TabsContent value="resources" className="mt-6">
                <ResourceManagement />
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                <CommunityManagement />
              </TabsContent>

              <TabsContent value="blog" className="mt-6">
                <BlogManagement />
              </TabsContent>

              <TabsContent value="sql-generator" className="mt-6">
                <SQLTemplateGenerator />
              </TabsContent>
            </Suspense>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
