
import { supabase } from "@/integrations/supabase/client";
import { resources, products } from "@/data/mockData";
import { shoppingData } from "@/data/shoppingData";
import { communityData } from "@/data/communityData";

// Helper function to convert mock data format to database format
const convertResourceToDbFormat = (resource: any) => {
  return {
    id: resource.id,
    title: resource.title,
    description: resource.description,
    url: resource.url,
    age_ranges: resource.ageRanges,
    resource_type: resource.resourceType,
    format: resource.format,
    cost: resource.cost,
    learning_outcomes: resource.learningOutcomes || [],
    skills_attained: resource.skillsAttained || [],
    key_features: resource.keyFeatures || [],
    requirements: resource.requirements || [],
    image_url: resource.imageUrl,
    added_by: 'system-admin', // We'll need to create a system admin user
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
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    short_description: product.shortDescription,
    category: product.category,
    price: product.price,
    original_price: product.originalPrice,
    price_type: product.priceType,
    currency: product.currency || 'USD',
    image_url: product.imageUrl,
    images: product.images || [],
    rating: product.rating || 0,
    review_count: product.reviewCount || 0,
    in_stock: product.inStock !== false,
    stock_count: product.stockCount,
    seller: product.seller,
    is_affiliate: product.isAffiliate || false,
    affiliate_url: product.affiliateUrl,
    age_range: product.ageRange,
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
    // Create a system admin user first (if needed)
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', 'system-admin')
      .single();

    let adminUserId = adminProfile?.id;

    if (adminError && adminError.code === 'PGRST116') {
      // Admin doesn't exist, we'll use a placeholder for now
      // In a real app, you'd create this through proper auth
      adminUserId = '00000000-0000-0000-0000-000000000000';
    }

    // Convert and insert resources
    const convertedResources = resources.map(resource => ({
      ...convertResourceToDbFormat(resource),
      added_by: adminUserId
    }));

    const { data, error } = await supabase
      .from('resources')
      .upsert(convertedResources, { onConflict: 'id' });

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
    const convertedProducts = shoppingData.products.map(convertProductToDbFormat);

    const { data, error } = await supabase
      .from('products')
      .upsert(convertedProducts, { onConflict: 'id' });

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
