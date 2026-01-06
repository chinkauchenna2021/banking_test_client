export interface EnhancedAdminFilters {
  query?: string;
  status?: string;
  risk_level?: string;
  account_type?: string;
  has_deposits?: boolean;
  has_crypto?: boolean;
  tags?: string[];
}

export interface EnhancedUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  account_number: string;
  account_status: string;
  account_type: string;
  balance: string;
  risk_level?: string;
  identification_number?: string;
  email_verified_at?: string;
  is_active: boolean;
  tags?: string[];
  created_at: string;
  _count?: {
    deposits?: number;
    transactions?: number;
    loans?: number;
    cards?: number;
    payment_methods?: number;
    accounts?: number;
  };
}

export interface EnhancedDeposit {
  id: string;
  user_id: string;
  amount: string;
  method: string;
  status: string;
  proof_of_payment?: string;
  confirmed_at?: string;
  fee?: string;
  reference?: string;
  created_at: string;
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  confirmed_by_user?: {
    first_name: string;
    last_name: string;
  };
}

export interface CryptoAccount {
  id: string;
  user_id: string;
  currency: string;
  network?: string;
  wallet_address: string;
  status: string;
  verified_at?: string;
  is_default: boolean;
  created_at: string;
}

export interface SystemAlert {
  id: string;
  type: string;
  level: string;
  title: string;
  description: string;
  resolved: boolean;
  created_at: string;
}

export interface AdminActionLog {
  id: string;
  action: string;
  admin_name?: string;
  admin?: {
    first_name: string;
    last_name: string;
  };
  ip_address?: string;
  created_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  action: string;
  details?: string;
  created_at: string;
}

export interface EnhancedDashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  suspendedUsers: number;
  totalBalance: number;
  averageBalance: number;
  riskLevels: Record<string, number>;
  accountTypes: Record<string, number>;
}

export interface EnhancedDepositStats {
  total: number;
  byMethod: Record<string, number>;
  byStatus: Record<string, number>;
  pendingWithEvidence: number;
  cryptoDeposits: number;
  totalAmount: number;
  totalFees: number;
}
