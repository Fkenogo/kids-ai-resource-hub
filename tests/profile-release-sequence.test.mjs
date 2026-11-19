import test from 'node:test';
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

const UID_OWNER = 'uid-owner-uid';
const LEGACY_OWNER = 'legacy-owner-uid';
const UNVERIFIED_LEGACY_OWNER = 'unverified-legacy-uid';
const ORDINARY = 'ordinary-uid';
const ADMIN = 'admin-uid';

const UID_AUTHOR_ID = UID_OWNER;
const LEGACY_AUTHOR_ID = 'legacy-author';
const UNVERIFIED_LEGACY_AUTHOR_ID = 'legacy-unverified';
const UID_EMAIL = 'uid-owner@example.com';
const LEGACY_EMAIL = 'legacy@example.com';
const UNVERIFIED_LEGACY_EMAIL = 'unverified-legacy@example.com';

const PUBLISHED_RULES = readFileSync('tests/fixtures/published-firestore.rules', 'utf8');
const PROPOSED_RULES = readFileSync('firestore.rules', 'utf8');

// Mirrors the exact read+join the app services perform for author rendering.
const authorNameFromProfile = (profile) =>
  (profile && (profile.display_name || profile.username)) || 'Anonymous';

const publicProfile = (username, displayName) => ({
  username,
  display_name: displayName,
  avatar_url: `https://example.test/${username}.png`,
});

const seedOldWorld = async (env) => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID), {
      id: LEGACY_AUTHOR_ID,
      email: LEGACY_EMAIL,
      username: 'legacy_author',
      display_name: 'Legacy Author',
      avatar_url: 'https://example.test/legacy.png',
      phone: 'private-phone',
      created_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'blog_posts', 'post-1'), {
      author_id: LEGACY_AUTHOR_ID,
      title: 'Old-world post',
      is_published: true,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'community_posts', 'post-1'), {
      author_id: LEGACY_AUTHOR_ID,
      title: 'Old-world post',
      content: 'Content',
      category: 'getting-started',
      created_at: '2026-01-01T00:00:00.000Z',
      last_activity: '2026-01-01T00:00:00.000Z',
    });
  });
};

const seedNewWorld = async (env) => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    // UID-keyed author (works without a verified email).
    await setDoc(doc(db, 'profiles', UID_AUTHOR_ID), {
      id: UID_AUTHOR_ID,
      email: UID_EMAIL,
      username: 'uid_author',
      display_name: 'UID Author',
      avatar_url: 'https://example.test/uid.png',
      phone: 'private-phone',
      created_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'public_profiles', UID_AUTHOR_ID), publicProfile('uid_author', 'UID Author'));
    // Verified legacy author.
    await setDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID), {
      id: LEGACY_AUTHOR_ID,
      email: LEGACY_EMAIL,
      username: 'legacy_author',
      display_name: 'Legacy Author',
      avatar_url: 'https://example.test/legacy.png',
      phone: 'private-phone',
      created_at: '2026-01-02T00:00:00.000Z',
    });
    await setDoc(doc(db, 'public_profiles', LEGACY_AUTHOR_ID), publicProfile('legacy_author', 'Legacy Author'));
    // Unverified legacy author (legacy id + unverified email).
    await setDoc(doc(db, 'profiles', UNVERIFIED_LEGACY_AUTHOR_ID), {
      id: UNVERIFIED_LEGACY_AUTHOR_ID,
      email: UNVERIFIED_LEGACY_EMAIL,
      username: 'unverified_legacy',
      display_name: 'Unverified Legacy',
      created_at: '2026-01-03T00:00:00.000Z',
    });
    await setDoc(doc(db, 'public_profiles', UNVERIFIED_LEGACY_AUTHOR_ID), publicProfile('unverified_legacy', 'Unverified Legacy'));
    // Public content by both authors.
    await setDoc(doc(db, 'blog_posts', 'post-uid'), {
      author_id: UID_AUTHOR_ID,
      title: 'UID post',
      is_published: true,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    await setDoc(doc(db, 'blog_posts', 'post-legacy'), {
      author_id: LEGACY_AUTHOR_ID,
      title: 'Legacy post',
      is_published: true,
      created_at: '2026-01-02T00:00:00.000Z',
    });
    await setDoc(doc(db, 'community_posts', 'post-legacy'), {
      author_id: LEGACY_AUTHOR_ID,
      title: 'Legacy community post',
      content: 'Content',
      category: 'getting-started',
      created_at: '2026-01-02T00:00:00.000Z',
      last_activity: '2026-01-02T00:00:00.000Z',
    });
    await setDoc(doc(db, 'user_roles', ADMIN), { role: 'admin' });
  });
};

