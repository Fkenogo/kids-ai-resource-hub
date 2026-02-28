#!/usr/bin/env node

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Testing Firestore connection and upload...');

async function testUpload() {
  try {
    // Test with a simple resource
    const testResource = {
      title: "Test Resource",
      description: "A test resource for debugging",
      url: "https://example.com",
      ageRanges: ["8-10"],
      type: "online_courses_platforms",
      format: "Online Course",
      cost: "free",
      learningOutcomes: ["Test learning outcome"],
      skillsAttained: ["Test skill"],
      keyFeatures: ["Test feature"],
      imageUrl: "",
      addedBy: "admin",
      isApproved: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      date_added: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      shareCount: 0,
      saveCount: 0,
      commentCount: 0,
      averageRating: 0,
      reviewCount: 0,
      featuredResource: false
    };

    console.log('Attempting to upload test resource...');
    console.log('Resource data:', JSON.stringify(testResource, null, 2));

    const docRef = await addDoc(collection(db, 'resources'), testResource);
    console.log(`✅ Test upload successful! Document ID: ${docRef.id}`);

    // Now try with the first real resource
    const resourcesPath = resolve(process.cwd(), 'kids_ai_resources.json');
    const resourcesData = JSON.parse(readFileSync(resourcesPath, 'utf8'));
    const firstResource = resourcesData.resources[0];

    console.log('\nAttempting to upload first real resource...');
    console.log('First resource title:', firstResource.title);

    const realResourceData = {
      title: firstResource.title,
      description: firstResource.description,
      url: firstResource.url,
      ageRanges: Array.isArray(firstResource.ageRanges) ? firstResource.ageRanges : [],
      resourceType: firstResource.resourceType,
      format: firstResource.format,
      cost: firstResource.cost,
      learningOutcomes: Array.isArray(firstResource.learningOutcomes) ? firstResource.learningOutcomes : [],
      skillsAttained: Array.isArray(firstResource.skillsAttained) ? firstResource.skillsAttained : [],
      keyFeatures: Array.isArray(firstResource.keyFeatures) ? firstResource.keyFeatures : [],
      imageUrl: firstResource.imageUrl || '',
      addedBy: firstResource.addedBy || 'admin',
      isApproved: firstResource.isApproved || false,
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
      featured_resource: firstResource.isFeatured || false
    };

    console.log('Real resource data structure:', JSON.stringify(realResourceData, null, 2));

    const docRef2 = await addDoc(collection(db, 'resources'), realResourceData);
    console.log(`✅ Real resource upload successful! Document ID: ${docRef2.id}`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

testUpload();