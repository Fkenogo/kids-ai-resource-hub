import { supabase } from "@/integrations/supabase/client";
import { mockResources } from "@/data/mockData";
import { mockProducts } from "@/data/shoppingData";
import { convertResourceToDbFormat, convertProductToDbFormat } from "./converters";

export const migrateResourceData = async () => {
  console.log('Starting resource data migration...');
  
  try {
    // First, check if user is authenticated - this is REQUIRED for migration
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('Migration Aborted: User must be logged in to perform migration.');
      throw new Error('User must be logged in to perform migration. Please log in first.');
    }

    console.log('Authenticated user found. User ID:', user.id);

    // Convert and insert resources with the authenticated user's ID
    const convertedResources = mockResources.map(resource => {
      try {
        return convertResourceToDbFormat(resource, user.id);
      } catch (e) {
        console.error(`Failed to convert resource: "${resource?.title}"`, e);
        return null;
      }
    }).filter((r): r is NonNullable<typeof r> => r !== null);

    if (convertedResources.length !== mockResources.length) {
      console.warn(`${mockResources.length - convertedResources.length} resource(s) were skipped due to conversion errors.`);
    }

    console.log(`Successfully converted ${convertedResources.length} resources. Preparing to upsert to Supabase.`);
    if (convertedResources.length > 0) {
      console.log('Sample converted resource:', JSON.stringify(convertedResources[0], null, 2));
    }

    const { data, error } = await supabase
      .from('resources')
      .upsert(convertedResources, { onConflict: 'title' }); // Use title for conflict resolution

    if (error) {
      console.error('Error during Supabase upsert for resources:', error);
      throw error;
    }

    console.log(`Successfully migrated ${(data || []).length} resources to Supabase.`);
    return data;
  } catch (error) {
    console.error('Resource migration failed catastrophically:', error);
    throw error;
  }
};

export const migrateProductData = async () => {
  console.log('Starting product data migration...');
  
  try {
    // Convert and insert products
    const convertedProducts = mockProducts.map(product => {
       try {
        return convertProductToDbFormat(product);
      } catch (e) {
        console.error(`Failed to convert product: "${product?.title}"`, e);
        return null;
      }
    }).filter((p): p is NonNullable<typeof p> => p !== null);

    if (convertedProducts.length !== mockProducts.length) {
      console.warn(`${mockProducts.length - convertedProducts.length} product(s) were skipped due to conversion errors.`);
    }

    console.log(`Successfully converted ${convertedProducts.length} products. Preparing to upsert to Supabase.`);
    if (convertedProducts.length > 0) {
      console.log('Sample converted product:', JSON.stringify(convertedProducts[0], null, 2));
    }

    const { data, error } = await supabase
      .from('products')
      .upsert(convertedProducts, { onConflict: 'title' }); // Use title for conflict resolution

    if (error) {
      console.error('Error during Supabase upsert for products:', error);
      throw error;
    }

    console.log(`Successfully migrated ${(data || []).length} products to Supabase.`);
    return data;
  } catch (error) {
    console.error('Product migration failed catastrophically:', error);
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
