import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import type { UserRole } from '@/types';

interface AuthContextType {
  user: { id: string; email: string; full_name: string; avatar_url?: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded } = useClerkAuth();
  const { signOut } = useClerk();
  const [role, setRole] = useState<UserRole | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!authLoaded || !userLoaded) return;

    if (!isSignedIn || !clerkUser) {
      setRole(null);
      setRoleLoading(false);
      return;
    }

    const fetchRole = async () => {
      setRoleLoading(true);
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', clerkUser.id)
        .maybeSingle();

      setRole((data?.role as UserRole) ?? null);
      setRoleLoading(false);
    };

    fetchRole();
  }, [isSignedIn, clerkUser, authLoaded, userLoaded]);

  const isLoading = !authLoaded || !userLoaded || roleLoading;

  const user = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
        full_name: clerkUser.fullName ?? '',
        avatar_url: clerkUser.imageUrl,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!isSignedIn,
        isLoading,
        role,
        logout: () => signOut(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
