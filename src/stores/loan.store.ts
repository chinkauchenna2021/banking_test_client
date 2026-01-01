import { create } from 'zustand';
import { apiClient } from '../lib/api-client';
import { Loan } from '@prisma/client';

export type UserLoan = Loan;

// Client-side definition of LoanType enum
export enum LoanType {
  personal = 'personal',
  business = 'business',
  mortgage = 'mortgage',
  auto = 'auto',
  education = 'education',
  emergency = 'emergency',
}

interface LoanState {
  userLoans: UserLoan[];
  pendingLoans: UserLoan[]; // For admin
  isLoading: boolean;
  error: string | null;
  pagination: any | null;

  // User actions
  applyForLoan: (data: { amount: number; term_months: number; purpose: string; loan_type: LoanType; account_id: bigint; }) => Promise<UserLoan>;
  fetchUserLoans: (params?: any) => Promise<void>;

  // Admin actions
  fetchPendingLoans: (params?: any) => Promise<void>;
  approveLoan: (loanId: string, notes: string) => Promise<void>;
  rejectLoan: (loanId: string, reason: string) => Promise<void>;

  clearError: () => void;
}

export const useLoanStore = create<LoanState>((set, get) => ({
  userLoans: [],
  pendingLoans: [],
  isLoading: false,
  error: null,
  pagination: null,

  clearError: () => set({ error: null }),

  applyForLoan: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.applyForLoan<{ data: UserLoan }>(data);
      set((state) => ({
        userLoans: [response.data, ...state.userLoans],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchUserLoans: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUserLoans<{ data: UserLoan[], pagination: any }>(params);
      set({
        userLoans: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchPendingLoans: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getPendingLoans<{ data: UserLoan[], pagination: any }>(params);
      set({
        pendingLoans: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  approveLoan: async (loanId, notes) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.approveLoan(loanId, notes);
      set((state) => ({
        pendingLoans: state.pendingLoans.filter((l) => l.id !== loanId),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  rejectLoan: async (loanId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.rejectLoan(loanId, reason);
      set((state) => ({
        pendingLoans: state.pendingLoans.filter((l) => l.id !== loanId),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
