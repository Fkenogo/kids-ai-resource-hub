import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

const UID = 'split-uid';
const LEGACY_ID = 'legacy-elder';
const EMAIL = 'elder@example.com';
const ADMIN = 'split-admin-uid';

let testEnv;

// Mirrors resolveDataUserId: verified legacy link first, then uid fallback.
const resolveIdentity = async (db, uid, email) => {
  try {
    const matches = await (await getDocs(query(collection(db, 'profiles'), where('email', '==', email)))).docs;
    if (matches.length > 0) {
      const legacy = matches.find((d) => d.id !== uid);
      return legacy ? legacy.id : matches[0].id;
    }
  } catch {
    // Unverified email: query denied; fall through to the uid path.
  }
  try {
    const own = await getDoc(doc(db, 'profiles', uid));
    if (own.exists()) return uid;
  } catch {
    // Fall through to the uid fallback.
  }
  return uid;
};

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    // Pre-existing legacy user: profile keyed by the legacy id, not the uid.
    await setDoc(doc(db, 'profiles', LEGACY_ID), {
      id: LEGACY_ID,
      email: EMAIL,
      username: 'elder_author',
      display_name: 'Elder Author',
      avatar_url: 'https://example.test/elder.png',
      phone: 'private-phone',
      created_at: '2025-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'user_roles', ADMIN), { role: 'admin' });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('legacy user: unverified sign-in uses the uid profile, verification re-links the legacy id, and all activity stays owned', async () => {
  // ---- Sign-in #1: unverified email ----
  const unverifiedDb = testEnv
    .authenticatedContext(UID, { email: EMAIL, email_verified: false })
    .firestore();

  // ensureProfileDocument: legacy email query is denied (unverified), so the
  // uid-keyed profile is created and the projection synced.
  await assertFails(
    getDocs(query(collection(unverifiedDb, 'profiles'), where('email', '==', EMAIL)))
  );
  await assertSucceeds(
    setDoc(doc(unverifiedDb, 'profiles', UID), {
      id: UID,
      email: EMAIL,
      username: 'elder_uid',
      display_name: 'Elder (uid)',
      created_at: '2026-01-01T00:00:00.000Z',
    })
  );
  await assertSucceeds(
    setDoc(doc(unverifiedDb, 'public_profiles', UID), {
      username: 'elder_uid',
      display_name: 'Elder (uid)',
      avatar_url: 'https://example.test/elder.png',
    })
  );

  // Identity during the unverified window: the uid profile.
  const identityUnverified = await resolveIdentity(unverifiedDb, UID, EMAIL);
  assert.equal(identityUnverified, UID);

  // Activity created before verification is authored under the uid.
  await assertSucceeds(
    setDoc(doc(unverifiedDb, 'community_posts', 'pre-verification'), {
      author_id: UID,
      title: 'Posted while unverified',
      content: 'Content',
      category: 'getting-started',
      created_at: '2026-01-01T00:00:00.000Z',
      last_activity: '2026-01-01T00:00:00.000Z',
    })
  );
  await assertSucceeds(
    setDoc(doc(unverifiedDb, 'resource_reviews', 'pre-verification'), {
      resource_id: 'r1',
      user_id: UID,
      rating: 4,
      is_approved: true,
      created_at: '2026-01-01T00:00:00.000Z',
    })
  );

  // ---- Sign-in #2: email now verified ----
  const verifiedDb = testEnv
    .authenticatedContext(UID, { email: EMAIL, email_verified: true })
    .firestore();

  // ensureProfileDocument: the legacy email query now succeeds and the legacy
  // document (id != uid) wins, so the legacy id becomes authoritative again.
  const identityVerified = await resolveIdentity(verifiedDb, UID, EMAIL);
  assert.equal(identityVerified, LEGACY_ID);

  // Mirrors ensureProfileDocument: the winning profile's projection is synced.
  await assertSucceeds(
    setDoc(doc(verifiedDb, 'public_profiles', LEGACY_ID), {
      username: 'elder_author',
      display_name: 'Elder Author',
      avatar_url: 'https://example.test/elder.png',
    })
  );

  // The full legacy profile is readable again via the verified email match.
  const legacyProfile = await assertSucceeds(getDoc(doc(verifiedDb, 'profiles', LEGACY_ID)));
  assert.equal(legacyProfile.data().email, EMAIL);
  assert.equal(legacyProfile.data().phone, 'private-phone');

  // Activity created after verification uses the legacy id.
  await assertSucceeds(
    setDoc(doc(verifiedDb, 'community_posts', 'post-verification'), {
      author_id: LEGACY_ID,
      title: 'Posted after verification',
      content: 'Content',
      category: 'getting-started',
      created_at: '2026-01-02T00:00:00.000Z',
      last_activity: '2026-01-02T00:00:00.000Z',
    })
  );
  await assertSucceeds(
    setDoc(doc(verifiedDb, 'resource_reviews', 'post-verification'), {
      resource_id: 'r1',
      user_id: LEGACY_ID,
      rating: 5,
      is_approved: true,
      created_at: '2026-01-02T00:00:00.000Z',
    })
  );

  // Retained access: the pre-verification review (uid-owned) is still
  // editable by the same person after verification.
  await assertSucceeds(
    updateDoc(doc(verifiedDb, 'resource_reviews', 'pre-verification'), { rating: 3 })
  );
  // And the post-verification review (legacy-owned) stays editable too.
  await assertSucceeds(
    updateDoc(doc(verifiedDb, 'resource_reviews', 'post-verification'), { rating: 4 })
  );

  // Author rendering keeps working for both halves of the identity.
  const [uidProjection, legacyProjection] = await Promise.all([
    assertSucceeds(getDoc(doc(verifiedDb, 'public_profiles', UID))),
    assertSucceeds(getDoc(doc(verifiedDb, 'public_profiles', LEGACY_ID))),
  ]);
  assert.equal(uidProjection.data().display_name, 'Elder (uid)');
  assert.equal(legacyProjection.data().display_name, 'Elder Author');

  // Documented residual: the identity is split in data (two profile docs).
  const adminDb = testEnv.authenticatedContext(ADMIN).firestore();
  const allProfiles = await assertSucceeds(getDocs(collection(adminDb, 'profiles')));
  const ids = allProfiles.docs.map((d) => d.id).sort();
  assert.deepEqual(ids, [LEGACY_ID, UID].sort());
});
