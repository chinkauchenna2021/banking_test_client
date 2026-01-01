import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface Receipt {
  id: string;
  user_id: string;
  receipt_number: string;
  type: string;
  transaction_id: string | null;
  deposit_id: string | null;
  transfer_id: string | null;
  amount: string;
  fee: string;
  tax: string;
  total: string;
  currency: string;
  payer_name: string;
  payer_email: string;
  payer_account: string;
  receiver_name: string;
  receiver_email: string;
  receiver_account: string;
  description: string;
  items: any[];
  verification_code: string;
  pdf_url: string | null;
  qr_code_url: string | null;
  is_verified: boolean;
  verified_at: string | null;
  issued_at: string;
  expires_at: string;
  metadata: any;
  created_at: string;
  updated_at: string;
  transaction?: {
    type: string;
    status: string;
    created_at: string;
  };
  deposit?: {
    method: string;
    status: string;
    created_at: string;
  };
  transfer?: {
    status: string;
    completed_at: string;
  };
}

export interface ReceiptStatistics {
  period: {
    start: string;
    end: string;
  };
  summary: {
    total_receipts: number;
    total_amount: number;
    average_amount: number;
  };
  type_summary: any[];
  recent_receipts: any[];
}

export interface ReceiptState {
  receipts: Receipt[];
  currentReceipt: Receipt | null;
  statistics: ReceiptStatistics | null;
  isLoading: boolean;
  error: string | null;

  // Receipt Management
  generateReceipt: (data: any) => Promise<Receipt>;
  getReceipts: (params?: any) => Promise<{ receipts: Receipt[]; pagination: any }>;
  getReceiptDetails: (receiptId: string) => Promise<Receipt>;
  downloadReceipt: (receiptId: string, format?: string) => Promise<Blob | Receipt>;
  resendReceipt: (receiptId: string) => Promise<void>;

  // Public Verification
  verifyReceipt: (receiptNumber: string, verificationCode: string) => Promise<any>;

  // Receipt Statistics
  getReceiptStatistics: (period?: string) => Promise<ReceiptStatistics>;

  // UI Actions
  clearReceipts: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useReceiptStore = create<ReceiptState>((set, get) => ({
  receipts: [],
  currentReceipt: null,
  statistics: null,
  isLoading: false,
  error: null,

  generateReceipt: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: Receipt;
        message: string;
      }>('/receipts/generate', data);

      const receipt = response.data;
      set((state) => ({
        receipts: [receipt, ...state.receipts],
        isLoading: false,
      }));

      return receipt;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to generate receipt',
        isLoading: false,
      });
      throw error;
    }
  },

  getReceipts: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        receipts: Receipt[];
        pagination: any;
      }>('/receipts', { params });

      set({
        receipts: response.receipts,
        isLoading: false,
      });

      return response;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch receipts',
        isLoading: false,
      });
      throw error;
    }
  },

  getReceiptDetails: async (receiptId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Receipt;
      }>(`/receipts/${receiptId}`);

      const receipt = response.data;
      set({
        currentReceipt: receipt,
        isLoading: false,
      });

      return receipt;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch receipt details',
        isLoading: false,
      });
      throw error;
    }
  },

  downloadReceipt: async (receiptId: string, format: string = 'pdf') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get(
        `/receipts/${receiptId}/download`,
        {
          params: { format },
          responseType: format === 'pdf' ? 'blob' : 'json',
        }
      );

      set({ isLoading: false });

      if (format === 'pdf') {
        return response as Blob;
      } else {
        return response as Receipt;
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to download receipt',
        isLoading: false,
      });
      throw error;
    }
  },

  verifyReceipt: async (receiptNumber: string, verificationCode: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
      }>('/receipts/verify', {
        params: { receipt_number: receiptNumber, verification_code: verificationCode },
      });

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to verify receipt',
        isLoading: false,
      });
      throw error;
    }
  },

  resendReceipt: async (receiptId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post(`/receipts/${receiptId}/resend`);

      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to resend receipt',
        isLoading: false,
      });
      throw error;
    }
  },

  getReceiptStatistics: async (period: string = 'month') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ReceiptStatistics;
      }>('/receipts/statistics', { params: { period } });

      set({
        statistics: response.data,
        isLoading: false,
      });

      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.error || error.message || 'Failed to fetch receipt statistics',
        isLoading: false,
      });
      throw error;
    }
  },

  clearReceipts: () => set({ receipts: [], currentReceipt: null, statistics: null }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));