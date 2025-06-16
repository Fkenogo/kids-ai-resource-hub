
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

  useEffect(() => {
    if (!isLoading && !dbResource) {
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
        <ResourceDetail resource={mapDbResourceToResource(dbResource)} reviews={[]} />
      </div>
    </Layout>
  );
};

export default ResourcePage;
