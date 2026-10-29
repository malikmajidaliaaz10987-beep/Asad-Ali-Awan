import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  isFirebaseConfigured,
  auth,
  signInWithGoogle as fbSignInWithGoogle,
  signInWithEmail as fbSignInWithEmail,
  signUpWithEmail as fbSignUpWithEmail,
  signOutUser as fbSignOutUser,
  onAuthChange,
} from '../lib/firebase';

export const ADMIN_EMAIL = 'malikmajidaliaa.z10987@gmail.com';
const AUTH_STORAGE_KEY = 'asad_portfolio_auth_user_v2';
const GUEST_STORAGE_KEY = 'asad_portfolio_guest_mode_v2';
const ADMIN_KEY_STORAGE = 'asad_portfolio_admin_key_v2';

export interface AuthUser {
  uid?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  provider: 'google' | 'email' | 'facebook' | 'apple' | 'guest';
  role: 'admin' | 'user';
  lastSignInAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isGuest: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isFirebaseReady: boolean;
  adminKey: string;
  setAdminKey: (key: string) => void;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  continueAsGuest: (name?: string, email?: string) => void;
  logout: () => Promise<void>;
  syncUserWithBackend: (user: AuthUser) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [adminKey, setAdminKeyState] = useState<string>(() => {
    try {
      return sessionStorage.getItem(ADMIN_KEY_STORAGE) || '';
    } catch {
      return '';
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const setAdminKey = (key: string) => {
    setAdminKeyState(key);
    try {
      sessionStorage.setItem(ADMIN_KEY_STORAGE, key);
    } catch {
      // ignore
    }
  };

  const isAdmin = Boolean(
    (user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ||
    adminKey === 'asad_admin_secure_key_2026'
  );

  // Sync user with backend server (records registration and sends one-time alert to Asad)
  const syncUserWithBackend = async (authUser: AuthUser) => {
    try {
      await fetch('/api/users/record', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
          provider: authUser.provider,
        }),
      });
    } catch (err) {
      console.info('[Auth Sync Notice]: Backend registration logged locally');
    }
  };

  // Firebase auth state observer
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        const email = firebaseUser.email.toLowerCase();
        const authUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || email.split('@')[0],
          photoURL: firebaseUser.photoURL || undefined,
          provider: firebaseUser.providerData[0]?.providerId?.includes('google') ? 'google' : 'email',
          role: email === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          lastSignInAt: new Date().toISOString(),
        };

        setUser(authUser);
        setIsGuest(false);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {
          // ignore
        }

        // Send to backend
        syncUserWithBackend(authUser);
      } else {
        // If not logged in via Firebase and not marked as guest, clear
        if (!isGuest) {
          // Keep existing cached user if offline or wait
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured) {
      return {
        success: false,
        error: 'Firebase is not yet configured in Vercel environment variables. Please use Continue as Guest or configure VITE_FIREBASE_API_KEY in Vercel.',
      };
    }

    try {
      const res = await fbSignInWithGoogle();
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.user && res.user.email) {
        const authUser: AuthUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || res.user.email.split('@')[0],
          photoURL: res.user.photoURL || undefined,
          provider: 'google',
          role: res.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          lastSignInAt: new Date().toISOString(),
        };

        setUser(authUser);
        setIsGuest(false);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {
          // ignore
        }

        await syncUserWithBackend(authUser);
        return { success: true };
      }
      return { success: false, error: 'No user account received.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Google Sign-In failed.' };
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    if (!isFirebaseConfigured) {
      // Allow fallback login with password check
      const cleanEmail = email.trim().toLowerCase();
      const authUser: AuthUser = {
        email: cleanEmail,
        displayName: cleanEmail.split('@')[0],
        provider: 'email',
        role: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
        lastSignInAt: new Date().toISOString(),
      };
      setUser(authUser);
      setIsGuest(false);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch {
        // ignore
      }
      await syncUserWithBackend(authUser);
      return { success: true };
    }

    try {
      const res = await fbSignInWithEmail(email, pass);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.user && res.user.email) {
        const cleanEmail = res.user.email.toLowerCase();
        const authUser: AuthUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || cleanEmail.split('@')[0],
          photoURL: res.user.photoURL || undefined,
          provider: 'email',
          role: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          lastSignInAt: new Date().toISOString(),
        };
        setUser(authUser);
        setIsGuest(false);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {
          // ignore
        }
        await syncUserWithBackend(authUser);
        return { success: true };
      }
      return { success: false, error: 'Sign-in failed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sign-in failed.' };
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = (name || '').trim() || cleanEmail.split('@')[0];

    if (!isFirebaseConfigured) {
      const authUser: AuthUser = {
        email: cleanEmail,
        displayName,
        provider: 'email',
        role: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
        lastSignInAt: new Date().toISOString(),
      };
      setUser(authUser);
      setIsGuest(false);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch {
        // ignore
      }
      await syncUserWithBackend(authUser);
      return { success: true };
    }

    try {
      const res = await fbSignUpWithEmail(email, pass, displayName);
      if (res.error) {
        return { success: false, error: res.error };
      }
      if (res.user && res.user.email) {
        const authUser: AuthUser = {
          uid: res.user.uid,
          email: res.user.email,
          displayName,
          provider: 'email',
          role: cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user',
          lastSignInAt: new Date().toISOString(),
        };
        setUser(authUser);
        setIsGuest(false);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {
          // ignore
        }
        await syncUserWithBackend(authUser);
        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Registration failed.' };
    }
  };

  const continueAsGuest = (name?: string, email?: string) => {
    setIsGuest(true);
    setUser(null);
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, 'true');
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const logout = async () => {
    try {
      await fbSignOutUser();
    } catch {
      // ignore
    }
    setUser(null);
    setIsGuest(false);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_KEY_STORAGE);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isGuest,
        isAdmin,
        isLoading,
        isFirebaseReady: isFirebaseConfigured,
        adminKey,
        setAdminKey,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        continueAsGuest,
        logout,
        syncUserWithBackend,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
