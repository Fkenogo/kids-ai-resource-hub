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

const OWNER_UID = 'alice-uid';
const LEGACY_OWNER_UID = 'bob-uid';
const UNVERIFIED_UID = 'unverified-uid';
const ORDINARY_UID = 'carol-uid';
const ADMIN_UID = 'admin-uid';

const ALICE_EMAIL = 'alice@example.com';
const BOB_EMAIL = 'bob@example.com';
const UNVERIFIED_EMAIL = 'unverified@example.com';

let testEnv;

const publicProfile = () => ({
  username: 'alice',
  display_name: 'alice-uid display',
  avatar_url: 'https://example.test/alice.png',
});

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });

  await testEnv.clearFirestore();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'profiles', OWNER_UID), {
      id: OWNER_UID,
      email: ALICE_EMAIL,
      username: 'alice',
      display_name: 'Alice',
      avatar_url: 'https://example.test/alice.png',
      bio: 'Public bio',
      phone: 'private-phone',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'profiles', 'legacy-bob'), {
      id: 'legacy-bob',
      email: BOB_EMAIL,
      username: 'bob',
      display_name: 'Bob',
      created_at: '2026-01-02T00:00:00.000Z',
    });
    await setDoc(doc(db, 'profiles', 'legacy-unverified'), {
      id: 'legacy-unverified',
      email: UNVERIFIED_EMAIL,
      username: 'unverified',
      display_name: 'Unverified',
      created_at: '2026-01-03T00:00:00.000Z',
    });
    await setDoc(doc(db, 'profiles', UNVERIFIED_UID), {
      id: UNVERIFIED_UID,
      email: UNVERIFIED_EMAIL,
      username: 'unverified',
      display_name: 'Unverified',
      created_at: '2026-01-03T00:00:00.000Z',
    });
    await setDoc(doc(db, 'profiles', ORDINARY_UID), {
      id: ORDINARY_UID,
      email: 'carol@example.com',
      username: 'carol',
      display_name: 'Carol',
      created_at: '2026-01-04T00:00:00.000Z',
    });
    await setDoc(doc(db, 'public_profiles', OWNER_UID), publicProfile());
    await setDoc(doc(db, 'user_roles', ADMIN_UID), { role: 'admin' });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('signed-out visitors cannot read a full profile', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'profiles', OWNER_UID)));
});

test('signed-out visitors cannot list profiles', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDocs(collection(db, 'profiles')));
});

test('signed-out visitors can read the public profile projection', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'public_profiles', OWNER_UID)));
  const data = snap.data();
  assert.equal(data.display_name, 'alice-uid display');
  assert.equal(data.email, undefined);
  assert.equal(data.bio, undefined);
  assert.equal(data.created_at, undefined);
});

test('signed-out visitors can list public profiles for author names', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const snap = await assertSucceeds(getDocs(collection(db, 'public_profiles')));
  assert.ok(snap.size >= 1);
});

test('ordinary users cannot read another users full profile', async () => {
  const db = testEnv.authenticatedContext(ORDINARY_UID).firestore();
  await assertFails(getDoc(doc(db, 'profiles', OWNER_UID)));
});

test('ordinary users cannot list all profiles', async () => {
  const db = testEnv.authenticatedContext(ORDINARY_UID).firestore();
  await assertFails(getDocs(collection(db, 'profiles')));
});

test('ordinary users cannot query another users profile by email', async () => {
  const db = testEnv.authenticatedContext(ORDINARY_UID).firestore();
  await assertFails(
    getDocs(query(collection(db, 'profiles'), where('email', '==', ALICE_EMAIL)))
  );
});

test('ordinary users cannot update another users profile', async () => {
  const db = testEnv.authenticatedContext(ORDINARY_UID).firestore();
  await assertFails(updateDoc(doc(db, 'profiles', OWNER_UID), { display_name: 'Hacked' }));
});

test('unverified email cannot claim a legacy profile by matching email', async () => {
  const db = testEnv
    .authenticatedContext(UNVERIFIED_UID, { email: UNVERIFIED_EMAIL, email_verified: false })
    .firestore();
  await assertFails(getDoc(doc(db, 'profiles', 'legacy-unverified')));
});

test('unverified email cannot run an own-email profile query', async () => {
  const db = testEnv
    .authenticatedContext(UNVERIFIED_UID, { email: UNVERIFIED_EMAIL, email_verified: false })
    .firestore();
  await assertFails(
    getDocs(query(collection(db, 'profiles'), where('email', '==', UNVERIFIED_EMAIL)))
  );
});

test('uid ownership still works without a verified email', async () => {
  const db = testEnv
    .authenticatedContext(UNVERIFIED_UID, { email: UNVERIFIED_EMAIL, email_verified: false })
    .firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', UNVERIFIED_UID)));
  assert.equal(snap.data().email, UNVERIFIED_EMAIL);
});

test('uid ownership still allows updating the own profile without a verified email', async () => {
  const db = testEnv
    .authenticatedContext(UNVERIFIED_UID, { email: UNVERIFIED_EMAIL, email_verified: false })
    .firestore();
  await assertSucceeds(updateDoc(doc(db, 'profiles', UNVERIFIED_UID), { display_name: 'Still Owner' }));
});

