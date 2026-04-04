import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { currentMockUser, mockUsers } from '@/data/mock-data';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  switchRole: (role: UserRole) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(currentMockUser);

  const switchRole = (role: UserRole) => {
    const userForRole = mockUsers.find(u => u.role === role);
    if (userForRole) setUser(userForRole);
  };

  const login = async (_email: string, _password: string) => {
    setUser(currentMockUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      role: user?.role ?? null,
      switchRole,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
