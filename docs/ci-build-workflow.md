# GitHub Actions Build Workflow

**Date:** 2026-11-19
**Status:** Draft PR. Build-only. **No deploy, no Firebase rules publication, no DNS/Cloudflare change.**

## Scope

`.github/workflows/build.yml` builds the Vite SPA, smoke-checks the built app, and retains `dist` as an artifact. It deliberately does **not** deploy anywhere. Deployment stays a separate, owner-approved step.

## Triggers

- `pull_request` — build every PR (same-repo branches can read the `production` environment variables).
- `push` to `main` — build the merged baseline.
- `workflow_dispatch` — manual runs.

`concurrency` cancels superseded runs for the same ref.

## Environment and variables

The `build` job uses the GitHub **`production` environment** and reads only the public Firebase web config:

| Variable | Required |
|---|---|
| `VITE_FIREBASE_API_KEY` | Yes |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes |
| `VITE_FIREBASE_PROJECT_ID` | Yes |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes |
| `VITE_FIREBASE_APP_ID` | Yes |
| `VITE_FIREBASE_MEASUREMENT_ID` | Optional |

The workflow fails early with a named error if any required variable is missing. It does not echo values.

**Admin credentials are excluded.** The job maps only `VITE_*` variables. A guard step fails the build if any of `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_CLIENT_X509_CERT_URL`, or `GOOGLE_APPLICATION_CREDENTIALS` is present in the build environment. None are configured.

## Jobs

### `build` — build, smoke, artifact

1. Checkout, Node 22 with npm cache.
2. Verify required web variables; report optional measurement ID as a notice.
3. Guard against Admin credentials.
4. `npm ci`.
5. `npm run build`.
6. `npm run smoke:routes` (starts `vite preview` on `127.0.0.1:4174`, checks `/`, `/login`, `/signup`, `/resources`, `/resources/r_teachable_machine`, `/blog`, `/community`, `/shopping`, `/admin`).
7. `actions/upload-artifact@v4` uploads `dist` as `dist-<sha>`, retention 14 days, fails if the folder is empty.

### `typecheck` — separate, true status

Runs `npm run typecheck` in its own job **without** `continue-on-error`. This keeps the real result visible as a failing check instead of hiding it behind a green build.

Current result on `main`: **167 TypeScript errors** (for example `src/utils/resourceTransform.ts` uses `ageRanges`/`resourceType` while `Resource` declares `age_ranges`/`resource_type`). This PR does not modify `src/` and does not mask the failures. The workflow will therefore show an overall red status until those errors are fixed, while the `build` job can still pass and publish the artifact.

## Local reproduction (2026-11-19)

Run on the workflow branch, Node 22.23.2 / npm 10.9.8, using the same `.env` values that were uploaded to the `production` environment:

| Step | Result |
|---|---|
| `npm ci` | PASS |
| `npm run build` | PASS — 4.72 s, `dist` 3.1 MB / 68 files |
| `npm run smoke:routes` | PASS — 9/9 routes returned 200 with the app shell |
| `npm run typecheck` | FAIL — 167 errors (expected; documented above) |

### Browser validation of the built artifact

Served `dist` with `vite preview` and loaded it in Chromium:

| Route | Result |
|---|---|
| `/` | Rendered full home page with live featured resources from Firebase; no console errors |
| `/resources` | Rendered directory (`AI Learning Resource Directory`) with filters and resource cards; no console errors |
| `/resources/res_teachable_machine` | Rendered detail page (`Google Teachable Machine`, rating, reviews); no console errors |
| `/login` | Rendered login form; no console errors |

All local assets returned 200. Firebase Firestore/Storage requests returned 200, confirming the injected web config works. No authenticated flow was exercised.

**Finding (pre-existing, out of scope):** `/resources/r_teachable_machine` — one of the smoke routes — stays on “Loading resource...” indefinitely because that resource ID does not exist in production; the real ID is `res_teachable_machine`. The smoke check only asserts the app shell, so it still passes. Fix the route fixture or make the detail page show a not-found state in a separate change.

## CI verification

Run on head `aa1de3d` (PR #3, run `44507344381`):

| Job | Result |
|---|---|
| `Build, smoke test, and retain dist` | **SUCCESS** — all steps passed, including smoke and artifact upload |
| `Typecheck (true result; currently fails on main)` | **FAILURE** — 167 errors, visible by design |
| Overall workflow | **FAILURE** (only because of typecheck) |

Artifact uploaded: `dist-<merge-sha>`, 1,157,528 bytes compressed (artifact names now prefer the PR head SHA).

The first CI attempt (`e1c6f28`) hung on the smoke step because the `vite` grandchild process kept the inherited pipes open after `npm` was signalled. `scripts/smoke-routes.mjs` now runs the preview tree in its own process group and escalates `SIGTERM` → `SIGKILL`, so it exits in under 2 s locally and in CI. The hung run was cancelled.

## Owner checks before relying on this workflow

- [ ] Confirm the `production` environment still has the six required web variables (names only; no values displayed).
- [ ] Confirm no Admin credential variables/secrets are added to `production` later; the guard fails the build if they are.
- [ ] Decide when to fix the 167 typecheck errors; until then the workflow conclusion is red even when build and artifact succeed.
- [ ] Replace or remove the stale `/resources/r_teachable_machine` smoke fixture.
- [ ] Keep artifact consumption (download + deploy) in a separate, approved workflow.

## Non-goals

No Firebase rules publish, no Hosting/Cloudflare deploy, no DNS change, no role migration, no IAM change, no production data writes.
