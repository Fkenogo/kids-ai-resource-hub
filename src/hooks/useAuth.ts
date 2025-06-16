
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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user || null);
        
        if (session?.user) {
          try {
            const userProfile = await getProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching profile:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else if (session) {
          console.log('Initial session found:', session.user?.id);
          setSession(session);
          setUser(session.user);
          
          try {
            const userProfile = await getProfile(session.user.id);
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => subscription.unsubscribe();
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
