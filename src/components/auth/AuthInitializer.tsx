'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export function AuthInitializer() {
  useEffect(() => {
    // Listen for logout events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth-storage' && !e.newValue) {
        // If auth storage was cleared in another tab, clear it here too
        useAuthStore.getState().logout();
      }
    };

    // Listen for custom logout events
    const handleLogoutEvent = () => {
      useAuthStore.getState().logout();
    };

    // Check initial auth state from localStorage
    const checkInitialAuth = () => {
      const storedAuth = localStorage.getItem('auth-storage');
      if (!storedAuth) {
        // If no stored auth, ensure we're logged out
        useAuthStore.setState({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          _hasHydrated: true
        });
      }
    };

    // Run initial check
    checkInitialAuth();

    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  return null; // This component doesn't render anything
}
