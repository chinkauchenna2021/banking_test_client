import { create } from 'zustand';
import { apiClient } from '../lib/api-client';
// import { Transfer } from '@prisma/client'; // Removed server-side import

// Client-side definition of Transfer interface, mirroring necessary properties
export interface ClientTransfer {
  id: string;
  sender_id: bigint;
  receiver_id: bigint;
  sender_account_id: bigint;
  receiver_account_id: bigint;
  transfer_reference: string;
  status: string; // Use string for status
  amount: number;
  fee: number;
  currency: string;
  description: string | null;
  sender_note: string | null;
  receiver_note: string | null;
  scheduled_for: Date | null;
  created_at: Date;
  updated_at: Date;
  recipient_bank?: string;
  recipient_address?: string;
  recipient_routing_number?: string;
  // Add other properties as needed by the client
}

export type UserTransfer = ClientTransfer;

// Client-side definition for CreateTransferDto
export interface CreateTransferDto {
  sender_account_id: bigint;
  receiver_account_number: string;
  amount: number;
  description?: string;
  transaction_pin?: string;
  scheduled_for?: Date;
  recipient_bank?: string;
  recipient_address?: string;
  recipient_routing_number?: string;
}

// Client-side definition for TransferQueryParams
export interface TransferQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  direction?: 'sent' | 'received';
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
}

interface ValidatedAccount {
  valid: boolean;
  account_number: string;
  account_name: string;
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
  scheduledTransfers: UserTransfer[]; // Added
  transferFees: any | null; // Added

  validateAccount: (accountNumber: string) => Promise<ValidatedAccount>;
  initiateTransfer: (data: CreateTransferDto) => Promise<any>; // Updated type
  fetchTransferLimits: () => Promise<void>;
  fetchUserTransfers: (params?: TransferQueryParams) => Promise<void>; // Updated type
  fetchScheduledTransfers: (params?: TransferQueryParams) => Promise<void>; // Added
  cancelTransfer: (transferId: string, reason: string) => Promise<void>; // Added
  scheduleTransfer: (data: CreateTransferDto) => Promise<any>; // Added
  cancelScheduledTransfer: (transferId: string) => Promise<void>; // Added
  calculateFees: (
    amount: number,
    currency: string,
    type: string
  ) => Promise<any>; // Added
  getTransferDetails: (transferId: string) => Promise<UserTransfer>; // Added

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
  scheduledTransfers: [], // Initial state
  transferFees: null, // Initial state

  clearError: () => set({ error: null }),
  clearValidatedAccount: () => set({ validatedAccount: null }),

  validateAccount: async (accountNumber) => {
    set({ isLoading: true, error: null, validatedAccount: null });
    try {
      const response = await apiClient.validateRecipientAccount<{
        data: ValidatedAccount;
      }>(accountNumber);
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
      const response = await apiClient.getTransferLimits<{
        data: TransferLimits;
      }>();
      set({ transferLimits: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchUserTransfers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUserTransfers<{
        data: UserTransfer[];
        pagination: any;
      }>(params);
      set({
        userTransfers: response.data,
        pagination: response.pagination,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchScheduledTransfers: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getScheduledTransfers<{
        data: UserTransfer[];
        pagination: any;
      }>(params);
      set({
        scheduledTransfers: response.data,
        isLoading: false
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  cancelTransfer: async (transferId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.cancelTransfer(transferId, reason);
      get().fetchUserTransfers(); // Refresh list
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  scheduleTransfer: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.scheduleTransfer(data);
      get().fetchScheduledTransfers(); // Refresh list
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  cancelScheduledTransfer: async (transferId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.cancelScheduledTransfer(transferId);
      get().fetchScheduledTransfers(); // Refresh list
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  calculateFees: async (amount, currency, type) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getTransferFees<{ data: any }>(
        amount,
        currency,
        type
      );
      set({ transferFees: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getTransferDetails: async (transferId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getTransferDetails<{
        data: UserTransfer;
      }>(transferId);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  }
}));
