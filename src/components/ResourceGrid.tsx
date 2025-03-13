
import { Resource } from '@/types';
import { ResourceCard } from './ResourceCard';

interface ResourceGridProps {
  resources: Resource[];
  columns?: number;
}

export const ResourceGrid = ({ resources, columns = 3 }: ResourceGridProps) => {
  const getColumnClass = () => {
    switch(columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 sm:grid-cols-2';
      case 3: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    }
  };

  return (
    <div className={`grid ${getColumnClass()} gap-6`}>
      {resources.map((resource, index) => (
        <ResourceCard key={resource.id} resource={resource} index={index} />
      ))}
    </div>
  );
};
