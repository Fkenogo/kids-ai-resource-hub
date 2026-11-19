# Audit Remediation — Rules, Queries, Roles, and Storage Change-Together Matrix

**Date:** 2026-11-19
**Status:** Planning record only. **No live rules, production data, hosting, or DNS were changed.**
**Scope:** Firebase Firestore/Storage security model and the app code that depends on it.

This document records what must change *together* so that tightening security does not break the live product, plus the read-only Firebase console confirmations still required before any deploy. It intentionally uses **aggregate counts and field names only** — no user records or credentials.

---

## 1. Current enforcement map (repo truth)

| Collection | Current read rule | Current write rule | File |
|---|---|---|---|
| `profiles` | `if true` (public) | create own uid; update own/admin; delete admin | `firestore.rules:32-37` |
| `user_roles` | admin, or own doc by id / `user_id` | admin only | `firestore.rules:39-42` |
| `resources` | `if true` (includes unapproved) | create/delete admin; update admin **or any signed-in user for counter fields** | `firestore.rules:44-62` |
| `resource_reviews` | `if true` | create signed-in + own + `rating is number`; update/delete owner/admin | `firestore.rules:64-70` |
| `resource_comments` | `if true` | create signed-in + own; update/delete owner/admin | `firestore.rules:72-78` |
| `blog_posts` | `if true` (includes unpublished) | admin only | `firestore.rules:80-83` |
| `blog_comments` | `if true` (includes unapproved) | create signed-in + own (approval field caller-controlled); update/delete owner/admin | `firestore.rules:85-91` |
| `community_posts` | `if true` | create signed-in + own; update any signed-in for counter fields; delete admin | `firestore.rules:93-104` |
| `community_replies` | `if true` | create signed-in + own; update/delete owner/admin | `firestore.rules:106-113` |
| `user_engagements` | signed-in + own | create/delete own; update false | `firestore.rules:115-120` |
| `products` | `if true` | admin only | `firestore.rules:122-125` |

**Storage** (`storage.rules`): `/{allPaths=**}` → read public; write (includes delete) allowed for **any signed-in user** with `size < 10MB` and `contentType` image. No path scoping, no role check.

**Admin helper mismatch:** `isAdmin()` resolves `user_roles/{request.auth.uid}` **by document ID** (`firestore.rules:7-18`), while the app resolves roles by the **`user_id` field of a legacy profile id** (`src/hooks/useAdminAccess.ts:13-21`, `src/services/storageService.ts:42-51`). For migrated users these are different keys.

---

## 2. Change-together matrix

Each row is one unit of work: the rules change and the app change must ship in the same window, or the live site breaks.

### Group A — Public content visibility (resources)
- **Rules:** `resources` read → `resource.data.is_approved == true || isAdmin()`.
- **App to change together:**
  - `src/services/backend/resources.ts` `getResourcesFromBackend()` — currently fetches `is_approved == true` **and** filters client-side; verify the query still matches the rule (it does) and that missing-`is_approved` docs are handled explicitly.
  - `src/services/backend/admin.ts` `getAdminResources()` — reads all resources; must remain admin (rule allows `isAdmin()`), and the "pending" tab must include docs where `is_approved` is missing (currently invisible in both tabs).
  - `src/hooks/useBackendData.ts` — error/empty states are needed because a rules denial now looks like "no data" (see Group G).
  - Home/Directory/Detail pages consume the hook; no query text change needed.
- **Must not deploy until:** every production resource doc has an explicit boolean `is_approved` (see §3, check R1).

### Group B — Blog visibility
- **Rules:** `blog_posts` read → `resource.data.is_published == true || isAdmin()`.
- **App to change together:**
  - `src/services/backend/blog.ts` `getBlogPostsFromBackend()` — still fetches the whole collection and filters in JS; after the rule change it must add `where('is_published','==',true)` for public pages, and admin must use the admin path.
  - `src/pages/Blog.tsx`, `src/pages/home/LatestBlogPostsSection.tsx`, `src/pages/BlogPost.tsx` (slug lookup) — confirm no public page passes `includeUnpublished`.
  - Admin: `src/components/admin/blog/PostsManagement.tsx`, `BlogManagement.tsx` use `includeUnpublished: true`; require `isAdmin()` and explicit admin query.
- **Must not deploy until:** every production `blog_posts` doc has explicit `is_published` (check R2).

### Group C — Comment/review moderation + owner update limits
- **Rules:** force `is_approved: false` on create; owner updates limited to content fields via `diff().affectedKeys().hasOnly([...])`; rating range 1–5.
- **App to change together:**
  - `src/services/backend/blog.ts` `createBlogCommentFromBackend()` — line ~89 accepts caller `is_approved`; change to always write `false`.
  - `src/services/backend/resources.ts` `createCommentFromBackend()` / `createReviewFromBackend()` — write explicit `is_approved` values and ratings in range.
  - `src/components/admin/blog/CommentsManagement.tsx`, `src/components/ResourceReviews.tsx`, `src/components/ResourceComments.tsx` — admin approval updates must remain allowed (admin bypass), owner edits must only send content fields (no accidental `is_approved` in the update payload).
  - `src/services/backend/admin.ts` — any approval helpers must use the admin path.