// ---------- Phase A: the rules that are live today ----------

test('phase A - published rules rehearsal', async (t) => {
  const oldEnv = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: PUBLISHED_RULES },
  });
  try {
    await seedOldWorld(oldEnv);

    await t.test('full profiles are publicly readable', async () => {
      const db = oldEnv.unauthenticatedContext().firestore();
      const snap = await assertSucceeds(getDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID)));
      assert.equal(snap.data().email, LEGACY_EMAIL);
      assert.equal(snap.data().phone, 'private-phone');
    });

    await t.test('author rendering reads full profiles', async () => {
      const db = oldEnv.unauthenticatedContext().firestore();
      const posts = await assertSucceeds(
        getDocs(query(collection(db, 'blog_posts'), where('is_published', '==', true)))
      );
      const profile = await assertSucceeds(getDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID)));
      assert.equal(authorNameFromProfile(profile.data()), 'Legacy Author');
      assert.equal(posts.size, 1);
    });

    await t.test('legacy profile read works without a verified email; profile update is still uid/admin-only', async () => {
      const db = oldEnv
        .authenticatedContext(LEGACY_OWNER, { email: LEGACY_EMAIL, email_verified: false })
        .firestore();
      const snap = await assertSucceeds(getDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID)));
      assert.equal(snap.data().email, LEGACY_EMAIL);
      // The published rules never allowed a legacy owner to update either.
      await assertFails(updateDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID), { display_name: 'Legacy Author' }));
    });

    await t.test('legacy posting works without a verified email', async () => {
      const db = oldEnv
        .authenticatedContext(LEGACY_OWNER, { email: LEGACY_EMAIL, email_verified: false })
        .firestore();
      await assertSucceeds(
        setDoc(doc(db, 'community_posts', 'posted-old'), {
          author_id: LEGACY_AUTHOR_ID,
          title: 'Old rules post',
          content: 'Content',
          category: 'getting-started',
          created_at: '2026-01-01T00:00:00.000Z',
          last_activity: '2026-01-01T00:00:00.000Z',
        })
      );
    });
  } finally {
    await oldEnv.cleanup();
  }
});

// ---------- Phase B: the proposed rules (after publication) ----------

