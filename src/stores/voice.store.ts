import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface VoiceBalanceRequest {
  id: string;
  user_id: string;
  from_number: string;
  to_number: string;
  call_sid?: string;
  call_status: 'initiated' | 'in_progress' | 'completed' | 'failed';
  language: string;
  voice_type: string;
  balance_amount: number;
  currency: string;
  audio_text: string;
  twilio_response?: any;
  call_metadata?: Record<string, any>;
  error_message?: string;
  is_successful?: boolean;
  call_initiated_at: string;
  call_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface VoiceStatistics {
  total_calls: number;
  successful_calls: number;
  failed_calls: number;
  success_rate: string;
  recent_calls: VoiceBalanceRequest[];
}

export interface SupportedLanguage {
  code: string;
  name: string;
}

export interface SupportedVoiceType {
  code: string;
  name: string;
}

export interface VoiceState {
  voiceRequests: VoiceBalanceRequest[];
  currentRequest: VoiceBalanceRequest | null;
  voiceStatistics: VoiceStatistics | null;
  supportedLanguages: SupportedLanguage[];
  supportedVoiceTypes: SupportedVoiceType[];
  isLoading: boolean;
  error: string | null;

  // Voice Actions
  requestBalance: (data: {
    phone_number: string;
    language?: string;
    voice_type?: string;
  }) => Promise<VoiceBalanceRequest>;
  getBalanceRequests: (filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => Promise<{
    requests: VoiceBalanceRequest[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }>;
  getRequestDetails: (requestId: string) => Promise<VoiceBalanceRequest>;

  // Information Actions
  getSupportedLanguages: () => Promise<SupportedLanguage[]>;
  getSupportedVoiceTypes: () => Promise<SupportedVoiceType[]>;

  // Statistics and Testing
  getVoiceStatistics: () => Promise<VoiceStatistics>;
  testVoiceCall: (phone_number: string, message?: string) => Promise<any>;

  // UI Actions
  setCurrentRequest: (request: VoiceBalanceRequest | null) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useVoiceStore = create<VoiceState>((set, get) => ({
  voiceRequests: [],
  currentRequest: null,
  voiceStatistics: null,
  supportedLanguages: [],
  supportedVoiceTypes: [],
  isLoading: false,
  error: null,

  requestBalance: async (data: {
    phone_number: string;
    language?: string;
    voice_type?: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: VoiceBalanceRequest;
        message: string;
      }>('/voice/balance/request', data);

      const request = response.data;

      // Refresh voice requests
      await get().getBalanceRequests();

      set({
        currentRequest: request,
        isLoading: false
      });

      return request;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to request balance',
        isLoading: false
      });
      throw error;
    }
  },

  getBalanceRequests: async (filters?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        requests?: VoiceBalanceRequest[];
        data?: VoiceBalanceRequest[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>('/voice/balance/requests', { params: filters });

      const requests = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.requests)
          ? response.requests
          : [];

      set({
        voiceRequests: requests,
        isLoading: false
      });

      return {
        requests,
        pagination: response.pagination
      };
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch balance requests',
        isLoading: false
      });
      throw error;
    }
  },

  getRequestDetails: async (requestId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: VoiceBalanceRequest;
      }>(`/voice/balance/requests/${requestId}`);

      const request = response.data;
      set({
        currentRequest: request,
        isLoading: false
      });

      return request;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch request details',
        isLoading: false
      });
      throw error;
    }
  },

  getSupportedLanguages: async () => {
    if (get().supportedLanguages.length > 0) {
      return get().supportedLanguages;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: SupportedLanguage[];
      }>('/voice/languages');

      const languages = response.data;
      set({
        supportedLanguages: languages,
        isLoading: false
      });

      return languages;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch supported languages',
        isLoading: false
      });
      throw error;
    }
  },

  getSupportedVoiceTypes: async () => {
    if (get().supportedVoiceTypes.length > 0) {
      return get().supportedVoiceTypes;
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: SupportedVoiceType[];
      }>('/voice/voice-types');

      const voiceTypes = response.data;
      set({
        supportedVoiceTypes: voiceTypes,
        isLoading: false
      });

      return voiceTypes;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch supported voice types',
        isLoading: false
      });
      throw error;
    }
  },

  getVoiceStatistics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: VoiceStatistics;
      }>('/voice/balance/statistics');

      const statistics = response.data;
      set({
        voiceStatistics: statistics,
        isLoading: false
      });

      return statistics;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch voice statistics',
        isLoading: false
      });
      throw error;
    }
  },

  testVoiceCall: async (phone_number: string, message?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: any;
        message: string;
      }>('/voice/balance/test', { phone_number, message });

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error || error.message || 'Test call failed',
        isLoading: false
      });
      throw error;
    }
  },

  setCurrentRequest: (request: VoiceBalanceRequest | null) =>
    set({ currentRequest: request }),

  clearError: () => set({ error: null }),

  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
