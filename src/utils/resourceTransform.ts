
import { Resource } from '@/types';
import { formatTagsToStorage, normalizeResourceType, parseFormatTags } from '@/utils/resourceTaxonomy';

type DbResource = {
  id: string;
  title: string;
  description: string;
  url: string;
  age_ranges: Resource['ageRanges'];
  resource_type: Resource['resourceType'];
  format?: Resource['format'];
  cost: Resource['cost'];
  learning_outcomes?: string[];
  skills_attained?: string[];
  key_features?: string[];
  created_at: string;
  added_by?: string;
  average_rating?: number;
  review_count?: number;
  is_featured?: boolean;
  image_url?: string;
  view_count?: number;
  like_count?: number;
  share_count?: number;
  save_count?: number;
  comment_count?: number;
};

export const mapDbResourceToResource = (r: DbResource): Resource => ({
  id: r.id,
  title: r.title,
  description: r.description,
  url: r.url,
  ageRanges: r.age_ranges,
  resourceType: normalizeResourceType(r.resource_type),
  format: formatTagsToStorage(parseFormatTags(r.format)) || undefined,
  cost: r.cost,
  learningOutcomes: r.learning_outcomes ?? undefined,
  skillsAttained: r.skills_attained ?? undefined,
  keyFeatures: r.key_features ?? undefined,
  dateAdded: r.created_at,
  addedBy: r.added_by || 'system',
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
