import admin from 'firebase-admin';
import { loadProjectEnv } from './lib/env.mjs';

loadProjectEnv();

const PUBLIC_FIELDS = [
  'username',
  'display_name',
  'avatar_url',
  'bio',
  'created_at',
  'updated_at',
];

const getEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const projectId = getEnv('FIREBASE_PROJECT_ID');
  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
};

const toPublicProfile = (profile) => {
  const output = {};
  for (const field of PUBLIC_FIELDS) {
    if (profile[field] !== undefined && profile[field] !== null) {
      output[field] = profile[field];
    }
  }
  return output;
};

const main = async () => {
  const apply = process.argv.includes('--apply');
  initAdmin();
  const db = admin.firestore();

  const profiles = await db.collection('profiles').get();
  let written = 0;

  for (const profile of profiles.docs) {
    if (apply) {
      await db.collection('public_profiles').doc(profile.id).set(toPublicProfile(profile.data()), { merge: true });
    }
    written += 1;
  }

  const mode = apply ? 'wrote' : 'would write (dry run)';
  console.log(`profiles scanned: ${profiles.size}`);
  console.log(`public_profiles ${mode}: ${written}`);
  if (!apply) {
    console.log('Re-run with --apply to write the public projections.');
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
