import admin from 'firebase-admin';
import { loadProjectEnv } from './lib/env.mjs';
import { pathToFileURL } from 'node:url';

loadProjectEnv();

/**
 * Read-only pre-publication check for the profile privacy rollout.
 * Never writes, never prints emails or user records — counts and ids of
 * *documents to repair* only.
 *
 * Checks:
 *  - every profile has a public projection (coverage),
 *  - every projection contains only the three rendered fields,
 *  - projection values follow the string-only contract (names non-blank
 *    strings; avatar an optional string),
 *  - every content author (blog/community/reviews/comments) has a projection.
 */

const PUBLIC_FIELDS = [
  'username',
  'display_name',
  'avatar_url',
];

const RENDER_NAME_FIELDS = ['username', 'display_name'];

const CONTENT_AUTHOR_FIELDS = [
  ['blog_posts', 'author_id'],
  ['blog_comments', 'author_id'],
  ['community_posts', 'author_id'],
  ['community_replies', 'author_id'],
  ['resource_reviews', 'user_id'],
  ['resource_comments', 'user_id'],
];

const isBlank = (value) =>
  typeof value === 'string' && value.trim() === '';

export const verifyPublicProfiles = async (db) => {
  const [profiles, projections] = await Promise.all([
    db.collection('profiles').select().get(),
    db.collection('public_profiles').get(),
  ]);

  const projectionIds = new Set(projections.docs.map((d) => d.id));
  const profileIds = new Set(profiles.docs.map((d) => d.id));

  const missingProjectionCount = profiles.docs
    .map((d) => d.id)
    .filter((id) => !projectionIds.has(id)).length;

  const unexpectedFieldProjectionCount = projections.docs
    .filter((d) => Object.keys(d.data() || {}).some((field) => !PUBLIC_FIELDS.includes(field)))
    .length;

  const malformedCounts = Object.fromEntries(PUBLIC_FIELDS.map((field) => [field, 0]));
  const blankCounts = Object.fromEntries(PUBLIC_FIELDS.map((field) => [field, 0]));
  for (const d of projections.docs) {
    for (const field of PUBLIC_FIELDS) {
      const value = d.data()?.[field];
      if (value !== undefined && value !== null && typeof value !== 'string') {
        malformedCounts[field] += 1;
      } else if (value === undefined || value === null || isBlank(value)) {
        blankCounts[field] += 1;
      }
    }
  }

  const orphanProjectionCount = projections.docs.filter((d) => !profileIds.has(d.id)).length;

  let missingAuthorReferenceCount = 0;
  for (const [collectionName, field] of CONTENT_AUTHOR_FIELDS) {
    const rows = await db.collection(collectionName).select(field).get();
    for (const row of rows.docs) {
      const authorId = String(row.data()[field] || '');
      if (authorId && !projectionIds.has(authorId)) {
        missingAuthorReferenceCount += 1;
      }
    }
  }

  const blocking =
    missingProjectionCount > 0 ||
    unexpectedFieldProjectionCount > 0 ||
    malformedCounts.username > 0 ||
    malformedCounts.display_name > 0 ||
    malformedCounts.avatar_url > 0 ||
    blankCounts.username > 0 ||
    blankCounts.display_name > 0 ||
    missingAuthorReferenceCount > 0;

  return {
    profiles: profiles.size,
    projections: projections.size,
    missingProjectionCount,
    unexpectedFieldProjectionCount,
    malformedCounts,
    blankCounts,
    orphanProjectionCount,
    missingAuthorReferenceCount,
    blocking,
  };
};

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
  const counts = await verifyPublicProfiles(db);

  console.log(`profiles: ${counts.profiles}`);
  console.log(`public_profiles: ${counts.projections}`);
  console.log(`profiles missing projection: ${counts.missingProjectionCount}`);
  console.log(`projections with unexpected fields: ${counts.unexpectedFieldProjectionCount}`);
  for (const field of PUBLIC_FIELDS) {
    console.log(`projections with non-string ${field}: ${counts.malformedCounts[field]}`);
    console.log(`projections missing/blank ${field}: ${counts.blankCounts[field]}${field === 'avatar_url' ? ' (informational)' : ''}`);
  }
  console.log(`orphan projections (no source profile): ${counts.orphanProjectionCount} (informational)`);
  console.log(`content author references missing projection: ${counts.missingAuthorReferenceCount}`);

  if (counts.blocking) {
    console.log('repair needed: run `npm run backfill:public-profiles` (dry run first), then publish rules only when all repair counts are 0.');
    process.exitCode = 2;
  } else {
    console.log('ready: projection coverage, field values, and fields are clean.');
  }
};

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
