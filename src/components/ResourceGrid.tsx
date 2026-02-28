
import { Resource, DisplayMode } from '@/types';
import { ResourceCard } from './ResourceCard';
import { ResourceTable } from './ResourceTable';

interface ResourceGridProps {
  resources: Resource[];
  columns?: number;
  displayMode?: DisplayMode;
  showCategories?: boolean;
  categoryBy?: 'ageRange' | null;
}

export const ResourceGrid = ({ 
  resources, 
  columns = 3, 
  displayMode = 'grid',
  showCategories = false,
  categoryBy = null
}: ResourceGridProps) => {
  const getColumnClass = () => {
    switch(columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  const getCategorizedResources = () => {
    if (!categoryBy || !showCategories) return { uncategorized: resources };
    
    const categorized: Record<string, Resource[]> = {};
    
    if (categoryBy === 'ageRange') {
      resources.forEach(resource => {
        resource.ageRanges.forEach(ageRange => {
          if (!categorized[ageRange]) categorized[ageRange] = [];
          categorized[ageRange].push(resource);
        });
      });
      
      // Sort by age range
      return Object.keys(categorized)
        .sort((a, b) => {
          const ageA = parseInt(a.split('-')[0]);
          const ageB = parseInt(b.split('-')[0]);
          return ageA - ageB;
        })
        .reduce((acc, key) => {
          acc[key] = categorized[key];
          return acc;
        }, {} as Record<string, Resource[]>);
    }
    
    return { uncategorized: resources };
  };
  
  const categorizedResources = getCategorizedResources();
  
  if (displayMode === 'table') {
    return (
      <div className="space-y-12">
        {showCategories && categoryBy ? (
          Object.entries(categorizedResources).map(([category, categoryResources]) => (
            <div key={category} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                {categoryBy === 'ageRange' ? `Ages ${category} (${getCategoryDescription(category)})` : category}
              </h2>
              <ResourceTable resources={categoryResources} />
            </div>
          ))
        ) : (
          <ResourceTable resources={resources} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {showCategories && categoryBy ? (
        Object.entries(categorizedResources).map(([category, categoryResources]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {categoryBy === 'ageRange' ? `Ages ${category} (${getCategoryDescription(category)})` : category}
            </h2>
            <div className={`grid ${getColumnClass()} gap-4`}>
              {categoryResources.map((resource, index) => (
                <ResourceCard key={resource.id} resource={resource} index={index} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className={`grid ${getColumnClass()} gap-4`}>
          {resources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

function getCategoryDescription(ageRange: string): string {
  switch (ageRange) {
    case '4-7':
      return 'Early Learning';
    case '8-10':
      return 'Beginner AI Learning';
    case '11-13':
      return 'Hands-on AI & Coding';
    case '14-17':
      return 'Advanced AI & Career Readiness';
    default:
      return '';
  }
}
