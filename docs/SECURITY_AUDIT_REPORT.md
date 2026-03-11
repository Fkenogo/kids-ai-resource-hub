# Security Audit Report

Date: 2026-03-11
Repository: `kids-ai-resource-hub`
Branch audited: `main`
Tags present: none

## Executive Summary

This audit found no confirmed hardcoded third-party API secrets in tracked application source files. The main risks were local secret-bearing files in the repository root and weak script-side environment handling for Firebase Admin operations.

Confirmed high-risk items:

- Local `.env` contains real Firebase web config and Firebase Admin credential material. It is currently ignored by Git and was not found in commit history.
- Local `kids-ai-resources-firebase-adminsdk-fbsvc-f00c465b43.json` contains a real Firebase service account private key. It is currently ignored by Git and was not found in commit history.

Code/config risks fixed in this pass:

- Standardized environment loading for Node scripts.
- Separated server/admin config from client-prefixed `VITE_*` usage where it mattered.
- Added `.env.example` with placeholders only.
- Tightened `.gitignore` for common key/cert/service-account files.
- Added a lightweight secret scan script and pre-commit hook stub.

Git history result:

- No committed `.env`, `.env.local`, `.env.example`, `.env.migration`, or Firebase service-account JSON files were found in history.
- No exact match for the current local Firebase API key or Admin SDK private-key-related values was found in Git history.
- Public Firebase identifiers such as `projectId` and `authDomain` do appear in docs/history; those are expected and not secrets by themselves.

## Findings By File

| File | Issue Found | Severity | Why It Is A Problem | Fix Applied | Rotate Now |
| --- | --- | --- | --- | --- | --- |
| `.env` (local, ignored, untracked) | Real Firebase web config plus Firebase Admin credential material stored in a repo-root env file | High | Admin SDK values are sensitive and should not live in tracked source or be casually shared from the repo root | Added `.env.example` placeholders only, standardized env loading, and documented server/admin variable separation; no real secret values were committed to source | Yes, rotate Admin SDK credentials if this file was ever shared outside the machine |
| `kids-ai-resources-firebase-adminsdk-fbsvc-f00c465b43.json` (local, ignored, untracked) | Real Firebase service-account private key file present inside repository directory | Critical | Service-account JSON grants privileged backend access; storing it under the repo root raises accidental commit and exfiltration risk | Added stronger ignore patterns for service-account JSON and documented external-path usage via `GOOGLE_APPLICATION_CREDENTIALS` in `.env.example` | Yes, rotate immediately if this file was ever uploaded, copied, or shared |
| `scripts/admin-upload-resources.mjs` | Server-side script used mixed client/server env naming and assumed Admin SDK values from process env without shared validation | Medium | Mixing `VITE_*` client config into admin scripts makes secret boundaries unclear and encourages unsafe env reuse | Refactored to shared env loader and server-only Admin SDK helpers in `scripts/lib/env.mjs` | No new rotation triggered by code, but current Admin credentials should still be treated as sensitive |
| `scripts/upload-resources-admin.mjs` | Manual `.env` parsing and server-side dependence on `VITE_FIREBASE_PROJECT_ID` | Medium | Manual parsers drift, bypass precedence rules, and make accidental secret handling harder to audit | Refactored to shared env loader and `FIREBASE_PROJECT_ID` fallback handling | No |
| `scripts/upload-resources.mjs` | Manual `.env` parsing | Low | Inconsistent env loading increases configuration mistakes and weakens auditability | Refactored to shared env loader and centralized Firebase web-config helper | No |
| `scripts/bulk-upload-resources.mjs` | No centralized env validation/loading | Low | Weak config hygiene; easier to run with partial or wrong config | Refactored to shared env loader and centralized Firebase web-config helper | No |
| `scripts/test-firestore-upload.mjs` | No centralized env validation/loading | Low | Same configuration drift risk as above | Refactored to shared env loader and centralized Firebase web-config helper | No |
| `scripts/check-firebase-key.mjs` | Custom env file parser | Low | Duplicate parsing logic can mishandle quoting and precedence | Refactored to shared env loader and required-var helper | No |
| `scripts/seed-firestore.mjs` | Relied on external env setup without loading local env files when run directly | Low | Easy to misconfigure and harder to run safely in a controlled way | Updated to use shared env loader | No |
| `.gitignore` | Did not explicitly ignore common key/cert/service-account filename patterns beyond one Firebase-specific pattern | Medium | Developers could accidentally add additional cert/key formats or generic service-account filenames | Added `*.pem`, `*.p12`, `*.pfx`, and `*service-account*.json` ignore rules | No |
| `docs/admin-resource-upload-instructions.md` | Placeholder private-key example string appears in docs | Informational | Secret scanners can flag placeholder examples even when they are not real secrets | No content change; scanner now allows documented placeholder context instead of muting real exposures globally | No |

