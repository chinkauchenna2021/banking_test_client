import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

export interface ContactMessage {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  type: string;
  priority: string;
  status: string;
  attachments: any[] | null;
  read_at: string | null;
  replied_at: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  assigned_to_user?: {
    first_name: string;
    last_name: string;
  };
}

export interface ContactCategory {
  id: string;
  name: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export interface SupportHours {
  email: string;
  phone: string;
  chat: string;
  holidays: string[];
}

export interface ResponseTime {
  average_hours: number;
  message: string;
  sample_size?: number;
}

export interface ContactState {
  messages: ContactMessage[];
  categories: ContactCategory[];
  faqs: FAQ[];
  supportHours: SupportHours | null;
  responseTime: ResponseTime | null;
  isLoading: boolean;
  error: string | null;

  // Public Actions
  sendMessage: (messageData: any) => Promise<ContactMessage>;
  getContactCategories: () => Promise<ContactCategory[]>;
  getFaqs: () => Promise<FAQ[]>;
  getSupportHours: () => Promise<SupportHours>;
  getResponseTime: () => Promise<ResponseTime>;

  // Authenticated Actions
  getMessages: (
    params?: any
  ) => Promise<{ messages: ContactMessage[]; pagination: any }>;
  getMessageDetails: (messageId: string) => Promise<ContactMessage>;
  updateMessage: (
    messageId: string,
    updateData: any
  ) => Promise<ContactMessage>;
  deleteMessage: (messageId: string) => Promise<void>;
  sendTestMessage: (messageData: any) => Promise<ContactMessage>;

  // UI Actions
  clearMessages: () => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useContactStore = create<ContactState>((set, get) => ({
  messages: [],
  categories: [],
  faqs: [],
  supportHours: null,
  responseTime: null,
  isLoading: false,
  error: null,

  sendMessage: async (messageData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: ContactMessage;
        message: string;
      }>('/contact', messageData);

      const message = response.data;
      set({ isLoading: false });
      return message;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to send message',
        isLoading: false
      });
      throw error;
    }
  },

  getContactCategories: async () => {
    const cacheKey = 'contact:categories';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ContactCategory[];
      }>('/contact/categories');

      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      set({
        categories: response.data,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch contact categories',
        isLoading: false
      });
      throw error;
    }
  },

  getFaqs: async () => {
    const cacheKey = 'contact:faqs';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: FAQ[];
      }>('/contact/faqs');

      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      set({
        faqs: response.data,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch FAQs',
        isLoading: false
      });
      throw error;
    }
  },

  getSupportHours: async () => {
    const cacheKey = 'contact:support-hours';
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: SupportHours;
      }>('/contact/support-hours');

      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      set({
        supportHours: response.data,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch support hours',
        isLoading: false
      });
      throw error;
    }
  },

  getResponseTime: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ResponseTime;
      }>('/contact/response-time');

      set({
        responseTime: response.data,
        isLoading: false
      });

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch response time',
        isLoading: false
      });
      throw error;
    }
  },

  getMessages: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        messages?: ContactMessage[];
        data?: ContactMessage[];
        pagination: any;
      }>('/contact/messages', { params });

      const messages = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.messages)
          ? response.messages
          : [];

      set({
        messages,
        isLoading: false
      });

      return { messages, pagination: response.pagination };
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch messages',
        isLoading: false
      });
      throw error;
    }
  },

  getMessageDetails: async (messageId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ContactMessage;
      }>(`/contact/messages/${messageId}`);

      // Update in messages list
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? response.data : msg
        ),
        isLoading: false
      }));

      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to fetch message details',
        isLoading: false
      });
      throw error;
    }
  },

  updateMessage: async (messageId: string, updateData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.put<{
        success: boolean;
        data: ContactMessage;
        message: string;
      }>(`/contact/messages/${messageId}`, updateData);

      const updatedMessage = response.data;
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg.id === messageId ? updatedMessage : msg
        ),
        isLoading: false
      }));

      return updatedMessage;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to update message',
        isLoading: false
      });
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.delete(`/contact/messages/${messageId}`);

      set((state) => ({
        messages: state.messages.filter((msg) => msg.id !== messageId),
        isLoading: false
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to delete message',
        isLoading: false
      });
      throw error;
    }
  },

  sendTestMessage: async (messageData: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post<{
        success: boolean;
        data: ContactMessage;
        message: string;
      }>('/contact/messages/test', messageData);

      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.error ||
          error.message ||
          'Failed to send test message',
        isLoading: false
      });
      throw error;
    }
  },

  clearMessages: () => set({ messages: [] }),
  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading })
}));
