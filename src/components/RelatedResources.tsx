
import { Resource } from '@/types';
import { ResourceGrid } from './ResourceGrid';
import { useResources } from '@/hooks/useSupabaseData';
import { Heart } from 'lucide-react';

interface RelatedResourcesProps {
  resource: Resource;
}

const mapDbResourceToResource = (r: any): Resource => ({
  id: r.id,
  title: r.title,
  description: r.description,
  url: r.url,
  ageRanges: r.age_ranges,
  resourceType: r.resource_type,
  format: r.format ?? undefined,
  cost: r.cost,
  learningOutcomes: r.learning_outcomes ?? undefined,
  skillsAttained: r.skills_attained ?? undefined,
  keyFeatures: r.key_features ?? undefined,
  dateAdded: r.created_at,
  addedBy: r.added_by,
  averageRating: r.average_rating ?? 0,
  reviewCount: r.review_count ?? 0,
  featuredResource: r.is_featured ?? false,
  imageUrl: r.image_url ?? undefined,
  viewCount: r.view_count ?? 0,
  likeCount: r.like_count ?? 0,
  shareCount: r.share_count ?? 0,
  saveCount: r.save_count ?? 0,
  commentCount: r.comment_count ?? 0,
});

export const RelatedResources = ({ resource }: RelatedResourcesProps) => {
  const { data: dbResourcesRaw = [], isLoading, error } = useResources();

  if (error) {
    console.error("RelatedResources: resource query error", error);
  }

  const dbResources = Array.isArray(dbResourcesRaw)
    ? dbResourcesRaw.map(mapDbResourceToResource)
    : [];

  // Find similar resources based on type and age range
  const getSimilarResources = (): Resource[] => {
    const filtered = dbResources.filter(r => {
      // Exclude the current resource
      if (r.id === resource.id) return false;
      
      // Match by resource type (primary criterion)
      if (r.resourceType !== resource.resourceType) return false;
      
      // Check for overlapping age ranges (secondary criterion)
      const hasOverlappingAges = r.ageRanges.some(age => 
        resource.ageRanges.includes(age)
      );
      
      return hasOverlappingAges;
    });

    // Sort by rating/popularity and take top 4
    return filtered
      .sort((a, b) => {
        // Sort by view count first, then by rating
        if (b.viewCount !== a.viewCount) {
          return b.viewCount - a.viewCount;
        }
        return b.averageRating - a.averageRating;
      })
      .slice(0, 4);
  };

  const similarResources = getSimilarResources();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          You might also like
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted animate-pulse rounded-lg h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (similarResources.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-medium flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          You might also like
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No similar resources found at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium flex items-center gap-2">
        <Heart className="h-5 w-5 text-primary" />
        You might also like
      </h3>
      <ResourceGrid resources={similarResources} columns={4} />
    </div>
  );
};
