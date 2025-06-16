
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUser, signUp, signIn, signOut, getProfile } from '@/services/supabaseService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking the auth state update
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const userProfile = await getProfile(session.user.id);
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
    const getInitialSession = async () => {
      if (!mounted) return;
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session && mounted) {
          console.log('Initial session found:', session.user?.id);
          setSession(session);
          setUser(session.user);
          
          // Defer profile fetching
          setTimeout(async () => {
            if (!mounted) return;
            try {
              const userProfile = await getProfile(session.user.id);
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

    getInitialSession();

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
