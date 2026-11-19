import admin from 'firebase-admin';
import { loadProjectEnv } from './lib/env.mjs';
import { pathToFileURL } from 'node:url';

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

/**
 * Decides the backfill action for one profile/projection pair.
 * - missing: the projection does not exist yet.
 * - profileFresher: the profile was written after the projection was written
 *   (projection values may be stale) -> rewrite from the profile.
 * - skippedFresherPublic: the projection was written after the profile's last
 *   write (a successful app sync) -> never overwrite fresher projection values.
 * - sanitizedPublic / orphanSanitized: unexpected fields must be removed even
 *   when values are otherwise kept.
 * - unchanged: values and field set already match.
 *
 * Freshness uses the later of the profile's `updated_at` stamp and its own
 * server write time, so a concurrent edit is never mistaken for a stale one.
 */
const planAction = (profile, profileWriteMs, publicSnap) => {
  const source = toPublicProfile(profile);

  if (!publicSnap?.exists) return { action: 'missing', payload: source };

  const publicData = publicSnap?.data() || {};
  const unexpected = unexpectedFields(publicData);
  // A projection the UI cannot render at all (blank name fields) is always
  // repaired from the profile, even if the projection was written later.
  const blankBlocking = ['username', 'display_name'].some((field) => {
    const value = publicData[field];
    return value == null || (typeof value === 'string' && value.trim() === '');
  });
  const publicWriteMs = toMillis(publicSnap.updateTime);
  const profileMs = Math.max(toMillis(profile.updated_at), profileWriteMs);
  const publicIsFresher = publicWriteMs > profileMs;

  if (publicIsFresher && !blankBlocking) {
    if (unexpected.length > 0) {
      return { action: 'sanitizedPublic', payload: toPublicProfile(publicData) };
    }
    return { action: 'skippedFresherPublic', payload: null };
  }

  const needsWrite =
    unexpected.length > 0 ||
    valuesDiffer(source, publicData) ||
    Object.keys(publicData).length !== Object.keys(source).length;

  return needsWrite
    ? { action: 'profileFresher', payload: source }
    : { action: 'unchanged', payload: null };
};

/**
 * Backfills/repairs public_profiles.
 *
 * When `apply` is true, every read+decide+write pair runs inside a Firestore
 * transaction. A concurrent profile or projection edit either happens before
 * the transaction reads (and is picked up) or after it commits (and is picked
 * up by the next run); Firestore retries conflicting transactions, so the
 * script never writes a half-mixed projection and never resurrects private
 * fields that a concurrent edit removed.
 */
export const backfillPublicProfiles = async (db, { apply = false } = {}) => {
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
    const publicRef = db.collection('public_profiles').doc(profileDoc.id);

    if (!apply) {
      const publicSnap = await publicRef.get();
      const { action } = planAction(profile, toMillis(profileDoc.updateTime), publicSnap);
      totals[action] += 1;
      continue;
    }

    const action = await db.runTransaction(async (tx) => {
      const [freshProfileSnap, freshPublicSnap] = await Promise.all([
        tx.get(db.collection('profiles').doc(profileDoc.id)),
        tx.get(publicRef),
      ]);
      const { action: plannedAction, payload } = planAction(
        freshProfileSnap.data() || {},
        toMillis(freshProfileSnap.updateTime),
        freshPublicSnap,
      );
      if (payload) tx.set(publicRef, payload);
      return plannedAction;
    });

    totals[action] += 1;
  }

  // Also sanitize projections whose profile no longer exists, so stray or
  // hand-edited documents cannot keep unexpected fields around.
  const publics = await db.collection('public_profiles').get();
  for (const publicDoc of publics.docs) {
    if (profileIds.has(publicDoc.id)) continue;
    const data = publicDoc.data() || {};
    if (unexpectedFields(data).length === 0) continue;

    if (apply) {
      await db.runTransaction(async (tx) => {
        const freshSnap = await tx.get(publicDoc.ref);
        if (!freshSnap.exists) return;
        const freshData = freshSnap.data() || {};
        if (unexpectedFields(freshData).length === 0) return;
        tx.set(publicDoc.ref, toPublicProfile(freshData));
      });
    }
    totals.orphanSanitized += 1;
  }

  return totals;
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

const getEnv = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};

const main = async () => {
  const apply = process.argv.includes('--apply');
  initAdmin();
  const db = admin.firestore();
  const totals = await backfillPublicProfiles(db, { apply });

  const mode = apply ? 'applied' : 'dry run (re-run with --apply to write)';
  console.log(`mode: ${mode}`);
  console.log(`profiles scanned: ${totals.profilesScanned}`);
  console.log(`projections to create: ${totals.missing}`);
  console.log(`updates from fresher profile: ${totals.profileFresher}`);
  console.log(`kept fresher projection as-is: ${totals.skippedFresherPublic}`);
  console.log(`unexpected fields removed: ${totals.sanitizedPublic + totals.orphanSanitized}`);
  console.log(`already in sync: ${totals.unchanged}`);
};

const isCli =
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
