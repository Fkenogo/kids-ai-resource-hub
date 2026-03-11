#!/usr/bin/env node

import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getFirebaseAdminServiceAccountEnv, loadProjectEnv, projectRoot } from './lib/env.mjs';

loadProjectEnv();

const adminEnv = getFirebaseAdminServiceAccountEnv();

// Admin Firebase configuration
const serviceAccount = {
  type: "service_account",
  project_id: adminEnv.projectId,
  private_key_id: adminEnv.privateKeyId,
  private_key: adminEnv.privateKey,
  client_email: adminEnv.clientEmail,
  client_id: adminEnv.clientId,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: adminEnv.clientX509CertUrl
};

console.log('Checking admin credentials...');

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'FIREBASE_CLIENT_X509_CERT_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables for admin access:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nTo upload resources, you need to:');
  console.error('1. Go to Firebase Console > Project Settings > Service Accounts');
  console.error('2. Generate a new private key');
  console.error('3. Add the service account credentials to your .env file');
  console.error('4. Use the format shown in docs/resource-upload-instructions.md');
  process.exit(1);
}

try {
  // Initialize Firebase Admin
  const app = initializeApp({
    credential: cert(serviceAccount)
  });
  
  const db = getFirestore(app);

  console.log('✅ Admin credentials validated');
  console.log(`Starting bulk upload of resources to project: ${serviceAccount.project_id}...`);

  // Load resources from JSON file
  const resourcesPath = resolve(projectRoot, 'kids_ai_resources.json');
  const resourcesData = JSON.parse(readFileSync(resourcesPath, 'utf8'));
  const resources = resourcesData.resources;

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
        
        // Upload to Firestore with admin privileges
        const docRef = await db.collection('resources').add(resourceData);
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
      const snapshot = await db.collection('resources')
        .where('title', '==', title)
        .limit(1)
        .get();
      return !snapshot.empty;
    } catch (error) {
      console.warn(`Warning: Could not check existing resource for ${title}:`, error.message);
      return false;
    }
  }

  // Run the upload
  await uploadResources();
  console.log('\n🎉 Bulk upload completed!');
  process.exit(0);

} catch (error) {
  console.error('❌ Admin initialization failed:', error.message);
  console.error('\nTo fix this issue:');
  console.error('1. Ensure you have a valid Firebase service account key');
  console.error('2. Add the credentials to your .env file');
  console.error('3. Make sure the service account has Firestore admin permissions');
  process.exit(1);
}
