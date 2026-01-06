import { create } from 'zustand';
import { apiClient } from '../lib/api-client';

// ==================== TYPES ====================

// Base Types
export interface AdminUser {
  id: string;
  account_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  account_type: string;
  account_status: string;
  balance: string;
  currency: string;
  is_admin: boolean;
  is_active: boolean;
  email_verified_at: string | null;
  created_at: string;
  last_login_at: string | null;
}

export interface EnhancedAdminUser extends AdminUser {
  ledger_balance: string;
  available_balance: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  profile_image?: string;
  identification_type?: string;
  identification_number?: string;
  identification_image?: string;
  tax_id?: string;
  occupation?: string;
  employer?: string;
  monthly_income?: string;
  source_of_funds?: string;
  risk_level?: string;
  tags?: string[];
  transaction_pin?: string;
  two_factor_enabled: boolean;
  two_factor_secret?: string;
  last_login_ip?: string;
  preferences?: any;
  security_questions?: any;
  accepted_terms?: boolean;
  accepted_terms_date?: string;
  deleted_at?: string;

  // Counts
  _count?: {
    accounts: number;
    transactions: number;
    deposits: number;
    payment_methods: number;
    loans: number;
    cards: number;
    sent_transfers: number;
    received_transfers: number;
  };
}

export interface AdminTransaction {
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
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    account_number: string;
  };
  account?: {
    account_number: string;
    account_name: string;
  };
}

export interface AdminDeposit {
  id: string;
  user_id: string;
  account_id: string;
  deposit_reference: string;
  amount: string;
  fee: string;
  method: string;
  status: string;
  description: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    account_number: string;
  };
  account?: {
    account_number: string;
    account_name: string;
  };
}

export interface EnhancedAdminDeposit extends AdminDeposit {
  payment_method_id: string;
  currency: string;
  conversion_rate?: string;
  crypto_amount?: string;
  crypto_address?: string;
  crypto_transaction_hash?: string;
  bank_reference?: string;
  sender_bank?: string;
  sender_account?: string;
  sender_name?: string;
  receipt_url?: string;
  proof_of_payment?: any;
  admin_notes?: string;
  confirmed_at?: string;
  confirmed_by?: string;

  payment_method?: {
    id: string;
    type: string;
    name: string;
    account_number?: string;
    account_holder?: string;
    bank_name?: string;
    crypto_wallet_address?: string;
    crypto_type?: string;
  };

  confirmed_by_user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface ApprovalQueueItem {
  id: string;
  type: string;
  status: string;
  priority: string;
  model_id: string;
  model_type: string;
  user_id: string;
  assigned_to: string | null;
  approved_by: string | null;
  description: string;
  metadata: any;
  created_at: string;
  processed_at: string | null;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
    account_number: string;
  };
}

