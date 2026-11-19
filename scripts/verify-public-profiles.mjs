import admin from 'firebase-admin';
import { loadProjectEnv } from './lib/env.mjs';

loadProjectEnv();

/**
 * Read-only pre-publication check for the profile privacy rollout.
 * Never writes, never prints emails or user records — counts and ids of
 * *documents to repair* only.
 *
 * Checks:
 *  - every profile has a public projection (coverage),
 *  - every projection contains only the three rendered fields,
 *  - every content author (blog/community/reviews/comments) has a projection.
 */

const PUBLIC_FIELDS = [
  'username',
  'display_name',
  'avatar_url',
];

const CONTENT_AUTHOR_FIELDS = [
  ['blog_posts', 'author_id'],
  ['blog_comments', 'author_id'],
  ['community_posts', 'author_id'],
  ['community_replies', 'author_id'],
  ['resource_reviews', 'user_id'],
  ['resource_comments', 'user_id'],
];

const getEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

const initAdmin = () => {
  if (admin.apps.length > 0) return admin.app();

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
  if (!projectId) throw new Error('Missing env var: FIREBASE_PROJECT_ID');

  if (process.env.FIRESTORE_EMULATOR_HOST) {
    return admin.initializeApp({ projectId });
  }

  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
};

const main = async () => {
  initAdmin();
  const db = admin.firestore();

  const [profiles, projections] = await Promise.all([
    db.collection('profiles').select().get(),
    db.collection('public_profiles').get(),
  ]);

  const projectionIds = new Set(projections.docs.map((d) => d.id));
  const missingProjectionIds = profiles.docs
    .map((d) => d.id)
    .filter((id) => !projectionIds.has(id));

  const badFieldProjectionIds = projections.docs
    .filter((d) => Object.keys(d.data() || {}).some((field) => !PUBLIC_FIELDS.includes(field)))
    .map((d) => d.id);

  let missingAuthorIds = [];
  for (const [collectionName, field] of CONTENT_AUTHOR_FIELDS) {
    const rows = await db.collection(collectionName).select(field).get();
    for (const row of rows.docs) {
      const authorId = String(row.data()[field] || '');
      if (authorId && !projectionIds.has(authorId)) {
        missingAuthorIds.push(`${collectionName}:${field}:${authorId}`);
      }
    }
  }

  console.log(`profiles: ${profiles.size}`);
  console.log(`public_profiles: ${projections.size}`);
  console.log(`profiles missing projection: ${missingProjectionIds.length}`);
  console.log(`projections with unexpected fields: ${badFieldProjectionIds.length}`);
  console.log(`content author references missing projection: ${missingAuthorIds.length}`);

  if (
    missingProjectionIds.length > 0 ||
    badFieldProjectionIds.length > 0 ||
    missingAuthorIds.length > 0
  ) {
    console.log('repair needed: run `npm run backfill:public-profiles` (dry run first), then publish rules only when all counts are 0.');
    process.exitCode = 2;
  } else {
    console.log('ready: projection coverage and fields are clean.');
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
