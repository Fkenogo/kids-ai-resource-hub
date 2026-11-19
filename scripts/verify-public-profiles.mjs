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
  const profileIds = new Set(profiles.docs.map((d) => d.id));
  const missingProjectionIds = profiles.docs
    .map((d) => d.id)
    .filter((id) => !projectionIds.has(id));

  const badFieldProjectionIds = projections.docs
    .filter((d) => Object.keys(d.data() || {}).some((field) => !PUBLIC_FIELDS.includes(field)))
    .map((d) => d.id);

  // Field-value coverage: projections the UI cannot render because the value
  // is missing or blank. Counts only; values are never printed.
  const blankValueCounts = Object.fromEntries(PUBLIC_FIELDS.map((field) => [field, 0]));
  for (const d of projections.docs) {
    for (const field of PUBLIC_FIELDS) {
      const value = d.data()?.[field];
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        blankValueCounts[field] += 1;
      }
    }
  }

  // Orphan projections: no source profile exists (renamed/deleted accounts).
  const orphanProjectionCount = projections.docs.filter((d) => !profileIds.has(d.id)).length;

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
  for (const field of PUBLIC_FIELDS) {
    console.log(`projections missing/blank ${field}: ${blankValueCounts[field]}`);
  }
  console.log(`orphan projections (no source profile): ${orphanProjectionCount}`);
  console.log(`content author references missing projection: ${missingAuthorIds.length}`);

  const blankBlocking = blankValueCounts.username + blankValueCounts.display_name;
  // Blank avatars and orphan projections degrade gracefully (initials avatar /
  // sanitized doc), so they are reported but do not block publication.
  const needsRepair =
    missingProjectionIds.length > 0 ||
    badFieldProjectionIds.length > 0 ||
    blankBlocking > 0 ||
    missingAuthorIds.length > 0;

  if (needsRepair) {
    console.log('repair needed: run `npm run backfill:public-profiles` (dry run first), then publish rules only when all counts are 0.');
    process.exitCode = 2;
  } else {
    console.log('ready: projection coverage, field values, and fields are clean.');
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
