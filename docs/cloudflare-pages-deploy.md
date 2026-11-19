# Cloudflare Pages Deployment Workflow (manual)

**Status:** Draft PR. **No deployment performed.** This workflow is `workflow_dispatch`-only: it never runs automatically and changes no DNS or Cloudflare settings until the owner triggers it.

## What it does

`.github/workflows/cloudflare-pages-deploy.yml`:

1. Takes an **approved `main` commit SHA** as an input (must be an ancestor of `main`).
2. Locates the **successful Build workflow run** for that exact commit and downloads its `dist-<sha>` artifact (the artifact produced by `Build`, containing the embedded `COMMIT_SHA` stamp).
3. Verifies the artifact: `COMMIT_SHA` must match the requested commit; no `__identity-probe` route or `VITE_FIREBASE_USE_EMULATOR` flag may exist in the bundle.
4. Deploys `dist/` to the **Cloudflare Pages Direct Upload project** with wrangler (`pages deploy dist --branch=main`), using a Pages Edit token.

## Settings the owner must add (one-time)

All values live on the **`cloudflare-pages` environment** (Settings → Environments → cloudflare-pages) — the deploy job is scoped to it. No placeholders have been added; the environment is empty until the owner fills it in.

| Where | Name | Value / source |
|---|---|---|
| **Environment secret** (cloudflare-pages) | `CLOUDFLARE_PAGES_EDIT_TOKEN` | Cloudflare API token with **Account → Cloudflare Pages → Edit** scoped to the target account (and optionally only the specific Pages project). Create in Cloudflare → My Profile → API Tokens. |
| **Environment variable** (cloudflare-pages) | `CF_PAGES_PROJECT_NAME` | The **Pages Direct Upload project name** (Cloudflare → Workers & Pages → the project). |
| **Environment variable** (cloudflare-pages) | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare **Account ID** (shown in the Pages project overview). |
| Repo **Environments** | `cloudflare-pages` | Optionally add **required reviewers** — the workflow targets this environment, so deployments get a second human gate even when triggered manually. |

The job fail-fasts if either environment variable is missing; a missing token fails at the deploy step (secrets cannot be inspected from Actions).

## Running it

1. Make sure the **Build** workflow has run successfully on `main` for the approved commit (it produces `dist-<sha>` on every `push` to `main`).
2. Actions → **Cloudflare Pages deploy** → **Run workflow** → enter the full commit SHA.
3. The job verifies the commit is on `main`, downloads and re-verifies the artifact, then deploys.

## pages.dev verification steps (after the owner's first run)

1. Read the wrangler output in the run log: it prints the deployment URL `https://<hash>.<project>.pages.dev` and, for the production branch, the alias `https://<project>.pages.dev`.
2. `curl -s https://<project>.pages.dev/ | grep -o 'assets/index-[^"]*\.js'` — the bundle hash must match the verified artifact (`dist-<sha>`).
3. `curl -s https://<project>.pages.dev/COMMIT_SHA` — must equal the approved commit SHA.
4. Open the site signed-out: public author names render (blog/community); `/resources` loads live Firebase data.
5. `curl -s -o /dev/null -w "%{http_code}" https://<project>.pages.dev/__identity-probe` — the SPA serves 200 (shell) but the route must render the 404 "non-existent route" screen; there must be **no probe UI**.
6. Browser console: no errors; network hosts only `*.pages.dev` and the production Firebase endpoints (no emulators).

## Out of scope

- No DNS record changes, no custom-domain attachment in Cloudflare, no automatic deploys on push.
- The production Firebase target is unchanged; this only publishes the static bundle to Cloudflare Pages.
