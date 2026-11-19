# GitHub Actions Build Environment — Firebase Web Variables

**Date:** 2026-11-19
**Status:** The six required web variables and the optional measurement ID are configured in the GitHub **`production` environment** (names verified, values not printed). No workflow file is added in this PR; CI wiring and Cloudflare deployment remain the next stage.

The app is a Vite SPA. Vite inlines `import.meta.env.VITE_*` values **at build time**, so the CI build needs the Firebase **web** config present in the runner environment before `npm run build`.

These values are the public Firebase client config. They are not secrets in the "can access your database" sense — Firestore/Storage security is enforced by rules, not by hiding this config. They are managed as environment **variables** scoped to `production`, not committed to the repo.

## Six required web variables (plus optional measurement ID)

| Variable | Required | Source | Notes |
|---|---|---|---|
| `VITE_FIREBASE_API_KEY` | Yes | Firebase console → Project settings → General → Your apps → Web app | Public web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Same | `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Same | `kids-ai-resources` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Same | Modern format: `<project-id>.firebasestorage.app` (older projects may show `.appspot.com` — use exactly what the console shows) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Same | Numeric sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | Same | Web app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Optional | Same | `G-XXXXXXXXXX`; optional in `src/services/backend/firebaseClient.ts:6-22` |

`VITE_BACKEND_PROVIDER` exists in `.env.example` but is **read by nothing** (`src/services/backend/provider.ts` is unused). Omit it.

Do **not** add `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_CLIENT_X509_CERT_URL`, or `GOOGLE_APPLICATION_CREDENTIALS` to the web build. They are Admin SDK credentials used only by local scripts and must never be exposed to the client or the build environment.

## Production environment configuration

- Environment name: **`production`** (GitHub → Settings → Environments).
- Scope: all seven `VITE_FIREBASE_*` values are **environment variables** on `production`, so preview/other environments can point at a different Firebase project later.
- Values are public web config; **Secrets** are not required for these. Use Secrets only if org policy requires it.
- Admin credentials are intentionally absent. Any future CI step that needs them must use a separate, explicitly scoped secret and must never feed the web build.
- Verify names only (never echo values):

```sh
gh api repos/Fkenogo/kids-ai-resource-hub/environments/production/variables -q '.variables[].name'
```

Expected output (order may vary): `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`, `VITE_FIREBASE_MEASUREMENT_ID`.

## Current setup status (2026-11-19)

- Created the `production` environment.
- Added the six required web variables.
- Added the optional measurement ID (a real value was present locally; no placeholder).
- Verified the variable **names** via the GitHub API; no values were printed, logged, or committed.
- Confirmed no Admin credential names (`FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_CLIENT_ID`, `FIREBASE_PRIVATE_KEY_ID`, `FIREBASE_CLIENT_X509_CERT_URL`, `GOOGLE_APPLICATION_CREDENTIALS`) exist in the production environment variables.

## Build contract the next stage should assume

- Node 18+ (project uses Vite 5 / React 18).
- Install: `npm ci` (uses the committed `package-lock.json`). Note: `bun.lockb` also exists; this PR does not remove it — keep `npm ci` for CI to avoid ambiguity, or remove the extra lockfile in a cleanup PR.
- Typecheck: `npm run typecheck` (currently **fails with 167 errors** — see the remediation plan; do not make it a blocking gate until fixed, or gate on "error count does not increase").
- Lint: `npm run lint` (0 errors, 7 warnings).
- Build: `npm run build` → output in `dist/`.
- Smoke: `npm run smoke:routes` (starts `vite preview` on `127.0.0.1:4174`; not suitable for a hosted CI runner without the preview step — useful for local/pre-deploy checks).
- Secret scan: `npm run scan:secrets`.

## Deferred to the next stage

- `.github/workflows/*` creation and branch protection.
- Cloudflare Pages/Workers project, build command, output directory, and environment wiring.
- Custom domain/DNS cutover (`kidsairesources.com`).
- Firebase Hosting changes or rules deploys.
