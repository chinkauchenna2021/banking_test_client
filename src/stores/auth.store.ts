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
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => Promise<void>;
  verifyTwoFactor: (tempToken: string, code: string) => Promise<void>;
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
          const response = await apiClient.post<{
            user: User;
            access_token: string;
            refresh_token: string;
            requires_two_factor?: boolean;
            temp_token?: string;
            message?: string;
          }>('/auth/login', { email, password });

          if (response.requires_two_factor) {
            set({
              isLoading: false,
              error: null
            });
            // Return special object for 2FA
            throw { requiresTwoFactor: true, tempToken: response.temp_token };
          }

          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          // Store tokens in localStorage for axios interceptor
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error || error.message || 'Login failed',
            isLoading: false
          });
          throw error;
        }
      },

      // register: async (userData: any) => {
      //   set({ isLoading: true, error: null });
      //   try {
      //     const response = await apiClient.post<{
      //       user: User;
      //       access_token: string;
      //       refresh_token: string;
      //       message: string;
      //     }>('/auth/register', userData);

      //     set({
      //       user: response.user,
      //       accessToken: response.access_token,
      //       refreshToken: response.refresh_token,
      //       isAuthenticated: true,
      //       isLoading: false,
      //       error: null,
      //     });

      //     localStorage.setItem('access_token', response.access_token);
      //     localStorage.setItem('refresh_token', response.refresh_token);
      //   } catch (error: any) {
      //     set({
      //       error: error.response?.data?.error || error.message || 'Registration failed',
      //       isLoading: false,
      //     });
      //     throw error;
      //   }
      // },

      register: async (userData: any) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.post<{
            user: User;
            access_token: string;
            refresh_token: string;
            message: string;
          }>('/auth/register', userData);

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
        } catch (error: any) {
          // Pass through the full error response for better handling
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Registration failed',
            isLoading: false
          });
          // Re-throw the error with full response for component-level handling
          throw error;
        }
      },
      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.post('/auth/logout');
        } catch (error) {
          // Even if logout API fails, clear local state
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
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

      verifyEmail: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          await apiClient.post('/auth/verify-email', { token });
          set({ isLoading: false });
        } catch (error: any) {
          set({
            error:
              error.response?.data?.error ||
              error.message ||
              'Email verification failed',
            isLoading: false
          });
          throw error;
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
          const response = await apiClient.post<{
            user: User;
            access_token: string;
            refresh_token: string;
          }>('/auth/verify-2fa', { temp_token: tempToken, code });

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
          const user = await apiClient.get<User>('/auth/profile');
          set({
            user,
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
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
