import { create } from 'zustand';
import { apiClient } from '../lib/api-client';
import { Loan } from '@prisma/client';

export type UserLoan = Loan;

// Client-side definition for LoanRepayment
export interface LoanRepayment {
  id: string;
  loan_id: string;
  installment_number: string;
  due_date: Date;
  paid_date: Date | null;
  amount_due: number;
  principal_amount: number;
  interest_amount: number;
  penalty_amount: number;
  total_paid: number;
  status: string; // Use string for status
  days_overdue: number;
  late_fee: number;
  payment_data: any;
  transaction_id: string | null;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

// Client-side definition for LoanEligibility
export interface LoanEligibility {
  eligible: boolean;
  max_amount: number;
  interest_rate: number;
  term_months: number[];
  reason: string;
}

// Client-side definition for LoanCalculator
export interface LoanCalculator {
  amount: number;
  term_months: number;
  interest_rate: number;
  monthly_payment: number;
  total_interest: number;
  total_payment: number;
}

// Client-side definition for LoanDocument
export interface LoanDocument {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  uploaded_at: string;
  path: string;
}

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
  eligibility: LoanEligibility | null; // Added
  calculator: LoanCalculator | null; // Added
  repaymentSchedule: LoanRepayment[] | null; // Added
  documents: LoanDocument[] | null; // Added
  summary: any | null; // Added

  // User actions
  applyForLoan: (data: { amount: number; term_months: number; purpose: string; loan_type: LoanType; account_id: bigint; }) => Promise<UserLoan>;
  fetchUserLoans: (params?: any) => Promise<void>;
  checkEligibility: (userId: bigint, criteria: any) => Promise<LoanEligibility>; // Added
  calculateLoan: (amount: number, termMonths: number, interestRate: number) => Promise<LoanCalculator>; // Added
  makeRepayment: (loanId: string, repaymentData: any) => Promise<any>; // Added
  getRepaymentSchedule: (loanId: string) => Promise<LoanRepayment[]>; // Added
  getLoanDocuments: (loanId: string) => Promise<LoanDocument[]>; // Added
  uploadLoanDocument: (loanId: string, file: File) => Promise<any>; // Added
  cancelLoanApplication: (loanId: string, reason: string) => Promise<void>; // Added
  getLoanSummary: () => Promise<any>; // Added

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
  eligibility: null,
  calculator: null,
  repaymentSchedule: null,
  documents: null,
  summary: null,

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

  checkEligibility: async (userId, criteria) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.checkEligibility<{ data: LoanEligibility }>(userId, criteria);
      set({ eligibility: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  calculateLoan: async (amount, termMonths, interestRate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.calculateLoan<{ data: LoanCalculator }>(amount, termMonths, interestRate);
      set({ calculator: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  makeRepayment: async (loanId, repaymentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.makeRepayment<{ data: any }>(loanId, repaymentData);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getRepaymentSchedule: async (loanId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getRepaymentSchedule<{ data: LoanRepayment[] }>(loanId);
      set({ repaymentSchedule: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getLoanDocuments: async (loanId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getLoanDocuments<{ data: LoanDocument[] }>(loanId);
      set({ documents: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  uploadLoanDocument: async (loanId, file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('document', file);
      const response = await apiClient.uploadLoanDocument<{ data: any }>(loanId, formData);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  cancelLoanApplication: async (loanId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.cancelLoanApplication(loanId, reason);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getLoanSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getLoanSummary<{ data: any }>();
      set({ summary: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
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
