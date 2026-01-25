'use client';
import { useEffect, useCallback, useMemo } from 'react';
import { useAdminStore } from '../stores/admin.store';
// Add this export at the end of your file, before the closing
export type {
  EnhancedAdminFilters,
  EnhancedUser,
  EnhancedDeposit,
  CryptoAccount,
  SystemAlert,
  AdminActionLog,
  UserActivity,
  EnhancedDashboardStats,
  EnhancedDepositStats
} from '../types/admin/types';

export const useEnhancedAdmin = () => {
  const store = useAdminStore();

  // Auto-fetch enhanced dashboard on mount
  useEffect(() => {
    const fetchEnhancedDashboard = async () => {
      if (!store.enhancedDashboardStats) {
        await store.getEnhancedDashboardStats();
      }
    };
    fetchEnhancedDashboard();
  }, [store.enhancedDashboardStats, store.getEnhancedDashboardStats]);

  // Enhanced search users with filters
  const searchEnhancedUsers = useCallback(
    (
      query: string,
      filters?: {
        status?: string;
        risk_level?: string;
        account_type?: string;
        has_deposits?: boolean;
        has_crypto?: boolean;
        tags?: string[];
      }
    ) => {
      let results = store.enhancedUsers;

      if (query) {
        const lowerQuery = query.toLowerCase();
        results = results.filter((user) => {
          const firstName = (user.first_name || '').toLowerCase();
          const lastName = (user.last_name || '').toLowerCase();
          const email = (user.email || '').toLowerCase();
          const accountNumber = (user.account_number || '').toLowerCase();
          const phone = (user.phone || '').toLowerCase();
          const identification = (
            user.identification_number || ''
          ).toLowerCase();

          return (
            firstName.includes(lowerQuery) ||
            lastName.includes(lowerQuery) ||
            email.includes(lowerQuery) ||
            accountNumber.includes(lowerQuery) ||
            phone.includes(lowerQuery) ||
            identification.includes(lowerQuery)
          );
        });
      }

      if (filters?.status) {
        results = results.filter(
          (user) => user.account_status === filters.status
        );
      }

      if (filters?.risk_level) {
        results = results.filter(
          (user) => user.risk_level === filters.risk_level
        );
      }

      if (filters?.account_type) {
        results = results.filter(
          (user) => user.account_type === filters.account_type
        );
      }

      if (filters?.has_deposits !== undefined) {
        results = results.filter((user) => {
          const hasDeposits = user._count?.deposits
            ? user._count.deposits > 0
            : false;
          return filters.has_deposits ? hasDeposits : !hasDeposits;
        });
      }

      if (filters?.has_crypto !== undefined) {
        results = results.filter((user) => {
          const hasCrypto = user._count?.payment_methods
            ? user._count.payment_methods > 0
            : false;
          return filters.has_crypto ? hasCrypto : !hasCrypto;
        });
      }

      if (filters?.tags && filters.tags.length > 0) {
        results = results.filter((user) =>
          user.tags?.some((tag) => filters.tags!.includes(tag))
        );
      }

      return results;
    },
    [store.enhancedUsers]
  );

  // Enhanced user statistics
  const getEnhancedUserStats = useCallback(() => {
    const riskLevels = store.enhancedUsers.reduce(
      (acc, user) => {
        const level = user.risk_level || 'unknown';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const accountTypes = store.enhancedUsers.reduce(
      (acc, user) => {
        const type = user.account_type || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: store.enhancedUsers.length,
      active: store.enhancedUsers.filter((u) => u.account_status === 'active')
        .length,
      pending: store.enhancedUsers.filter((u) => u.account_status === 'pending')
        .length,
      suspended: store.enhancedUsers.filter(
        (u) => u.account_status === 'suspended'
      ).length,
      riskLevels,
      accountTypes,
      averageBalance:
        store.enhancedUsers.length > 0
          ? store.enhancedUsers.reduce(
              (sum, user) => sum + parseFloat(user.balance),
              0
            ) / store.enhancedUsers.length
          : 0,
      totalBalance: store.enhancedUsers.reduce(
        (sum, user) => sum + parseFloat(user.balance),
        0
      )
    };
  }, [store.enhancedUsers]);

  // Enhanced deposit statistics
  const getEnhancedDepositStats = useCallback(() => {
    const byMethod = store.enhancedDeposits.reduce(
      (acc, deposit) => {
        const method = deposit.method;
        acc[method] = (acc[method] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byStatus = store.enhancedDeposits.reduce(
      (acc, deposit) => {
        const status = deposit.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const pendingWithEvidence = store.enhancedDeposits.filter(
      (d) => d.status === 'pending' && d.proof_of_payment
    ).length;

    return {
      total: store.enhancedDeposits.length,
      byMethod,
      byStatus,
      pendingWithEvidence,
      cryptoDeposits: store.enhancedDeposits.filter(
        (d) => d.method === 'crypto'
      ).length,
      totalAmount: store.enhancedDeposits.reduce(
        (sum, d) => sum + parseFloat(d.amount),
        0
      ),
      totalFees: store.enhancedDeposits.reduce(
        (sum, d) => sum + parseFloat(d.fee || '0'),
        0
      )
    };
  }, [store.enhancedDeposits]);

  // Crypto account statistics
  const getCryptoAccountStats = useCallback(() => {
    const byNetwork = store.cryptoAccounts.reduce(
      (acc, account) => {
        const network = account.network || 'unknown';
        acc[network] = (acc[network] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byStatus = store.cryptoAccounts.reduce(
      (acc, account) => {
        const status = account.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: store.cryptoAccounts.length,
      byNetwork,
      byStatus,
      verified: store.cryptoAccounts.filter((a) => a.verified_at).length,
      defaultAccounts: store.cryptoAccounts.filter((a) => a.is_default).length
    };
  }, [store.cryptoAccounts]);

  // System alert statistics
  const getSystemAlertStats = useCallback(() => {
    const byType = store.systemAlerts.reduce(
      (acc, alert) => {
        const type = alert.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byLevel = store.systemAlerts.reduce(
      (acc, alert) => {
        const level = alert.level;
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total: store.systemAlerts.length,
      byType,
      byLevel,
      unresolved: store.systemAlerts.filter((a) => !a.resolved).length,
      critical: store.systemAlerts.filter((a) => a.level === 'critical').length
    };
  }, [store.systemAlerts]);

  // Admin action statistics
  const getAdminActionStats = useCallback(() => {
    const byAction = store.adminActionLogs.reduce(
      (acc, log) => {
        const action = log.action.split('_')[0];
        acc[action] = (acc[action] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Last 7 days actions
    const last7Days = store.adminActionLogs.filter((log) => {
      const logDate = new Date(log.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return logDate >= weekAgo;
    });

    return {
      total: store.adminActionLogs.length,
      byAction,
      last7Days: last7Days.length,
      today: store.adminActionLogs.filter((log) => {
        const logDate = new Date(log.created_at);
        const today = new Date();
        return logDate.toDateString() === today.toDateString();
      }).length
    };
  }, [store.adminActionLogs]);

  // Get user's crypto accounts
  const getUserCryptoAccounts = useCallback(
    (userId: string) => {
      return store.cryptoAccounts.filter(
        (account) => account.user_id === userId
      );
    },
    [store.cryptoAccounts]
  );

  // Get user's recent activities
  const getUserRecentActivities = useCallback(
    (userId: string, limit: number = 10) => {
      return store.userActivities
        .filter((activity) => activity.user_id === userId)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, limit);
    },
    [store.userActivities]
  );

  // Get deposits requiring verification
  const getPendingVerificationDeposits = useCallback(() => {
    return store.enhancedDeposits.filter(
      (deposit) =>
        deposit.status === 'pending' &&
        deposit.proof_of_payment &&
        !deposit.confirmed_at
    );
  }, [store.enhancedDeposits]);

  // Get deposits with evidence
  const getDepositsWithEvidence = useCallback(() => {
    return store.enhancedDeposits.filter((deposit) => deposit.proof_of_payment);
  }, [store.enhancedDeposits]);

  const {
    getEnhancedDashboardStats,
    getEnhancedUsers,
    getEnhancedDeposits,
    getCryptoAccounts,
    getPaymentMethods,
    getUserActivities,
    getAdminActionLogs,
    getSystemAlerts,
    createAdminUser,
    createAdminUserAccount,
    createAdminTransfer,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  } = store;

  // Refresh all enhanced data
  const refreshEnhancedData = useCallback(async () => {
    await Promise.all([
      getEnhancedDashboardStats(),
      getEnhancedUsers(),
      getEnhancedDeposits(),
      getCryptoAccounts(),
      getUserActivities(),
      getAdminActionLogs(),
      getSystemAlerts()
    ]);
  }, [
    getEnhancedDashboardStats,
    getEnhancedUsers,
    getEnhancedDeposits,
    getCryptoAccounts,
    getPaymentMethods,
    getUserActivities,
    getAdminActionLogs,
    getSystemAlerts,
    createAdminUser,
    createAdminUserAccount,
    createAdminTransfer,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
  ]);

  // Memoized computed properties
  const enhancedUserStats = useMemo(
    () => getEnhancedUserStats(),
    [getEnhancedUserStats]
  );
  const enhancedDepositStats = useMemo(
    () => getEnhancedDepositStats(),
    [getEnhancedDepositStats]
  );
  const cryptoAccountStats = useMemo(
    () => getCryptoAccountStats(),
    [getCryptoAccountStats]
  );
  const systemAlertStats = useMemo(
    () => getSystemAlertStats(),
    [getSystemAlertStats]
  );
  const adminActionStats = useMemo(
    () => getAdminActionStats(),
    [getAdminActionStats]
  );
  const depositsRequiringVerification = useMemo(
    () => getPendingVerificationDeposits(),
    [getPendingVerificationDeposits]
  );
  const criticalAlerts = useMemo(
    () =>
      store.systemAlerts.filter(
        (alert) => alert.level === 'critical' && !alert.resolved
      ),
    [store.systemAlerts]
  );

  return {
    // Store state and actions
    ...store,

    // Enhanced utility functions
    searchEnhancedUsers,
    getEnhancedUserStats,
    getEnhancedDepositStats,
    getCryptoAccountStats,
    getSystemAlertStats,
    getAdminActionStats,
    getUserCryptoAccounts,
    getUserRecentActivities,
    getPendingVerificationDeposits,
    getDepositsWithEvidence,
    refreshEnhancedData,
    createAdminUser,
    createAdminUserAccount,
    createAdminTransfer,
    getPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,

    // Computed properties
    enhancedUserStats,
    enhancedDepositStats,
    cryptoAccountStats,
    systemAlertStats,
    adminActionStats,
    depositsRequiringVerification,
    criticalAlerts,
    recentUserActivities: store.userActivities.slice(0, 20),
    recentAdminActions: store.adminActionLogs.slice(0, 20),
    topUsers: store.enhancedUsers
      .sort((a, b) => parseFloat(b.balance) - parseFloat(a.balance))
      .slice(0, 10)
  };
};

// Hook for enhanced user management
export const useEnhancedAdminUser = (userId?: string) => {
  const {
    enhancedUsers,
    selectedUser,
    getUserDetails,
    updateUserProfile,
    deleteUser,
    restoreUser,
    updateUserBalance,
    createAdminUserAccount,
    createAdminTransfer,
    getUserCryptoAccounts,
    getUserRecentActivities,
    setSelectedUser,
    clearSelection,
    isLoading,
    error
  } = useEnhancedAdmin();

  const userFromList = userId
    ? enhancedUsers.find((u) => u.id === userId)
    : undefined;
  const user = userFromList
    ? userFromList
    : userId
      ? selectedUser?.id === userId
        ? selectedUser
        : undefined
      : selectedUser;

  const loadUserDetails = useCallback(
    async (id: string) => {
      if (id) {
        return await getUserDetails(id);
      }
    },
    [getUserDetails]
  );

  const suspendUser = useCallback(
    async (reason?: string) => {
      if (user) {
        return await updateUserProfile(user.id, {
          account_status: 'suspended',
          is_active: false
        });
      }
      throw new Error('User not found');
    },
    [user, updateUserProfile]
  );

  const activateUser = useCallback(async () => {
    if (user) {
      return await updateUserProfile(user.id, {
        account_status: 'active',
        is_active: true
      });
    }
    throw new Error('User not found');
  }, [user, updateUserProfile]);

  const verifyUser = useCallback(async () => {
    if (user) {
      return await updateUserProfile(user.id, {
        account_status: 'active',
        email_verified_at: new Date().toISOString()
      });
    }
    throw new Error('User not found');
  }, [user, updateUserProfile]);

  const addUserTag = useCallback(
    async (tag: string) => {
      if (user) {
        const currentTags = user.tags || [];
        const newTags = [...new Set([...currentTags, tag])];
        return await updateUserProfile(user.id, { tags: newTags });
      }
      throw new Error('User not found');
    },
    [user, updateUserProfile]
  );

  const removeUserTag = useCallback(
    async (tag: string) => {
      if (user) {
        const currentTags = user.tags || [];
        const newTags = currentTags.filter((t) => t !== tag);
        return await updateUserProfile(user.id, { tags: newTags });
      }
      throw new Error('User not found');
    },
    [user, updateUserProfile]
  );

  const updateRiskLevel = useCallback(
    async (riskLevel: string) => {
      if (user) {
        return await updateUserProfile(user.id, { risk_level: riskLevel });
      }
      throw new Error('User not found');
    },
    [user, updateUserProfile]
  );

  const addBalance = useCallback(
    async (amount: number, reason: string, transactionAt?: string) => {
      if (user) {
        return await updateUserBalance(
          user.id,
          amount,
          reason,
          'add',
          transactionAt
        );
      }
      throw new Error('User not found');
    },
    [user, updateUserBalance]
  );

  const deductBalance = useCallback(
    async (amount: number, reason: string, transactionAt?: string) => {
      if (user) {
        return await updateUserBalance(
          user.id,
          amount,
          reason,
          'deduct',
          transactionAt
        );
      }
      throw new Error('User not found');
    },
    [user, updateUserBalance]
  );

  const setBalance = useCallback(
    async (amount: number, reason: string, transactionAt?: string) => {
      if (user) {
        return await updateUserBalance(
          user.id,
          amount,
          reason,
          'set',
          transactionAt
        );
      }
      throw new Error('User not found');
    },
    [user, updateUserBalance]
  );

  const createAccount = useCallback(
    async (data: any) => {
      if (user) {
        return await createAdminUserAccount(user.id, data);
      }
      throw new Error('User not found');
    },
    [user, createAdminUserAccount]
  );

  const createTransfer = useCallback(
    async (data: any) => {
      if (user) {
        return await createAdminTransfer({
          sender_user_id: user.id,
          ...data
        });
      }
      throw new Error('User not found');
    },
    [user, createAdminTransfer]
  );

  return {
    user,
    loadUserDetails,
    updateUserProfile,
    deleteUser,
    restoreUser,
    suspendUser,
    activateUser,
    verifyUser,
    addUserTag,
    removeUserTag,
    updateRiskLevel,
    addBalance,
    deductBalance,
    setBalance,
    createAccount,
    createTransfer,
    userActivities: user ? getUserRecentActivities(user.id) : [],
    cryptoAccounts: user ? getUserCryptoAccounts(user.id) : [],
    setSelectedUser,
    clearSelection,
    isLoading,
    error,

    // Computed properties
    isActive: user?.account_status === 'active',
    isSuspended: user?.account_status === 'suspended',
    isPending: user?.account_status === 'pending',
    isVerified: !!user?.email_verified_at,
    totalAccounts: user?._count?.accounts || 0,
    totalTransactions: user?._count?.transactions || 0,
    totalDeposits: user?._count?.deposits || 0,
    totalLoans: user?._count?.loans || 0,
    totalCards: user?._count?.cards || 0,
    userTags: user?.tags || [],
    riskLevel: user?.risk_level || 'unknown'
  };
};

// Hook for enhanced deposit management
export const useEnhancedAdminDeposit = (depositId?: string) => {
  const {
    enhancedDeposits,
    selectedDeposit,
    getDepositDetails,
    updateDepositEvidence,
    verifyDepositEvidence,
    setSelectedDeposit,
    clearSelection,
    isLoading,
    error
  } = useEnhancedAdmin();

  const deposit = depositId
    ? enhancedDeposits.find((d) => d.id === depositId)
    : selectedDeposit;

  const loadDepositDetails = useCallback(
    async (id: string) => {
      if (id) {
        return await getDepositDetails(id);
      }
    },
    [getDepositDetails]
  );

  const approveDeposit = useCallback(
    async (notes?: string) => {
      if (deposit) {
        return await verifyDepositEvidence(deposit.id, true, notes);
      }
      throw new Error('Deposit not found');
    },
    [deposit, verifyDepositEvidence]
  );

  const rejectDeposit = useCallback(
    async (notes?: string) => {
      if (deposit) {
        return await verifyDepositEvidence(deposit.id, false, notes);
      }
      throw new Error('Deposit not found');
    },
    [deposit, verifyDepositEvidence]
  );

  const updateEvidence = useCallback(
    async (evidence: any) => {
      if (deposit) {
        return await updateDepositEvidence(deposit.id, evidence);
      }
      throw new Error('Deposit not found');
    },
    [deposit, updateDepositEvidence]
  );

  return {
    deposit,
    loadDepositDetails,
    updateEvidence,
    approveDeposit,
    rejectDeposit,
    setSelectedDeposit,
    clearSelection,
    isLoading,
    error,

    // Computed properties
    // At the bottom of your existing useEnhancedAdmin.ts file, add:
    hasEvidence: !!deposit?.proof_of_payment,
    isPending: deposit?.status === 'pending',
    isCompleted: deposit?.status === 'completed',
    isFailed: deposit?.status === 'failed',
    isCrypto: deposit?.method === 'crypto',
    isBankTransfer: deposit?.method === 'bank_transfer',
    confirmedBy: deposit?.confirmed_by_user
      ? `${deposit.confirmed_by_user.first_name} ${deposit.confirmed_by_user.last_name}`
      : null
  };
};
