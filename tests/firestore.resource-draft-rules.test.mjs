import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, doc, getDoc, getDocs, getDocsFromServer, query, setDoc, updateDoc, where } from 'firebase/firestore';

const ADMIN_UID = 'resource-admin';
let env;

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
  });
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'user_roles', ADMIN_UID), { role: 'admin' });
    await setDoc(doc(db, 'resources', 'published'), { title: 'Public resource', is_approved: true });
    await setDoc(doc(db, 'resources', 'draft'), { title: 'Private draft', is_approved: false });
    await setDoc(doc(db, 'resources', 'legacy'), { title: 'Legacy public resource' });
    await setDoc(doc(db, 'resources', 'legacy-url'), {
      title: 'Legacy URL resource', description: 'Existing published content', url: ' https://example.org',
      resource_type: 'tool', cost: 'free', age_ranges: ['8-10'], is_approved: true,
    });
    await setDoc(doc(db, 'resources', 'legacy-ages'), {
      title: 'Legacy ages resource', description: 'Existing published content', url: 'https://example.org',
      resource_type: 'tool', cost: 'free', age_ranges: ['5-7', '8-10'], is_approved: true,
    });
  });
});

after(async () => env?.cleanup());

test('public visitors can read published and legacy records, but not drafts', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDoc(doc(db, 'resources', 'published')));
  await assertSucceeds(getDoc(doc(db, 'resources', 'legacy')));
  await assertSucceeds(getDoc(doc(db, 'resources', 'legacy-url')));
  await assertSucceeds(getDoc(doc(db, 'resources', 'legacy-ages')));
  await assertFails(getDoc(doc(db, 'resources', 'draft')));
});

test('public list queries must constrain results to published records', async () => {
  const db = env.unauthenticatedContext().firestore();
  const visible = await assertSucceeds(getDocs(query(collection(db, 'resources'), where('is_approved', '==', true))));
  assert.equal(visible.size, 3);
  await assertFails(getDocsFromServer(collection(db, 'resources')));
});

test('admins can list and edit drafts, while non-admins cannot', async () => {
  const adminDb = env.authenticatedContext(ADMIN_UID).firestore();
  const all = await assertSucceeds(getDocs(collection(adminDb, 'resources')));
  assert.equal(all.size, 5);
  await assertSucceeds(updateDoc(doc(adminDb, 'resources', 'draft'), { description: 'Saved draft edit' }));
  await assertFails(updateDoc(doc(env.authenticatedContext('ordinary').firestore(), 'resources', 'draft'), { title: 'Changed' }));
});

test('admins can create incomplete drafts but cannot publish them until required fields are valid', async () => {
  const db = env.authenticatedContext(ADMIN_UID).firestore();
  const draftRef = doc(db, 'resources', 'incomplete-import');
  await assertSucceeds(setDoc(draftRef, {
    id: 'incomplete-import', source_id: 'source-42', title: 'Imported draft', description: '',
    url: '', image_url: '', resource_type: '', cost: '', age_ranges: ['5-12'],
    source_data: { age_ranges: ['5-12'] }, is_approved: false,
  }));
  await assertFails(updateDoc(draftRef, { is_approved: true }));
  await assertSucceeds(updateDoc(draftRef, {
    description: 'Reviewed description', url: 'https://example.org/resource',
    resource_type: 'interactive_tools_apps', cost: 'free', age_ranges: ['8-10'],
  }));
  await assertSucceeds(updateDoc(draftRef, { is_approved: true }));
  const correctedAndPublished = (await assertSucceeds(getDoc(draftRef))).data();
  assert.deepEqual(correctedAndPublished.age_ranges, ['8-10']);
  assert.deepEqual(correctedAndPublished.source_data.age_ranges, ['5-12']);
  assert.equal(correctedAndPublished.is_approved, true);
});

test('new resources must explicitly declare approval state', async () => {
  const db = env.authenticatedContext(ADMIN_UID).firestore();
  await assertFails(setDoc(doc(db, 'resources', 'missing-approval-state'), {
    title: 'Incomplete and unflagged resource', description: '', url: '', resource_type: '', cost: '', age_ranges: [],
  }));
});

test('admins can edit existing published records with legacy URL or age values without changing them', async () => {
  const db = env.authenticatedContext(ADMIN_UID).firestore();
  const urlRef = doc(db, 'resources', 'legacy-url');
  const agesRef = doc(db, 'resources', 'legacy-ages');

  await assertSucceeds(updateDoc(urlRef, { description: 'Edited without changing legacy URL' }));
  await assertSucceeds(updateDoc(agesRef, { description: 'Edited without changing legacy ages' }));
  await assertFails(updateDoc(urlRef, { url: 'not-a-url' }));
  await assertFails(updateDoc(agesRef, { age_ranges: ['99-100'] }));
  await assertFails(updateDoc(urlRef, { age_ranges: ['99-100'] }));
  await assertFails(updateDoc(agesRef, { url: 'javascript:alert(1)' }));
  await assertFails(updateDoc(urlRef, { title: '' }));
  await assertFails(updateDoc(agesRef, { description: '' }));
  await assertFails(updateDoc(urlRef, { cost: 'unknown' }));

  await assertSucceeds(updateDoc(urlRef, { url: 'https://corrected.example.org', age_ranges: ['8-10'] }));
  await assertSucceeds(updateDoc(agesRef, { age_ranges: ['8-10'], url: 'https://example.org' }));
});
