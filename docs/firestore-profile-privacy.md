# Firestore Profile Privacy — Owner/Admin Reads + Public Projection

**Date:** 2026-11-19
**Status:** Draft PR. **Rules are not published and no data is migrated.** Live Firestore rules still allow public reads of full `profiles` documents.

## 1. Why

Published Firestore rules currently contain:

```
match /profiles/{profileId} {
  allow read: if true;
  ...
}
```

That exposes **every field** of every profile document to signed-out visitors, including `email` and any other private fields. Firestore rules are document-level; they cannot hide individual fields on a public read. The safe fix is a separate public projection.

## 2. Every client read of `profiles` (trace)

| Location | Purpose | New access path |
|---|---|---|
| `src/services/backend/blog.ts` — `getBlogPostsFromBackend`, `getBlogPostBySlugFromBackend`, `getBlogCommentsFromBackend` | Blog post/comment author names | `public_profiles` (fallback to `profiles` during rollout) |
| `src/services/backend/community.ts` — `getCommunityPostsFromBackend`, `getCommunityRepliesFromBackend` | Community author names and avatars | `public_profiles` |
| `src/services/backend/community.ts` — `getCommunityUsersFromBackend`, `getLeaderboardFromBackend` | Public member directory / leaderboard | `public_profiles` list |
| `src/services/backend/resources.ts` — `getResourceReviewsFromBackend`, `getResourceCommentsFromBackend` | Reviewer/commenter display names | `public_profiles` |
| `src/services/backend/auth.ts` — `ensureProfileDocument` | Finds a profile by the signed-in email; syncs the projection | `profiles` list constrained to own email (owner) |
| `src/services/backend/auth.ts` — `resolveDataUserId` | Maps auth uid → legacy profile id by email | `profiles` list constrained to own email (owner) |
| `src/services/backendService.ts` — `getProfile`, `updateProfile` | Current user's account profile; update syncs projection | Owner read/write |
| `src/hooks/useAuth.ts` | Loads the signed-in user's own profile | Owner read |
| `src/services/backend/admin.ts` — `getAdminCounts` | Admin dashboard user count | Admin list |
| Admin blog/community screens | Author display via the blog/community services | `public_profiles` |

No component reads `profiles` directly; all reads go through these services.

## 3. Data shape

New collection: `public_profiles/{profileId}` (same document id as the profile).

Allowed fields only:

- `username`
- `display_name`
- `avatar_url`
- `bio`
- `created_at`
- `updated_at`

`email` and any other field are rejected by rules (`keys().hasOnly([...])`).

Writes:

- `ensureProfileDocument` creates/syncs the projection on every sign-in (incremental repair).
- `updateProfile` re-syncs after a profile update.
- `scripts/backfill-public-profiles.mjs` is a **dry-run-by-default** owner tool for existing accounts. It is not executed by this PR.
- `src/services/backend/publicProfiles.ts` centralizes reads, the rollout fallback, and safe field picking.

## 4. Rules change

`profiles/{profileId}`:

- `get`: owner (uid match, or legacy doc whose `email` equals the caller's token email) or admin.
- `list`: admin, or a signed-in owner querying their **own email** (preserves legacy id resolution).
- `create`: signed-in user creating their own uid-keyed document.
- `update`: owner (uid or verified email match) or admin.
- `delete`: admin.

`public_profiles/{profileId}`:

- `read`: public.
- `create`/`update`: owner or admin, restricted to the six public fields.
- `delete`: admin.

No other rules were changed. `matchesProfileUser()` already existed and is reused for owner checks.

## 5. Emulator tests

Command:

```sh
npm run test:profile-rules
```

Runs `firebase emulators:exec --only firestore --project demo-kids-ai` with `tests/firestore.profile-rules.test.mjs`.

Result: **19/19 passing.**

| # | Case | Result |
|---|---|---|
| 1 | Signed-out cannot read a full profile | PASS |
| 2 | Signed-out cannot list profiles | PASS |
| 3 | Signed-out can read a public profile; no `email` returned | PASS |
| 4 | Signed-out can list public profiles (author names) | PASS |
| 5 | Ordinary user cannot read another user's full profile | PASS |
| 6 | Ordinary user cannot list all profiles | PASS |
| 7 | Ordinary user cannot query another profile by email | PASS |
| 8 | Ordinary user cannot update another profile | PASS |
| 9 | Owner can read own full profile | PASS |
| 10 | Legacy owner can read a profile keyed by a different id via email | PASS |
| 11 | Owner can list own profile by email constraint | PASS |
| 12 | Owner can update own profile | PASS |
| 13 | Admin can read any full profile | PASS |
| 14 | Admin can list all full profiles | PASS |
| 15 | Owner can write own public projection | PASS |
| 16 | Public projection rejects `email` | PASS |
| 17 | Ordinary user cannot write another public projection | PASS |
| 18 | Signed-out cannot write a public projection | PASS |
| 19 | Admin can write any public projection | PASS |

## 6. Release sequence for the currently live frontend

The live bundle reads `profiles` directly. Publishing the rules first would break public author names for every visitor still running it. Do **not** publish rules until the new bundle is live and the projection is backfilled.

1. **Merge this PR. Do not publish rules.**
2. **Deploy the new frontend** (dual-write + `public_profiles` reads with fallback). Live rules are unchanged, so both old and new bundles keep working.
3. **Backfill existing profiles** (owner, Admin SDK):
   ```sh
   npm run backfill:public-profiles            # dry run
   npm run backfill:public-profiles -- --apply # write projections
   ```
   This only creates `public_profiles`; it does not modify `profiles`.
4. **Verify completeness:** public-profile count should equal the profile count (aggregate counts only; do not dump user records).
5. **Verify public flows** signed-out (incognito): Home, `/resources`, a resource detail page, `/blog` and `/community` author names/avatars. No "Anonymous" regression.
6. **Confirm the new bundle is actually served.** `index.html` is `no-cache`, but an already-open SPA tab keeps the old JS until reload. Announce the change or wait for sessions to refresh.
7. **Publish Firestore rules** only after steps 4–6. Capture the current ruleset for rollback: `projects/kids-ai-resources/rulesets/c3fd3010-125f-47ec-bec8-f35d923039d1`.
8. **Verify signed-in flows:** owner loads their profile (including a legacy id resolved by email); profile updates still save and refresh `public_profiles`; admin dashboard counts and admin-only reads work.
9. **Verify ordinary users:** cannot read another full profile, but can still create reviews/comments/posts (those rules use `matchesProfileUser`).
10. **Rollback:** republish the previous Firestore ruleset. No data rollback is needed; `public_profiles` can remain in place.

Residual window: after step 7, a visitor still running the old bundle in an open tab will fail `profiles` reads and may see fallback/Anonymous names until reload. Step 6 minimizes this; publishing during low traffic further reduces it.

## 7. Out of scope

- No rules publication in this PR.
- No production data migration, backfill execution, or user-record reads.
- No change to Storage rules, Hosting, DNS, or Cloudflare.
- No changes to review/comment/post authorization semantics.
- Missing-resource detail page behavior is a separate follow-up (tracked on the CI PR).