test('uid ownership still allows writing the own public projection without a verified email', async () => {
  const db = testEnv
    .authenticatedContext(UNVERIFIED_UID, { email: UNVERIFIED_EMAIL, email_verified: false })
    .firestore();
  await assertSucceeds(
    setDoc(doc(db, 'public_profiles', UNVERIFIED_UID), {
      username: 'unverified',
      display_name: 'Still Owner',
      avatar_url: null,
    })
  );
});

test('verified legacy owner can read the legacy profile (regression)', async () => {
  const db = testEnv
    .authenticatedContext(LEGACY_OWNER_UID, { email: BOB_EMAIL, email_verified: true })
    .firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', 'legacy-bob')));
  assert.equal(snap.data().email, BOB_EMAIL);
});

test('verified legacy owner can list their profile by own email (regression)', async () => {
  const db = testEnv
    .authenticatedContext(LEGACY_OWNER_UID, { email: BOB_EMAIL, email_verified: true })
    .firestore();
  const snap = await assertSucceeds(
    getDocs(query(collection(db, 'profiles'), where('email', '==', BOB_EMAIL)))
  );
  assert.equal(snap.size, 1);
});

test('verified legacy owner can update the legacy profile (regression)', async () => {
  const db = testEnv
    .authenticatedContext(LEGACY_OWNER_UID, { email: BOB_EMAIL, email_verified: true })
    .firestore();
  await assertSucceeds(updateDoc(doc(db, 'profiles', 'legacy-bob'), { display_name: 'Bob Updated' }));
});

test('verified legacy owner can write the legacy public projection (regression)', async () => {
  const db = testEnv
    .authenticatedContext(LEGACY_OWNER_UID, { email: BOB_EMAIL, email_verified: true })
    .firestore();
  await assertSucceeds(
    setDoc(doc(db, 'public_profiles', 'legacy-bob'), {
      username: 'bob',
      display_name: 'Bob Updated',
      avatar_url: null,
    })
  );
});

test('owners can read their own full profile', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID, { email: ALICE_EMAIL, email_verified: true }).firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', OWNER_UID)));
  assert.equal(snap.data().email, ALICE_EMAIL);
  assert.equal(snap.data().phone, 'private-phone');
});

test('owners can update their own profile', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID, { email: ALICE_EMAIL, email_verified: true }).firestore();
  await assertSucceeds(updateDoc(doc(db, 'profiles', OWNER_UID), { display_name: 'Alice Updated' }));
});

test('admins can read any full profile', async () => {
  const db = testEnv.authenticatedContext(ADMIN_UID).firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', OWNER_UID)));
  assert.equal(snap.data().email, ALICE_EMAIL);
});

test('admins can list all full profiles', async () => {
  const db = testEnv.authenticatedContext(ADMIN_UID).firestore();
  await assertSucceeds(getDocs(collection(db, 'profiles')));
});

test('owners can write their own public profile projection', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID, { email: ALICE_EMAIL, email_verified: true }).firestore();
  await assertSucceeds(
    setDoc(doc(db, 'public_profiles', OWNER_UID), {
      username: 'alice',
      display_name: 'Alice Updated',
      avatar_url: 'https://example.test/alice.png',
    })
  );
});

test('public profile writes cannot include private email', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID, { email: ALICE_EMAIL, email_verified: true }).firestore();
  await assertFails(
    setDoc(doc(db, 'public_profiles', OWNER_UID), {
      username: 'alice',
      display_name: 'Alice',
      email: ALICE_EMAIL,
    })
  );
});

test('public profile writes cannot include unrendered fields', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID, { email: ALICE_EMAIL, email_verified: true }).firestore();
  await assertFails(
    setDoc(doc(db, 'public_profiles', OWNER_UID), {
      username: 'alice',
      display_name: 'Alice',
      avatar_url: null,
      bio: 'Not rendered publicly',
    })
  );
});

test('ordinary users cannot write another users public profile', async () => {
  const db = testEnv.authenticatedContext(ORDINARY_UID).firestore();
  await assertFails(
    setDoc(doc(db, 'public_profiles', OWNER_UID), {
      username: 'alice',
      display_name: 'Hacked',
    })
  );
});

test('signed-out visitors cannot write public profiles', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(
    setDoc(doc(db, 'public_profiles', 'anonymous-write'), {
      username: 'anon',
      display_name: 'Anon',
    })
  );
});

test('admins can write any public profile projection', async () => {
  const db = testEnv.authenticatedContext(ADMIN_UID).firestore();
  await assertSucceeds(
    setDoc(doc(db, 'public_profiles', 'legacy-bob'), {
      username: 'bob',
      display_name: 'Bob Public',
    })
  );
});

test('admin public profile writes are also restricted to the public fields', async () => {
  const db = testEnv.authenticatedContext(ADMIN_UID).firestore();
  await assertFails(
    setDoc(doc(db, 'public_profiles', 'legacy-bob'), {
      username: 'bob',
      display_name: 'Bob',
      created_at: '2026-01-02T00:00:00.000Z',
    })
  );
});
