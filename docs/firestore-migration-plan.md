# Firestore Backend Status

## Runtime
- Backend provider is Firebase only.
- Auth: Firebase Auth
- Database: Firestore
- Storage: Firebase Storage

## Required environment variables
Frontend (`.env`)
- `VITE_BACKEND_PROVIDER=firebase`
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Migration/admin (`.env.migration`)
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

## Validation checklist
1. Resource directory and resource detail render and load data.
2. Resource comments/reviews create successfully.
3. Blog list/post/comments load and comment creation works.
4. Community feed/replies/leaderboard load and post/reply creation works.
5. Admin management actions work for resources and community moderation.

## Quick health commands
- Validate build: `npm run build`
- Validate app routes quickly: `npm run smoke:routes`
- Validate Firebase Auth API key in `.env`: `npm run check:firebase-key`
- Full smoke flow: `npm run audit:smoke`

## Preview deployment
Use a fresh preview channel after major bundle changes to avoid stale chunk caching:
- `firebase hosting:channel:deploy preview-fix --project kids-ai-resources`

## Notes
- Supabase runtime dependencies and adapters have been removed.
- Any historical Supabase-to-Firebase data import should now be handled outside this repo.
