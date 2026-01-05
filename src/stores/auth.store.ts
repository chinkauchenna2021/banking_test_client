// stores/auth.store.ts
'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';
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
  _hasHydrated: boolean; // Track hydration state

  // Actions
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
  setHasHydrated: (state: boolean) => void;
}

type AuthPersist = PersistOptions<AuthState> & {
  name: string;
  storage: ReturnType<typeof createJSONStorage>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      _hasHydrated: false,

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login(email, password);

          if (response.requires_two_factor) {
            set({ isLoading: false, error: null });
            return response;
          }

          // Extract tokens and user from response
          const user = response.user || response.data?.user;
          const accessToken =
            response.access_token || response.data?.access_token;
          const refreshToken =
            response.refresh_token || response.data?.refresh_token;

          if (!accessToken) {
            throw new Error('No access token received');
          }

          // Update state
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return response;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.error || error.message || 'Login failed';
          set({ error: errorMessage, isLoading: false });
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

          if (!accessToken) {
            throw new Error('No access token received after verification');
          }

          // Update state
          set({
            user: userData,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Clear pending verification email
          localStorage.removeItem('pending_verification_email');

          return response;
        } catch (error: any) {
          console.error('Verification error:', error);
          const errorMessage =
            error.response?.data?.error ||
            error.message ||
            'Email verification failed';
          set({ error: errorMessage, isLoading: false });
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
          // Clear all state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          // Clear any additional localStorage items
          localStorage.removeItem('pending_verification_email');
        }
      },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<any>(
            '/auth/register',
            userData
          );
          const user = response.data?.user || response.user;

          set({
            user: user || null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });

          if (
            response.data?.requires_verification ||
            response.requires_verification
          ) {
            const email = user?.email || response.data?.user?.email;
            if (email) {
              localStorage.setItem('pending_verification_email', email);
            }
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
        } catch (error) {
          console.error('Token refresh failed:', error);
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

          const user = response.user || response.data?.user;
          const accessToken =
            response.access_token || response.data?.access_token;
          const refreshToken =
            response.refresh_token || response.data?.refresh_token;

          if (!accessToken) {
            throw new Error('No access token received');
          }

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

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
          const user = response.data || response.user;

          if (user) {
            set({
              user: user,
              isLoading: false,
              error: null
            });
          } else {
            throw new Error('No user data received');
          }
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
      storage: createJSONStorage(() => localStorage),
      partialize: (state: {
        user: any;
        accessToken: any;
        refreshToken: any;
        isAuthenticated: any;
      }) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage:
        () =>
        (state: { setHasHydrated: (arg0: boolean) => void }, error: any) => {
          if (error) {
            console.error('Error during hydration:', error);
          } else if (state) {
            state.setHasHydrated(true);
            console.log('Auth store hydrated successfully');
          }
        },
      version: 1,
      migrate: (persistedState: any, version: number) => {
        console.log('Migrating auth state from version:', version);

        if (version === 0) {
          // Migration from old structure if needed
          return {
            ...persistedState,
            _hasHydrated: false
          };
        }

        return persistedState;
      }
    } as unknown as AuthPersist
  )
);
