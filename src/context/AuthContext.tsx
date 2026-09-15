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

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  toggleWatchlistSymbol: (symbol: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      console.error('Google Sign In Error:', err);
      const message = err instanceof Error ? err.message : 'Google authentication failed';
      setAuthError(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
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

    await updateUserProfile({ watchlist: updated });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        authError,
        signInWithGoogle,
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
