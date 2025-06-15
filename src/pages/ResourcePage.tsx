import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceDetail } from '@/components/ResourceDetail';
import { ResourceGrid } from '@/components/ResourceGrid';
import { filterResources } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { m } from 'framer-motion';
import { getPopularResources } from '@/services/engagementService';
import { Resource } from '@/types';
import { useResource } from '@/hooks/useSupabaseData';

const ResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: resource, isLoading } = useResource(id || '');

  useEffect(() => {
    if (!isLoading && !resource) {
      navigate('/resources', { replace: true });
      return;
    }
    window.scrollTo(0, 0);
  }, [resource, navigate, id, isLoading]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="text-lg text-muted-foreground">Loading resource...</p>
        </div>
      </Layout>
    );
  }

  if (!resource) {
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
        <ResourceDetail resource={resource} reviews={[]} />
      </div>
    </Layout>
  );
};

export default ResourcePage;
