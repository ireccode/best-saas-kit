'use client'

import { createContext, useContext, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

export interface User {
  id: string;
  username: string;
  credits: number;
  webUIEnabled: boolean;
  email?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const user = session?.user ? {
    id: session.user.id as string,
    username: session.user.name || 'Anonymous',
    email: session.user.email as string,
    credits: (session.user as any).credits || 0,
    webUIEnabled: (session.user as any).webUIEnabled || false,
    roles: (session.user as any).roles || ['user'],
  } : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: status === 'loading',
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
