import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface ManualDeposit {
  id: string;
  deposit_reference: string;
  amount: number;
  method: string;
  status: string;
  receipt_url?: string;
  created_at: string;
  confirmed_at?: string;
  sender_bank?: string;
  sender_account?: string;
  sender_name?: string;
  account?: {
    account_number: string;
    account_name: string;
  };
}

export interface CompanyAccountDetails {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  swift_code?: string;
  iban?: string;
  bank_address?: string;
  wallet_address?: string;
  network?: string;
  instructions: string[];
}

export interface ManualDepositState {
  deposits: ManualDeposit[];
  companyAccount: CompanyAccountDetails | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  createManualDeposit: (depositData: any) => Promise<any>;
  uploadProof: (
    depositId: string,
    file: File,
    notes?: string
  ) => Promise<ManualDeposit>;
  getDeposits: (
    filters?: any
  ) => Promise<{ deposits: ManualDeposit[]; pagination: any }>;
  getCompanyAccountDetails: (
    method: string,
    currency?: string
  ) => Promise<CompanyAccountDetails>;

  // UI Actions
  clearDeposits: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useManualDepositStore = create<ManualDepositState>((set, get) => ({
  deposits: [],
  companyAccount: null,
  isLoading: false,
  error: null,

  createManualDeposit: async (depositData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createManualDeposit(depositData);
      const data = response.data;

      set((state) => ({
        deposits: [data.deposit, ...state.deposits],
        companyAccount: data.company_account,
        isLoading: false
      }));

      return data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to create deposit',
        isLoading: false
      });
      throw error;
    }
  },

  uploadProof: async (depositId: string, file: File, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('proof_file', file);
      if (notes) {
        formData.append('additional_notes', notes);
      }

      const response = await apiClient.uploadDepositProof(depositId, formData);

      const deposit = response.data;
      set((state) => ({
        deposits: state.deposits.map((d) => (d.id === depositId ? deposit : d)),
        isLoading: false
      }));

      return deposit;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to upload proof',
        isLoading: false
      });
      throw error;
    }
  },

  getDeposits: async (filters?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getManualDeposits(filters);
      const data = response.data ?? response;
      const deposits = Array.isArray(data)
        ? data
        : data.deposits || data.data || [];

      set({
        deposits,
        isLoading: false
      });

      return data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch deposits',
        isLoading: false
      });
      throw error;
    }
  },

  getCompanyAccountDetails: async (method: string, currency = 'USD') => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCompanyAccountDetails(
        method,
        currency
      );
      const details = response.data;

      set({
        companyAccount: details,
        isLoading: false
      });

      return details;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch company account',
        isLoading: false
      });
      throw error;
    }
  },

  clearDeposits: () => set({ deposits: [], companyAccount: null }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
