import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface AnalyticsState {
  adminDashboard: any | null;
  userAnalytics: any | null;
  topUsers: any[];
  systemHealth: any | null;
  realtimeMetrics: any | null;
  predictiveAnalytics: any | null;
  spendingPatterns: any | null;
  transactionHistory: any | null;
  isLoading: boolean;
  error: string | null;

  // Admin Analytics
  getAdminDashboard: (params?: any) => Promise<any>;
  getTopUsers: (params?: any) => Promise<any[]>;
  getSystemHealth: () => Promise<any>;
  exportAnalytics: (format?: string) => Promise<any>;
  getRealTimeMetrics: () => Promise<any>;
  getPredictiveAnalytics: () => Promise<any>;

  // User Analytics
  getUserAnalytics: (params?: any) => Promise<any>;
  getUserSpendingPatterns: (params?: any) => Promise<any>;
  getUserTransactionHistory: (params?: any) => Promise<any>;

  // UI Actions
  clearAnalytics: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  adminDashboard: null,
  userAnalytics: null,
  topUsers: [],
  systemHealth: null,
  realtimeMetrics: null,
  predictiveAnalytics: null,
  spendingPatterns: null,
  transactionHistory: null,
  isLoading: false,
  error: null,

  getAdminDashboard: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/admin/dashboard', { params });

      set({
        adminDashboard: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch admin dashboard',
        isLoading: false,
      });
      throw error;
    }
  },

  getTopUsers: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any[];
        message: string;
      }>('/analytics/admin/top-users', { params });

      set({
        topUsers: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch top users',
        isLoading: false,
      });
      throw error;
    }
  },

  getSystemHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/admin/system-health');

      set({
        systemHealth: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch system health',
        isLoading: false,
      });
      throw error;
    }
  },

  exportAnalytics: async (format: string = 'json') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(`/analytics/admin/export?format=${format}`, {
        responseType: format === 'csv' ? 'blob' : 'json',
      });

      set({ isLoading: false });

      if (format === 'csv') {
        // Create download link for CSV
        const blob = new Blob([response as Blob], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to export analytics',
        isLoading: false,
      });
      throw error;
    }
  },

  getRealTimeMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/admin/realtime');

      set({
        realtimeMetrics: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch real-time metrics',
        isLoading: false,
      });
      throw error;
    }
  },

  getPredictiveAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/admin/predictive');

      set({
        predictiveAnalytics: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch predictive analytics',
        isLoading: false,
      });
      throw error;
    }
  },

  getUserAnalytics: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/user/analytics', { params });

      set({
        userAnalytics: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch user analytics',
        isLoading: false,
      });
      throw error;
    }
  },

  getUserSpendingPatterns: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/user/spending-patterns', { params });

      set({
        spendingPatterns: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch spending patterns',
        isLoading: false,
      });
      throw error;
    }
  },

  getUserTransactionHistory: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
        message: string;
      }>('/analytics/user/transaction-history', { params });

      set({
        transactionHistory: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch transaction history',
        isLoading: false,
      });
      throw error;
    }
  },

  clearAnalytics: () => set({
    adminDashboard: null,
    userAnalytics: null,
    topUsers: [],
    systemHealth: null,
    realtimeMetrics: null,
    predictiveAnalytics: null,
    spendingPatterns: null,
    transactionHistory: null,
  }),

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));