import test, { after, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

const ADMIN_UID = 'admin-user';
const MODERATOR_UID = 'moderator-user';
const ORDINARY_UID = 'ordinary-user';

// 1x1 transparent PNG.
const PNG_BYTES = Uint8Array.from(
  atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='),
  (c) => c.charCodeAt(0)
);

let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-kids-ai',
    firestore: { rules: readFileSync('firestore.rules', 'utf8') },
    storage: { rules: readFileSync('storage.rules', 'utf8') },
  });

  await testEnv.clearFirestore();
  await testEnv.clearStorage();

  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, 'user_roles', ADMIN_UID), { role: 'admin' });
    await setDoc(doc(db, 'user_roles', MODERATOR_UID), { role: 'moderator' });
    await setDoc(doc(db, 'user_roles', ORDINARY_UID), { role: 'viewer' });

    const storage = context.storage();
    await uploadBytes(ref(storage, 'resource-images/existing.png'), PNG_BYTES, {
      contentType: 'image/png',
    });
    await uploadBytes(ref(storage, 'legacy/old-image.png'), PNG_BYTES, {
      contentType: 'image/png',
    });
  });
});

after(async () => {
  await testEnv?.cleanup();
});

test('public visitors can still read resource images', async () => {
  const anon = testEnv.unauthenticatedContext().storage();
  const bytes = await assertSucceeds(getBytes(ref(anon, 'resource-images/existing.png')));
  assert.ok(bytes.byteLength > 0);
});

test('public visitors can still read legacy image paths', async () => {
  const anon = testEnv.unauthenticatedContext().storage();
  await assertSucceeds(getBytes(ref(anon, 'legacy/old-image.png')));
});

test('ordinary signed-in users cannot create resource images', async () => {
  const user = testEnv.authenticatedContext(ORDINARY_UID).storage();
  await assertFails(
    uploadBytes(ref(user, 'resource-images/user-upload.png'), PNG_BYTES, {
      contentType: 'image/png',
    })
  );
});

test('ordinary signed-in users cannot overwrite existing resource images', async () => {
  const user = testEnv.authenticatedContext(ORDINARY_UID).storage();
  await assertFails(
    uploadBytes(ref(user, 'resource-images/existing.png'), PNG_BYTES, {
      contentType: 'image/png',
    })
  );
});

test('admins can create resource images through the intended path', async () => {
  const admin = testEnv.authenticatedContext(ADMIN_UID).storage();
  await assertSucceeds(
    uploadBytes(ref(admin, 'resource-images/admin-created.png'), PNG_BYTES, {
      contentType: 'image/png',
    })
  );
});

test('admins can replace existing resource images', async () => {
  const admin = testEnv.authenticatedContext(ADMIN_UID).storage();
  await assertSucceeds(
    uploadBytes(ref(admin, 'resource-images/existing.png'), PNG_BYTES, {
      contentType: 'image/png',
    })
  );
});

test('moderators can upload resource images (same role as Firestore rules)', async () => {
  const moderator = testEnv.authenticatedContext(MODERATOR_UID).storage();
  await assertSucceeds(
    uploadBytes(ref(moderator, 'resource-images/moderator-created.png'), PNG_BYTES, {
      contentType: 'image/png',
    })
  );
});

test('admins cannot upload non-image content', async () => {
  const admin = testEnv.authenticatedContext(ADMIN_UID).storage();
  await assertFails(
    uploadBytes(ref(admin, 'resource-images/not-an-image.txt'), Uint8Array.from([1, 2, 3]), {
      contentType: 'text/plain',
    })
  );
});

test('admins cannot upload outside the resource-images prefix', async () => {
  const admin = testEnv.authenticatedContext(ADMIN_UID).storage();
  await assertFails(
    uploadBytes(ref(admin, 'other/evil.png'), PNG_BYTES, { contentType: 'image/png' })
  );
});

test('no delete workflow exists, so admins cannot delete images', async () => {
  const admin = testEnv.authenticatedContext(ADMIN_UID).storage();
  await assertFails(deleteObject(ref(admin, 'resource-images/existing.png')));
});

test('a signed-in user with no UID-keyed role document cannot upload', async () => {
  const noRole = testEnv.authenticatedContext('no-role-user').storage();
  await assertFails(
    uploadBytes(ref(noRole, 'resource-images/no-role-upload.png'), PNG_BYTES, {
      contentType: 'image/png',
    })
  );
});