test('phase B - proposed rules rehearsal', async (t) => {
  const newEnv = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: PROPOSED_RULES },
  });
  try {
    await seedNewWorld(newEnv);

    await t.test('pre-publication - author coverage: every content author has a public projection', async () => {
      const db = newEnv.unauthenticatedContext().firestore();
      const [blog, community, projections] = await Promise.all([
        getDocs(collection(db, 'blog_posts')),
        getDocs(collection(db, 'community_posts')),
        getDocs(collection(db, 'public_profiles')),
      ]);
      const authorIds = new Set();
      blog.forEach((d) => authorIds.add(String(d.data().author_id || '')));
      community.forEach((d) => authorIds.add(String(d.data().author_id || '')));
      const projectionIds = new Set(projections.docs.map((d) => d.id));
      for (const authorId of authorIds) {
        assert.ok(projectionIds.has(authorId), `missing public projection for ${authorId}`);
      }
    });

    await t.test('pre-publication - allowed fields: projections only contain rendered fields', async () => {
      const db = newEnv.unauthenticatedContext().firestore();
      const projections = await assertSucceeds(getDocs(collection(db, 'public_profiles')));
      projections.forEach((d) => {
        for (const key of Object.keys(d.data())) {
          assert.ok(
            ['username', 'display_name', 'avatar_url'].includes(key),
            `unexpected field ${key}`
          );
        }
      });
    });

    await t.test('post-publication - signed-out full profile reads are denied', async () => {
      const db = newEnv.unauthenticatedContext().firestore();
      await assertFails(getDoc(doc(db, 'profiles', UID_AUTHOR_ID)));
      await assertFails(getDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID)));
      await assertFails(getDoc(doc(db, 'profiles', UNVERIFIED_LEGACY_AUTHOR_ID)));
    });

    await t.test('post-publication - author rendering works from the public projection', async () => {
      const db = newEnv.unauthenticatedContext().firestore();
      const posts = await assertSucceeds(
        getDocs(query(collection(db, 'blog_posts'), where('is_published', '==', true)))
      );
      assert.equal(posts.size, 2);
      const [uidProfile, legacyProfile] = await Promise.all([
        assertSucceeds(getDoc(doc(db, 'public_profiles', UID_AUTHOR_ID))),
        assertSucceeds(getDoc(doc(db, 'public_profiles', LEGACY_AUTHOR_ID))),
      ]);
      assert.equal(authorNameFromProfile(uidProfile.data()), 'UID Author');
      assert.equal(authorNameFromProfile(legacyProfile.data()), 'Legacy Author');
    });

    await t.test('post-publication - stale frontend degrades to Anonymous without exposing profiles', async () => {
      const db = newEnv.unauthenticatedContext().firestore();
      await assertFails(getDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID)));
      assert.equal(authorNameFromProfile(null), 'Anonymous');
      const fresh = await assertSucceeds(getDoc(doc(db, 'public_profiles', LEGACY_AUTHOR_ID)));
      assert.equal(authorNameFromProfile(fresh.data()), 'Legacy Author');
    });

    await t.test('post-publication - UID-keyed owner posts and edits without a verified email', async () => {
      const db = newEnv
        .authenticatedContext(UID_OWNER, { email: UID_EMAIL, email_verified: false })
        .firestore();

      const own = await assertSucceeds(getDoc(doc(db, 'profiles', UID_AUTHOR_ID)));
      assert.equal(own.data().email, UID_EMAIL);

      await assertSucceeds(
        setDoc(doc(db, 'community_posts', 'posted-uid'), {
          author_id: UID_AUTHOR_ID,
          title: 'UID owner post',
          content: 'Content',
          category: 'getting-started',
          created_at: '2026-01-01T00:00:00.000Z',
          last_activity: '2026-01-01T00:00:00.000Z',
        })
      );

      await assertSucceeds(updateDoc(doc(db, 'profiles', UID_AUTHOR_ID), { display_name: 'UID Author Renamed' }));
      await assertSucceeds(
        setDoc(doc(db, 'public_profiles', UID_AUTHOR_ID), publicProfile('uid_author', 'UID Author Renamed'))
      );

      const anon = newEnv.unauthenticatedContext().firestore();
      const projection = await assertSucceeds(getDoc(doc(db, 'public_profiles', UID_AUTHOR_ID)));
      assert.equal(projection.data().display_name, 'UID Author Renamed');
      await assertFails(getDoc(doc(anon, 'profiles', UID_AUTHOR_ID)));
    });

    await t.test('post-publication - verified legacy owner posts and edits via email match', async () => {
      const db = newEnv
        .authenticatedContext(LEGACY_OWNER, { email: LEGACY_EMAIL, email_verified: true })
        .firestore();

      const matches = await assertSucceeds(
        getDocs(query(collection(db, 'profiles'), where('email', '==', LEGACY_EMAIL)))
      );
      assert.equal(matches.size, 1);

      await assertSucceeds(
        setDoc(doc(db, 'community_posts', 'posted-legacy'), {
          author_id: LEGACY_AUTHOR_ID,
          title: 'Legacy owner post',
          content: 'Content',
          category: 'getting-started',
          created_at: '2026-01-02T00:00:00.000Z',
          last_activity: '2026-01-02T00:00:00.000Z',
        })
      );

      await assertSucceeds(updateDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID), { display_name: 'Legacy Author Renamed' }));
      await assertSucceeds(
        setDoc(doc(db, 'public_profiles', LEGACY_AUTHOR_ID), publicProfile('legacy_author', 'Legacy Author Renamed'))
      );
    });

    await t.test('post-publication - unverified legacy owner cannot post with the legacy author id', async () => {
      const db = newEnv
        .authenticatedContext(UNVERIFIED_LEGACY_OWNER, { email: UNVERIFIED_LEGACY_EMAIL, email_verified: false })
        .firestore();
      await assertFails(
        setDoc(doc(db, 'community_posts', 'posted-unverified'), {
          author_id: UNVERIFIED_LEGACY_AUTHOR_ID,
          title: 'Should not post',
          content: 'Content',
          category: 'getting-started',
          created_at: '2026-01-03T00:00:00.000Z',
          last_activity: '2026-01-03T00:00:00.000Z',
        })
      );
    });

    await t.test('post-publication - admin keeps private reads', async () => {
      const db = newEnv.authenticatedContext(ADMIN).firestore();
      const snap = await assertSucceeds(getDoc(doc(db, 'profiles', LEGACY_AUTHOR_ID)));
      assert.equal(snap.data().display_name, 'Legacy Author Renamed');
      await assertSucceeds(getDocs(collection(db, 'profiles')));
    });
  } finally {
    await newEnv.cleanup();
  }
});
