'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type AllowedRoles = 'admin' | 'contributor' | 'user';

export function withAuth(
  Component: React.ComponentType,
  allowedRoles: AllowedRoles[] = [],
) {
  return function ProtectedComponent(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push('/login');
        } else if (user.suspended) {
          router.push('/'); // Or a specific suspended page
        } else if (
          allowedRoles.length > 0 &&
          !allowedRoles.includes(user.role)
        ) {
          // If user role is not in allowed roles, redirect to home or show restricted access
          router.push('/');
        }
      }
    }, [user, loading, router]);

    if (loading) {
      return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!user || user.suspended) {
      return null;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return null; // Will redirect in useEffect
    }

    return <Component {...props} />;
  };
}
