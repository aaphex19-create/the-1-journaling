import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { UserProfile } from '../types';
import { useTheme } from './ThemeContext';

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  isDomainUnauthorized: boolean;
  isGuest: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  clearAuthError: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleWatchlistSymbol: (symbol: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'the1_guest_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDomainUnauthorized, setIsDomainUnauthorized] = useState<boolean>(false);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    try {
      return localStorage.getItem(GUEST_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const { theme, setTheme } = useTheme();

  // Create guest profile
  const initGuestUser = () => {
    const guestUser = {
      uid: 'guest_terminal_user',
      displayName: 'The 1% Strategist (Guest)',
      email: 'guest@the1percent.internal',
      photoURL: '',
      emailVerified: true,
      isAnonymous: true,
    } as unknown as User;

    setUser(guestUser);
    setIsGuest(true);
    setUserProfile({
      displayName: 'The 1% Strategist (Guest)',
      email: 'guest@the1percent.internal',
      photoURL: '',
      theme: theme,
      tier: 'Elite Syndicate Member (Demo)',
      bio: 'Systematic Macro & High-Alpha Quantitative Portfolio Allocation.',
      watchlist: ['BTC', 'ETH', 'NVDA', 'SOL', 'SPY'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    try {
      localStorage.setItem(GUEST_STORAGE_KEY, 'true');
    } catch (e) {
      console.warn('LocalStorage notice:', e);
    }
    setLoading(false);
  };

  // Listen to Auth State
  useEffect(() => {
    const hasGuestSession = localStorage.getItem(GUEST_STORAGE_KEY) === 'true';

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setIsGuest(false);
        try {
          localStorage.removeItem(GUEST_STORAGE_KEY);
        } catch {}
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          let docSnap;
          try {
            docSnap = await getDoc(userDocRef);
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
          }

          if (docSnap && docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setUserProfile(data);
            if (data.theme && data.theme !== theme) {
              setTheme(data.theme);
            }
          } else {
            // Initialize new user profile
            const initialProfile: UserProfile = {
              displayName: currentUser.displayName || 'The 1% Strategist',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              theme: theme,
              tier: 'Elite Syndicate Member',
              bio: 'Systematic Macro & High-Alpha Quantitative Portfolio Allocation.',
              watchlist: ['BTC', 'ETH', 'NVDA', 'SOL', 'SPY'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            try {
              await setDoc(userDocRef, initialProfile);
              setUserProfile(initialProfile);
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}`);
            }
          }
        } catch (error) {
          console.error('Error synchronizing user profile:', error);
        }
        setLoading(false);
      } else {
        if (hasGuestSession) {
          initGuestUser();
        } else {
          setUser(null);
          setUserProfile(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    setIsDomainUnauthorized(false);
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const errCode = (err as { code?: string })?.code || '';
      const errMsg = err instanceof Error ? err.message : String(err);

      if (
        errCode === 'auth/unauthorized-domain' ||
        errMsg.toLowerCase().includes('unauthorized-domain') ||
        errMsg.toLowerCase().includes('authorized domain')
      ) {
        setIsDomainUnauthorized(true);
        setAuthError(
          `Domain Authorization Notice: The current domain (${typeof window !== 'undefined' ? window.location.hostname : 'your domain'}) must be added to Authorized Domains in Firebase.`
        );
      } else if (errCode === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled: The Google authentication window was closed.');
      } else if (errCode === 'auth/cancelled-popup-request') {
        setAuthError('A sign-in request is already in progress.');
      } else {
        setAuthError(errMsg || 'Google authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const signInAsGuest = () => {
    setAuthError(null);
    setIsDomainUnauthorized(false);
    initGuestUser();
  };

  const clearAuthError = () => {
    setAuthError(null);
    setIsDomainUnauthorized(false);
  };

  const logout = async () => {
    try {
      setLoading(true);
      try {
        localStorage.removeItem(GUEST_STORAGE_KEY);
      } catch {}
      setIsGuest(false);
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err) {
      console.error('Sign Out Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    if (user.uid === 'guest_terminal_user') {
      setUserProfile((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null));
      return;
    }
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(userDocRef, updatedData);
      setUserProfile((prev) => (prev ? { ...prev, ...updatedData } : null));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const toggleWatchlistSymbol = async (symbol: string) => {
    if (!userProfile || !user) return;
    const current = userProfile.watchlist || [];
    const exists = current.includes(symbol);
    const updated = exists 
      ? current.filter((s) => s !== symbol) 
      : [...current, symbol];

    if (user.uid === 'guest_terminal_user') {
      setUserProfile({ ...userProfile, watchlist: updated });
      return;
    }
    await updateUserProfile({ watchlist: updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        isDomainUnauthorized,
        isGuest,
        signInWithGoogle,
        signInAsGuest,
        clearAuthError,
        logout,
        updateUserProfile,
        toggleWatchlistSymbol,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
