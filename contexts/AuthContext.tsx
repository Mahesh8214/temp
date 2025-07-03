
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/firebaseService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUserStatus = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Failed to check user status", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    checkUserStatus();
    // This is where you would set up a listener for auth state changes with the real Firebase SDK
    // const unsubscribe = onAuthStateChanged(auth, (user) => { ... });
    // return () => unsubscribe();
    // For now, we just check once on mount.
  }, [checkUserStatus]);


  const login = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const loggedInUser = await authService.signIn(email, pass);
      setUser(loggedInUser);
    } catch (error) {
       throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setLoading(false);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
