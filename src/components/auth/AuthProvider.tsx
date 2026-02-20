
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { BackendAuthSession, BackendAuthUser } from '@/services/backend/auth';

interface AuthContextType {
  user: BackendAuthUser | null;
  session: BackendAuthSession;
  profile: Record<string, unknown> | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    metadata?: { display_name?: string; username?: string },
  ) => Promise<unknown>;
  signIn: (email: string, password: string) => Promise<unknown>;
  signOut: () => Promise<unknown>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
