'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';

export function withAdminAuth(Component: React.ComponentType) {
  return function AdminProtectedComponent() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const adminRef = ref(database, `admins/${user.uid}`);
          const snapshot = await get(adminRef);
          if (snapshot.exists()) {
            setIsAdmin(true);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    }, [auth, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return isAdmin ? <Component /> : null;
  };
}
