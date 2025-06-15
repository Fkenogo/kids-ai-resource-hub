import { Layout } from '@/components/Layout';
import { MigrationTool } from '@/components/MigrationTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Database, Users, Package, Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import React, { useEffect, useState } from 'react';
import { ResourceImageEditor } from '@/components/ResourceImageEditor';
import { Button } from '@/components/ui/button';

const Admin = () => {
  // Fetch resource count
  const { data: resourceCount } = useQuery({
    queryKey: ['admin-resource-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('resources')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch product count
  const { data: productCount } = useQuery({
    queryKey: ['admin-product-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // Fetch user count
  const { data: userCount } = useQuery({
    queryKey: ['admin-user-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  // --- Fetch resources with broken images for manual fix ---
  const [brokenResources, setBrokenResources] = useState<any[]>([]);
  const [loadingBroken, setLoadingBroken] = useState(false);

  const fetchBrokenResources = async () => {
    setLoadingBroken(true);
    const { data, error } = await supabase
      .from('resources')
      .select('id, title, image_url')
      .filter('image_url', 'like', '/lovable-uploads/%');
    setBrokenResources(data || []);
    setLoadingBroken(false);
  };

  useEffect(() => {
    fetchBrokenResources();
    // eslint-disable-next-line
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resourceCount ?? 'Loading...'}</div>
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
                <div className="text-2xl font-bold">{userCount ?? 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productCount ?? 'Loading...'}</div>
                <p className="text-xs text-muted-foreground">
                  Available for purchase
                </p>
              </CardContent>
            </Card>
          </div>

          <MigrationTool />

          {/* Manual image re-upload section */}
          <div className="my-16" id="manage-resource-images">
            <div className="flex items-center gap-2 mb-6">
              <Image className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Manage Resource Images</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              The following resources have broken or missing images. Re-upload a new image by using the uploader below and click Save to update.
            </p>
            <Button onClick={fetchBrokenResources} disabled={loadingBroken} className="mb-6">
              {loadingBroken ? "Refreshing..." : "Refresh List"}
            </Button>
            {brokenResources.length === 0 ? (
              <div className="text-green-700">No resources with broken images found.</div>
            ) : (
              <div className="grid gap-6">
                {brokenResources.map((res) => (
                  <ResourceImageEditor
                    key={res.id}
                    resource={res}
                    onUpdated={fetchBrokenResources}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
