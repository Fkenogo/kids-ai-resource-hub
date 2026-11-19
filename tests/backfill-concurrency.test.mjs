import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import admin from 'firebase-admin';
import { backfillPublicProfiles } from '../scripts/backfill-public-profiles.mjs';

const projectId =
  process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT || 'demo-kids-ai';

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Run this suite through `npm run test:backfill` (firebase emulators:exec).');
}

admin.initializeApp({ projectId });
const db = admin.firestore();

const PUBLIC_FIELDS = ['username', 'display_name', 'avatar_url'];
const deleteAll = async (name) => {
  const docs = await db.collection(name).listDocuments();
  await Promise.all(docs.map((ref) => ref.delete()));
};

const seedProfile = (id, displayName, updatedAt = '2026-01-01T00:00:00.000Z') =>
  db.collection('profiles').doc(id).set({
    id,
    username: `user_${id}`,
    display_name: displayName,
    avatar_url: `https://example.test/${id}.png`,
    email: `${id}@example.com`,
    phone: 'private-phone',
    updated_at: updatedAt,
  });

const seedProjection = (id, displayName) =>
  db.collection('public_profiles').doc(id).set({
    username: `user_${id}`,
    display_name: displayName,
    avatar_url: `https://example.test/${id}.png`,
  });

before(async () => {
  await deleteAll('profiles');
  await deleteAll('public_profiles');

  // A quiet baseline the backfill must leave untouched.
  for (let i = 0; i < 12; i += 1) {
    const id = `base-${i}`;
    await seedProfile(id, `Base ${i}`);
    await seedProjection(id, `Base ${i}`);
  }
  await seedProfile('c-edit', 'Before Edit');
  await seedProjection('c-edit', 'Before Edit');
  await seedProfile('p-edit', 'Before Projection Edit');
  await seedProjection('p-edit', 'Before Projection Edit');
});

after(async () => {
  await deleteAll('profiles');
  await deleteAll('public_profiles');
});

test('a profile or projection edit during the backfill never corrupts the projection', async () => {
  // Start the real backfill and race it against concurrent edits.
  const backfill = backfillPublicProfiles(db, { apply: true });
  const editProfileDuringBackfill = db
    .collection('profiles')
    .doc('c-edit')
    .update({
      display_name: 'Edited During Backfill',
      // Server timestamp guarantees the profile's write time is authoritative.
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  const editProjectionDuringBackfill = db
    .collection('public_profiles')
    .doc('p-edit')
    .set({
      username: 'user_p-edit',
      display_name: 'Fresher During Backfill',
      avatar_url: null,
      // An unexpected/private field injected mid-run must not survive.
      email: 'midrun-leak@example.com',
    });

  await Promise.all([backfill, editProfileDuringBackfill, editProjectionDuringBackfill]);

  // A second run must converge whatever ordering occurred.
  const totals = await backfillPublicProfiles(db, { apply: true });

  const cSnap = await db.collection('public_profiles').doc('c-edit').get();
  const cData = cSnap.data();
  assert.equal(cData.display_name, 'Edited During Backfill');
  assert.equal(Object.keys(cData).includes('email'), false);

  const pSnap = await db.collection('public_profiles').doc('p-edit').get();
  const pData = pSnap.data();
  assert.equal(pData.display_name, 'Fresher During Backfill');
  assert.equal(Object.keys(pData).includes('email'), false);

  // No projection anywhere may contain unexpected/private fields.
  const publics = await db.collection('public_profiles').get();
  for (const doc of publics.docs) {
    const keys = Object.keys(doc.data());
    for (const key of keys) {
      assert.ok(PUBLIC_FIELDS.includes(key), `unexpected field ${key} on ${doc.id}`);
    }
  }

  // Convergence: no pending creates, fresher-profile updates, or field removals.
  assert.equal(totals.missing, 0);
  assert.equal(totals.profileFresher, 0);
  assert.equal(totals.sanitizedPublic, 0);
  assert.equal(totals.orphanSanitized, 0);
});

test('dry run stays read-only and reports the same converged state', async () => {
  const dry = await backfillPublicProfiles(db, { apply: false });

  assert.equal(dry.missing, 0);
  assert.equal(dry.profileFresher, 0);
  assert.equal(dry.sanitizedPublic, 0);
  assert.equal(dry.orphanSanitized, 0);
  assert.equal(dry.profilesScanned, 14);

  // The dry run must not have modified anything.
  const pSnap = await db.collection('public_profiles').doc('p-edit').get();
  assert.equal(pSnap.data().display_name, 'Fresher During Backfill');
});
