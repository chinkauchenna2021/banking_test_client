// lib/hooks/useAdmin.ts
import { useEffect, useCallback } from 'react';
import { useAdminStore, AdminUser, AdminTransaction, AdminDeposit, ApprovalQueueItem } from '../stores/admin.store';

export const useAdmin = () => {
  const {
    dashboardStats,
    users,
    transactions,
    deposits,
    approvalQueue,
    auditLogs,
    isLoading,
    error,
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getApprovalQueue,
    processApproval,
    getTransactions,
    getDeposits,
    confirmDeposit,
    getAuditLogs,
    generateReport,
    getSystemHealth,
    clearError,
    setLoading,
  } = useAdminStore();

  // Auto-fetch dashboard stats on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!dashboardStats) {
        await getDashboardStats();
      }
    };
    fetchInitialData();
  }, [dashboardStats, getDashboardStats]);

  // Get user by ID
  const getUserById = useCallback((userId: string): AdminUser | undefined => {
    return users.find(user => user.id === userId);
  }, [users]);

  // Search users by name or email
  const searchUsers = useCallback((query: string): AdminUser[] => {
    const lowerQuery = query.toLowerCase();
    return users.filter(user => 
      user.first_name.toLowerCase().includes(lowerQuery) ||
      user.last_name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.account_number.toLowerCase().includes(lowerQuery)
    );
  }, [users]);

  // Filter users by status
  const getUsersByStatus = useCallback((status: string): AdminUser[] => {
    return users.filter(user => user.account_status === status);
  }, [users]);

  // Get user statistics
  const getUserStats = useCallback(() => {
    return {
      total: users.length,
      active: users.filter(u => u.account_status === 'active').length,
      pending: users.filter(u => u.account_status === 'pending').length,
      suspended: users.filter(u => u.account_status === 'suspended').length,
      verified: users.filter(u => u.email_verified_at !== null).length,
      admin: users.filter(u => u.is_admin).length,
    };
  }, [users]);

  // Get approval queue items by type
  const getApprovalsByType = useCallback((type: string): ApprovalQueueItem[] => {
    return approvalQueue.filter(item => item.type === type);
  }, [approvalQueue]);

  // Get urgent approvals (high priority)
  const getUrgentApprovals = useCallback((): ApprovalQueueItem[] => {
    return approvalQueue.filter(item => item.priority === 'high');
  }, [approvalQueue]);

  // Filter transactions by user
  const getTransactionsByUser = useCallback((userId: string): AdminTransaction[] => {
    return transactions.filter(transaction => transaction.user_id === userId);
  }, [transactions]);

  // Get transaction statistics
  const getTransactionStats = useCallback(() => {
    const completed = transactions.filter(t => t.status === 'completed');
    const pending = transactions.filter(t => t.status === 'pending');
    const failed = transactions.filter(t => t.status === 'failed');

    return {
      total: transactions.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
      totalFees: transactions.reduce((sum, t) => sum + parseFloat(t.charge), 0),
      successRate: transactions.length > 0 ? (completed.length / transactions.length) * 100 : 0,
    };
  }, [transactions]);

  // Get deposit statistics
  const getDepositStats = useCallback(() => {
    const completed = deposits.filter(d => d.status === 'completed');
    const pending = deposits.filter(d => d.status === 'pending');
    const failed = deposits.filter(d => d.status === 'failed');

    return {
      total: deposits.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      totalAmount: deposits.reduce((sum, d) => sum + parseFloat(d.amount), 0),
      totalFees: deposits.reduce((sum, d) => sum + parseFloat(d.fee), 0),
      successRate: deposits.length > 0 ? (completed.length / deposits.length) * 100 : 0,
    };
  }, [deposits]);

  // Get deposits by method
  const getDepositsByMethod = useCallback((method: string): AdminDeposit[] => {
    return deposits.filter(deposit => deposit.method === method);
  }, [deposits]);

  // Refresh all admin data
  const refreshAdminData = useCallback(async () => {
    await Promise.all([
      getDashboardStats(),
      getUsers(),
      getApprovalQueue(),
      getTransactions(),
      getDeposits(),
    ]);
  }, [getDashboardStats, getUsers, getApprovalQueue, getTransactions, getDeposits]);

  // Export user data
  const exportUserData = useCallback(async (userIds: string[], format: 'csv' | 'json' = 'csv') => {
    const usersToExport = users.filter(user => userIds.includes(user.id));
    const data = usersToExport.map(user => ({
      'User ID': user.id,
      'Account Number': user.account_number,
      'Name': `${user.first_name} ${user.last_name}`,
      'Email': user.email,
      'Phone': user.phone,
      'Status': user.account_status,
      'Balance': user.balance,
      'Currency': user.currency,
      'Created At': user.created_at,
      'Last Login': user.last_login_at,
    }));

    if (format === 'csv') {
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      return `${headers}\n${rows}`;
    }

    return data;
  }, [users]);

  // Format date for display
  const formatDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  return {
    // State
    dashboardStats,
    users,
    transactions,
    deposits,
    approvalQueue,
    auditLogs,
    isLoading,
    error,

    // Actions
    getDashboardStats,
    getUsers,
    updateUserStatus,
    getApprovalQueue,
    processApproval,
    getTransactions,
    getDeposits,
    confirmDeposit,
    getAuditLogs,
    generateReport,
    getSystemHealth,
    clearError,
    setLoading,

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
    getDepositsByMethod,
    refreshAdminData,
    exportUserData,
    formatDate,

    // Computed properties
    userStats: getUserStats(),
    transactionStats: getTransactionStats(),
    depositStats: getDepositStats(),
    urgentApprovals: getUrgentApprovals(),
    pendingApprovals: approvalQueue.filter(item => item.status === 'pending'),
    recentUsers: users.slice(0, 10).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    recentTransactions: transactions.slice(0, 10),
    recentDeposits: deposits.slice(0, 10),
  };
};

// Hook for user management
export const useAdminUser = (userId?: string) => {
  const {
    users,
    getUserById,
    updateUserStatus,
    getTransactionsByUser,
    getUserStats,
    formatDate,
  } = useAdmin();

  const user = userId ? getUserById(userId) : undefined;

  const suspendUser = useCallback(async (reason: string) => {
    if (user) {
      return await updateUserStatus(user.id, 'suspended', reason);
    }
    throw new Error('User not found');
  }, [user, updateUserStatus]);

  const activateUser = useCallback(async () => {
    if (user) {
      return await updateUserStatus(user.id, 'active', 'User activated');
    }
    throw new Error('User not found');
  }, [user, updateUserStatus]);

  const getUserTransactions = useCallback(() => {
    if (user) {
      return getTransactionsByUser(user.id);
    }
    return [];
  }, [user, getTransactionsByUser]);

  return {
    user,
    userTransactions: getUserTransactions(),
    userStats: getUserStats(),
    suspendUser,
    activateUser,
    formatDate,
    isActive: user?.account_status === 'active',
    isSuspended: user?.account_status === 'suspended',
    isPending: user?.account_status === 'pending',
  };
};