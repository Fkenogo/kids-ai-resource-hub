
import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ResourceGrid } from '@/components/ResourceGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { filterResources } from '@/data/mockData';
import { ResourceFilters } from '@/types';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResourceDirectory = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const initialAgeRanges = queryParams.get('age') 
    ? [queryParams.get('age') as any] 
    : [];

  const [filters, setFilters] = useState<ResourceFilters>({
    ageRanges: initialAgeRanges,
    resourceTypes: [],
    costTypes: [],
    minRating: 0,
    recentlyAdded: false,
    searchQuery: '',
  });

  const [filteredResources, setFilteredResources] = useState(
    filterResources({ ageRanges: initialAgeRanges })
  );

  useEffect(() => {
    setFilteredResources(filterResources(filters));
  }, [filters]);

  const handleFiltersChange = (newFilters: ResourceFilters) => {
    setFilters(newFilters);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Layout>
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-3xl font-bold mb-8">AI Learning Resources</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4 lg:w-1/5">
            <div className="glass-panel rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              <FilterSidebar 
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </div>
          
          <div className="md:w-3/4 lg:w-4/5">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-medium">
                {filteredResources.length} {filteredResources.length === 1 ? 'resource' : 'resources'} found
              </h2>
            </div>
            
            {filteredResources.length > 0 ? (
              <ResourceGrid resources={filteredResources} columns={3} />
            ) : (
              <div className="glass-panel rounded-xl p-8 text-center">
                <h3 className="text-lg font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query to find more resources.
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};

export default ResourceDirectory;
