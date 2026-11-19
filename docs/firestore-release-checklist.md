# Firebase Release Checklist — Firestore Profile Privacy (kids-ai-resources)

**Status:** Pre-merge review copy. **Nothing in this checklist has been executed against production.**

## 1. Review inputs

| Item | Value |
|---|---|
| PR | #4 `privacy/firestore-profile-reads` (draft → ready for review) |
| Review head | see PR #4 (updated after the checklist tooling landed) |
| Base | `main` @ `992828c640a8633ac87b609f1ae53cd80e2295b8` (unchanged at review time) |
| Checks | none — the build workflow ships in PR #3; once PR #3 is merged, PR #4 should get `Build` + `Typecheck` checks on the next update |
| Review threads | none open |
| Typecheck | 167 pre-existing `main` errors, unchanged by this PR; stays red in CI by design |
| Emulator suites | `test:profile-rules` 33/33, `test:profile-release` 15/15 (published rules → proposed rules), `test:backfill` 4/4 (incl. malformed-value regressions) |

Merge order note: PR #2 (Storage), PR #3 (build workflow), and PR #4 each touch `package.json`/`firebase.json`; expect small conflicts. PR #4 does not depend on either; rerun `test:profile-rules`, `test:profile-release`, and `test:backfill` after any rebase.

## 2. What gets published

| Artifact | Identification |
|---|---|
| **Firestore ruleset** | `firestore.rules` at the review head. Diff vs live is limited to: `matchesProfileUser` requiring `email_verified`, the `profiles` get/list/update rework, and the new `public_profiles` match. No other collection's rules change. |
| **Live ruleset (rollback reference)** | `projects/kids-ai-resources/rulesets/c3fd3010-125f-47ec-bec8-f35d923039d1` (updated 2026-03-11) — never republished for rollback (it makes profiles public). |
| **Frontend artifact** | Built from the same review head with production `VITE_FIREBASE_*` values. Preferred: the GitHub Actions build artifact (`dist-<github.sha>`, includes `COMMIT_SHA`) from PR #3's workflow on the merged `main` push. Fallback: `npm run build` from the review commit with production env. **`VITE_FIREBASE_USE_EMULATOR` must never be set.** |
| **Not in this release** | Storage rules (PR #2) publish separately; no Hosting/DNS change in this checklist beyond deploying the frontend. |

## 3. Read-only pre-publication verification (no rules touched)

Owner, Admin SDK; counts only — no emails or user records are printed.

```sh
npm run verify:public-profiles
```

Expected clean state before publication:

| Output line | Requirement |
|---|---|
| `profiles missing projection: 0` | every profile has a projection |
| `projections with unexpected fields: 0` | only `username`, `display_name`, `avatar_url` exist |
| `projections with non-string username/display_name/avatar_url: 0` | string-only value contract |
| `projections missing/blank username: 0` | name fields renderable |
| `projections missing/blank display_name: 0` | name fields renderable |
| `projections missing/blank avatar_url` | informational only (UI falls back to initials) |
| `orphan projections (no source profile)` | informational only (sanitized by the backfill; UI ignores) |
| `content author references missing projection: 0` | blog/community/reviews/comments authors covered |

If repair counts are non-zero:

```sh
npm run backfill:public-profiles            # dry run (default)
npm run backfill:public-profiles -- --apply # transaction-safe; safe while users edit
npm run verify:public-profiles              # re-check
```

Also verify, still before publication:

- [ ] New frontend deployed and actually served (hashed bundle check; `index.html` is no-cache, open tabs need a reload).
- [ ] Signed-out (incognito): Home, `/resources`, a resource detail page, `/blog`, `/blog/<post>`, `/community` — author names/avatars render, no `Anonymous` regression.
- [ ] Emulator suites green on the exact rules file being published.

## 4. Publication

```sh
firebase deploy --only firestore:rules   # publishes the head ruleset
```

Verify **immediately after** (each item has an emulator-proven equivalent):

- [ ] Signed-out full-profile read denied; public projection still readable.
- [ ] Public author rendering intact (`/blog`, `/blog/<post>`, `/community`).
- [ ] **UID-keyed owner** (unverified email): sign in, load own profile, edit profile + projection refresh, post with own `uid` author id.
- [ ] **Verified legacy owner:** legacy id resolves via the verified email; edit profile + projection refresh; post with the legacy `author_id`.
- [ ] Unverified legacy owner: posting with the legacy `author_id` is denied (expected; owner re-verifies email or uses the uid path).
- [ ] Ordinary signed-in user: cannot read another full profile; can still post/comment/review.
- [ ] Admin: dashboard counts and private reads still work.
- [ ] Stale frontend: old cached bundles degrade to Anonymous/fallback names until reload; no page-breaking errors.

## 5. Rollback (verified to keep full profiles private)

- **Never** republish the pre-lockdown ruleset `c3fd3010…` — that re-exposes full profiles.
- Rules fault: revert only the rules file to this PR's previous state (owner/admin reads + public projection) and redeploy `--only firestore:rules`. Full profiles stay private; public projection stays readable.
- App/projection fault: redeploy the last known-good frontend and repair projections with the backfill (transaction-safe, idempotent). Do not loosen rules.
- Acceptable degraded states while profiles stay private: `Anonymous`/fallback author names (stale tab, blank field), missing avatars (initials fallback).
- After any rollback, re-run `npm run verify:public-profiles` and confirm the signed-out denial with an incognito check.

## 6. Stop conditions

- Do not publish rules until every pre-publication box is checked and repair counts are 0.
- Do not run the production backfill or verification against production before owner approval.
- No Hosting, Cloudflare, or DNS changes in this checklist; no Storage rules publication.