- **Must not deploy until:** verify no client code updates `is_approved` as an owner (grep `is_approved` in `src/components` and `src/services`).

### Group D — Counters: authorization vs transactional consistency

These are two separate problems. Fixing one does not fix the other.

- **Authorization — who may write trusted counters.** The rules currently let *any* signed-in user write `{average_rating, review_count, comment_count, view_count, like_count, share_count, save_count}` on resources and `{like_count, reply_count}` on community posts. Adding range validation is **not** an authorization fix: a forged but in-range value (for example a 5.0 average) is still accepted. Preferred direction: ordinary clients may only submit engagement deltas (or dedicated engagement documents), while aggregate counters are written by trusted code (Admin SDK / Cloud Functions) or constrained to an exact increment shape. Decide this model before granting write access.
- **Transactional consistency — lost updates.** Even with correct authorization, read-then-write `current + 1` loses updates under concurrency. Use `runTransaction`/`increment`. This fixes correctness under load, not forgery.
- **App files:** `src/services/backend/resources.ts` (`createReviewFromBackend`, `createCommentFromBackend`), `src/services/backend/engagement.ts`, `src/services/backend/community.ts` (`reply_count`, `last_activity`), and removal/rewiring of `src/services/engagementService.ts` (currently localStorage fake).
- **Ordering:** decide counter authorization first; then implement transactions for the aggregates that remain client-written. Emulator tests must cover both an ordinary-user forgery attempt and a successful legitimate update.

### Group E — Admin role lookup (uid vs legacy profile id)
- **Rules:** keep `user_roles/{uid}` by doc ID (recommended canonical key).
- **App to change together:**
  - `src/hooks/useAdminAccess.ts` — read `user_roles/{currentUser.uid}` first; keep the `user_id`-field query as a temporary fallback.
  - `src/services/storageService.ts` — same lookup (currently duplicates the role query before upload).
  - One-off migration: copy `user_id`-keyed role docs to uid-keyed docs (Admin SDK, owner-approved, dry-run first).
  - `src/services/backend/auth.ts` `resolveDataUserId()` — email-based legacy-id resolution remains load-bearing; do not remove until role docs and profile ownership are uid-based.
- **Must not deploy until:** founder's admin account is confirmed working under the uid-keyed lookup (check R4).

### Group F — Profiles read (PII) and author-name joins
- **Rules (target):** `profiles` read → `matchesProfileUser(profileId) || request.auth.token.email == resource.data.email || isAdmin()`.
- **App that depends on profile reads (change together):**
  - `src/services/backend/auth.ts` `ensureProfileDocument()` (line ~90) and `resolveDataUserId()` (line ~131) query `profiles where email == currentUser.email` — the rule must allow authenticated email-matched reads or both functions fail at sign-in.
  - `src/services/backend/resources.ts:37`, `src/services/backend/blog.ts:9,39`, `src/services/backend/community.ts:7-16` join profiles per author (`getProfileMap`) — **signed-out** visitors currently rely on public profile reads to see author names/avatars. Locking profiles breaks signed-out community/blog author display.
  - **Decision required:** either (a) denormalize `display_name` + `avatar_url` into `community_posts`, `community_replies`, comments, reviews, and blog posts (recommended; heavier app change), or (b) allow public reads of profiles but move sensitive fields out of `profiles` (email) into a private collection (smaller rules change, larger data change). Do not mix both.
- **Must not deploy until:** author-name rendering is verified signed-out and signed-in (check R5).

### Group G — Storage paths and rules
- **Current upload path (single):** `resource-images/<timestamp>-<random>.<ext>` — `src/services/storageService.ts:11`.
- **Rules target:** `match /resource-images/{fileName}` → read public; write/delete only `isAdmin()` (mirroring Firestore helper); locked fallback `match /{allPaths=**}` → read public, write false.
- **App to change together:**
  - `src/services/storageService.ts` — remove/keep the client-side role check (UX only), keep path prefix stable.
  - `src/components/ImageUploader.tsx`, `src/components/ResourceImageEditor.tsx`, `src/components/admin/ResourceManagement.tsx` — uploads must go through `storageService` (verify no direct `ref()` calls elsewhere; grep shows only `storageService.ts`).
  - `src/pages/AdminPlaceholderMigration.tsx` — verify it uploads via the same service; if it writes to another prefix, scope that prefix too or migrate it.
  - `scripts/*` uploads use Firestore only (no Storage writes) — unaffected.
- **Must not deploy until:** admin upload is verified against the emulator suite (11/11) and non-admin upload is denied (check R6). A Hosting preview channel cannot validate Storage rules; use a staging Firebase project if a live check is required.

### Group H — Error/empty states (dependency)
- Rules denials surface as query errors. `src/hooks/useBackendData.ts:19-47` currently swallows errors and returns `[]`/`null`; `src/pages/ResourcePage.tsx:17-23` conflates error with not-found. **Ship error states in the same release as any rules tightening**, or admins will report "site is empty" with no signal.

---

