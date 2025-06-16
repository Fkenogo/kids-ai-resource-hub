
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceDetail } from '@/components/ResourceDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useResource } from '@/hooks/useSupabaseData';
import { mapDbResourceToResource } from '@/utils/resourceTransform';

const ResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: dbResource, isLoading, error } = useResource(id || '');

  console.log('ResourcePage: id:', id);
  console.log('ResourcePage: raw data from useResource:', dbResource);
  console.log('ResourcePage: isLoading:', isLoading);
  console.log('ResourcePage: error:', error);

  useEffect(() => {
    if (!isLoading && !dbResource) {
      console.log('ResourcePage: No resource found, navigating to /resources');
      navigate('/resources', { replace: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [dbResource, navigate, id, isLoading]);

  if (error) {
    console.error("ResourcePage: resource query error", error);
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-lg text-muted-foreground">Loading resource...</p>
        </div>
      </Layout>
    );
  }

  if (!dbResource) {
    return null;
  }

  const transformedResource = mapDbResourceToResource(dbResource);
  console.log('ResourcePage: transformed resource:', transformedResource);

  if (!transformedResource) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-lg text-muted-foreground">Resource not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link to="/resources" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Resources
            </Link>
          </Button>
        </div>
        <ResourceDetail resource={transformedResource} reviews={[]} />
      </div>
    </Layout>
  );
};

export default ResourcePage;
