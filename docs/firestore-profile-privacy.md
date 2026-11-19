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
| `src/services/backend/auth.ts` — `ensureProfileDocument` | Finds a profile by the signed-in email; syncs the projection | `profiles` list constrained to the caller's own **verified** email |
| `src/services/backend/auth.ts` — `resolveDataUserId` | Maps auth uid → legacy profile id by email | `profiles` list constrained to the caller's own **verified** email |
| `src/services/backendService.ts` — `getProfile`, `updateProfile` | Current user's account profile; update syncs projection | Owner read/write |
| `src/hooks/useAuth.ts` | Loads the signed-in user's own profile | Owner read |
| `src/services/backend/admin.ts` — `getAdminCounts` | Admin dashboard user count | Admin list |
| Admin blog/community screens | Author display via the blog/community services | `public_profiles` |

No component reads `profiles` directly; all reads go through these services.

## 3. Verified email for legacy/email access

Legacy profile documents are keyed by an old id, not the auth uid, so email matching grants access to "your own" legacy profile. Email addresses can be changed without verification, so that match now requires a **verified** email:

- `request.auth.token.email_verified == true` is required for:
  - the email branch of legacy-profile ownership (`get`/`update` on a profile keyed by a different id),
  - own-email `profiles` queries (`resolveDataUserId`, `ensureProfileDocument`),
  - public projection writes for legacy-keyed documents.
- **UID-based access is unchanged:** a signed-in user can always read/update their uid-keyed profile and write their own `public_profiles/{uid}` without a verified email.

## 4. Data shape

New collection: `public_profiles/{profileId}` (same document id as the profile).

Fields the public UI actually renders, under a **string-only value contract**:

- `username` — `@member` in the leaderboard; author fallback names — required, non-blank string
- `display_name` — author/member display names — required, non-blank string
- `avatar_url` — community feed and leaderboard avatars — optional string (initials fallback when absent/blank)

`bio`, `created_at`, `updated_at`, `email`, and anything else are rejected by rules (`keys().hasOnly([...])` plus per-field `is string` checks). Non-string or blank values in an allowed field are rejected at write time, flagged by the verifier, and repaired by the backfill (from the profile when the profile value is valid). The UI never renders `bio` or `joinDate` from real data (only mock components do), and timestamps exist only for internal freshness checks — so they stay private.

Writes:

- `ensureProfileDocument` creates/syncs the projection on every sign-in (incremental repair).
- `updateProfile` stamps `updated_at` on the profile and re-syncs the projection.
- `src/services/backend/publicProfiles.ts` centralizes reads, the rollout fallback, and safe field picking.
- `scripts/backfill-public-profiles.mjs` is the **dry-run-by-default** owner tool for existing accounts. It is not executed by this PR.

### Idempotent, concurrency-safe backfill

The script keeps the projection exactly in sync without clobbering fresher writes:

