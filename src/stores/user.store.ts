import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

const isFileValue = (value: unknown): value is File =>
  typeof File !== 'undefined' && value instanceof File;

export interface Account {
  id: bigint;
  user_id: bigint;
  account_number: string;
  account_name: string;
  account_type: string;
  currency: string;
  balance: number;
  available_balance: number;
  ledger_balance: number;
  status: string;
  // Add other properties as needed by the client
}

export interface User {
  id: string;
  account_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  profile_image?: string;
  gender?: string;
  account_type: string;
  account_status: string;
  balance: string;
  ledger_balance: string;
  available_balance: string;
  currency: string;
  occupation?: string;
  employer?: string;
  is_admin: boolean;
  is_active: boolean;
  two_factor_enabled: boolean;
  email_verified_at?: string;
  last_login_at?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
  accounts?: Account[]; // Added accounts property
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  profile_image?: string | File;
  gender?: string;
  occupation?: string;
  employer?: string;
}

export interface ChangePasswordDto {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface KYCDataDto {
  identification_type: string;
  identification_number: string;
  identification_image?: string | File;
  tax_id?: string;
  monthly_income?: number;
  source_of_funds?: string;
}

export interface ActivityLog {
  id: string;
  type: string;
  amount: string;
  status: string;
  description: string;
  created_at: string;
  account?: {
    account_number: string;
  };
}

export interface DashboardData {
  user: User;
  accounts: any[];
  recent_transactions: any[];
  pending_deposits: number;
  total_balance: number;
}

export interface UserState {
  user: User | null;
  profile: User | null;
  activityLog: ActivityLog[];
  dashboard: DashboardData | null;
  isLoading: boolean;
  error: string | null;

  // Profile Actions
  getProfile: () => Promise<User>;
  updateProfile: (updateData: UpdateUserDto) => Promise<User>;
  changePassword: (data: ChangePasswordDto) => Promise<void>;

  // KYC Actions
  submitKYC: (kycData: KYCDataDto) => Promise<void>;

  // Dashboard and Activity
  getDashboard: () => Promise<DashboardData>;
  getActivityLog: (
    page?: number,
    limit?: number
  ) => Promise<{
    activities: ActivityLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>;

  // Preferences and Settings
  updatePreferences: (preferences: Record<string, any>) => Promise<void>;
  enableTwoFactor: (enable: boolean) => Promise<void>;

  // Account Management
  deleteAccount: (password: string) => Promise<void>;

  // UI Actions
  setUser: (user: User | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  profile: null,
  activityLog: [],
  dashboard: null,
  isLoading: false,
  error: null,

  getProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: User;
      }>('/users/profile');

      const user = response.data;
      set({
        user,
        profile: user,
        isLoading: false
      });

      return user;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch profile',
        isLoading: false
      });
      throw error;
    }
  },

  updateProfile: async (updateData: UpdateUserDto) => {
    set({ isLoading: true, error: null });
    try {
      const hasFile = isFileValue(updateData.profile_image);

      const response = hasFile
        ? await (() => {
            const formData = new FormData();

            Object.entries(updateData).forEach(([key, value]) => {
              if (
                value === undefined ||
                value === null ||
                key === 'profile_image'
              ) {
                return;
              }
              formData.append(key, value.toString());
            });

            formData.append('profile_image', updateData.profile_image as File);

            return apiClient.updateUserProfile<{
              success: boolean;
              data: User;
              message: string;
            }>(formData);
          })()
        : await apiClient.updateUserProfile<{
            success: boolean;
            data: User;
            message: string;
          }>(updateData);

      const updatedUser = response.data;
      set({
        user: updatedUser,
        profile: updatedUser,
        isLoading: false
      });

      return updatedUser;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to update profile',
        isLoading: false
      });
      throw error;
    }
  },

  changePassword: async (data: ChangePasswordDto) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post<{
        success: boolean;
        message: string;
      }>('/users/change-password', data);

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to change password',
        isLoading: false
      });
      throw error;
    }
  },

  submitKYC: async (kycData: KYCDataDto) => {
    set({ isLoading: true, error: null });
    try {
      const hasFile = isFileValue(kycData.identification_image);

      if (hasFile) {
        const formData = new FormData();

        Object.entries(kycData).forEach(([key, value]) => {
          if (
            value === undefined ||
            value === null ||
            key === 'identification_image'
          ) {
            return;
          }
          formData.append(key, value.toString());
        });

        formData.append(
          'identification_image',
          kycData.identification_image as File
        );

        await apiClient.submitKYC<{
          success: boolean;
          message: string;
        }>(formData);
      } else {
        await apiClient.post<{
          success: boolean;
          message: string;
        }>('/users/kyc/submit', kycData);
      }

      // Refresh profile
      await get().getProfile();

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to submit KYC',
        isLoading: false
      });
      throw error;
    }
  },

  getDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: DashboardData;
      }>('/users/dashboard');

      const dashboard = response.data;
      set({
        dashboard,
        isLoading: false
      });

      return dashboard;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch dashboard',
        isLoading: false
      });
      throw error;
    }
  },

  getActivityLog: async (page: number = 1, limit: number = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        activities: ActivityLog[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>('/users/activity', { params: { page, limit } });

      set({
        activityLog: response.activities,
        isLoading: false
      });

      return {
        activities: response.activities,
        pagination: response.pagination
      };
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch activity log',
        isLoading: false
      });
      throw error;
    }
  },

  updatePreferences: async (preferences: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put<{
        success: boolean;
        message: string;
      }>('/users/preferences', preferences);

      // Refresh profile
      await get().getProfile();

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to update preferences',
        isLoading: false
      });
      throw error;
    }
  },

  enableTwoFactor: async (enable: boolean) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.put<{
        success: boolean;
        message: string;
      }>('/users/two-factor', { enable });

      // Refresh profile
      await get().getProfile();

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to update two-factor authentication',
        isLoading: false
      });
      throw error;
    }
  },

  deleteAccount: async (password: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete<{
        success: boolean;
        message: string;
      }>('/users/account', { data: { password } });

      set({
        user: null,
        profile: null,
        dashboard: null,
        activityLog: [],
        isLoading: false
      });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to delete account',
        isLoading: false
      });
      throw error;
    }
  },

  setUser: (user: User | null) => set({ user }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
