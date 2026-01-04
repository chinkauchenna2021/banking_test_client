'use client';
import { useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

export const useAuthDebug = () => {
  useEffect(() => {
    const unsubscribe = useAuthStore.subscribe((state) => {
      console.log('Auth State Changed:', {
        user: state.user?.email,
        hasToken: !!state.accessToken,
        isAuthenticated: state.isAuthenticated,
        localStorageAuth: localStorage.getItem('auth-storage'),
        localStorageToken: localStorage.getItem('access_token')
      });
    });

    return () => unsubscribe();
  }, []);
};
