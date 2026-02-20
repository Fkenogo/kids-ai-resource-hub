
type LegacyResource = {
  title: string;
  description: string;
  url: string;
  ageRanges?: string[];
  resourceType: string;
  format?: string;
  cost: string;
  learningOutcomes?: string[];
  skillsAttained?: string[];
  keyFeatures?: string[];
  requirements?: string[];
  imageUrl?: string;
  averageRating?: number;
  reviewCount?: number;
  featuredResource?: boolean;
  viewCount?: number;
  likeCount?: number;
  shareCount?: number;
  saveCount?: number;
  commentCount?: number;
  dateAdded?: string;
};

type LegacyProduct = {
  title: string;
  description: string;
  shortDescription?: string;
  category?: string;
  price?: number;
  originalPrice?: number;
  priceType?: string;
  currency?: string;
  imageUrl?: string;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  stockCount?: number;
  seller?: string;
  isAffiliate?: boolean;
  affiliateUrl?: string;
  ageRange?: string;
  tags?: string[];
  features?: string[];
  requirements?: string[];
  bestseller?: boolean;
  featured?: boolean;
  dateAdded?: string;
};

// Helper function to convert mock data format to database format
export const convertResourceToDbFormat = (resource: LegacyResource, userId: string) => {
  // Map mock age ranges to database enum values
  const mapAgeRange = (ageRange: string): "5-7" | "8-10" | "11-13" | "14-17" => {
    const mapping: Record<string, "5-7" | "8-10" | "11-13" | "14-17"> = {
      '5-7': '5-7',
      '8-10': '8-10', 
      '11-13': '11-13',
      '14-17': '14-17'
    };
    if (!mapping[ageRange]) {
      console.warn(`Unsupported resource age range: "${ageRange}", defaulting to '8-10'. Resource: ${resource.title}`);
      return '8-10';
    }
    return mapping[ageRange];
  };

  // Map mock resource types to database enum values
  const mapResourceType = (type: string):
    | "online_courses_platforms"
    | "books_reading_materials"
    | "interactive_tools_apps"
    | "ai_powered_games_simulations"
    | "youtube_channels_video_resources"
    | "hands_on_ai_projects_activities"
    | "ai_camps_webinars_live_classes" => {
    const mapping: Record<string,
      | "online_courses_platforms"
      | "books_reading_materials"
      | "interactive_tools_apps"
      | "ai_powered_games_simulations"
      | "youtube_channels_video_resources"
      | "hands_on_ai_projects_activities"
      | "ai_camps_webinars_live_classes"> = {
      'online_course': 'online_courses_platforms',
      'book': 'books_reading_materials',
      'curriculum': 'books_reading_materials',
      'interactive_tool': 'interactive_tools_apps',
      'ai_tool': 'interactive_tools_apps',
      'game': 'ai_powered_games_simulations',
      'video': 'youtube_channels_video_resources',
      'tutorial': 'hands_on_ai_projects_activities',
      'activity': 'hands_on_ai_projects_activities',
      'camp': 'ai_camps_webinars_live_classes'
    };
    if (!mapping[type]) {
      console.warn(`Unsupported resource type: "${type}", defaulting to 'online_courses_platforms'. Resource: ${resource.title}`);
      return 'online_courses_platforms';
    }
    return mapping[type];
  };

  // Map mock cost types to database enum values
  const mapCostType = (cost: string): "free" | "paid" | "subscription" | "freemium" => {
    const mapping: Record<string, "free" | "paid" | "subscription" | "freemium"> = {
      'free': 'free',
      'paid': 'paid',
      'subscription': 'subscription',
      'freemium': 'freemium'
    };
    if (!mapping[cost]) {
      console.warn(`Unsupported cost type: "${cost}", defaulting to 'free'. Resource: ${resource.title}`);
      return 'free';
    }
    return mapping[cost];
  };

  return {
    // Don't include id - let database generate UUID
    title: resource.title,
    description: resource.description,
    url: resource.url,
    age_ranges: resource.ageRanges?.map(mapAgeRange) || ['8-10'],
    resource_type: mapResourceType(resource.resourceType),
    format:
      resource.format?.toLowerCase() === 'course'
        ? 'Online Course'
        : resource.format?.toLowerCase() === 'experiments'
          ? 'Activity'
          : resource.format,
    cost: mapCostType(resource.cost),
    learning_outcomes: resource.learningOutcomes || [],
    skills_attained: resource.skillsAttained || [],
    key_features: resource.keyFeatures || [],
    requirements: resource.requirements || [],
    image_url: resource.imageUrl,
    // Use the provided userId - this field is NOT NULL in database
    added_by: userId,
    average_rating: resource.averageRating || 0,
    review_count: resource.reviewCount || 0,
    is_featured: resource.featuredResource || false,
    view_count: resource.viewCount || 0,
    like_count: resource.likeCount || 0,
    share_count: resource.shareCount || 0,
    save_count: resource.saveCount || 0,
    comment_count: resource.commentCount || 0,
    is_approved: true, // Approve all migrated resources
    created_at: resource.dateAdded || new Date().toISOString()
  };
};

export const convertProductToDbFormat = (product: LegacyProduct) => {
  // Map mock product categories to database enum values
  const mapProductCategory = (category: string): "books" | "courses" | "videos" | "tools" | "games" | "kits" => {
    const mapping: Record<string, "books" | "courses" | "videos" | "tools" | "games" | "kits"> = {
      'books': 'books',
      'courses': 'courses', 
      'videos': 'videos',
      'tools': 'tools',
      'games': 'games',
      'kits': 'kits'
    };
    if (!mapping[category?.toLowerCase()]) {
      console.warn(`Unsupported product category: "${category}", defaulting to 'tools'. Product: ${product.title}`);
      return 'tools';
    }
    return mapping[category?.toLowerCase()];
  };

  // Map mock price types to database enum values
  const mapPriceType = (priceType: string): "one-time" | "subscription" | "free" => {
    const mapping: Record<string, "one-time" | "subscription" | "free"> = {
      'one-time': 'one-time',
      'subscription': 'subscription',
      'free': 'free'
    };
    if (!mapping[priceType]) {
      console.warn(`Unsupported price type: "${priceType}", defaulting to 'one-time'. Product: ${product.title}`);
      return 'one-time';
    }
    return mapping[priceType];
  };

  return {
    // Don't include id - let database generate UUID
    title: product.title,
    description: product.description,
    short_description: product.shortDescription,
    category: mapProductCategory(product.category),
    price: product.price || 0,
    original_price: product.originalPrice,
    price_type: mapPriceType(product.priceType || 'one-time'),
    currency: product.currency || 'USD',
    image_url: product.imageUrl,
    images: product.images || [],
    rating: product.rating || 0,
    review_count: product.reviewCount || 0,
    in_stock: product.inStock !== false,
    stock_count: product.stockCount,
    seller: product.seller || 'Unknown Seller',
    is_affiliate: product.isAffiliate || false,
    affiliate_url: product.affiliateUrl,
    age_range: product.ageRange || '8-10',
    tags: product.tags || [],
    features: product.features || [],
    requirements: product.requirements || [],
    is_bestseller: product.bestseller || false,
    is_featured: product.featured || false,
    created_at: product.dateAdded || new Date().toISOString()
  };
};
