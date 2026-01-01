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
  // Add other properties as needed by the client
}

export type UserCard = ClientCard;

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

  // User actions
  requestCard: (data: { account_id: bigint; type: CardType; card_type: CardCardType; is_virtual: boolean }) => Promise<UserCard>;
  fetchUserCards: (params?: any) => Promise<void>;

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