- **Missing projection → write** the three public fields from the profile.
- **Profile fresher than projection** (the later of `profile.updated_at` and the profile's own write time is newer than the projection's write time) → rewrite the projection from the profile.
- **Projection fresher than profile** (a successful app sync writes the projection after the profile's last write) → leave the values untouched; do not overwrite fresher projection data.
- **Unexpected fields** (`email`, `bio`, timestamps, anything else) are **removed** by replacing the document with only the three allowed fields — in every case, including stale/fresher projections and orphaned projections.
- Re-running the script on an already-correct projection reports “already in sync” with no writes (idempotent).
- **Concurrency safety:** with `--apply`, every read+decide+write pair runs inside a Firestore **transaction**. A concurrent profile or projection edit either lands before the transaction reads (and is picked up) or after it commits (and is picked up by the next run); Firestore retries conflicting transactions, so the script never writes a half-mixed projection and never resurrects fields a concurrent edit removed. Dry run stays read-only.
- Dry run is the default; writes only with `--apply`. No emails or user records are printed.
- Emulator verification (`FIRESTORE_EMULATOR_HOST=127.0.0.1:8080`, isolated `demo-kids-ai` data):
  dry run → apply → verify → dry run again:
  | Case | Result |
  |---|---|
  | Missing projection created | `projections to create: 1` |
  | Stale projection overwritten from fresher profile | `updates from fresher profile: 1`; values replaced with profile values |
  | Fresher projection preserved | `kept fresher projection as-is: 1`; values kept |
  | Unexpected `email` removed from a kept-fresher projection | `unexpected fields removed: 2` (fresher case + orphan) |
  | In-sync projection untouched | `already in sync: 1` |
  | Second dry run after apply | `0` creates, `0` updates, `0` fields to remove (idempotent) |
  | **Profile or projection edit during the backfill** (`npm run test:backfill`) | converges to the latest write; no `email` survives; second run reports 0 repairs |

## 5. Rules change

`profiles/{profileId}`:

- `get`: owner (uid match, or legacy doc whose `email` equals the caller's **verified** token email) or admin.
- `list`: admin, or a signed-in owner querying their **own verified email** (preserves legacy id resolution).
- `create`: signed-in user creating their own uid-keyed document.
- `update`: owner (uid or verified email match) or admin.
- `delete`: admin.

`public_profiles/{profileId}`:

- `read`: public.
- `create`/`update`: owner or admin, restricted to `username`, `display_name`, `avatar_url` via `keys().hasOnly([...])`, with the string-only value contract (non-blank name strings; optional `avatar_url` string).
- `delete`: admin.

No other rules were changed. `matchesProfileUser()` now requires the verified email for its email branch; its uid branch is unchanged.

## 6. Emulator tests

Three suites run against the Firestore emulator with the `demo-kids-ai` project:

```sh
npm run test:profile-rules    # access-control matrix
npm run test:profile-release  # release rehearsal: published rules, then proposed rules
npm run test:backfill         # backfill idempotency + concurrent-edit regression
```

A read-only production pre-check is available too: `npm run verify:public-profiles` (Admin SDK; counts only — profiles without projections, projections with unexpected fields, and content author references missing a projection).

### `test:profile-rules` — 33/33 PASS

| # | Case | Result |
|---|---|---|
| 1 | Signed-out cannot read a full profile | PASS |
| 2 | Signed-out cannot list profiles | PASS |
| 3 | Signed-out can read a public profile; no `email`/`bio`/timestamps | PASS |
| 4 | Signed-out can list public profiles (author names) | PASS |
| 5 | Ordinary user cannot read another user's full profile | PASS |
| 6 | Ordinary user cannot list all profiles | PASS |
| 7 | Ordinary user cannot query another profile by email | PASS |
| 8 | Ordinary user cannot update another profile | PASS |
| 9 | **Unverified email cannot claim a legacy profile by matching email** | PASS |
| 10 | **Unverified email cannot run an own-email profile query** | PASS |
| 11 | UID ownership still works without a verified email | PASS |
| 12 | UID ownership still allows updating the own profile without a verified email | PASS |
| 13 | UID ownership still allows writing the own public projection | PASS |
| 14 | **Verified legacy owner can read the legacy profile (regression)** | PASS |
| 15 | **Verified legacy owner can list by own email (regression)** | PASS |
| 16 | Verified legacy owner can update the legacy profile (regression) | PASS |
| 17 | Verified legacy owner can write the legacy projection (regression) | PASS |
| 18 | Owner can read own full profile | PASS |
| 19 | Owner can update own profile | PASS |
| 20 | Admin can read any full profile | PASS |
| 21 | Admin can list all full profiles | PASS |
| 22 | Owner can write own public projection | PASS |
| 23 | Public projection rejects `email` | PASS |
| 24 | **Public projection rejects unrendered fields (`bio`)** | PASS |
| 25 | Ordinary user cannot write another public projection | PASS |
| 26 | Signed-out cannot write public projections | PASS |
| 27 | Admin can write any public projection | PASS |
| 28 | Admin projection writes are also restricted to public fields | PASS |
| 29 | **Projection username must be a string** | PASS |
| 30 | **Projection username cannot be blank** | PASS |
| 31 | **Projection display_name must be a string** | PASS |
| 32 | **Projection display_name cannot be blank** | PASS |
| 33 | **Projection avatar_url must be a string when present** | PASS |

### `test:profile-release` — 15/15 PASS

Release **rehearsal** against the *published* rules first (`tests/fixtures/published-firestore.rules`, captured from the live ruleset), then the *proposed* rules:

**Phase A — published rules (what is true today):**

| # | Case | Result |
|---|---|---|
| 1 | Full profiles are publicly readable (the exposure this PR fixes) | PASS |
| 2 | Author rendering reads full profiles | PASS |
| 3 | Legacy profile read works without a verified email; legacy profile **update** is still denied | PASS |
| 4 | Legacy posting works without a verified email | PASS |

**Phase B — proposed rules (what must be true after publication):**

| # | Case | Result |
|---|---|---|
| 1 | Pre-publication: author coverage — every content author has a projection | PASS |
| 2 | Pre-publication: allowed fields — projections contain only rendered fields | PASS |
| 3 | Post-publication: signed-out full-profile reads denied (UID, legacy, unverified-legacy) | PASS |
| 4 | Post-publication: author rendering works from the public projection | PASS |
| 5 | Post-publication: stale frontend degrades to Anonymous without exposing profiles | PASS |
| 6 | Post-publication: **UID-keyed owner posts and edits without a verified email** | PASS |
| 7 | Post-publication: **verified legacy owner posts and edits via email match** | PASS |
| 8 | Post-publication: unverified legacy owner cannot post with the legacy author id | PASS |
| 9 | Post-publication: admin keeps private reads | PASS |

### `test:backfill` — 4/4 PASS

| # | Case | Result |
|---|---|---|
| 1 | **Profile or projection edit during the backfill**: transaction-safe; converges to the latest write; no private field survives; second run reports 0 repairs | PASS |
| 2 | Dry run stays read-only and reports the same converged state | PASS |
| 3 | **Malformed existing projection (non-string `username` + stray field) is flagged by the verifier and repaired from the profile** | PASS |
| 4 | **Malformed source profile value is dropped and remains flagged for repair** | PASS |

### Built-UI proof against the emulator

`firebaseClient.ts` gained opt-in local plumbing (`VITE_FIREBASE_USE_EMULATOR=true`; never set in production, documented in `.env.example`). The app was built with demo `VITE_FIREBASE_*` config plus the emulator host and served with `vite preview`, pointed at the Firestore emulator seeded with one author and one post:

| Route | Signed-out result |
|---|---|
| `/community` | Rendered the seeded post author (“Public Author”) from `public_profiles`; Firestore traffic hit `127.0.0.1:8080`; no console errors; no `Anonymous` |
| `/blog/emulator-proof-post` | Rendered the post with the author name from `public_profiles`; no console errors |
| `/blog` | Post rendered; author name is not part of the card markup |

This proves the actual signed-out UI reads the public projection. Full-profile denial is proven by the SDK suites; the UI has no code path that reads a full profile while signed out.

## 7. Release sequence for the currently live frontend

The live bundle reads `profiles` directly. Publishing the rules first would break public author names for every visitor still running it. Do **not** publish rules until the new bundle is live and the projection is backfilled.

### Before publication (can be checked without touching rules)

- **Merge this PR; deploy the new frontend** (dual-write + `public_profiles` reads with fallback). Live rules are unchanged, so old and new bundles keep working.
- **Backfill existing profiles** (owner, Admin SDK):
  ```sh
  npm run backfill:public-profiles             # dry run (default, read-only)
  npm run backfill:public-profiles -- --apply  # write projections
  ```
  Transactions make it safe to run while users edit profiles; re-runs are safe.
- **Run the read-only rollout check:**
  ```sh
  npm run verify:public-profiles
  ```
  Repair counts must be **0** before publication: profiles missing projections, projections with unexpected fields, blank `username`/`display_name`, and content author references missing a projection. Blank avatars and orphan projections are informational (graceful degradation). See `docs/firestore-release-checklist.md` for the full checklist.
- **Verify public flows** signed-out (incognito): Home, `/resources`, a resource detail page, `/blog`, `/blog/<post>`, `/community` author names/avatars. No "Anonymous" regression.
- **Confirm the new bundle is actually served.** `index.html` is `no-cache`, but an already-open SPA tab keeps the old JS until reload. Announce the change or wait for sessions to refresh.
- **Confirm the emulator suites and UI rehearsal are green** on the exact rules file being published.

### Immediately after publication (verify while watching)

- **Full-profile denial:** signed-out and ordinary accounts cannot read full `profiles` documents (emulator-proven; confirm with a real ordinary account if desired — no record contents printed).
- **Public author rendering:** `/blog`, `/blog/<post>`, `/community` still show author names/avatars for signed-out visitors (the projection path).
- **UID-keyed owner:** sign in, load own profile, edit profile + projection sync — all without a verified email.
- **Verified legacy owner:** sign in, legacy id resolves via the verified email, profile edit + projection sync, and posting with the legacy `author_id` works.
- **Unverified legacy owner:** posting with the legacy `author_id` is denied (expected; the owner can re-verify email or use the uid path).
- **Admin:** dashboard counts and admin-only profile reads still work.
- **Stale frontend:** visitors on an old cached bundle degrade to Anonymous/fallback names until reload; no errors are thrown that break pages.

### Rollback that keeps full profiles private

- Do **not** republish the pre-lockdown ruleset (`c3fd3010…`); that would make full profiles public again.
- If the rules themselves are faulty, revert only the rules file to the previous state of **this PR** (owner/admin reads + public projection) and redeploy rules. `profiles` stays private.
- If the app/projection breaks, fix or roll back the **frontend** (redeploy the last known-good bundle) and run the backfill to repair projections. Do not loosen rules.
- Author names degrading to "Anonymous" (stale tab, missing projection) is an acceptable degraded state; private profile reads stay denied.

## 8. Out of scope

- No rules publication in this PR.
- No production data migration, backfill execution, or user-record reads.
- No change to Storage rules, Hosting, DNS, or Cloudflare.
- No changes to review/comment/post authorization semantics.
- Missing-resource detail page behavior is a separate follow-up (tracked on the CI PR).
