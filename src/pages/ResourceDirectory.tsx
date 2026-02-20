import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ResourceGrid } from '@/components/ResourceGrid';
import { FilterSidebar } from '@/components/FilterSidebar';
import { useResources } from '@/hooks/useBackendData';
import { ResourceFilters, DisplayMode, AgeRange } from '@/types';
import { useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Grid2x2, List } from 'lucide-react';
import { mapDbResourceToResource } from '@/utils/resourceTransform';
import { logger } from '@/lib/logger';
import { parseFormatTags } from '@/utils/resourceTaxonomy';

const ResourceDirectory = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const initialAgeRange = queryParams.get('age') 
    ? [queryParams.get('age') as AgeRange] 
    : [];

  const { data: dbResourcesRaw = [], isLoading, error } = useResources();
  if (error) logger.error("ResourceDirectory: resource query error", error);
  logger.debug("ResourceDirectory: dbResourcesRaw", dbResourcesRaw);

  const dbResources = Array.isArray(dbResourcesRaw)
    ? dbResourcesRaw.map(mapDbResourceToResource)
    : [];
  
  const [filters, setFilters] = useState<ResourceFilters>({
    ageRanges: initialAgeRange,
    resourceTypes: [],
    formats: [],
    costTypes: [],
    minRating: 0,
    recentlyAdded: false,
    searchQuery: '',
  });

  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [showByCategory, setShowByCategory] = useState(initialAgeRange.length === 0);

  const filteredResources = dbResources.filter(resource => {
    // Filter by ageRanges
    if (filters.ageRanges.length > 0 && !resource.ageRanges.some((age: AgeRange) => filters.ageRanges.includes(age))) {
      return false;
    }
    // Filter by resourceTypes
    if (filters.resourceTypes.length > 0 && !filters.resourceTypes.includes(resource.resourceType)) {
      return false;
    }
    // Filter by formats
    if (filters.formats.length > 0) {
      const resourceFormats = parseFormatTags(resource.format);
      if (!resourceFormats.some((format) => filters.formats.includes(format))) {
        return false;
      }
    }
    // Filter by costTypes
    if (filters.costTypes.length > 0 && !filters.costTypes.includes(resource.cost)) {
      return false;
    }
    // Filter by minRating
    if (filters.minRating > 0 && (resource.averageRating ?? 0) < filters.minRating) {
      return false;
    }
    // Filter by recentlyAdded (last 30 days)
    if (filters.recentlyAdded) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (new Date(resource.dateAdded) < thirtyDaysAgo) return false;
    }
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (
        !resource.title.toLowerCase().includes(query) &&
        !resource.description.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  useEffect(() => {
    // If age range filter is applied, disable category grouping
    if (filters.ageRanges.length > 0) {
      setShowByCategory(false);
    } else {
      setShowByCategory(true);
    }
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
      <m.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-3xl font-bold mb-8">AI Learning Resource Directory</h1>
        
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
              
              <div className="flex items-center gap-4">
                <Tabs 
                  defaultValue={displayMode} 
                  className="w-auto"
                  onValueChange={(value) => setDisplayMode(value as DisplayMode)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid" className="flex items-center gap-2">
                      <Grid2x2 size={16} />
                      <span className="hidden sm:inline">Grid</span>
                    </TabsTrigger>
                    <TabsTrigger value="table" className="flex items-center gap-2">
                      <List size={16} />
                      <span className="hidden sm:inline">Table</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            
            {filteredResources.length > 0 ? (
              <ResourceGrid 
                resources={filteredResources} 
                columns={3} 
                displayMode={displayMode}
                showCategories={showByCategory}
                categoryBy={showByCategory ? 'ageRange' : null}
              />
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
      </m.div>
    </Layout>
  );
};

export default ResourceDirectory;
