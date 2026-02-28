#!/usr/bin/env node

/**
 * Resource Data Upload Script
 * 
 * Usage:
 *   node scripts/upload-resources.mjs
 * 
 * Environment Variables Required (in .env file):
 *   VITE_FIREBASE_API_KEY
 *   VITE_FIREBASE_AUTH_DOMAIN
 *   VITE_FIREBASE_PROJECT_ID
 *   VITE_FIREBASE_STORAGE_BUCKET
 *   VITE_FIREBASE_MESSAGING_SENDER_ID
 *   VITE_FIREBASE_APP_ID
 *   VITE_FIREBASE_MEASUREMENT_ID (optional)
 */

// Immediate output to prevent Node 24 hanging
process.stdout.write('Starting upload script...\n');

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, writeBatch, doc } from 'firebase/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file manually
const envPath = resolve(__dirname, '../.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

process.stdout.write('Config loaded, initializing Firebase...\n');

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate configuration
const requiredVars = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:');
  missingVars.forEach(v => console.error('   - ' + v));
  console.error('\nPlease add these to your .env file');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

process.stdout.write('Firebase initialized, loading resources...\n');

// Load resources from JSON file
const resourcesPath = resolve(__dirname, '../kids_ai_resources.json');
let resourcesData;

try {
  const fileContent = readFileSync(resourcesPath, 'utf8');
  resourcesData = JSON.parse(fileContent);
} catch (error) {
  console.error('Failed to read ' + resourcesPath + ': ' + error.message);
  process.exit(1);
}

const resources = resourcesData.resources;

console.log('\n📚 Resource Data Upload Script');
console.log('====================================================');
console.log('📄 Loaded ' + resources.length + ' resources from JSON file');
console.log('🏗️  Project ID: ' + firebaseConfig.projectId);
console.log('====================================================\n');

// Transform JSON resource to Firestore format
function transformResource(resource, index) {
  const now = new Date().toISOString();
  
  // Generate a consistent ID based on title
  const id = resource.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 50) + '_' + Date.now().toString(36).slice(-4);
  
  return {
    // Core fields (mapped to snake_case)
    id: id,
    title: resource.title,
    description: resource.description,
    url: resource.url,
    age_ranges: Array.isArray(resource.ageRanges) ? resource.ageRanges : [],
    resource_type: resource.resourceType,
    format: resource.format,
    cost: resource.cost,
    
    // Content fields
    learning_outcomes: Array.isArray(resource.learningOutcomes) ? resource.learningOutcomes : [],
    skills_attained: Array.isArray(resource.skillsAttained) ? resource.skillsAttained : [],
    key_features: Array.isArray(resource.keyFeatures) ? resource.keyFeatures : [],
    
    // Metadata
    image_url: resource.imageUrl || '',
    added_by: resource.addedBy || 'admin',
    is_approved: true, // Auto-approve for bulk upload
    created_at: now,
    updated_at: now,
    
    // Engagement metrics (initialize at 0)
    average_rating: 0,
    review_count: 0,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    
    // Featured flag
    featured_resource: resource.isFeatured || false,
  };
}

// Check for existing resources by title
async function checkExistingResources(titles) {
  console.log('🔍 Checking for existing resources...');
  
  const existingTitles = new Set();
  
  try {
    const q = query(
      collection(db, 'resources'),
      where('title', 'in', titles.slice(0, 10))
    );
    
    const snapshot = await getDocs(q);
    snapshot.forEach(d => {
      existingTitles.add(d.data().title);
    });
    
    console.log('   Found ' + existingTitles.size + ' existing resources\n');
  } catch (error) {
    console.log('   Warning: Could not check existing resources: ' + error.message + '\n');
  }
  
  return existingTitles;
}

// Upload resources in batches
async function uploadResources(resources) {
  const batch = writeBatch(db);
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    total: resources.length
  };
  
  // Get existing titles
  const titles = resources.map(r => r.title);
  const existingTitles = await checkExistingResources(titles);
  
  console.log('🚀 Starting upload...\n');
  
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    
    // Skip if already exists
    if (existingTitles.has(resource.title)) {
      console.log('   ⏭️  Skipping (already exists): ' + resource.title);
      results.skipped++;
      continue;
    }
    
    try {
      // Add to batch
      const docRef = doc(collection(db, 'resources'), resource.id);
      batch.set(docRef, resource);
      
      results.success++;
      
      // Log progress every 10 items
      if ((i + 1) % 10 === 0 || i === resources.length - 1) {
        console.log('   📊 Progress: ' + (i + 1) + '/' + resources.length + ' processed');
      }
      
    } catch (error) {
      console.error('   ❌ Failed: ' + resource.title + ' - ' + error.message);
      results.failed++;
    }
  }
  
  // Commit the batch
  if (results.success > 0) {
    console.log('\n💾 Committing batch to Firestore...');
    try {
      await batch.commit();
      console.log('   ✅ Batch committed successfully!\n');
    } catch (error) {
      console.error('   ❌ Batch commit failed: ' + error.message);
      results.failed += results.success;
      results.success = 0;
    }
  }
  
  return results;
}

// Print summary
function printSummary(results) {
  console.log('====================================================');
  console.log('📊 Upload Summary');
  console.log('====================================================');
  console.log('   ✅ Successfully uploaded: ' + results.success);
  console.log('   ⏭️  Skipped (existing):     ' + results.skipped);
  console.log('   ❌ Failed:                 ' + results.failed);
  console.log('   📈 Total processed:        ' + results.total);
  console.log('====================================================\n');
}

// Main execution
async function main() {
  try {
    // Transform all resources
    console.log('🔄 Transforming resource data...\n');
    const transformedResources = resources.map((r, i) => transformResource(r, i));
    
    // Show sample of first resource (for debugging)
    console.log('📝 Sample transformed resource:');
    console.log(JSON.stringify(transformedResources[0], null, 2).substring(0, 500) + '...\n');
    
    // Upload
    const results = await uploadResources(transformedResources);
    
    // Summary
    printSummary(results);
    
    if (results.failed > 0) {
      console.log('⚠️  Some resources failed to upload. Please check the errors above.');
      process.exit(1);
    }
    
    console.log('🎉 Bulk upload completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n💥 Fatal error: ' + error);
    process.exit(1);
  }
}

main();

