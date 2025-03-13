
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ResourceDetail } from '@/components/ResourceDetail';
import { ResourceGrid } from '@/components/ResourceGrid';
import { getResourceById, getReviewsForResource, filterResources } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourcePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const resource = id ? getResourceById(id) : undefined;
  const reviews = id ? getReviewsForResource(id) : [];
  
  useEffect(() => {
    if (!resource) {
      navigate('/resources', { replace: true });
    }
    
    // Scroll to top when resource changes
    window.scrollTo(0, 0);
  }, [resource, navigate]);
  
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
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-medium mb-6">Similar Resources</h2>
            <ResourceGrid resources={similarResources} columns={3} />
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default ResourcePage;
