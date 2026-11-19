# GitHub Actions Build Environment — Firebase Web Variables

**Date:** 2026-11-19
**Status:** Documentation only. No workflow file is added in this PR; CI wiring and Cloudflare deployment are the next stage.

The app is a Vite SPA. Vite inlines `import.meta.env.VITE_*` values **at build time**, so the CI build needs the Firebase **web** config present in the runner environment before `npm run build`.

These values are the public Firebase client config. They are not secrets in the "can access your database" sense — Firestore/Storage security is enforced by rules, not by hiding this config. They should still be managed as repository **variables** (preferred) rather than committed to the repo.

## Required variables

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

## Where the variables go (when the workflow is added)

- GitHub → repository **Settings → Secrets and variables → Actions → Variables** for the seven `VITE_*` values (public config).
- Use **Secrets** instead only if org policy requires it; either works because Vite inlines them into the public bundle.
- Scope them to the `production` environment if environments are used, so preview builds can point at a different Firebase project later.

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
