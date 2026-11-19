import admin from 'firebase-admin';
import { loadProjectEnv } from './lib/env.mjs';

loadProjectEnv();

/**
 * Must match the fields allowed by the public_profiles rules:
 * only what the public UI renders (name and avatar).
 */
const PUBLIC_FIELDS = [
  'username',
  'display_name',
  'avatar_url',
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
    // Emulator testing needs no service-account credentials.
    return admin.initializeApp({ projectId });
  }

  const clientEmail = getEnv('FIREBASE_CLIENT_EMAIL');
  const privateKey = getEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');

  return admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    projectId,
  });
};

/** Keeps only the allowed public fields; never stores private values. */
const toPublicProfile = (profile) => {
  const output = {};
  for (const field of PUBLIC_FIELDS) {
    if (profile[field] !== undefined && profile[field] !== null) {
      output[field] = profile[field];
    }
  }
  return output;
};

const unexpectedFields = (data) =>
  Object.keys(data || {}).filter((field) => !PUBLIC_FIELDS.includes(field));

const toMillis = (value) => {
  if (value == null) return -Infinity;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Date.parse(value) || -Infinity;
  if (value instanceof Date) return value.getTime();
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.seconds === 'number') return value.seconds * 1000 + Math.floor((value.nanoseconds || 0) / 1e6);
  return -Infinity;
};

const valuesDiffer = (a, b) => {
  for (const field of PUBLIC_FIELDS) {
    const left = a[field] ?? null;
    const right = b[field] ?? null;
    if (left !== right) return true;
  }
  return false;
};

const main = async () => {
  const apply = process.argv.includes('--apply');
  initAdmin();
  const db = admin.firestore();

  const totals = {
    profilesScanned: 0,
    missing: 0,
    profileFresher: 0,
    skippedFresherPublic: 0,
    sanitizedPublic: 0,
    unchanged: 0,
    orphanSanitized: 0,
  };

  const profiles = await db.collection('profiles').get();
  const profileIds = new Set();

  for (const profileDoc of profiles.docs) {
    totals.profilesScanned += 1;
    profileIds.add(profileDoc.id);

    const profile = profileDoc.data() || {};
    const source = toPublicProfile(profile);
    const publicRef = db.collection('public_profiles').doc(profileDoc.id);
    const publicSnap = await publicRef.get();

    if (!publicSnap.exists) {
      if (apply) await publicRef.set(source);
      totals.missing += 1;
      continue;
    }

    const publicData = publicSnap.data() || {};
    const unexpected = unexpectedFields(publicData);
    // The last time this projection was written, from the document itself.
    const publicWriteMs = toMillis(publicSnap.updateTime);
    // The last edit recorded on the full profile.
    const profileMs = toMillis(profile.updated_at);
    // A projection newer than the profile edit was written after the edit and
    // is assumed to be in sync; never overwrite fresher public writes.
    const publicIsFresher = publicWriteMs > profileMs;

    if (publicIsFresher) {
      if (unexpected.length > 0) {
        if (apply) {
          const sanitized = toPublicProfile(publicData);
          await publicRef.set(sanitized);
        }
        totals.sanitizedPublic += 1;
      } else {
        totals.skippedFresherPublic += 1;
      }
      continue;
    }

    const needsWrite =
      unexpected.length > 0 ||
      valuesDiffer(source, publicData) ||
      Object.keys(publicData).length !== Object.keys(source).length;

    if (needsWrite) {
      if (apply) await publicRef.set(source);
      totals.profileFresher += 1;
    } else {
      totals.unchanged += 1;
    }
  }

  // Also sanitize projections whose profile no longer exists, so stray or
  // hand-edited documents cannot keep unexpected fields around.
  const publics = await db.collection('public_profiles').get();
  for (const publicDoc of publics.docs) {
    if (profileIds.has(publicDoc.id)) continue;
    const data = publicDoc.data() || {};
    if (unexpectedFields(data).length === 0) continue;
    if (apply) await db.collection('public_profiles').doc(publicDoc.id).set(toPublicProfile(data));
    totals.orphanSanitized += 1;
  }

  const mode = apply ? 'applied' : 'dry run (re-run with --apply to write)';
  console.log(`mode: ${mode}`);
  console.log(`profiles scanned: ${totals.profilesScanned}`);
  console.log(`projections to create: ${totals.missing}`);
  console.log(`updates from fresher profile: ${totals.profileFresher}`);
  console.log(`kept fresher projection as-is: ${totals.skippedFresherPublic}`);
  console.log(`unexpected fields removed: ${totals.sanitizedPublic + totals.orphanSanitized}`);
  console.log(`already in sync: ${totals.unchanged}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
