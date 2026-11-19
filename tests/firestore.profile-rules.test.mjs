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
const ORDINARY_UID = 'carol-uid';
const ADMIN_UID = 'admin-uid';

const ALICE_EMAIL = 'alice@example.com';
const BOB_EMAIL = 'bob@example.com';

let testEnv;

const publicProfile = (id) => ({
  id,
  username: id,
  display_name: `${id} display`,
  avatar_url: `https://example.test/${id}.png`,
  bio: 'Public bio',
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
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
      updated_at: '2026-01-02T00:00:00.000Z',
    });
    await setDoc(doc(db, 'profiles', ORDINARY_UID), {
      id: ORDINARY_UID,
      email: 'carol@example.com',
      username: 'carol',
      display_name: 'Carol',
      created_at: '2026-01-03T00:00:00.000Z',
    });
    await setDoc(doc(db, 'public_profiles', OWNER_UID), publicProfile(OWNER_UID));
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
  assert.equal(snap.data().display_name, 'alice-uid display');
  assert.equal(snap.data().email, undefined);
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

test('owners can read their own full profile', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID).firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', OWNER_UID)));
  assert.equal(snap.data().email, ALICE_EMAIL);
  assert.equal(snap.data().phone, 'private-phone');
});

test('owners can resolve a legacy profile id by their own email', async () => {
  const db = testEnv.authenticatedContext(LEGACY_OWNER_UID, { email: BOB_EMAIL }).firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', 'legacy-bob')));
  assert.equal(snap.data().email, BOB_EMAIL);
});

test('owners can list their own profile by email constraint', async () => {
  const db = testEnv.authenticatedContext(LEGACY_OWNER_UID, { email: BOB_EMAIL }).firestore();
  const snap = await assertSucceeds(
    getDocs(query(collection(db, 'profiles'), where('email', '==', BOB_EMAIL)))
  );
  assert.equal(snap.size, 1);
});

test('owners can update their own profile', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID).firestore();
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
  const db = testEnv.authenticatedContext(OWNER_UID).firestore();
  await assertSucceeds(
    setDoc(doc(db, 'public_profiles', OWNER_UID), {
      username: 'alice',
      display_name: 'Alice Updated',
      avatar_url: 'https://example.test/alice.png',
      bio: 'New bio',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-02-01T00:00:00.000Z',
    })
  );
});

test('public profile writes cannot include private email', async () => {
  const db = testEnv.authenticatedContext(OWNER_UID).firestore();
  await assertFails(
    setDoc(doc(db, 'public_profiles', OWNER_UID), {
      username: 'alice',
      display_name: 'Alice',
      email: ALICE_EMAIL,
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
      created_at: '2026-01-02T00:00:00.000Z',
      updated_at: '2026-02-01T00:00:00.000Z',
    })
  );
});
