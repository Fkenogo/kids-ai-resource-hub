# Firebase Runtime Verification (Post-Migration)

## What was verified
1. Static correctness checks:
- `npm run lint` (passes with warnings only)
- `npx tsc --noEmit` (passes)
- `npm run build` (passes)
 - `npm run smoke:routes` (passes for `/`, `/login`, `/signup`, `/resources`, `/resources/r_teachable_machine`, `/blog`, `/community`, `/shopping`, `/admin`)
2. Runtime auth consistency:
- New Firebase users now get a `profiles/{uid}` document automatically after sign up/sign in/OAuth sign in.

## Functional smoke checklist to run locally
1. Auth:
- Sign up (email/password) creates account and profile.
- Sign in (email/password) succeeds.
- OAuth sign in (Google/GitHub) succeeds.
- Sign out works.
2. Resources:
- Resource directory loads approved resources.
- Resource detail page loads.
- Add comment and review as authenticated user.
3. Blog:
- Blog list loads.
- Blog post loads by slug.
- Comment submission works.
4. Community:
- Posts list loads.
- Reply list loads.
- Create post and reply works.
- Like/save/view engagement updates.
5. Admin:
- Admin access check works for `user_roles`.
- Resource approve/feature/delete/edit works.
- Community pin/lock/delete works.

## Known deployment blockers to confirm in Firebase console
1. Firestore Rules:
- Ensure your rules allow the current client write patterns for:
  - `profiles`, `resource_comments`, `resource_reviews`, `blog_comments`, `community_posts`, `community_replies`, `user_engagements`.
2. Firestore Indexes:
- Create composite indexes for multi-field equality queries, especially:
  - `user_engagements`: `user_id`, `target_type`, `target_id`, `engagement_type`
  - `resource_reviews`: `resource_id`, `user_id`
  - `blog_posts`: `slug`
  - `profiles`: `email`
3. Storage Rules:
- Ensure uploads for resource/blog images are allowed for authenticated users and blocked for anonymous users.
4. Firebase Web API key restrictions:
- Keep the app using the Firebase auto-created web key.
- After deployment is stable, set application restriction to `Websites` and allow:
  - `http://localhost`
  - `http://localhost:*`
  - `http://127.0.0.1`
  - `http://127.0.0.1:*`
  - `https://kids-ai-resources.web.app`
  - `https://kids-ai-resources.firebaseapp.com`
  - `https://*--kids-ai-resources.web.app` (preview channels)
- Keep API restrictions compatible with Firebase Auth (`Identity Toolkit API`), or use `Don't restrict key` if troubleshooting.

## Repository config added
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `storage.rules`

### Important role-model requirement
- Admin checks in rules use `user_roles/{uid}` where document ID must equal Firebase Auth UID.
- Ensure each admin/moderator role document is stored under that UID and contains `role: "admin"` or `role: "moderator"`.