export interface CryptoAccount {
  user_id: string;
  payment_method_id: string;
  type: string;
  network: string;
  address: string;
  label?: string;
  is_default: boolean;
  status: string;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  user?: {
    account_number: string;
    first_name: string;
    last_name: string;
    email: string;
    account_status: string;
  };
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  location?: string;
  metadata?: any;
  created_at: string;
  user?: {
    account_number: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface SystemAlert {
  id: string;
  type: 'security' | 'system' | 'transaction' | 'user';
  level: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  data?: any;
  resolved: boolean;
  resolved_at?: string;
  created_at: string;
}

export interface AdminActionLog {
  id: string;
  admin_id: string;
  action: string;
  model_type: string;
  model_id: string;
  description: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  admin?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: string[];
  results: any[];
}

export interface DashboardStats {
  total_users: number;
  active_users: number;
  pending_approvals: number;
  total_deposits: number;
  total_withdrawals: number;
  total_loans: number;
  total_balance: number;
  recent_transactions: any[];
  pending_kyc: number;
  pending_contact_messages: number;
}

export interface EnhancedDashboardStats extends DashboardStats {
  total_crypto_deposits: number;
  pending_deposits: number;
  daily_activity_count: number;
  top_users: any[];
  recent_activities: any[];
  system_alerts: SystemAlert[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ==================== ADMIN STORE INTERFACE ====================

export interface AdminStoreState {
  // Dashboard
  dashboardStats: DashboardStats | null;
  enhancedDashboardStats: EnhancedDashboardStats | null;

  // User Management
  users: AdminUser[];
  enhancedUsers: EnhancedAdminUser[];
  selectedUser: EnhancedAdminUser | null;

  // Transaction Management
  transactions: AdminTransaction[];

  // Deposit Management
  deposits: AdminDeposit[];
  enhancedDeposits: EnhancedAdminDeposit[];
  selectedDeposit: EnhancedAdminDeposit | null;

  // Approval Queue
  approvalQueue: ApprovalQueueItem[];

  // Audit & Logs
  auditLogs: any[];
  adminActionLogs: AdminActionLog[];

  // Crypto Accounts
  cryptoAccounts: CryptoAccount[];

  // Activities
  userActivities: UserActivity[];

  // System
  systemAlerts: SystemAlert[];

  // UI State
  isLoading: boolean;
  error: string | null;

  // ==================== ACTIONS ====================

  // Dashboard Actions
  getDashboardStats: () => Promise<DashboardStats>;
  getEnhancedDashboardStats: () => Promise<EnhancedDashboardStats>;

  // User Management Actions
  getUsers: (
    params?: any
  ) => Promise<{ users: AdminUser[]; pagination: Pagination }>;
  getEnhancedUsers: (
    params?: any
  ) => Promise<{ users: EnhancedAdminUser[]; pagination: Pagination }>;
  getUserDetails: (userId: string) => Promise<EnhancedAdminUser>;
  updateUserStatus: (
    userId: string,
    status: string,
    reason?: string
  ) => Promise<AdminUser>;
  updateUserProfile: (userId: string, data: any) => Promise<EnhancedAdminUser>;
  deleteUser: (userId: string, reason?: string) => Promise<void>;
  restoreUser: (userId: string) => Promise<void>;
  updateUserBalance: (
    userId: string,
    amount: number,
    reason: string,
    type: 'add' | 'deduct' | 'set'
  ) => Promise<any>;
  bulkUpdateUserStatus: (
    userIds: string[],
    status: string,
    reason?: string
  ) => Promise<BulkOperationResult>;
  setSelectedUser: (user: EnhancedAdminUser | null) => void;

  // Deposit Management Actions
  getDeposits: (
    params?: any
  ) => Promise<{ deposits: AdminDeposit[]; pagination: Pagination }>;
  getEnhancedDeposits: (
    params?: any
  ) => Promise<{ deposits: EnhancedAdminDeposit[]; pagination: Pagination }>;
  getDepositDetails: (depositId: string) => Promise<EnhancedAdminDeposit>;
  confirmDeposit: (depositId: string, notes?: string) => Promise<AdminDeposit>;
  updateDepositEvidence: (
    depositId: string,
    evidence: any
  ) => Promise<EnhancedAdminDeposit>;
  verifyDepositEvidence: (
    depositId: string,
    verified: boolean,
    notes?: string
  ) => Promise<EnhancedAdminDeposit>;
  setSelectedDeposit: (deposit: EnhancedAdminDeposit | null) => void;

  // Crypto Accounts Actions
  getCryptoAccounts: (params?: any) => Promise<CryptoAccount[]>;
  verifyCryptoAccount: (
    paymentMethodId: string,
    verified: boolean,
    notes?: string
  ) => Promise<void>;

  // Loan Management Actions
  getLoans: (params?: any) => Promise<{ loans: any[]; pagination: Pagination }>;
  approveLoan: (loanId: string, notes?: string) => Promise<any>;
  rejectLoan: (loanId: string, reason: string) => Promise<any>;

  // Card Management Actions
  getPendingCardRequests: (
    params?: any
  ) => Promise<{ cards: any[]; pagination: Pagination }>;
  approveCardRequest: (cardId: string) => Promise<any>;
  rejectCardRequest: (cardId: string, reason: string) => Promise<any>;

  // Approval Queue Actions
  getApprovalQueue: (params?: any) => Promise<ApprovalQueueItem[]>;
  processApproval: (
    approvalId: string,
    action: string,
    notes?: string
  ) => Promise<any>;

  // Transaction Management Actions
  getTransactions: (
    params?: any
  ) => Promise<{ transactions: AdminTransaction[]; pagination: Pagination }>;

  // Activity Monitoring Actions
  getUserActivities: (params?: any) => Promise<UserActivity[]>;
  getAdminActionLogs: (params?: any) => Promise<AdminActionLog[]>;
  getAuditLogs: (
    params?: any
  ) => Promise<{ logs: any[]; pagination: Pagination }>;

  // System Management Actions
  getSystemAlerts: () => Promise<SystemAlert[]>;
  generateReport: (options: any) => Promise<any>;
  getSystemHealth: () => Promise<any>;

  // UI Actions
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  clearSelection: () => void;
}

// ==================== ADMIN STORE IMPLEMENTATION ====================

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  // ==================== INITIAL STATE ====================
  dashboardStats: null,
  enhancedDashboardStats: null,
  users: [],
  enhancedUsers: [],
  selectedUser: null,
  transactions: [],
  deposits: [],
  enhancedDeposits: [],
  selectedDeposit: null,
  approvalQueue: [],
  auditLogs: [],
  adminActionLogs: [],
  cryptoAccounts: [],
  userActivities: [],
  systemAlerts: [],
  isLoading: false,
  error: null,

  // ==================== DASHBOARD ACTIONS ====================

  getDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getDashboardStats();
      set({
        dashboardStats: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch dashboard stats';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getEnhancedDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getEnhancedDashboardStats();
      set({
        enhancedDashboardStats: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch enhanced dashboard stats';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== USER MANAGEMENT ACTIONS ====================

  getUsers: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUsers(params);
      set({
        users: response.users,
        isLoading: false
      });
      return { users: response.users, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to fetch users';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getEnhancedUsers: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getEnhancedUsers(params);
      set({
        enhancedUsers: response.users,
        isLoading: false
      });
      return { users: response.users, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch enhanced users';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getUserDetails: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUserDetails(userId);
      const user = response.data;
      set({
        selectedUser: user,
        isLoading: false
      });
      return user;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch user details';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateUserStatus: async (userId: string, status: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateUserStatus(userId, status, reason);
      const updatedUser = response.data;

      // Update in both user lists
      set((state) => ({
        users: state.users.map((user) =>
          user.id === userId ? updatedUser : user
        ),
        enhancedUsers: state.enhancedUsers.map((user) =>
          user.id === userId ? { ...user, account_status: status } : user
        ),
        selectedUser:
          state.selectedUser?.id === userId
            ? { ...state.selectedUser, account_status: status }
            : state.selectedUser,
        isLoading: false
      }));

      return updatedUser;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to update user status';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateUserProfile: async (userId: string, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateAdminUserProfile(userId, data);
      const updatedUser = response.data;

      // Update in enhanced users list
      set((state) => ({
        enhancedUsers: state.enhancedUsers.map((user) =>
          user.id === userId ? updatedUser : user
        ),
        selectedUser:
          state.selectedUser?.id === userId ? updatedUser : state.selectedUser,
        isLoading: false
      }));

      return updatedUser;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to update user profile';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId: string, reason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.deleteUser(userId, reason);

      // Remove from user lists
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        enhancedUsers: state.enhancedUsers.filter((user) => user.id !== userId),
        selectedUser:
          state.selectedUser?.id === userId ? null : state.selectedUser,
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to delete user';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  restoreUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.restoreUser(userId);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to restore user';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateUserBalance: async (
    userId: string,
    amount: number,
    reason: string,
    type: 'add' | 'deduct' | 'set'
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateUserBalance(userId, {
        amount,
        reason,
        type
      });

      // Update user balance in state
      const updateBalance = (user: any) => {
        if (user.id === userId) {
          const currentBalance = parseFloat(user.balance);
          let newBalance = currentBalance;

          if (type === 'add') newBalance = currentBalance + amount;
          else if (type === 'deduct') newBalance = currentBalance - amount;
          else if (type === 'set') newBalance = amount;

          return {
            ...user,
            balance: newBalance.toString(),
            ledger_balance: newBalance.toString(),
            available_balance: newBalance.toString()
          };
        }
        return user;
      };

      set((state) => ({
        enhancedUsers: state.enhancedUsers.map(updateBalance),
        selectedUser: state.selectedUser
          ? updateBalance(state.selectedUser)
          : state.selectedUser,
        isLoading: false
      }));

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to update user balance';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  bulkUpdateUserStatus: async (
    userIds: string[],
    status: string,
    reason?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.bulkUpdateUserStatus({
        userIds,
        status,
        reason
      });

      // Update status for all affected users
      set((state) => ({
        users: state.users.map((user) =>
          userIds.includes(user.id) ? { ...user, account_status: status } : user
        ),
        enhancedUsers: state.enhancedUsers.map((user) =>
          userIds.includes(user.id) ? { ...user, account_status: status } : user
        ),
        selectedUser:
          state.selectedUser && userIds.includes(state.selectedUser.id)
            ? { ...state.selectedUser, account_status: status }
            : state.selectedUser,
        isLoading: false
      }));

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to bulk update user status';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedUser: (user: EnhancedAdminUser | null) =>
    set({ selectedUser: user }),

  // ==================== DEPOSIT MANAGEMENT ACTIONS ====================

  getDeposits: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getDeposits(params);
      set({
        deposits: response.deposits,
        isLoading: false
      });
      return { deposits: response.deposits, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch deposits';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getEnhancedDeposits: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getEnhancedDeposits(params);
      set({
        enhancedDeposits: response.deposits,
        isLoading: false
      });
      return { deposits: response.deposits, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch enhanced deposits';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getDepositDetails: async (depositId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getDepositDetails(depositId);
      const deposit = response.data;
      set({
        selectedDeposit: deposit,
        isLoading: false
      });
      return deposit;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch deposit details';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  confirmDeposit: async (depositId: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.confirmDeposit(depositId, notes);
      const confirmedDeposit = response.data;

      // Update deposit in both lists
      set((state) => ({
        deposits: state.deposits.map((deposit) =>
          deposit.id === depositId ? confirmedDeposit : deposit
        ),
        enhancedDeposits: state.enhancedDeposits.map((deposit) =>
          deposit.id === depositId
            ? {
                ...deposit,
                status: 'completed',
                confirmed_at: new Date().toISOString()
              }
            : deposit
        ),
        selectedDeposit:
          state.selectedDeposit?.id === depositId
            ? {
                ...state.selectedDeposit,
                status: 'completed',
                confirmed_at: new Date().toISOString()
              }
            : state.selectedDeposit,
        isLoading: false
      }));

      return confirmedDeposit;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to confirm deposit';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  updateDepositEvidence: async (depositId: string, evidence: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.updateDepositEvidence(
        depositId,
        evidence
      );
      const updatedDeposit = response.data;

      // Update deposit in enhanced list
      set((state) => ({
        enhancedDeposits: state.enhancedDeposits.map((deposit) =>
          deposit.id === depositId ? updatedDeposit : deposit
        ),
        selectedDeposit:
          state.selectedDeposit?.id === depositId
            ? updatedDeposit
            : state.selectedDeposit,
        isLoading: false
      }));

      return updatedDeposit;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to update deposit evidence';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  verifyDepositEvidence: async (
    depositId: string,
    verified: boolean,
    notes?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.verifyDepositEvidence(depositId, {
        verified,
        notes
      });
      const updatedDeposit = response.data;

      // Update deposit in both lists
      const status = verified ? 'completed' : 'failed';
      set((state) => ({
        deposits: state.deposits.map((deposit) =>
          deposit.id === depositId ? { ...deposit, status } : deposit
        ),
        enhancedDeposits: state.enhancedDeposits.map((deposit) =>
          deposit.id === depositId ? updatedDeposit : deposit
        ),
        selectedDeposit:
          state.selectedDeposit?.id === depositId
            ? updatedDeposit
            : state.selectedDeposit,
        isLoading: false
      }));

      return updatedDeposit;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to verify deposit evidence';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  setSelectedDeposit: (deposit: EnhancedAdminDeposit | null) =>
    set({ selectedDeposit: deposit }),

  // ==================== CRYPTO ACCOUNTS ACTIONS ====================

  getCryptoAccounts: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getCryptoAccounts(params);
      set({
        cryptoAccounts: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch crypto accounts';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  verifyCryptoAccount: async (
    paymentMethodId: string,
    verified: boolean,
    notes?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.verifyCryptoAccount(paymentMethodId, { verified, notes });

      // Update crypto account status
      set((state) => ({
        cryptoAccounts: state.cryptoAccounts.map((account) =>
          account.payment_method_id === paymentMethodId
            ? {
                ...account,
                status: verified ? 'active' : 'suspended',
                verified_at: verified
                  ? new Date().toISOString()
                  : account.verified_at
              }
            : account
        ),
        isLoading: false
      }));
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to verify crypto account';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== LOAN MANAGEMENT ACTIONS ====================

  getLoans: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getAdminLoans(params);
      set({ isLoading: false });
      return { loans: response.data, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to fetch loans';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  approveLoan: async (loanId: string, notes?: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.approveLoan(loanId, notes);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to approve loan';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  rejectLoan: async (loanId: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.rejectLoan(loanId, reason);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || 'Failed to reject loan';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== CARD MANAGEMENT ACTIONS ====================

  getPendingCardRequests: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getPendingCardRequests(params);
      set({ isLoading: false });
      return { cards: response.data, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch pending card requests';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  approveCardRequest: async (cardId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.approveCardRequest(cardId);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to approve card request';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  rejectCardRequest: async (cardId: string, reason: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.rejectCardRequest(cardId, reason);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to reject card request';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== APPROVAL QUEUE ACTIONS ====================

  getApprovalQueue: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getApprovalQueue(params);
      set({
        approvalQueue: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch approval queue';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  processApproval: async (
    approvalId: string,
    action: string,
    notes?: string
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.processApproval(approvalId, {
        action,
        notes
      });

      // Remove from approval queue
      set((state) => ({
        approvalQueue: state.approvalQueue.filter(
          (item) => item.id !== approvalId
        ),
        isLoading: false
      }));

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to process approval';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== TRANSACTION MANAGEMENT ACTIONS ====================

  getTransactions: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getTransactions(params);
      set({
        transactions: response.transactions,
        isLoading: false
      });
      return {
        transactions: response.transactions,
        pagination: response.pagination
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch transactions';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== ACTIVITY MONITORING ACTIONS ====================

  getUserActivities: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getUserActivities(params);
      set({
        userActivities: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch user activities';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getAdminActionLogs: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getAdminActionLogs(params);
      set({
        adminActionLogs: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch admin action logs';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getAuditLogs: async (params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getAuditLogs(params);
      set({
        auditLogs: response.logs,
        isLoading: false
      });
      return { logs: response.logs, pagination: response.pagination };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch audit logs';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== SYSTEM MANAGEMENT ACTIONS ====================

  getSystemAlerts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getSystemAlerts();
      set({
        systemAlerts: response.data,
        isLoading: false
      });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch system alerts';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  generateReport: async (options: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.generateReport(options);
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to generate report';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  getSystemHealth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.getSystemHealth();
      set({ isLoading: false });
      return response;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch system health';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ==================== UI ACTIONS ====================

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  clearSelection: () => set({ selectedUser: null, selectedDeposit: null })
}));
