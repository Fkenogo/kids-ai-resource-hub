
import { Resource } from '@/types';

// Transform database resource to Resource type
export const mapDbResourceToResource = (r: any): Resource => {
  if (!r) {
    return null as any;
  }

  return {
    id: r.id,
    title: r.title,
    description: r.description,
    url: r.url,
    ageRanges: r.age_ranges || [],
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
  };
};
