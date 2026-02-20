
import { useState, useEffect } from 'react';
import { signUp, signIn, signOut, getProfile } from '@/services/backendService';
import {
  getCurrentAuthSession,
  onAuthStateChangedBackend,
  resolveDataUserId,
  type BackendAuthSession,
  type BackendAuthUser,
} from '@/services/backend/auth';
import { logger } from '@/lib/logger';

export const useAuth = () => {
  const [user, setUser] = useState<BackendAuthUser | null>(null);
  const [session, setSession] = useState<BackendAuthSession>(null);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const subscription = onAuthStateChangedBackend(
      async (event, session) => {
        logger.debug('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking the auth state update
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const profileUserId = (await resolveDataUserId(session.user)) || session.user.id;
              const userProfile = await getProfile(profileUserId);
              if (mounted) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
              if (mounted) {
                setProfile(null);
              }
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    const loadInitialSession = async () => {
      if (!mounted) return;
      
      try {
        const session = await getCurrentAuthSession();
        if (session && mounted) {
          logger.debug('Initial session found:', session.user?.id);
          setSession(session);
          setUser(session.user);
          
          // Defer profile fetching
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const profileUserId = (await resolveDataUserId(session.user)) || session.user.id;
              const userProfile = await getProfile(profileUserId);
              if (mounted) {
                setProfile(userProfile);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user && !!session,
  };
};
