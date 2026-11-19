import { readMany, readOneById, upsertOne } from './firestoreDb';
import { logger } from '@/lib/logger';

type BackendRow = Record<string, unknown>;

/**
 * Fields that the public UI actually renders (author/member name and avatar).
 * Never add `email`, `bio`, timestamps, or any other field here; Firestore
 * rules reject anything outside this list.
 */
const PUBLIC_PROFILE_FIELDS = [
  'username',
  'display_name',
  'avatar_url',
] as const;

const toPublicProfile = (id: string, profile: BackendRow): BackendRow => {
  const output: BackendRow = { id };
  for (const field of PUBLIC_PROFILE_FIELDS) {
    if (profile[field] !== undefined && profile[field] !== null) {
      output[field] = profile[field];
    }
  }
  return output;
};

/**
 * Reads the public projection first. Falls back to the full profile document
 * during the rollout window, before `public_profiles` is backfilled and before
 * the full `profiles` collection is locked down. After rules are published the
 * fallback is denied and simply returns null for non-owners.
 */
export const getPublicProfile = async (id: string): Promise<BackendRow | null> => {
  if (!id) return null;

  try {
    const publicProfile = await readOneById('public_profiles', id);
    if (publicProfile) return publicProfile;
  } catch {
    // Public projection unavailable; try the rollout fallback below.
  }

  try {
    const fullProfile = await readOneById('profiles', id);
    return fullProfile ? toPublicProfile(id, fullProfile) : null;
  } catch {
    return null;
  }
};

export const getPublicProfilesMap = async (ids: string[]) => {
  const map = new Map<string, BackendRow | null>();
  await Promise.all(
    [...new Set(ids.filter(Boolean))].map(async (id) => {
      map.set(id, await getPublicProfile(id));
    }),
  );
  return map;
};

/**
 * Lists the public projections. During rollout it merges any profiles that do
 * not have a public document yet (when the caller is still allowed to list
 * `profiles`). After lockdown only `public_profiles` is readable.
 */
export const getAllPublicProfiles = async (): Promise<BackendRow[]> => {
  let publicRows: BackendRow[] = [];
  try {
    // Public projections do not carry `created_at`, so list without orderBy
    // (an orderBy on a missing field would silently drop every document).
    publicRows = await readMany('public_profiles');
  } catch {
    // Signed-out or ordinary callers may not list the projection yet.
  }

  let fullRows: BackendRow[] = [];
  try {
    fullRows = await readMany('profiles', {
      orderBy: { field: 'created_at', direction: 'desc' },
    });
  } catch {
    // Expected after `profiles` is locked down; public rows are enough.
  }

  const merged = new Map<string, BackendRow>();
  for (const row of publicRows) {
    merged.set(String(row.id), row);
  }
  for (const row of fullRows) {
    const id = String(row.id);
    if (!merged.has(id)) merged.set(id, toPublicProfile(id, row));
  }

  return [...merged.values()].sort((a, b) =>
    String(b.created_at || '').localeCompare(String(a.created_at || '')),
  );
};

/**
 * Writes the safe projection for a profile. Failure is logged but does not
 * break the profile write; the owner can repair projections via the backfill.
 */
export const syncPublicProfile = async (id: string, profile: BackendRow) => {
  if (!id) return;
  try {
    const payload = toPublicProfile(id, profile);
    delete payload.id;
    await upsertOne('public_profiles', id, payload);
  } catch (error) {
    logger.warn('Failed to sync public profile', id, error);
  }
};
