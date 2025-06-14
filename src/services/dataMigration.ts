
import { supabase } from "@/integrations/supabase/client";
import { mockResources } from "@/data/mockData";
import { mockProducts } from "@/data/shoppingData";
import { mockCommunityPosts } from "@/data/communityData";

// Helper function to convert mock data format to database format
const convertResourceToDbFormat = (resource: any) => {
  // Map mock age ranges to database enum values
  const mapAgeRange = (ageRange: string): "5-7" | "8-10" | "11-13" | "14-17" => {
    const mapping: Record<string, "5-7" | "8-10" | "11-13" | "14-17"> = {
      '5-7': '5-7',
      '8-10': '8-10', 
      '11-13': '11-13',
      '14-17': '14-17'
    };
    return mapping[ageRange] || '8-10';
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
    return mapping[type] || 'online_course';
  };

  // Map mock cost types to database enum values
  const mapCostType = (cost: string): "free" | "paid" | "subscription" | "freemium" => {
    const mapping: Record<string, "free" | "paid" | "subscription" | "freemium"> = {
      'free': 'free',
      'paid': 'paid',
      'subscription': 'subscription',
      'freemium': 'freemium'
    };
    return mapping[cost] || 'free';
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
    // Use null for added_by - will be set to system admin if available
    added_by: null as string | null,
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

const convertProductToDbFormat = (product: any) => {
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
    return mapping[category?.toLowerCase()] || 'tools';
  };

  // Map mock price types to database enum values
  const mapPriceType = (priceType: string): "one-time" | "subscription" | "free" => {
    const mapping: Record<string, "one-time" | "subscription" | "free"> = {
      'one-time': 'one-time',
      'subscription': 'subscription',
      'free': 'free'
    };
    return mapping[priceType] || 'one-time';
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

export const migrateResourceData = async () => {
  console.log('Starting resource data migration...');
  
  try {
    // First, try to get or create a system admin user
    let adminUserId: string | null = null;
    
    // Try to get current user as fallback
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      adminUserId = user.id;
      console.log('Using current user as admin for migration:', adminUserId);
    }

    // Convert and insert resources
    const convertedResources = mockResources.map(resource => {
      const converted = convertResourceToDbFormat(resource);
      if (adminUserId) {
        converted.added_by = adminUserId;
      }
      return converted;
    });

    console.log('Converted resources sample:', convertedResources[0]);

    const { data, error } = await supabase
      .from('resources')
      .upsert(convertedResources, { onConflict: 'title' }); // Use title for conflict resolution

    if (error) {
      console.error('Error migrating resources:', error);
      throw error;
    }

    console.log(`Successfully migrated ${convertedResources.length} resources`);
    return data;
  } catch (error) {
    console.error('Resource migration failed:', error);
    throw error;
  }
};

export const migrateProductData = async () => {
  console.log('Starting product data migration...');
  
  try {
    // Convert and insert products
    const convertedProducts = mockProducts.map(convertProductToDbFormat);

    console.log('Converted products sample:', convertedProducts[0]);

    const { data, error } = await supabase
      .from('products')
      .upsert(convertedProducts, { onConflict: 'title' }); // Use title for conflict resolution

    if (error) {
      console.error('Error migrating products:', error);
      throw error;
    }

    console.log(`Successfully migrated ${convertedProducts.length} products`);
    return data;
  } catch (error) {
    console.error('Product migration failed:', error);
    throw error;
  }
};

export const migrateCommunityData = async () => {
  console.log('Starting community data migration...');
  
  try {
    // We'll skip community migration for now since it requires actual users
    // This would be done after authentication is properly set up
    console.log('Community data migration skipped - requires authenticated users');
    return null;
  } catch (error) {
    console.error('Community migration failed:', error);
    throw error;
  }
};

export const runFullMigration = async () => {
  console.log('Starting full data migration...');
  
  try {
    await migrateResourceData();
    await migrateProductData();
    await migrateCommunityData();
    
    console.log('Full migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
