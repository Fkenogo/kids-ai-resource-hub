import { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { auth, db } from '@/services/backend/client';
import { createCommunityPostFromBackend } from '@/services/backend/community';
import { resolveDataUserId } from '@/services/backend/auth';
import {
  createReview,
  getCurrentUser,
  signIn,
  signOut,
} from '@/services/backendService';

/**
 * Emulator-only identity probe. This page is registered only when
 * VITE_FIREBASE_USE_EMULATOR=true (never in a production build) and drives the
 * REAL auth/identity services against the emulator suite.
 */

const isProbeEnabled = import.meta.env.VITE_FIREBASE_USE_EMULATOR === 'true';
const EMAIL = String(import.meta.env.VITE_E2E_ACCOUNT_EMAIL || 'elder@example.com');
const PASSWORD = String(import.meta.env.VITE_E2E_ACCOUNT_PASSWORD || 'probe-password-1');
const LEGACY_ID = String(import.meta.env.VITE_E2E_LEGACY_ID || 'legacy-elder');

const IdentityProbe = () => {
  const [log, setLog] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [reviewIds, setReviewIds] = useState<string[]>([]);
  const [activityCount, setActivityCount] = useState(0);

  const push = (line: string) => setLog((prev) => [...prev, line]);

  const run = async (label: string, fn: () => Promise<string>) => {
    setBusy(true);
    try {
      push(`[${label}] ${await fn()}`);
    } catch (error) {
      const code = (error as { code?: string })?.code || '';
      push(`[${label}] ERROR ${code || ''} ${(error as Error).message}`.trim());
    } finally {
      setBusy(false);
    }
  };

  const resolvedNow = async () => {
    const user = await getCurrentUser();
    const verified = auth.currentUser?.emailVerified ?? false;
    const id = await resolveDataUserId();
    return `authUid=${user?.id ?? 'none'} verified=${verified} resolved=${id}`;
  };

  const signInAndResolve = () =>
    run('signIn', async () => {
      const result = await signIn(EMAIL, PASSWORD);
      if (result && 'error' in result && result.error) throw new Error(String(result.error));
      return resolvedNow();
    });

  const reloadAuthAndResolve = () =>
    run('reloadAuth', async () => {
      await auth.currentUser?.reload();
      // Force a token refresh so Firestore rules see the verified claim.
      await auth.currentUser?.getIdToken(true);
      return resolvedNow();
    });

  const signOutAndSignInAndResolve = () =>
    run('signOut+signIn', async () => {
      await signOut();
      const result = await signIn(EMAIL, PASSWORD);
      if (result && 'error' in result && result.error) throw new Error(String(result.error));
      return resolvedNow();
    });

  const createActivity = () =>
    run('createActivity', async () => {
      const resourceId = `probe-resource-${activityCount}`;
      setActivityCount((n) => n + 1);
      const post = await createCommunityPostFromBackend({
        title: `Probe post ${Date.now()}`,
        content: 'Identity probe activity',
        category: 'getting-started',
      });
      const review = await createReview({
        resource_id: resourceId,
        user_id: (await getCurrentUser())?.id || '',
        rating: 4,
        comment: 'probe review',
      });
      const reviewId = String((review as { id?: string })?.id || 'unknown');
      setReviewIds((prev) => [...prev, reviewId]);
      return `resource=${resourceId} post author_id=${String((post as { author_id?: string })?.author_id)} review=${reviewId} user_id=${String((review as { user_id?: string })?.user_id)}`;
    });

  const touchActivities = () =>
    run('touchReviews', async () => {
      const results: string[] = [];
      for (const id of reviewIds) {
        try {
          await updateDoc(doc(db, 'resource_reviews', id), { rating: 4 });
          results.push(`${id}:editable`);
        } catch (error) {
          results.push(`${id}:DENIED ${((error as Error).message || '').slice(0, 40)}`);
        }
      }
      return results.join(' | ');
    });

  const readLegacyProfile = () =>
    run('readLegacyProfile', async () => {
      try {
        const snap = await getDoc(doc(db, 'profiles', LEGACY_ID));
        return snap.exists() ? `READABLE keys=${Object.keys(snap.data() || {}).length}` : 'missing';
      } catch (error) {
        return `DENIED ${(error as { code?: string })?.code || (error as Error).message}`.trim();
      }
    });

  const readOwnProfile = () =>
    run('readOwnProfile', async () => {
      const user = await getCurrentUser();
      if (!user?.id) throw new Error('not signed in');
      const snap = await getDoc(doc(db, 'profiles', user.id));
      return snap.exists() ? `READABLE uid-doc yes` : 'uid-doc missing';
    });

  if (!isProbeEnabled) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
          Identity probe requires VITE_FIREBASE_USE_EMULATOR=true.
        </div>
      </Layout>
    );
  }

  const actions: Array<[string, () => void]> = [
    ['Sign in & resolve', signInAndResolve],
    ['Reload auth & resolve', reloadAuthAndResolve],
    ['Sign out & sign in & resolve', signOutAndSignInAndResolve],
    ['Create activity', createActivity],
    ['Touch reviews (ownership)', touchActivities],
    ['Read legacy profile', readLegacyProfile],
    ['Read own uid profile', readOwnProfile],
    ['Sign out only', () => run('signOutOnly', async () => {
      await signOut();
      return resolvedNow();
    })],
  ];

  return (
    <Layout>
      <div className="min-h-screen max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Identity probe (emulator only)</h1>
        <div data-testid="probe-log" className="rounded border p-3 text-sm font-mono whitespace-pre-wrap min-h-24">
          {log.length === 0 ? 'no entries yet' : log.join('\n')}
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map(([label, action]) => (
            <Button key={label} size="sm" variant="outline" disabled={busy} onClick={action}>
              {label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Account {EMAIL} · legacy id {LEGACY_ID} · review ids tracked in-session.
        </p>
      </div>
    </Layout>
  );
};

export default IdentityProbe;
