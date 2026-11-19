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

const OWNER_UID = 'release-owner-uid';
const AUTHOR_ID = 'release-author';
const OWNER_EMAIL = 'release-owner@example.com';
const ORDINARY_UID = 'release-ordinary-uid';
const ADMIN_UID = 'release-admin-uid';

let testEnv;

// Mirrors the exact read+join the app services perform for author rendering.
const authorNameFromPublicProfile = (profile) =>
  (profile && (profile.display_name || profile.username)) || 'Anonymous';

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });

  await testEnv.clearFirestore();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'profiles', AUTHOR_ID), {
      id: AUTHOR_ID,
      email: OWNER_EMAIL,
      username: 'release_author',
      display_name: 'Release Author',
      avatar_url: 'https://example.test/author.png',
      phone: 'private-phone',
      created_at: '2026-01-01T00:00:00.000Z',
      updated_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'public_profiles', AUTHOR_ID), {
      username: 'release_author',
      display_name: 'Release Author',
      avatar_url: 'https://example.test/author.png',
    });
    await setDoc(doc(db, 'blog_posts', 'post-1'), {
      author_id: AUTHOR_ID,
      title: 'Backfill sequence post',
      slug: 'backfill-sequence-post',
      is_published: true,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'community_posts', 'post-1'), {
      author_id: AUTHOR_ID,
      title: 'Backfill sequence post',
      content: 'Content',
      category: 'getting-started',
      created_at: '2026-01-01T00:00:00.000Z',
      last_activity: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'user_roles', ADMIN_UID), { role: 'admin' });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('step 1 - stale frontend path: full profile reads are denied after lockdown', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(db, 'profiles', AUTHOR_ID)));
});

test('step 2 - new frontend path: signed-out reads the public projection', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'public_profiles', AUTHOR_ID)));
  const data = snap.data();
  assert.equal(data.display_name, 'Release Author');
  assert.equal(data.email, undefined);
  assert.equal(data.phone, undefined);
});

test('step 3 - author rendering works from public content plus public profiles', async () => {
  const db = testEnv.unauthenticatedContext().firestore();

  const [blogSnap, communitySnap] = await Promise.all([
    assertSucceeds(getDocs(query(collection(db, 'blog_posts'), where('is_published', '==', true)))),
    assertSucceeds(getDocs(query(collection(db, 'community_posts'), where('category', '==', 'getting-started')))),
  ]);
  assert.equal(blogSnap.size, 1);
  assert.equal(communitySnap.size, 1);

  const profileSnap = await assertSucceeds(getDoc(doc(db, 'public_profiles', AUTHOR_ID)));
  const renderedAuthor = authorNameFromPublicProfile(profileSnap.data());
  assert.equal(renderedAuthor, 'Release Author');
});

test('step 3b - stale frontend fallback would show Anonymous, not expose the profile', async () => {
  const db = testEnv.unauthenticatedContext().firestore();
  const denied = await assertFails(getDoc(doc(db, 'profiles', AUTHOR_ID)));
  assert.ok(denied);
  assert.equal(authorNameFromPublicProfile(null), 'Anonymous');
});

test('step 4 - sign-in resolves the legacy profile via a verified email', async () => {
  const db = testEnv
    .authenticatedContext(OWNER_UID, { email: OWNER_EMAIL, email_verified: true })
    .firestore();

  const matches = await assertSucceeds(
    getDocs(query(collection(db, 'profiles'), where('email', '==', OWNER_EMAIL)))
  );
  assert.equal(matches.size, 1);

  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', AUTHOR_ID)));
  assert.equal(snap.data().email, OWNER_EMAIL);
  assert.equal(snap.data().phone, 'private-phone');
});

test('step 5 - profile edit keeps the projection in sync and stays private', async () => {
  const db = testEnv
    .authenticatedContext(OWNER_UID, { email: OWNER_EMAIL, email_verified: true })
    .firestore();

  // What backendService.updateProfile performs: profile write + projection sync.
  await assertSucceeds(updateDoc(doc(db, 'profiles', AUTHOR_ID), { display_name: 'Release Author Renamed' }));
  await assertSucceeds(
    setDoc(doc(db, 'public_profiles', AUTHOR_ID), {
      username: 'release_author',
      display_name: 'Release Author Renamed',
      avatar_url: 'https://example.test/author.png',
    })
  );

  const publicSnap = await assertSucceeds(getDoc(doc(db, 'public_profiles', AUTHOR_ID)));
  assert.equal(publicSnap.data().display_name, 'Release Author Renamed');

  // The owner still has private access; public/ordinary denial is covered in step 1/7.
  const own = await assertSucceeds(getDoc(doc(db, 'profiles', AUTHOR_ID)));
  assert.equal(own.data().display_name, 'Release Author Renamed');
  assert.equal(own.data().phone, 'private-phone');
});

test('step 6 - admin keeps the private read path after lockdown', async () => {
  const db = testEnv.authenticatedContext(ADMIN_UID).firestore();
  const snap = await assertSucceeds(getDoc(doc(db, 'profiles', AUTHOR_ID)));
  assert.equal(snap.data().display_name, 'Release Author Renamed');
});

test('step 7 - ordinary signed-in user can read public content but not profiles', async () => {
  const db = testEnv.authenticatedContext(ORDINARY_UID).firestore();

  const blog = await assertSucceeds(getDocs(query(collection(db, 'blog_posts'), where('is_published', '==', true))));
  assert.equal(blog.size, 1);
  await assertSucceeds(getDoc(doc(db, 'public_profiles', AUTHOR_ID)));
  await assertFails(getDoc(doc(db, 'profiles', AUTHOR_ID)));
});
