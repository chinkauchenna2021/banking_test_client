import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

// This should match the Prisma model, but we only define what we need client-side
interface CompanyInformation {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  bank_accounts?: any; // JSON field
  crypto_wallets?: any; // JSON field
  [key: string]: any;
}

interface CompanyState {
  information: CompanyInformation | null;
  isLoading: boolean;
  error: string | null;
  getCompanyInformation: () => Promise<void>;
  updateBankAccounts: (data: any) => Promise<CompanyInformation>;
  updateCryptoWallets: (data: any) => Promise<CompanyInformation>;
  clearError: () => void;
}

export const useCompanyStore = create<CompanyState>((set, get) => ({
  information: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  getCompanyInformation: async () => {
    if (get().information) return; // Avoid refetching if already present
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCompanyInformation<{ data: CompanyInformation }>();
      set({ information: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateBankAccounts: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateBankAccounts<{ data: CompanyInformation }>(data);
      set({ information: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateCryptoWallets: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateCryptoWallets<{ data: CompanyInformation }>(data);
      set({ information: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
