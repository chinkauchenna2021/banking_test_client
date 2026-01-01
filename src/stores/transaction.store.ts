import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  reference: string;
  transaction_id: string;
  type: 'transfer' | 'deposit' | 'withdrawal' | 'payment' | 'charge' | 'refund' | 'interest';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: string;
  charge: string;
  tax: string;
  total_amount: string;
  balance_before: string;
  balance_after: string;
  currency: string;
  recipient_account_number?: string;
  recipient_name?: string;
  recipient_bank?: string;
  sender_account_number?: string;
  sender_name?: string;
  description: string;
  remarks?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, any>;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TransferRequest {
  senderAccountId: string;
  receiverAccountNumber: string;
  amount: number;
  description?: string;
  senderNote?: string;
  transactionPin?: string;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: Transaction['type'];
  status?: Transaction['status'];
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  account_id?: string;
}

export interface TransactionSummary {
  total_transactions: number;
  total_amount: number;
  total_fees: number;
  by_type: Record<string, { count: number; amount: number }>;
  by_status: Record<string, number>;
}

export interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  transactionSummary: TransactionSummary | null;
  recentTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Transaction Actions
  getTransactions: (params?: TransactionQueryParams) => Promise<{
    data: Transaction[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }>;
  getTransactionDetails: (transactionId: string) => Promise<Transaction>;
  initiateTransfer: (transferData: TransferRequest) => Promise<{
    transaction: any;
    transfer: any;
    requires_approval: boolean;
  }>;
  getTransactionSummary: (period?: string) => Promise<TransactionSummary>;
  exportTransactions: (params: {
    start_date?: string;
    end_date?: string;
    format?: 'csv' | 'pdf' | 'json';
  }) => Promise<any>;
  verifyTransaction: (transactionId: string, otp: string) => Promise<void>;
  cancelTransaction: (transactionId: string, reason?: string) => Promise<void>;

  // Additional Actions
  getRecentTransactions: (limit?: number) => Promise<Transaction[]>;
  getTransactionStats: () => Promise<{
    daily: { count: number; amount: number };
    monthly: { count: number; amount: number };
    yearly: { count: number; amount: number };
  }>;
  searchTransactions: (query: string, limit?: number) => Promise<Transaction[]>;
  getTransactionByReference: (reference: string) => Promise<Transaction | null>;

  // UI Actions
  setCurrentTransaction: (transaction: Transaction | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  currentTransaction: null,
  transactionSummary: null,
  recentTransactions: [],
  isLoading: false,
  error: null,

  getTransactions: async (params?: TransactionQueryParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Transaction[];
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPrevPage: boolean;
        };
      }>('/transactions', { params });

      set({
        transactions: response.data,
        isLoading: false,
      });

      return {
        data: response.data,
        meta: response.meta,
      };
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  getTransactionDetails: async (transactionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Transaction;
      }>(`/transactions/${transactionId}`);

      const transaction = response.data;
      set({
        currentTransaction: transaction,
        isLoading: false,
      });

      return transaction;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch transaction details',
        isLoading: false,
      });
      throw error;
    }
  },

  initiateTransfer: async (transferData: TransferRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: {
          transaction: any;
          transfer: any;
          requires_approval: boolean;
        };
        message: string;
      }>('/transactions/transfer', transferData);

      const result = response.data;
      
      // Refresh transactions
      await get().getTransactions();
      
      set({ isLoading: false });
      return result;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Transfer failed',
        isLoading: false,
      });
      throw error;
    }
  },

  getTransactionSummary: async (period: string = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: TransactionSummary;
      }>('/transactions/summary', { params: { period } });

      const summary = response.data;
      set({
        transactionSummary: summary,
        isLoading: false,
      });

      return summary;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch transaction summary',
        isLoading: false,
      });
      throw error;
    }
  },

  exportTransactions: async (params: {
    start_date?: string;
    end_date?: string;
    format?: 'csv' | 'pdf' | 'json';
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any;
      }>('/transactions/export', params);

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to export transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyTransaction: async (transactionId: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/transactions/${transactionId}/verify`, { otp });

      // Refresh transaction details
      await get().getTransactionDetails(transactionId);
      await get().getTransactions();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Verification failed',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelTransaction: async (transactionId: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post<{
        success: boolean;
        message: string;
      }>(`/transactions/${transactionId}/cancel`, { reason });

      // Refresh transaction details
      await get().getTransactionDetails(transactionId);
      await get().getTransactions();
      
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to cancel transaction',
        isLoading: false,
      });
      throw error;
    }
  },

  getRecentTransactions: async (limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Transaction[];
      }>('/transactions/recent', { params: { limit } });

      const recent = response.data;
      set({
        recentTransactions: recent,
        isLoading: false,
      });

      return recent;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch recent transactions',
        isLoading: false,
      });
      throw error;
    }
  },

  getTransactionStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: {
          daily: { count: number; amount: number };
          monthly: { count: number; amount: number };
          yearly: { count: number; amount: number };
        };
      }>('/transactions/stats');

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch transaction stats',
        isLoading: false,
      });
      throw error;
    }
  },

  searchTransactions: async (query: string, limit: number = 20) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Transaction[];
      }>('/transactions/search', { params: { query, limit } });

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Search failed',
        isLoading: false,
      });
      throw error;
    }
  },

  getTransactionByReference: async (reference: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Transaction;
      }>(`/transactions/reference/${reference}`);

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Transaction not found',
        isLoading: false,
      });
      return null;
    }
  },

  setCurrentTransaction: (transaction: Transaction | null) => 
    set({ currentTransaction: transaction }),
  
  clearError: () => set({ error: null }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));