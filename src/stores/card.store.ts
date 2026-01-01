import { create } from 'zustand';
import { apiClient } from '../lib/api-client';
// import { Card } from '@prisma/client'; // Removed server-side import

// Client-side definition of Card interface, mirroring necessary properties
export interface ClientCard {
  id: string;
  user_id: bigint;
  account_id: bigint;
  type: CardType;
  card_type: CardCardType;
  card_number: string;
  card_holder: string;
  cvv: string | null;
  expiry_month: string;
  expiry_year: string;
  status: string; // Use string for status as client might not need the full enum
  is_virtual: boolean;
  is_default: boolean;
  issue_date: Date;
  activation_date: Date | null;
  expiry_date: Date;
  created_at: Date;
  updated_at: Date;
  limits?: {
    daily_limit?: number;
    transaction_limit?: number;
    monthly_limit?: number;
  };
  // Add other properties as needed by the client
}

export type UserCard = ClientCard;

// Client-side definition for CardTransaction
export interface CardTransaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  created_at: Date;
  metadata: any; // Adjust as needed
}

// Client-side definition for CardUsageSummary
export interface CardUsageSummary {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    total_spent: number;
    transaction_count: number;
    average_transaction: number;
    remaining_limit: number;
  };
  categories: {
    online: number;
    retail: number;
    travel: number;
    other: number;
  };
  recent_transactions: CardTransaction[];
}

// Client-side definition of CardType enum
export enum CardType {
  debit = 'debit',
  credit = 'credit',
  prepaid = 'prepaid',
  virtual = 'virtual',
}

// Client-side definition of CardCardType enum
export enum CardCardType {
  visa = 'visa',
  mastercard = 'mastercard',
  amex = 'amex',
  discover = 'discover',
}

interface CardState {
  userCards: UserCard[];
  pendingCardRequests: UserCard[]; // For admin
  isLoading: boolean;
  error: string | null;
  pagination: any | null;
  cardTransactions: CardTransaction[]; // Added
  usageSummary: CardUsageSummary | null; // Added

  // User actions
  requestCard: (data: { account_id: bigint; type: CardType; card_type: CardCardType; is_virtual: boolean }) => Promise<UserCard>;
  fetchUserCards: (params?: any) => Promise<void>;
  fetchCardTransactions: (cardId: string, params?: any) => Promise<void>; // Added
  fetchCardUsageSummary: (cardId: string, period?: string) => Promise<void>; // Added
  getCardDetails: (cardId: string) => Promise<UserCard>; // Added
  updateCard: (cardId: string, data: any) => Promise<UserCard>; // Added
  activateCard: (cardId: string) => Promise<UserCard>; // Added
  blockCard: (cardId: string, reason: string) => Promise<UserCard>; // Added
  reportCardLost: (cardId: string) => Promise<UserCard>; // Added
  reportCardStolen: (cardId: string) => Promise<UserCard>; // Added
  updateCardLimits: (cardId: string, limits: any) => Promise<UserCard>; // Added
  getVirtualCardDetails: (cardId: string) => Promise<UserCard>; // Added
  generateVirtualCard: (accountId: bigint) => Promise<UserCard>; // Added

  // Admin actions
  fetchPendingCardRequests: (params?: any) => Promise<void>;
  approveCardRequest: (cardId: string) => Promise<void>;
  rejectCardRequest: (cardId: string, reason: string) => Promise<void>;

  clearError: () => void;
}

export const useCardStore = create<CardState>((set, get) => ({
  userCards: [],
  pendingCardRequests: [],
  isLoading: false,
  error: null,
  pagination: null,
  cardTransactions: [], // Initial state
  usageSummary: null, // Initial state

  clearError: () => set({ error: null }),

  requestCard: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.requestCard<{ data: UserCard }>(data);
      set((state) => ({
        userCards: [response.data, ...state.userCards],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchUserCards: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUserCards<{ data: UserCard[], pagination: any }>(params);
      set({
        userCards: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchCardTransactions: async (cardId, params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCardTransactions<{ data: CardTransaction[], pagination: any }>(cardId, params);
      set({ cardTransactions: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  fetchCardUsageSummary: async (cardId, period) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCardUsageSummary<{ data: CardUsageSummary }>(cardId, period);
      set({ usageSummary: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  getCardDetails: async (cardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCardDetails<{ data: UserCard }>(cardId);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateCard: async (cardId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateCard<{ data: UserCard }>(cardId, data);
      set((state) => ({
        userCards: state.userCards.map((c) => (c.id === cardId ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  activateCard: async (cardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.activateCard<{ data: UserCard }>(cardId);
      set((state) => ({
        userCards: state.userCards.map((c) => (c.id === cardId ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  blockCard: async (cardId, reason) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.blockCard<{ data: UserCard }>(cardId, reason);
      set((state) => ({
        userCards: state.userCards.map((c) => (c.id === cardId ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  reportCardLost: async (cardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.reportCardLost<{ data: UserCard }>(cardId);
      set((state) => ({
        userCards: state.userCards.map((c) => (c.id === cardId ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  reportCardStolen: async (cardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.reportCardStolen<{ data: UserCard }>(cardId);
      set((state) => ({
        userCards: state.userCards.map((c) => (c.id === cardId ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  updateCardLimits: async (cardId, limits) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateCardLimits<{ data: UserCard }>(cardId, limits);
      set((state) => ({
        userCards: state.userCards.map((c) => (c.id === cardId ? response.data : c)),
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  getVirtualCardDetails: async (cardId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getVirtualCardDetails<{ data: UserCard }>(cardId);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  generateVirtualCard: async (accountId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.generateVirtualCard<{ data: UserCard }>(accountId);
      set((state) => ({
        userCards: [response.data, ...state.userCards],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  fetchPendingCardRequests: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getPendingCardRequests<{ data: UserCard[], pagination: any }>(params);
      set({
        pendingCardRequests: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  approveCardRequest: async (cardId) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.approveCardRequest(cardId);
      set((state) => ({
        pendingCardRequests: state.pendingCardRequests.filter((c) => c.id !== cardId),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  rejectCardRequest: async (cardId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.rejectCardRequest(cardId, reason);
      set((state) => ({
        pendingCardRequests: state.pendingCardRequests.filter((c) => c.id !== cardId),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
