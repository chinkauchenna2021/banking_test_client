'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export default function DebugAuth() {
  useEffect(() => {
    const logAuthState = () => {
      const state = useAuthStore.getState();
      console.log('🔍 Auth State:', {
        user: state.user?.email,
        accessToken: state.accessToken ? '✅' : '❌',
        refreshToken: state.refreshToken ? '✅' : '❌',
        isAuthenticated: state.isAuthenticated,
        localStorageAccess: localStorage.getItem('access_token') ? '✅' : '❌',
        localStorageRefresh: localStorage.getItem('refresh_token')
          ? '✅'
          : '❌',
        zustandStorage: localStorage.getItem('auth-storage')
      });
    };

    // Log on mount
    logAuthState();

    // Subscribe to changes
    const unsubscribe = useAuthStore.subscribe(logAuthState);

    return () => unsubscribe();
  }, []);

  return null;
}
