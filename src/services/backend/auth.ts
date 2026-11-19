import {
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './client';
import { createOne, readMany, readOneById } from './firestoreDb';
import { syncPublicProfile } from './publicProfiles';

export type BackendAuthUser = {
  id: string;
  email?: string | null;
  email_verified?: boolean;
  user_metadata?: Record<string, unknown>;
};

export type BackendAuthSession = {
  user: BackendAuthUser;
} | null;

type AuthListener = (event: string, session: BackendAuthSession) => void;

// LRU Cache with TTL for resolved user IDs
const MAX_CACHE_SIZE = 100;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  value: string;
  emailVerified: boolean;
  timestamp: number;
}

const resolvedUserIdByEmail = new Map<string, CacheEntry>();

const isCacheValid = (entry: CacheEntry, emailVerified: boolean): boolean => {
  // A verification change (unverified -> verified) is an auth transition: the
  // cached uid must not outlive it, or verified users keep authoring as uid.
  if (entry.emailVerified !== emailVerified) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
};

const getFromCache = (email: string, emailVerified: boolean): string | null => {
  const entry = resolvedUserIdByEmail.get(email);
  if (entry && isCacheValid(entry, emailVerified)) {
    return entry.value;
  }
  if (entry) {
    resolvedUserIdByEmail.delete(email); // Expired or verification state changed
  }
  return null;
};

const setCache = (email: string, userId: string, emailVerified: boolean): void => {
  // Implement LRU: remove oldest entry if at capacity
  if (resolvedUserIdByEmail.size >= MAX_CACHE_SIZE) {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;
    
    for (const [key, entry] of resolvedUserIdByEmail.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      resolvedUserIdByEmail.delete(oldestKey);
    }
  }
  
  resolvedUserIdByEmail.set(email, { value: userId, emailVerified, timestamp: Date.now() });
};

const clearAuthCache = (): void => {
  resolvedUserIdByEmail.clear();
};

const mapFirebaseUser = (user: FirebaseUser): BackendAuthUser => ({
  id: user.uid,
  email: user.email,
  email_verified: user.emailVerified,
  user_metadata: {
    display_name: user.displayName || undefined,
    photo_url: user.photoURL || undefined,
  },
});

const ensureProfileDocument = async (user: FirebaseUser) => {
  if (!user.email) return;

  // Verified legacy link first: keeps legacy authorship authoritative for
  // verified users (including users who created a uid profile while their
  // email was unverified). Unverified emails cannot run this query once the
  // rules are published; they fall through to the uid path below.
  try {
    const existing = await readMany('profiles', {
      filters: [{ field: 'email', op: '==', value: user.email }],
    });
    const legacyDoc = existing.find((row) => String(row.id) !== user.uid);
    if (legacyDoc) {
      await syncPublicProfile(String(legacyDoc.id), legacyDoc);
      return;
    }
    const ownDocInResults = existing.find((row) => String(row.id) === user.uid);
    if (ownDocInResults) {
      await syncPublicProfile(user.uid, ownDocInResults);
      return;
    }
  } catch {
    // Unverified email: the legacy query is denied; continue on the uid path
    // so sign-in/sign-up still complete and posting keeps working.
  }

  const ownDoc = await readOneById('profiles', user.uid);
  if (ownDoc) {
    await syncPublicProfile(user.uid, ownDoc);
    return;
  }

  const now = new Date().toISOString();
  const created = await createOne(
    'profiles',
    {
      id: user.uid,
      email: user.email,
      username: (user.displayName || user.email.split('@')[0] || '').toLowerCase(),
      display_name: user.displayName || user.email.split('@')[0] || 'User',
      avatar_url: user.photoURL || null,
      created_at: now,
      updated_at: now,
    },
    user.uid,
  );
  await syncPublicProfile(String(created.id), created);
};

export const getCurrentAuthUser = async (): Promise<BackendAuthUser | null> => {
  const user = auth.currentUser;
  return user ? mapFirebaseUser(user) : null;
};

export const getCurrentAuthSession = async (): Promise<BackendAuthSession> => {
  const user = auth.currentUser;
  return user ? { user: mapFirebaseUser(user) } : null;
};

export const resolveDataUserId = async (user?: BackendAuthUser | null): Promise<string | null> => {
  const currentUser = user || (await getCurrentAuthUser());
  if (!currentUser) return null;
  if (!currentUser.email) return currentUser.id;

  // Use cache helper with TTL
  const cached = getFromCache(currentUser.email, !!currentUser.email_verified);
  if (cached) return cached;

  // Verified legacy link first (deterministic when both a legacy doc and a
  // uid doc share the email), then the uid path for unverified/new accounts.
  try {
    const matches = await readMany('profiles', {
      filters: [{ field: 'email', op: '==', value: currentUser.email }],
    });
    if (matches.length > 0) {
      const legacyDoc = matches.find((row) => String(row.id) !== currentUser.id);
      const id = legacyDoc ? String(legacyDoc.id) : String(matches[0].id);
      setCache(currentUser.email, id, !!currentUser.email_verified);
      return id;
    }
  } catch {
    // Unverified emails cannot run the legacy email query once the rules are
    // published; fall back to the uid so posting/engagements keep working.
  }

  try {
    const ownDoc = await readOneById('profiles', currentUser.id);
    if (ownDoc) {
      setCache(currentUser.email, currentUser.id, !!currentUser.email_verified);
      return currentUser.id;
    }
  } catch {
    // Fall through to the uid fallback.
  }

  return currentUser.id;
};

export const onAuthStateChangedBackend = (callback: AuthListener) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    callback('AUTH_STATE_CHANGE', user ? { user: mapFirebaseUser(user) } : null);
  });
  return { unsubscribe };
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: { display_name?: string; username?: string },
) => {
  try {
    clearAuthCache(); // New auth session: never reuse the previous identity.
    const result = await createUserWithEmailAndPassword(auth, email, password);
    if (metadata?.display_name || metadata?.username) {
      await updateProfile(result.user, { displayName: metadata.display_name || metadata.username });
    }
    await ensureProfileDocument(result.user);
    return { data: { user: mapFirebaseUser(result.user) } };
  } catch (error) {
    return { error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    clearAuthCache(); // New auth session: never reuse the previous identity.
    const result = await signInWithEmailAndPassword(auth, email, password);
    await ensureProfileDocument(result.user);
    return { data: { user: mapFirebaseUser(result.user) } };
  } catch (error) {
    return { error };
  }
};

export const signOutAuth = async () => {
  try {
    await firebaseSignOut(auth);
    clearAuthCache(); // Ending a session invalidates the identity cache.
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const signInWithOAuthProvider = async (provider: 'google' | 'github') => {
  try {
    clearAuthCache(); // New auth session: never reuse the previous identity.
    const oauthProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    const result = await signInWithPopup(auth, oauthProvider);
    await ensureProfileDocument(result.user);
    return { data: { user: mapFirebaseUser(result.user) } };
  } catch (error) {
    return { error };
  }
};
