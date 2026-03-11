#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getFirebaseWebConfig, loadProjectEnv, projectRoot } from './lib/env.mjs';

loadProjectEnv();

// Firebase configuration
const firebaseConfig = getFirebaseWebConfig();

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load resources from JSON file
const resourcesPath = resolve(projectRoot, 'kids_ai_resources.json');
const resourcesData = JSON.parse(readFileSync(resourcesPath, 'utf8'));
const resources = resourcesData.resources;

console.log(`Starting bulk upload of ${resources.length} resources...`);

async function uploadResources() {
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    
    try {
      // Check if resource already exists by title
      const existingResource = await checkExistingResource(resource.title);
      
      if (existingResource) {
        console.log(`Skipping existing resource: ${resource.title}`);
        continue;
      }
      
      // Prepare resource data with proper Firestore formatting
      const resourceData = {
        title: resource.title,
        description: resource.description,
        url: resource.url,
        ageRanges: Array.isArray(resource.ageRanges) ? resource.ageRanges : [],
        resourceType: resource.resourceType,
        format: resource.format,
        cost: resource.cost,
        learningOutcomes: Array.isArray(resource.learningOutcomes) ? resource.learningOutcomes : [],
        skillsAttained: Array.isArray(resource.skillsAttained) ? resource.skillsAttained : [],
        keyFeatures: Array.isArray(resource.keyFeatures) ? resource.keyFeatures : [],
        imageUrl: resource.imageUrl || '',
        addedBy: resource.addedBy || 'admin',
        isApproved: resource.isApproved || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        date_added: new Date().toISOString(),
        view_count: 0,
        like_count: 0,
        share_count: 0,
        save_count: 0,
        comment_count: 0,
        average_rating: 0,
        review_count: 0,
        featured_resource: resource.isFeatured || false
      };

      // Debug: Log the first resource to see what's being uploaded
      if (i === 0) {
        console.log('Debug: First resource data structure:', JSON.stringify(resourceData, null, 2));
      }
      
      // Remove fields that shouldn't be in Firestore
      delete resourceData.isFeatured;
      delete resourceData.isApproved;
      
      // Upload to Firestore
      const docRef = await addDoc(collection(db, 'resources'), resourceData);
      console.log(`✅ Uploaded: ${resource.title} (ID: ${docRef.id})`);
      successCount++;
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error uploading ${resource.title}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Upload Summary:`);
  console.log(`   ✅ Successfully uploaded: ${successCount}`);
  console.log(`   ❌ Failed uploads: ${errorCount}`);
  console.log(`   📈 Total processed: ${resources.length}`);
}

async function checkExistingResource(title) {
  try {
    const { getDocs, query, where } = await import('firebase/firestore');
    const q = query(collection(db, 'resources'), where('title', '==', title));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.warn(`Warning: Could not check existing resource for ${title}:`, error.message);
    return false;
  }
}

// Run the upload
uploadResources()
  .then(() => {
    console.log('\n🎉 Bulk upload completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Upload failed:', error);
    process.exit(1);
  });
