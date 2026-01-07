import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  name: string;
  provider: string | null;
  account_number: string | null;
  account_holder: string | null;
  routing_number: string | null;
  swift_code: string | null;
  iban: string | null;
  bank_name: string | null;
  bank_country: string | null;
  crypto_wallet_address: string | null;
  crypto_type: string | null;
  card_number: string | null;
  card_holder: string | null;
  card_expiry: string | null;
  mobile_number: string | null;
  mobile_provider: string | null;
  paypal_email: string | null;
  is_default: boolean;
  status: string;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  account_id: string;
  reference: string;
  transaction_id: string;
  type: string;
  status: string;
  amount: string;
  charge: string;
  total_amount: string;
  currency: string;
  description: string;
  metadata: any;
  created_at: string;
  completed_at: string | null;
}

export interface PaymentFees {
  amount: number;
  currency: string;
  method: string;
  fee_percentage: number;
  fee_amount: number;
  total_amount: number;
}

export interface PaymentState {
  paymentMethods: PaymentMethod[];
  payments: Payment[];
  fees: PaymentFees | null;
  isLoading: boolean;
  error: string | null;

  // Payment Operations
  initiatePayment: (paymentData: any) => Promise<Payment>;
  verifyPayment: (reference: string) => Promise<Payment>;
  getPaymentHistory: (
    params?: any
  ) => Promise<{ payments: Payment[]; pagination: any }>;
  getPaymentFees: (
    amount: number,
    currency?: string,
    method?: string
  ) => Promise<PaymentFees>;

  // Payment Methods Management
  getPaymentMethods: () => Promise<PaymentMethod[]>;
  addPaymentMethod: (methodData: any) => Promise<PaymentMethod>;
  updatePaymentMethod: (
    methodId: string,
    updateData: any
  ) => Promise<PaymentMethod>;
  deletePaymentMethod: (methodId: string) => Promise<void>;
  setDefaultPaymentMethod: (methodId: string) => Promise<PaymentMethod>;

  // UI Actions
  clearPayments: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentMethods: [],
  payments: [],
  fees: null,
  isLoading: false,
  error: null,

  initiatePayment: async (paymentData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: Payment;
        message: string;
      }>('/payments', paymentData);

      const payment = response.data;
      set((state) => ({
        payments: [payment, ...state.payments],
        isLoading: false
      }));

      return payment;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to initiate payment',
        isLoading: false
      });
      throw error;
    }
  },

  verifyPayment: async (reference: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Payment;
      }>(`/payments/verify/${reference}`);

      const payment = response.data;
      set((state) => ({
        payments: state.payments.map((p) =>
          p.reference === reference ? payment : p
        ),
        isLoading: false
      }));

      return payment;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to verify payment',
        isLoading: false
      });
      throw error;
    }
  },

  getPaymentHistory: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        payments: Payment[];
        pagination: any;
      }>('/payments/history', { params });

      set({
        payments: response.payments,
        isLoading: false
      });

      return response;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch payment history',
        isLoading: false
      });
      throw error;
    }
  },

  getPaymentFees: async (
    amount: number,
    currency: string = 'USD',
    method?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const params: any = { amount, currency };
      if (method) params.method = method;

      const response = await apiClient.get<{
        success: boolean;
        data: PaymentFees;
      }>('/payments/fees', { params });

      set({
        fees: response.data,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to calculate payment fees',
        isLoading: false
      });
      throw error;
    }
  },

  getPaymentMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: PaymentMethod[];
      }>('/payments/payment-methods');

      set({
        paymentMethods: response.data,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch payment methods',
        isLoading: false
      });
      throw error;
    }
  },

  addPaymentMethod: async (methodData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: PaymentMethod;
        message: string;
      }>('/payments/payment-methods', methodData);

      const method = response.data;
      set((state) => ({
        paymentMethods: [...state.paymentMethods, method],
        isLoading: false
      }));

      return method;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to add payment method',
        isLoading: false
      });
      throw error;
    }
  },

  updatePaymentMethod: async (methodId: string, updateData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put<{
        success: boolean;
        data: PaymentMethod;
        message: string;
      }>(`/payments/payment-methods/${methodId}`, updateData);

      const updatedMethod = response.data;
      set((state) => ({
        paymentMethods: state.paymentMethods.map((method) =>
          method.id === methodId ? updatedMethod : method
        ),
        isLoading: false
      }));

      return updatedMethod;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to update payment method',
        isLoading: false
      });
      throw error;
    }
  },

  deletePaymentMethod: async (methodId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/payments/payment-methods/${methodId}`);

      set((state) => ({
        paymentMethods: state.paymentMethods.filter(
          (method) => method.id !== methodId
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to delete payment method',
        isLoading: false
      });
      throw error;
    }
  },

  setDefaultPaymentMethod: async (methodId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: PaymentMethod;
        message: string;
      }>(`/payments/payment-methods/${methodId}/default`);

      const defaultMethod = response.data;
      set((state) => ({
        paymentMethods: state.paymentMethods.map((method) => ({
          ...method,
          is_default: method.id === methodId
        })),
        isLoading: false
      }));

      return defaultMethod;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to set default payment method',
        isLoading: false
      });
      throw error;
    }
  },

  clearPayments: () => set({ payments: [], fees: null }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
