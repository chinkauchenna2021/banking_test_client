import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface Account {
  id: string;
  user_id: string;
  account_number: string;
  account_name: string;
  account_type: string;
  currency: string;
  balance: string;
  available_balance: string;
  ledger_balance: string;
  status: string;
  minimum_balance: string;
  overdraft_limit: string;
  interest_rate: string;
  opening_date: string;
  last_activity_date: string;
  branch_code: string;
  routing_number: string;
  iban: string;
  swift_code: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: string;
  status: string;
  amount: string;
  charge: string;
  total_amount: string;
  balance_before: string;
  balance_after: string;
  currency: string;
  description: string;
  recipient_account_number?: string;
  recipient_name?: string;
  sender_account_number?: string;
  sender_name?: string;
  created_at: string;
  completed_at?: string;
}

export interface AccountState {
  accounts: Account[];
  currentAccount: Account | null;
  transactions: Transaction[];
  accountStats: {
    totalBalance: number;
    totalAccounts: number;
    activeAccounts: number;
  } | null;
  isLoading: boolean;
  error: string | null;

  // Account Actions
  createAccount: (accountData: any) => Promise<Account>;
  getAccounts: (
    params?: any
  ) => Promise<{ accounts: Account[]; pagination: any }>;
  getAccountDetails: (accountId: string) => Promise<Account>;
  updateAccount: (accountId: string, updateData: any) => Promise<Account>;
  closeAccount: (
    accountId: string,
    reason: string,
    transferAccountId?: string
  ) => Promise<void>;

  // Account Operations
  getAccountBalance: (accountId: string) => Promise<any>;
  getAccountTransactions: (
    accountId: string,
    params?: any
  ) => Promise<{ transactions: Transaction[]; pagination: any }>;
  getAccountStatement: (accountId: string, params?: any) => Promise<any>;
  internalTransfer: (data: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    description?: string;
  }) => Promise<any>;

  // UI Actions
  setCurrentAccount: (account: Account | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  currentAccount: null,
  transactions: [],
  accountStats: null,
  isLoading: false,
  error: null,

  createAccount: async (accountData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: Account;
        message: string;
      }>('/accounts', accountData);

      const newAccount = response.data;
      set((state) => ({
        accounts: [...state.accounts, newAccount],
        isLoading: false
      }));

      return newAccount;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to create account',
        isLoading: false
      });
      throw error;
    }
  },

  getAccounts: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        accounts: Account[];
        pagination: any;
      }>('/accounts', { params });

      set({
        accounts: response.accounts,
        isLoading: false
      });

      return response;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch accounts',
        isLoading: false
      });
      throw error;
    }
  },

  getAccountDetails: async (accountId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Account;
      }>(`/accounts/${accountId}`);

      const account = response.data;
      set({
        currentAccount: account,
        isLoading: false
      });

      return account;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch account details',
        isLoading: false
      });
      throw error;
    }
  },

  updateAccount: async (accountId: string, updateData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put<{
        success: boolean;
        data: Account;
        message: string;
      }>(`/accounts/${accountId}`, updateData);

      const updatedAccount = response.data;
      set((state) => ({
        accounts: state.accounts.map((acc) =>
          acc.id === accountId ? updatedAccount : acc
        ),
        currentAccount:
          state.currentAccount?.id === accountId
            ? updatedAccount
            : state.currentAccount,
        isLoading: false
      }));

      return updatedAccount;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to update account',
        isLoading: false
      });
      throw error;
    }
  },

  closeAccount: async (
    accountId: string,
    reason: string,
    transferAccountId?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/accounts/${accountId}`, {
        data: { reason, transfer_account_id: transferAccountId }
      });

      set((state) => ({
        accounts: state.accounts.filter((acc) => acc.id !== accountId),
        currentAccount:
          state.currentAccount?.id === accountId ? null : state.currentAccount,
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to close account',
        isLoading: false
      });
      throw error;
    }
  },

  getAccountBalance: async (accountId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
      }>(`/accounts/${accountId}/balance`);

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch balance',
        isLoading: false
      });
      throw error;
    }
  },

  getAccountTransactions: async (accountId: string, params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        transactions: Transaction[];
        pagination: any;
      }>(`/accounts/${accountId}/transactions`, { params });

      set({
        transactions: response.transactions,
        isLoading: false
      });

      return response;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch transactions',
        isLoading: false
      });
      throw error;
    }
  },

  getAccountStatement: async (accountId: string, params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: any;
      }>(`/accounts/${accountId}/statement`, { params });

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch statement',
        isLoading: false
      });
      throw error;
    }
  },

  internalTransfer: async (data: {
    from_account_id: string;
    to_account_id: string;
    amount: number;
    description?: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any;
        message: string;
      }>('/accounts/internal-transfer', data);

      // Refresh account data after transfer
      const { getAccounts, getAccountDetails } = get();
      await getAccounts();
      if (data.from_account_id) {
        await getAccountDetails(data.from_account_id);
      }

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error || error.message || 'Transfer failed',
        isLoading: false
      });
      throw error;
    }
  },

  setCurrentAccount: (account: Account | null) =>
    set({ currentAccount: account }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
