import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface AdminUser {
  id: string;
  account_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  account_type: string;
  account_status: string;
  balance: string;
  currency: string;
  is_admin: boolean;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface AdminTransaction {
  id: string;
  user_id: string;
  account_id: string;
  reference: string;
  transaction_id: string;
  type: string;
  status: string;
  amount: string;
  charge: string;
  total_amount: string;
  currency: string;
  description: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    account_number: string;
  };
  account?: {
    account_number: string;
    account_name: string;
  };
}

export interface AdminDeposit {
  id: string;
  user_id: string;
  account_id: string;
  deposit_reference: string;
  amount: string;
  fee: string;
  method: string;
  status: string;
  description: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    account_number: string;
  };
  account?: {
    account_number: string;
    account_name: string;
  };
}

export interface ApprovalQueueItem {
  id: string;
  type: string;
  status: string;
  priority: string;
  model_id: string;
  model_type: string;
  user_id: string;
  assigned_to: string | null;
  approved_by: string | null;
  description: string;
  metadata: any;
  created_at: string;
  processed_at: string | null;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    account_number: string;
  };
}

export interface AdminState {
  dashboardStats: any | null;
  users: AdminUser[];
  transactions: AdminTransaction[];
  deposits: AdminDeposit[];
  approvalQueue: ApprovalQueueItem[];
  auditLogs: any[];
  isLoading: boolean;
  error: string | null;

  // Dashboard
  getDashboardStats: () => Promise<any>;
  
  // User Management
  getUsers: (params?: any) => Promise<{ users: AdminUser[]; pagination: any }>;
  updateUserStatus: (userId: string, status: string, reason: string) => Promise<AdminUser>;
  
  // Approval Queue
  getApprovalQueue: (params?: any) => Promise<ApprovalQueueItem[]>;
  processApproval: (approvalId: string, action: string, notes?: string) => Promise<any>;
  
  // Transaction Management
  getTransactions: (params?: any) => Promise<{ transactions: AdminTransaction[]; pagination: any }>;
  getDeposits: (params?: any) => Promise<{ deposits: AdminDeposit[]; pagination: any }>;
  confirmDeposit: (depositId: string, notes?: string) => Promise<AdminDeposit>;
  
  // Audit & Reports
  getAuditLogs: (params?: any) => Promise<{ logs: any[]; pagination: any }>;
  generateReport: (options: any) => Promise<any>;
  
  // System
  getSystemHealth: () => Promise<any>;

  // UI Actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  dashboardStats: null,
  users: [],
  transactions: [],
  deposits: [],
  approvalQueue: [],
  auditLogs: [],
  isLoading: false,
  error: null,

  getDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
      }>('/admin/dashboard');

      set({
        dashboardStats: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch dashboard stats',
        isLoading: false,
      });
      throw error;
    }
  },

  getUsers: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        users: AdminUser[];
        pagination: any;
      }>('/admin/users', { params });

      set({
        users: response.users,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch users',
        isLoading: false,
      });
      throw error;
    }
  },

  updateUserStatus: async (userId: string, status: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.patch<{
        success: boolean;
        data: AdminUser;
        message: string;
      }>(`/admin/users/${userId}/status`, { status, reason });

      const updatedUser = response.data;
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? updatedUser : user
        ),
        isLoading: false,
      }));

      return updatedUser;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to update user status',
        isLoading: false,
      });
      throw error;
    }
  },

  getApprovalQueue: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ApprovalQueueItem[];
      }>('/admin/approvals', { params });

      set({
        approvalQueue: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch approval queue',
        isLoading: false,
      });
      throw error;
    }
  },

  processApproval: async (approvalId: string, action: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any;
        message: string;
      }>(`/admin/approvals/${approvalId}/process`, { action, notes });

      // Remove from queue
      set((state) => ({
        approvalQueue: state.approvalQueue.filter((item) => item.id !== approvalId),
        isLoading: false,
      }));

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to process approval',
        isLoading: false,
      });
      throw error;
    }
  },

  getTransactions: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        transactions: AdminTransaction[];
        pagination: any;
      }>('/admin/transactions', { params });

      set({
        transactions: response.transactions,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  getDeposits: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        deposits: AdminDeposit[];
        pagination: any;
      }>('/admin/deposits', { params });

      set({
        deposits: response.deposits,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch deposits',
        isLoading: false,
      });
      throw error;
    }
  },

  confirmDeposit: async (depositId: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: AdminDeposit;
        message: string;
      }>(`/admin/deposits/${depositId}/confirm`, { notes });

      const confirmedDeposit = response.data;
      set((state) => ({
        deposits: state.deposits.map((deposit) =>
          deposit.id === depositId ? confirmedDeposit : deposit
        ),
        isLoading: false,
      }));

      return confirmedDeposit;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to confirm deposit',
        isLoading: false,
      });
      throw error;
    }
  },

  getAuditLogs: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        logs: any[];
        pagination: any;
      }>('/admin/audit-logs', { params });

      set({
        auditLogs: response.logs,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch audit logs',
        isLoading: false,
      });
      throw error;
    }
  },

  generateReport: async (options: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any;
      }>('/admin/reports/generate', options);

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to generate report',
        isLoading: false,
      });
      throw error;
    }
  },

  getSystemHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        status: string;
        timestamp: string;
      }>('/admin/system-health');

      set({ isLoading: false });
      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch system health',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));