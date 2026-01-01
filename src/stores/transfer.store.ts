import { create } from 'zustand';
import { apiClient } from '../lib/api-client';
import { Transfer } from '@prisma/client';

export type UserTransfer = Transfer;

interface ValidatedAccount {
  valid: boolean;
  account_number: string;
  holder_name: string;
}

interface TransferLimits {
    daily_limit: number;
    daily_used: number;
    daily_remaining: number;
    per_transaction_limit: number;
}

interface TransferState {
  userTransfers: UserTransfer[];
  validatedAccount: ValidatedAccount | null;
  transferLimits: TransferLimits | null;
  isLoading: boolean;
  error: string | null;
  pagination: any | null;

  validateAccount: (accountNumber: string) => Promise<ValidatedAccount>;
  initiateTransfer: (data: { receiver_account_number: string; amount: number; description: string; transaction_pin: string; sender_account_id: bigint; }) => Promise<any>;
  fetchTransferLimits: () => Promise<void>;
  fetchUserTransfers: (params?: any) => Promise<void>;
  clearValidatedAccount: () => void;
  clearError: () => void;
}

export const useTransferStore = create<TransferState>((set, get) => ({
  userTransfers: [],
  validatedAccount: null,
  transferLimits: null,
  isLoading: false,
  error: null,
  pagination: null,

  clearError: () => set({ error: null }),
  clearValidatedAccount: () => set({ validatedAccount: null }),

  validateAccount: async (accountNumber) => {
    set({ isLoading: true, error: null, validatedAccount: null });
    try {
      const response = await apiClient.validateRecipientAccount<{ data: ValidatedAccount }>(accountNumber);
      set({ validatedAccount: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  initiateTransfer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.initiateTransfer(data);
      // Refetch transfers to update the list
      get().fetchUserTransfers();
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchTransferLimits: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getTransferLimits<{ data: TransferLimits }>();
      set({ transferLimits: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUserTransfers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUserTransfers<{ data: UserTransfer[], pagination: any }>(params);
      set({
        userTransfers: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },
}));
