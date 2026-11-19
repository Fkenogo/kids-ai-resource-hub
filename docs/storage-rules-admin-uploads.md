# Storage Rules — Admin-Only Resource Image Uploads

**Date:** 2026-11-19
**Status:** Proposed rules + emulator-verified tests. **Not deployed.** Live Storage rules are unchanged until the owner approves a deploy.

## 1. Upload path inventory

| Path | Written by | Callers | Read by public site |
|---|---|---|---|
| `resource-images/<timestamp>-<random>.<ext>` | `src/services/storageService.ts` → `uploadResourceImage()` (line 11 builds the path, line 17 uploads) | `src/components/ImageUploader.tsx:61` (resource image editing), `src/pages/AdminPlaceholderMigration.tsx:57` (one-off placeholder backfill) | Yes — returned download URLs are stored on `resources.image_url` and rendered on public pages |

Findings:

- **One prefix only.** No other `ref()`/`uploadBytes()` call sites exist in `src/` or `scripts/`.
- **No deletion workflow.** `deleteObject` is not used anywhere in the app; deleting a resource does not delete its Storage object. Therefore deletion is **denied** in the new rules. If an admin cleanup workflow is added later, it must be granted explicitly.
- **No client-side replacement flow by design.** Each upload creates a new timestamped filename (`storageService.ts:11`), so "replacement" is effectively a new object; the rules still allow `update` on an existing object for admin tooling.
- **Public read must stay.** Image URLs are embedded in public resource pages and social previews. Reads remain public for **all paths** so legacy objects outside `resource-images/` continue to resolve.

## 2. How Firebase identifies admins

Firestore rules already define the source of truth (`firestore.rules:7-18`):

```
user_roles/{request.auth.uid}.role in ['admin', 'moderator']
```

The new Storage rules mirror that lookup with the supported cross-service functions:

```
firestore.get(/databases/(default)/documents/user_roles/$(request.auth.uid)).data.role
```

**Important prerequisite / known mismatch:** the app's UI check (`src/hooks/useAdminAccess.ts:13-21`) and `src/services/storageService.ts:42-51` query `user_roles` by the **`user_id` field of the resolved legacy profile id**, not by uid document ID. For migrated users these can be different documents. The Storage rule (like the Firestore rule) trusts the **uid-keyed document**.

Before deploying:

1. Confirm in the Firebase console which key production role documents use (aggregate count only: uid doc-ID vs `user_id` field).
2. If role documents are legacy-keyed, migrate them to `user_roles/{uid}` (dry-run script, owner approval) and verify the owner's account can upload.
3. Otherwise the UI may show the upload button while Storage denies the write.

Cross-service rules also require the one-time Firestore↔Storage rules permission (IAM role) that the Firebase console/CLI prompts for on first deploy. No emulator equivalent is needed.

## 3. Rule change (summary)

| Operation | Before | After |
|---|---|---|
| Read (any path) | Public | Public (unchanged) |
| Create/overwrite `resource-images/**` | Any signed-in user, image <10 MB | **Admin or moderator only**, image <10 MB |
| Create/overwrite any other path | Any signed-in user, image <10 MB | **Denied** (default deny) |
| Delete any path | **Denied** — the old `write` guard required `request.resource != null`, which is null on delete | **Denied** (now explicit; behavior unchanged) |

The 10 MB and `image/*` content-type limits are preserved. Deletion was already impossible before this change; the new rule states it explicitly so a future `write` relaxation cannot silently re-enable deletes.

## 4. Emulator verification

Command:

```sh
npm run test:storage-rules
```

This runs `firebase emulators:exec --only firestore,storage --project demo-kids-ai` and executes `tests/storage.rules.test.mjs` with `@firebase/rules-unit-testing`. The `demo-` project ID guarantees no production access.

Result: **11/11 passing.**

| # | Test | Result |
|---|---|---|
| 1 | Public visitors can still read resource images | PASS |
| 2 | Public visitors can still read legacy image paths | PASS |
| 3 | Ordinary signed-in users cannot create resource images | PASS |
| 4 | Ordinary signed-in users cannot overwrite existing resource images | PASS |
| 5 | Admins can create resource images through the intended path | PASS |
| 6 | Admins can replace existing resource images | PASS |
| 7 | Moderators can upload (same role semantics as Firestore rules) | PASS |
| 8 | Admins cannot upload non-image content | PASS |
| 9 | Admins cannot upload outside `resource-images/` | PASS |
| 10 | Admins cannot delete images (no delete workflow) | PASS |
| 11 | Signed-in user with no UID-keyed role document cannot upload | PASS |

Test setup seeds `user_roles/{uid}` documents with roles `admin`, `moderator`, and `viewer`, then exercises the Storage client SDK against the emulators — the same SDK the app uses. Test 11 authenticates a user who has **no** `user_roles/{uid}` document at all, which is the production risk if role documents are still legacy-keyed.

## 5. Pre-deploy checklist (owner)

- [ ] Confirm production `user_roles` documents are keyed by Firebase uid (console, counts only).
- [ ] Migrate legacy role docs first if needed. **Hosting preview channels cannot verify this change:** `firebase hosting:channel:deploy` deploys Hosting assets only, while Storage rules are project-wide and are not versioned per preview channel. Verify in the emulator (this PR) and, if a live check is required, deploy the rules to a separate staging Firebase project — not a Hosting preview channel.
- [ ] Confirm public resource images still render signed-out (Home, `/resources`, detail pages).
- [ ] Confirm a non-admin test account cannot upload (button should already be hidden; the rule is the real gate).
- [ ] Deploy with `firebase deploy --only storage` **only after approval**.
- [ ] Rollback: `git revert` this rules change and redeploy; no data migration is involved.

## 6. Out of scope

- No live rules deploy.
- No changes to Firestore rules, hosting, DNS, or Cloudflare.
- No production data reads or writes.
- No changes to the app's client-side role check (tracked separately as the uid/legacy role alignment).
