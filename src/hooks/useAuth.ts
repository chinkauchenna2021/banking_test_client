'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    register,
    forgotPassword,
    refreshAccessToken,
    resetPassword,
    changePassword,
    logout,
    verifyEmail,
    verifyTwoFactor,
    getProfile,
    clearError,
    login
  } = useAuthStore();

  // Auto-fetch profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && !user) {
      getProfile().catch(console.error);
    }
  }, [isAuthenticated, user, getProfile]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: async (email: string, password: string) => {
      return await login(email, password);
    },
    logout,
    getProfile,
    clearError,
    register: async (userData: any) => {
      return await register(userData);
    },
    forgotPassword,
    refreshAccessToken,
    resetPassword,
    changePassword,
    verifyEmail: async (token: string) => {
      return await verifyEmail(token);
    },
    verifyTwoFactor,
    isAdmin: user?.is_admin || false
  };
};