## 3. Read-only Firebase console confirmations still required

Run these **read-only** before any rules deploy. Aggregate counts and field names only; do not export documents.

| ID | Check | Why it gates the change | Safe method |
|---|---|---|---|
| R1 | `resources`: total count; count with `is_approved == true`; count with `is_approved == false`; count where `is_approved` is **missing**; count with `age_ranges` vs `ageRanges`; count with `is_featured` vs `featured_resource`; count whose `age_ranges` still contains `'5-7'` | Group A + schema normalization. Missing flags would vanish under an approval rule. | Console sampling + a read-only Admin SDK script that prints **counts only** (no doc content). Do not run until owner approves. |
| R2 | `blog_posts`: total; `is_published` true/false/missing | Group B | Same |
| R3 | `blog_comments`: total; `is_approved` true/false/missing. Same for `resource_comments`, `resource_reviews` | Group C | Same |
| R4 | `user_roles`: total; count keyed by document ID = Firebase uid vs docs containing a legacy `user_id` field | Group E | Console doc-ID inspection on a sample + aggregate count script |
| R5 | Profiles: total count only; confirm whether public pages visibly require other users' names/avatars when signed out | Group F | Manual signed-out check on `/community`, `/blog`, `/resources` |
| R6 | Storage: top-level path prefixes and object counts under `resource-images/` (no object names required) | Group G | Firebase console Storage listing (counts only) |
| R7 | Which rules version is **actually deployed** (console Rules tab vs repo `firestore.rules`) | Confirms drift before editing | Console read-only view |
| R8 | API key restrictions / authorized domains for `kids-ai-resources.web.app` and the future custom domain | Not a rules change, but affects the GitHub Actions build | Google Cloud console read-only |

**Repo-side evidence available without console:** `kids_ai_resources.json` contains **66** resources; the app expects snake_case fields; the seed script still emits `'5-7'`. These are repo artifacts, not production counts — do not treat them as production evidence.

---

## 4. Prioritized plan (rules + app fixes)

**Standing gate for every rules PR (Firestore or Storage):** ship emulator tests that cover both the allowed path and the denied path, and pass them before review. A rules change without emulator evidence is not ready. Storage PR #2 is the reference pattern (`npm run test:storage-rules`, 11/11 passing).

**P0 — before any rules change (safety + visibility)**
1. Land this remediation PR (temp rules removed, real `typecheck`, CI env documentation).
2. Complete console checks R1–R7; record aggregate counts in a dated doc.
3. Add error/empty states (Group H) so rules denials are diagnosable.

**P1 — identity, Storage, and live profile privacy verification (one window)**
4. Group E: uid-keyed `user_roles` migration (dry-run → owner approval), update `useAdminAccess` + `storageService`, verify founder admin write (approve/feature) works.
5. Group G: Storage rules scoped to `resource-images/`, admin-gated create/update, deletion denied; emulator tests pass; verify admin upload and non-admin denial in a staging project (Hosting preview channels do not deploy Storage rules) before deploy.
6. **Bring live profile privacy verification forward (R5):** signed-out and signed-in walkthrough of `/community`, `/blog`, `/resources` to confirm which author names/avatars currently depend on public profile reads. Record the decision (denormalize author fields vs split sensitive fields out of `profiles`) before any profile-rule change. Do not lock `profiles` until the chosen path is proven.

**P2 — schema normalization before visibility rules**
7. Normalize `resources` field names + `'5-7'` → `'4-7'` + `is_featured` (dry-run, backup snapshot, owner approval).
8. Ensure every `resources` doc has explicit `is_approved`; every `blog_posts` doc explicit `is_published`; every comment/review explicit `is_approved`.
9. Group A + B rules; add server-side `where` clauses in `resources.ts` / `blog.ts`; verify public pages and admin tabs with emulator tests.

**P3 — writes: authorization first, consistency second**
10. Group C authorization: force `is_approved: false` on create in code and rules; owner-update whitelists; rating range; remove caller-controlled approval; verify moderation flow.
11. Group D authorization: decide who may write trusted counters (ordinary clients only submit deltas, or aggregates move to trusted code). Then add transactions/increments for the aggregates that remain client-written. Do not treat a transaction as an authorization control.

**P4 — profile data model implementation**
12. Group F: implement the P1 decision (denormalize author fields or split sensitive fields), then lock `profiles`; verify signed-out author names and sign-in profile creation/resolution.

**P5 — cross-cutting verification**
13. Each rules PR already carries emulator tests; this phase adds the live click-through checklist and a final full rules-test pass. Deploy only **with owner approval**.

**Rollback:** every rules deploy is preceded by `git tag`/commit + exported copy of the current deployed rules; reverting is `git revert` + redeploy of the prior rules file. No data migrations without a pre-run snapshot JSON.

---

## 5. Explicitly out of scope in this PR

- No changes to `firestore.rules` or `storage.rules` contents.
- No Firebase deploys (hosting, rules, storage, indexes).
- No production data reads/writes or migrations.
- No DNS/domain/Cloudflare changes.
- No GitHub Actions workflow yet (env variables documented separately).
