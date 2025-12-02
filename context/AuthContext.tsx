'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { database } from '@/lib/firebase';

type UserRole = 'admin' | 'contributor' | 'user';

interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  suspended?: boolean;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isContributor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  isContributor: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = ref(database, `users/${firebaseUser.uid}`);
          const snapshot = await get(userRef);

          let role: UserRole = 'user';
          let suspended = false;

          if (snapshot.exists()) {
            const data = snapshot.val();
            role = data.role || 'user';
            suspended = data.suspended || false;
          } else {
            // Fallback: Check if in old admins path
            const adminRef = ref(database, `admins/${firebaseUser.uid}`);
            const adminSnapshot = await get(adminRef);
            if (adminSnapshot.exists() && adminSnapshot.val().isAdmin) {
              role = 'admin';
            }

            // Create user profile if it doesn't exist
            await set(userRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role,
              suspended: false,
            });
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role,
            suspended,
          });
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isContributor: user?.role === 'contributor',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