## Safe Public Config vs Sensitive Values

Safe to expose in frontend/Vite config:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Why: Firebase web config identifies the client app and is designed to be shipped to the browser. It still requires proper Firebase Auth, Firestore, and Storage rules.

Sensitive and must remain server-only:

- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_CLIENT_X509_CERT_URL`
- Any service-account JSON referenced by `GOOGLE_APPLICATION_CREDENTIALS`

## Fixes Applied

Changed files:

- `.env.example`
- `.gitignore`
- `.githooks/pre-commit`
- `package.json`
- `scripts/lib/env.mjs`
- `scripts/scan-secrets.mjs`
- `scripts/check-firebase-key.mjs`
- `scripts/upload-resources.mjs`
- `scripts/bulk-upload-resources.mjs`
- `scripts/test-firestore-upload.mjs`
- `scripts/upload-resources-admin.mjs`
- `scripts/admin-upload-resources.mjs`
- `scripts/seed-firestore.mjs`

What changed:

1. Added a shared env loader in `scripts/lib/env.mjs` so scripts consistently load `.env`, `.env.local`, and `.env.migration` with shell env taking precedence.
2. Added `.env.example` with placeholders only and explicit separation between public Vite config and sensitive admin config.
3. Refactored Firebase-related Node scripts to consume shared helpers instead of duplicating ad hoc `.env` parsing.
4. Updated admin-side script handling to prefer `FIREBASE_PROJECT_ID` for server/admin usage, with compatibility fallback from `VITE_FIREBASE_PROJECT_ID` where needed.
5. Added `npm run scan:secrets` plus `.githooks/pre-commit` as a lightweight safeguard.
6. Tightened `.gitignore` for service-account files and common certificate/key formats.

## New Env Variables Added / Standardized

Required frontend/runtime variables:

- `VITE_BACKEND_PROVIDER`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

Required server/admin variables:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_PRIVATE_KEY_ID`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_CLIENT_ID`
- `FIREBASE_CLIENT_X509_CERT_URL`

Optional server/admin alternative:

- `GOOGLE_APPLICATION_CREDENTIALS`

Optional utility variables:

- `SMOKE_HOST`
- `SMOKE_PORT`

## Keys That Must Be Rotated Now

Rotate immediately if there is any chance the files were ever shared, synced, uploaded, or copied outside this machine:

- Firebase Admin SDK private key in local `.env`
- Firebase service-account JSON in `kids-ai-resources-firebase-adminsdk-fbsvc-f00c465b43.json`

Lower urgency:

- Firebase web API key in local `.env` is normally public config, not a server secret. Rotation is only needed if you want to reduce abuse after accidental misuse or if the key lacks domain/app restrictions.

## History Cleanup Recommendation

Current result:

- No confirmed secret-bearing env files or service-account JSON files were found in Git history.
- No exact match for the current local Firebase API key or Admin credential values was found in Git history.

Because of that, history rewrite is not currently required.

If a real secret is later confirmed in history:

- Prefer `git filter-repo` over BFG for precise removal and better auditability.
- Rewrite every affected branch and tag before force-pushing.
- Coordinate force-pushes carefully with any collaborators and CI systems.

## Verification

Completed:

- `npm run scan:secrets`
- `npm run build`
- `node --check` on the modified Node scripts

## Follow-Up Recommendations

1. Move the local service-account JSON outside the repository directory and use `GOOGLE_APPLICATION_CREDENTIALS` to point to that external path.
2. Replace any repo-root `.env` that contains Admin SDK secrets with `.env.local` and/or `.env.migration` depending on workflow, keeping only placeholders in tracked files.
3. Rotate the current Firebase Admin credentials if there is any doubt about prior sharing.
4. Enable the hook with `git config core.hooksPath .githooks` so `pre-commit` runs automatically.
5. Review Firebase Security Rules and API key restrictions separately; this audit focused on secret exposure and config hygiene, not runtime authorization strength.
