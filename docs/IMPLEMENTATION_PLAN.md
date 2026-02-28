# Implementation Plan: Code Fixes + Data Upload

## Phase 1: Critical Code Fixes ✅ COMPLETED

### 1. Fix Type Inconsistency (Field Naming)

**File:** `src/types/index.ts`

- ✅ Updated Resource type to use snake_case to match Firestore schema
- ✅ Added required fields: `created_at`, `updated_at`, `view_count`, `is_approved`, etc.

### 2. Fix Memory Leak in Auth Module

**File:** `src/services/backend/auth.ts`

- ✅ Added LRU cache with TTL (5 minutes) for `resolvedUserIdByEmail`
- ✅ Implemented max cache size of 100 entries
- ✅ Added cache helper functions: `getFromCache`, `setCache`, `isCacheValid`

### 3. Add Error Boundaries

**Files:**

- ✅ Created `src/components/common/ErrorBoundary.tsx`
- ✅ Updated `src/App.tsx` to wrap application with ErrorBoundary

### 4. Add Missing Firestore Index

**File:** `firestore.indexes.json`

- ✅ Added index for `user_roles` collection by `user_id` field

## Phase 2: Data Upload Preparation ✅ COMPLETED

### 5. Create Field Mapping Script

**File:** `scripts/upload-resources.mjs`

- ✅ Maps JSON camelCase → Firestore snake_case
- ✅ Adds required fields: `is_approved: true`, timestamps, engagement metrics
- ✅ Generates consistent document IDs from titles
- ✅ Uses batch writes for efficiency
- ✅ Checks for existing resources before uploading

### 6. Upload Command

```bash
# Option 1: Client SDK (requires authenticated user)
npm run upload:new

# Option 2: Admin SDK (recommended - bypasses security rules)
# Requires service account key or gcloud authentication
npm run upload:admin-sdk
```

### To Use Admin SDK Script

1. **Option A - Google Cloud CLI:**
   ```bash
   gcloud auth application-default login
   ```
2. **Option B - Service Account:**
   - Download service account JSON from Firebase Console
   - Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
   ```

---

## Execution Status

- [x] 1. Update Resource types to match Firestore schema
- [x] 2. Fix memory leak in auth cache
- [x] 3. Add Error Boundary component
- [x] 4. Add missing Firestore index
- [x] 5. Create data transformation script (client SDK)
- [x] 6. Create Admin SDK script for server-side uploads
