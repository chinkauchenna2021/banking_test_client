'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/api-client';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  account_number: string;
  account_status: string;
  is_admin: boolean;
  two_factor_enabled: boolean;
  currency: string;
  balance: string;
  auth_type?: string;
  email_verified?: boolean;
  email_verified_at?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions - Using more flexible return types
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<any>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => Promise<void>;
  verifyTwoFactor: (tempToken: string, code: string) => Promise<any>;
  getProfile: () => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(email, password);

          if (response.requires_two_factor) {
            set({
              isLoading: false,
              error: null
            });
            return response;
          }

          // Set state BEFORE returning
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Manually update localStorage as backup
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);

          return response;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error || error.message || 'Login failed';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.verifyEmail(token);

          console.log('Verification response:', response);

          // Extract data correctly from response structure
          const userData = response.data?.user || response.user;
          const accessToken =
            response.data?.access_token || response.access_token;
          const refreshToken =
            response.data?.refresh_token || response.refresh_token;

          // Set state
          set({
            user: userData,
            accessToken: accessToken,
            refreshToken: refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Manual localStorage update
          if (accessToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
          }

          localStorage.removeItem('pending_verification_email');

          return response;
        } catch (error: any) {
          console.error('Verification error:', error);
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            'Email verification failed';
          set({
            error: errorMessage,
            isLoading: false
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.logout();
        } catch (error) {
          console.log('Logout API error:', error);
        } finally {
          // Clear Zustand state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          // Clear localStorage manually
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('pending_verification_email');

          // Clear Zustand persisted storage
          localStorage.removeItem('auth-storage');
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<any>(
            '/auth/register',
            userData
          );

          set({
            user: response.data?.user || null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          if (response.data?.requires_verification) {
            localStorage.setItem(
              'pending_verification_email',
              response.data.user.email
            );
          }

          return response;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Registration failed',
            isLoading: false
          });
          throw error;
        }
      },

      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return;

        try {
          const response = await apiClient.post<{
            access_token: string;
            refresh_token: string;
          }>('/auth/refresh-token', { refresh_token: refreshToken });

          set({
            accessToken: response.access_token,
            refreshToken: response.refresh_token
          });

          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        } catch (error) {
          get().logout();
        }
      },

      forgotPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/auth/forgot-password', { email });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Failed to send reset email',
            isLoading: false
          });
          throw error;
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/auth/reset-password', {
            token,
            new_password: newPassword
          });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Password reset failed',
            isLoading: false
          });
          throw error;
        }
      },

      changePassword: async (data: {
        current_password: string;
        new_password: string;
      }) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/auth/change-password', data);
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Password change failed',
            isLoading: false
          });
          throw error;
        }
      },

      verifyTwoFactor: async (tempToken: string, code: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<any>('/auth/verify-2fa', {
            temp_token: tempToken,
            code
          });

          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);

          return response;
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              '2FA verification failed',
            isLoading: false
          });
          throw error;
        }
      },

      getProfile: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.get<any>('/auth/profile');

          set({
            user: response.data,
            isLoading: false,
            error: null
          });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Failed to load profile',
            isLoading: false
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      setLoading: (loading: boolean) => set({ isLoading: loading })
    }),
    {
      name: 'auth-storage',
      // Include only serializable data
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
      // Add migration for corrupted state
      migrate: (persistedState: any, version: number) => {
        console.log('Migrating auth state from version:', version);

        // If state is corrupted, reset it
        if (!persistedState || typeof persistedState !== 'object') {
          return {
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false
          };
        }

        // Ensure required fields exist
        return {
          user: persistedState.user || null,
          accessToken: persistedState.accessToken || null,
          refreshToken: persistedState.refreshToken || null,
          isAuthenticated: persistedState.isAuthenticated || false
        };
      },
      // Add versioning
      version: 1
    }
  )
);
