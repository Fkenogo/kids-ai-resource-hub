
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceDetail } from '@/components/ResourceDetail';
import { ResourceGrid } from '@/components/ResourceGrid';
import { getResourceById, getReviewsForResource, filterResources } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { m } from 'framer-motion';
import { getPopularResources } from '@/services/engagementService';
import { Resource } from '@/types';

const ResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [popularResources, setPopularResources] = useState<Resource[]>([]);
  
  const resource = id ? getResourceById(id) : undefined;
  const reviews = id ? getReviewsForResource(id) : [];
  
  useEffect(() => {
    if (!resource) {
      navigate('/resources', { replace: true });
      return;
    }
    
    // Scroll to top when resource changes
    window.scrollTo(0, 0);
    
    // Get similar resources based on age range and resource type
    const similar = filterResources({
      ageRanges: resource.ageRanges,
      resourceTypes: [resource.resourceType],
    }).filter(r => r.id !== resource.id).slice(0, 3);
    
    // Get popular resources with engagement data
    const allResources = filterResources({});
    const popular = getPopularResources(allResources, 'views', 3)
      .filter(r => r.id !== resource.id && !similar.some(s => s.id === r.id));
    
    setPopularResources(popular);
  }, [resource, navigate, id]);
  
  if (!resource) {
    return null;
  }

  // Get similar resources based on age range and resource type
  const similarResources = filterResources({
    ageRanges: resource.ageRanges,
    resourceTypes: [resource.resourceType],
  }).filter(r => r.id !== resource.id).slice(0, 3);

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
        
        <ResourceDetail resource={resource} reviews={reviews} />
        
        {similarResources.length > 0 && (
          <m.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-medium mb-6">Similar Resources</h2>
            <ResourceGrid resources={similarResources} columns={3} />
          </m.div>
        )}
        
        {popularResources.length > 0 && (
          <m.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-medium flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-accent" />
              Popular Resources
            </h2>
            <ResourceGrid resources={popularResources} columns={3} />
          </m.div>
        )}
      </div>
    </Layout>
  );
};

export default ResourcePage;
