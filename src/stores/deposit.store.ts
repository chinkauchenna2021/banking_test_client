// Client-side definition of DepositMethod enum
export enum DepositMethod {
  bank_transfer = 'bank_transfer',
  crypto = 'crypto',
  card = 'card',
  mobile_money = 'mobile_money',
  paypal = 'paypal',
  wire_transfer = 'wire_transfer',
}

// Interface for items returned by getDepositMethods
export interface DepositMethodItem {
  method: DepositMethod;
  name: string;
  description: string;
  currencies: string[];
  min_amount: number;
  max_amount: number;
  fee_percentage: number;
  fee_fixed: number;
  processing_time: string;
  status: string;
}

// Client-side definition of ManualDeposit interface, mirroring necessary properties
export interface ClientDeposit {
  id: string;
  user_id: bigint;
  account_id: bigint;
  payment_method_id: bigint;
  deposit_reference: string;
  method: DepositMethod;
  status: string; // Use string for status as client might not need the full enum
  amount: number; // Assuming amount is number after parseFloat
  currency: string;
  fee: number;
  receipt_url: string | null;
  created_at: Date;
  updated_at: Date;
  account?: { account_number: string; account_name: string; }; // Added account property
  // Add other properties as needed by the client
}

export type ManualDeposit = ClientDeposit;

interface DepositState {
  userDeposits: ManualDeposit[];
  pendingDeposits: ManualDeposit[]; // For admin
  companyAccountDetails: any | null;
  depositMethods: DepositMethodItem[]; // Added this
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;

  // User actions
  getCompanyAccountDetails: (method: DepositMethod, currency: string) => Promise<any>;
  createManualDeposit: (data: { amount: number; currency: string; method: DepositMethod; account_id: bigint }) => Promise<ManualDeposit>;
  uploadDepositProof: (depositId: string, file: File, notes?: string) => Promise<ManualDeposit>;
  fetchUserDeposits: (params?: any) => Promise<void>;
  getDepositMethods: () => Promise<void>; // Added this

  // Admin actions
  fetchPendingDeposits: (params?: any) => Promise<void>;
  confirmDeposit: (depositId: string, notes: string) => Promise<void>;
  rejectDeposit: (depositId: string, reason: string) => Promise<void>;

  clearError: () => void;
}

export const useDepositStore = create<DepositState>((set, get) => ({
  userDeposits: [],
  pendingDeposits: [],
  companyAccountDetails: null,
  depositMethods: [], // Initial state
  isLoading: false,
  isUploading: false,
  error: null,
  pagination: null,

  clearError: () => set({ error: null }),

  // =================================================================
  // User Actions
  // =================================================================

  getCompanyAccountDetails: async (method, currency) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCompanyAccountDetails<{ data: any }>(method, currency);
      set({ companyAccountDetails: response.data, isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  createManualDeposit: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.createManualDeposit<{ data: ManualDeposit }>(data);
      // Add to the start of the user deposits list
      set((state) => ({
        userDeposits: [response.data, ...state.userDeposits],
        isLoading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  uploadDepositProof: async (depositId, file, notes) => {
    set({ isUploading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('proof_file', file);
      if (notes) {
        formData.append('additional_notes', notes);
      }

      const response = await apiClient.uploadDepositProof<{ data: ManualDeposit }>(depositId, formData);
      
      // Update the specific deposit in the list
      set((state) => ({
        userDeposits: state.userDeposits.map((d) =>
          d.id === depositId ? response.data : d
        ),
        isUploading: false,
      }));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isUploading: false });
      throw new Error(errorMessage);
    }
  },

  fetchUserDeposits: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getManualDeposits<{ data: ManualDeposit[], pagination: any }>(params);
      set({
        userDeposits: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  getDepositMethods: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getDepositMethods<{ data: DepositMethodItem[] }>();
      set({ depositMethods: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  // =================================================================
  // Admin Actions
  // =================================================================

  fetchPendingDeposits: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getPendingManualDeposits<{ data: ManualDeposit[], pagination: any }>(params);
      set({
        pendingDeposits: response.data,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
    }
  },

  confirmDeposit: async (depositId, notes) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.confirmManualDeposit(depositId, notes);
      // Remove from pending list
      set((state) => ({
        pendingDeposits: state.pendingDeposits.filter((d) => d.id !== depositId),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  rejectDeposit: async (depositId, reason) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.rejectManualDeposit(depositId, reason);
      // Remove from pending list
      set((state) => ({
        pendingDeposits: state.pendingDeposits.filter((d) => d.id !== depositId),
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message;
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },
}));
