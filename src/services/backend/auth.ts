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
import { createOne, readMany } from './firestoreDb';

export type BackendAuthUser = {
  id: string;
  email?: string | null;
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
  timestamp: number;
}

const resolvedUserIdByEmail = new Map<string, CacheEntry>();

const isCacheValid = (entry: CacheEntry): boolean => {
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
};

const getFromCache = (email: string): string | null => {
  const entry = resolvedUserIdByEmail.get(email);
  if (entry && isCacheValid(entry)) {
    return entry.value;
  }
  if (entry) {
    resolvedUserIdByEmail.delete(email); // Remove expired entry
  }
  return null;
};

const setCache = (email: string, userId: string): void => {
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
  
  resolvedUserIdByEmail.set(email, { value: userId, timestamp: Date.now() });
};

const clearAuthCache = (): void => {
  resolvedUserIdByEmail.clear();
};

const mapFirebaseUser = (user: FirebaseUser): BackendAuthUser => ({
  id: user.uid,
  email: user.email,
  user_metadata: {
    display_name: user.displayName || undefined,
    photo_url: user.photoURL || undefined,
  },
});

const ensureProfileDocument = async (user: FirebaseUser) => {
  if (!user.email) return;

  const existing = await readMany('profiles', {
    filters: [{ field: 'email', op: '==', value: user.email }],
    limit: 1,
  });
  if (existing.length > 0) return;

  const now = new Date().toISOString();
  await createOne(
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
  const cached = getFromCache(currentUser.email);
  if (cached) return cached;

  const matches = await readMany('profiles', {
    filters: [{ field: 'email', op: '==', value: currentUser.email }],
    limit: 1,
  });
  if (matches.length > 0) {
    const id = String(matches[0].id);
    setCache(currentUser.email, id);
    return id;
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
    return { error: null };
  } catch (error) {
    return { error };
  }
};

export const signInWithOAuthProvider = async (provider: 'google' | 'github') => {
  try {
    const oauthProvider = provider === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
    const result = await signInWithPopup(auth, oauthProvider);
    await ensureProfileDocument(result.user);
    return { data: { user: mapFirebaseUser(result.user) } };
  } catch (error) {
    return { error };
  }
};
