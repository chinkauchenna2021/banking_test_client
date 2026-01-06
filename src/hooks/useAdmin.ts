'use client';
import { useEffect, useCallback } from 'react';
import { useAdminStore } from '../stores/admin.store';

export const useAdmin = () => {
  const store = useAdminStore();

  // Auto-fetch dashboard stats on mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!store.dashboardStats) {
        await store.getDashboardStats();
      }
    };
    fetchDashboardStats();
  }, [store.dashboardStats, store.getDashboardStats]);

  // Get user by ID
  const getUserById = useCallback(
    (userId: string) => {
      return (
        store.users.find((user) => user.id === userId) ||
        store.enhancedUsers.find((user) => user.id === userId)
      );
    },
    [store.users, store.enhancedUsers]
  );

  // Search users
  const searchUsers = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return store.users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(lowerQuery) ||
          user.last_name.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery) ||
          user.account_number.toLowerCase().includes(lowerQuery)
      );
    },
    [store.users]
  );

  // Get users by status
  const getUsersByStatus = useCallback(
    (status: string) => {
      return store.users.filter((user) => user.account_status === status);
    },
    [store.users]
  );

  // Get user statistics
  const getUserStats = useCallback(() => {
    return {
      total: store.users.length,
      active: store.users.filter((u) => u.account_status === 'active').length,
      pending: store.users.filter((u) => u.account_status === 'pending').length,
      suspended: store.users.filter((u) => u.account_status === 'suspended')
        .length,
      verified: store.users.filter((u) => u.email_verified_at !== null).length,
      admin: store.users.filter((u) => u.is_admin).length
    };
  }, [store.users]);

  // Get transaction statistics
  const getTransactionStats = useCallback(() => {
    const completed = store.transactions.filter(
      (t) => t.status === 'completed'
    );
    const pending = store.transactions.filter((t) => t.status === 'pending');
    const failed = store.transactions.filter((t) => t.status === 'failed');

    return {
      total: store.transactions.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      totalAmount: store.transactions.reduce(
        (sum, t) => sum + parseFloat(t.amount),
        0
      ),
      totalFees: store.transactions.reduce(
        (sum, t) => sum + parseFloat(t.charge),
        0
      ),
      successRate:
        store.transactions.length > 0
          ? (completed.length / store.transactions.length) * 100
          : 0
    };
  }, [store.transactions]);

  // Get deposit statistics
  const getDepositStats = useCallback(() => {
    const completed = store.deposits.filter((d) => d.status === 'completed');
    const pending = store.deposits.filter((d) => d.status === 'pending');
    const failed = store.deposits.filter((d) => d.status === 'failed');

    return {
      total: store.deposits.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      totalAmount: store.deposits.reduce(
        (sum, d) => sum + parseFloat(d.amount),
        0
      ),
      totalFees: store.deposits.reduce((sum, d) => sum + parseFloat(d.fee), 0),
      successRate:
        store.deposits.length > 0
          ? (completed.length / store.deposits.length) * 100
          : 0
    };
  }, [store.deposits]);

  // Get approval queue by type
  const getApprovalsByType = useCallback(
    (type: string) => {
      return store.approvalQueue.filter((item) => item.type === type);
    },
    [store.approvalQueue]
  );

  // Get urgent approvals
  const getUrgentApprovals = useCallback(() => {
    return store.approvalQueue.filter((item) => item.priority === 'high');
  }, [store.approvalQueue]);

  // Get transactions by user
  const getTransactionsByUser = useCallback(
    (userId: string) => {
      return store.transactions.filter(
        (transaction) => transaction.user_id === userId
      );
    },
    [store.transactions]
  );

  // Get deposits by user
  const getDepositsByUser = useCallback(
    (userId: string) => {
      return store.deposits.filter((deposit) => deposit.user_id === userId);
    },
    [store.deposits]
  );

  // Get deposits by method
  const getDepositsByMethod = useCallback(
    (method: string) => {
      return store.deposits.filter((deposit) => deposit.method === method);
    },
    [store.deposits]
  );

  // Refresh all admin data
  const refreshAdminData = useCallback(async () => {
    await Promise.all([
      store.getDashboardStats(),
      store.getUsers(),
      store.getApprovalQueue(),
      store.getTransactions(),
      store.getDeposits()
    ]);
  }, [store]);

  // Format date for display
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return {
    // State
    ...store,

    // Utility functions
    getUserById,
    searchUsers,
    getUsersByStatus,
    getUserStats,
    getApprovalsByType,
    getUrgentApprovals,
    getTransactionsByUser,
    getTransactionStats,
    getDepositStats,
    getDepositsByUser,
    getDepositsByMethod,
    refreshAdminData,
    formatDate,

    // Computed properties
    userStats: getUserStats(),
    transactionStats: getTransactionStats(),
    depositStats: getDepositStats(),
    urgentApprovals: getUrgentApprovals(),
    pendingApprovals: store.approvalQueue.filter(
      (item) => item.status === 'pending'
    ),
    recentUsers: store.users
      .slice(0, 10)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    recentTransactions: store.transactions.slice(0, 10),
    recentDeposits: store.deposits.slice(0, 10)
  };
};
