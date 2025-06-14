
// Helper function to convert mock data format to database format
export const convertResourceToDbFormat = (resource: any, userId: string) => {
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
  const mapResourceType = (type: string): "interactive_tool" | "online_course" | "video" | "book" | "game" | "camp" | "ai_tool" | "curriculum" | "tutorial" | "activity" => {
    const mapping: Record<string, "interactive_tool" | "online_course" | "video" | "book" | "game" | "camp" | "ai_tool" | "curriculum" | "tutorial" | "activity"> = {
      'interactive_tool': 'interactive_tool',
      'online_course': 'online_course',
      'video': 'video',
      'book': 'book',
      'game': 'game',
      'camp': 'camp',
      'ai_tool': 'ai_tool',
      'curriculum': 'curriculum',
      'tutorial': 'tutorial',
      'activity': 'activity'
    };
    if (!mapping[type]) {
      console.warn(`Unsupported resource type: "${type}", defaulting to 'online_course'. Resource: ${resource.title}`);
      return 'online_course';
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
    format: resource.format,
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

export const convertProductToDbFormat = (product: any) => {
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
