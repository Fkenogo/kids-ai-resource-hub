#!/usr/bin/env node

/**
 * Resource Data Upload Script (Admin SDK Version)
 * 
 * This script uses Firebase Admin SDK to bypass security rules
 * for server-side operations.
 * 
 * Usage:
 *   node scripts/upload-resources-admin.mjs
 * 
 * Requires:
 *   - Google Application Credentials (service account key)
 *   - Set GOOGLE_APPLICATION_CREDENTIALS env var to path of service account JSON
 */

console.log('Starting admin upload script...');

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file for project ID
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

// Check for service account or use project ID
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const projectId = process.env.VITE_FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error('Missing VITE_FIREBASE_PROJECT_ID in .env file');
  process.exit(1);
}

let adminApp;
try {
  if (serviceAccountPath && existsSync(serviceAccountPath)) {
    // Use service account
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    adminApp = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log('Initialized with service account');
  } else {
    // Use default credentials (for local development with gcloud)
    adminApp = initializeApp({
      projectId: projectId
    });
    console.log('Initialized with project ID (ensure gcloud auth is set)');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error.message);
  process.exit(1);
}

const db = getFirestore(adminApp);

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

console.log('\n📚 Resource Data Upload Script (Admin Mode)');
console.log('====================================================');
console.log('📄 Loaded ' + resources.length + ' resources from JSON file');
console.log('🏗️  Project ID: ' + projectId);
console.log('====================================================\n');

// Transform JSON resource to Firestore format
function transformResource(resource) {
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
    is_approved: true,
    created_at: now,
    updated_at: now,
    
    // Engagement metrics
    average_rating: 0,
    review_count: 0,
    view_count: 0,
    like_count: 0,
    share_count: 0,
    save_count: 0,
    comment_count: 0,
    
    featured_resource: resource.isFeatured || false,
  };
}

// Check for existing resources
async function checkExistingResources() {
  console.log('🔍 Checking for existing resources...');
  
  const existingTitles = new Set();
  
  try {
    const snapshot = await db.collection('resources').limit(100).get();
    snapshot.forEach(doc => {
      existingTitles.add(doc.data().title);
    });
    console.log('   Found ' + existingTitles.size + ' existing resources\n');
  } catch (error) {
    console.log('   Warning: ' + error.message + '\n');
  }
  
  return existingTitles;
}

// Upload resources one by one (Admin SDK bypasses rules)
async function uploadResources(resources) {
  const results = {
    success: 0,
    skipped: 0,
    failed: 0,
    total: resources.length
  };
  
  const existingTitles = await checkExistingResources();
  
  console.log('🚀 Starting upload...\n');
  
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    
    // Skip if already exists
    if (existingTitles.has(resource.title)) {
      console.log('   ⏭️  Skipping (exists): ' + resource.title);
      results.skipped++;
      continue;
    }
    
    try {
      await db.collection('resources').doc(resource.id).set(resource);
      results.success++;
      
      if ((i + 1) % 10 === 0 || i === resources.length - 1) {
        console.log('   📊 Progress: ' + (i + 1) + '/' + resources.length);
      }
      
    } catch (error) {
      console.error('   ❌ Failed: ' + resource.title + ' - ' + error.message);
      results.failed++;
    }
  }
  
  return results;
}

// Print summary
function printSummary(results) {
  console.log('\n====================================================');
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
    console.log('🔄 Transforming resource data...\n');
    const transformedResources = resources.map((r) => transformResource(r));
    
    console.log('📝 Sample transformed resource:');
    console.log(JSON.stringify(transformedResources[0], null, 2).substring(0, 500) + '...\n');
    
    const results = await uploadResources(transformedResources);
    
    printSummary(results);
    
    if (results.failed > 0) {
      console.log('⚠️  Some resources failed to upload.');
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

