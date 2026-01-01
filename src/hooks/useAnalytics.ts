"use client"
import { useEffect, useCallback } from 'react';
import { useAnalyticsStore } from '../stores/analytics.store';

export const useAnalytics = () => {
  const {
    adminDashboard,
    userAnalytics,
    topUsers,
    systemHealth,
    realtimeMetrics,
    predictiveAnalytics,
    spendingPatterns,
    transactionHistory,
    isLoading,
    error,
    getAdminDashboard,
    getTopUsers,
    getSystemHealth,
    exportAnalytics,
    getRealTimeMetrics,
    getPredictiveAnalytics,
    getUserAnalytics,
    getUserSpendingPatterns,
    getUserTransactionHistory,
    clearAnalytics,
    clearError,
    setLoading,
  } = useAnalyticsStore();

  // Format currency
  const formatCurrency = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Format percentage
  const formatPercentage = useCallback((value: number): string => {
    return `${value.toFixed(2)}%`;
  }, []);

  // Format large numbers
  const formatNumber = useCallback((num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toFixed(2);
  }, []);

  // Get top users by balance
  const getTopUsersByBalance = useCallback(async (limit: number = 10) => {
    const response = await getTopUsers({ by: 'balance', limit });
    return response;
  }, [getTopUsers]);

  // Get top users by transactions
  const getTopUsersByTransactions = useCallback(async (limit: number = 10) => {
    const response = await getTopUsers({ by: 'transactions', limit });
    return response;
  }, [getTopUsers]);

  // Get analytics for date range
  const getAnalyticsForDateRange = useCallback(async (
    startDate: Date,
    endDate: Date,
    userId?: string
  ) => {
    const params: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    
    if (userId) {
      params.userId = userId;
    }

    return await getAdminDashboard(params);
  }, [getAdminDashboard]);

  // Get user analytics for date range
  const getUserAnalyticsForDateRange = useCallback(async (
    startDate: Date,
    endDate: Date,
    accountId?: string
  ) => {
    const params: any = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
    
    if (accountId) {
      params.accountId = accountId;
    }

    return await getUserAnalytics(params);
  }, [getUserAnalytics]);

  // Get spending patterns for category
  const getSpendingByCategory = useCallback((): Record<string, number> => {
    if (!spendingPatterns?.categorySpending) return {};
    return spendingPatterns.categorySpending;
  }, [spendingPatterns]);

  // Get top merchants
  const getTopMerchants = useCallback((): Array<{name: string; amount: number}> => {
    if (!spendingPatterns?.topMerchants) return [];
    return spendingPatterns.topMerchants;
  }, [spendingPatterns]);

  // Get monthly spending trend
  const getMonthlySpendingTrend = useCallback((): Array<{month: string; amount: number}> => {
    if (!spendingPatterns?.monthlySpending) return [];
    return spendingPatterns.monthlySpending;
  }, [spendingPatterns]);

  // Calculate average transaction amount
  const getAverageTransactionAmount = useCallback((): number => {
    if (!userAnalytics?.transactions || userAnalytics.transactions.length === 0) return 0;
    
    const total = userAnalytics.transactions.reduce((sum: number, transaction: { amount: string; }) => {
      return sum + (parseFloat(transaction.amount) || 0);
    }, 0);
    
    return total / userAnalytics.transactions.length;
  }, [userAnalytics]);

  // Get transaction frequency
  const getTransactionFrequency = useCallback((): 'daily' | 'weekly' | 'monthly' | 'occasional' => {
    if (!userAnalytics?.transactions || userAnalytics.transactions.length === 0) return 'occasional';
    
    const transactions = userAnalytics.transactions;
    const firstTransaction = new Date(transactions[transactions.length - 1].created_at);
    const lastTransaction = new Date(transactions[0].created_at);
    
    const daysDiff = (lastTransaction.getTime() - firstTransaction.getTime()) / (1000 * 60 * 60 * 24);
    const avgTransactionsPerDay = transactions.length / Math.max(daysDiff, 1);
    
    if (avgTransactionsPerDay >= 1) return 'daily';
    if (avgTransactionsPerDay >= 0.14) return 'weekly'; // ~1 per week
    if (avgTransactionsPerDay >= 0.033) return 'monthly'; // ~1 per month
    return 'occasional';
  }, [userAnalytics]);

  // Get system health status
  const getSystemHealthStatus = useCallback((): 'healthy' | 'warning' | 'critical' => {
    if (!systemHealth) return 'healthy';
    
    const { database, cache, email_service, payment_gateways, memory_usage } = systemHealth;
    
    if (!database || !cache || memory_usage > 90) return 'critical';
    if (!email_service || !payment_gateways.stripe || !payment_gateways.paypal || memory_usage > 80) return 'warning';
    
    return 'healthy';
  }, [systemHealth]);

  // Get real-time metrics summary
  const getRealtimeSummary = useCallback(() => {
    if (!realtimeMetrics?.metrics) return null;
    
    const { metrics } = realtimeMetrics;
    return {
      totalActivity: metrics.transactionsLastHour + metrics.depositsLastHour,
      activeUsers: metrics.activeUsersNow,
      systemLoad: metrics.systemLoad,
      status: metrics.systemLoad > 80 ? 'high' : metrics.systemLoad > 60 ? 'medium' : 'low',
    };
  }, [realtimeMetrics]);

  // Get predictive insights
  const getPredictiveInsights = useCallback(() => {
    if (!predictiveAnalytics) return [];
    
    const insights = [];
    
    if (predictiveAnalytics.riskAlerts?.length > 0) {
      insights.push({
        type: 'risk',
        message: `${predictiveAnalytics.riskAlerts.length} risk alerts detected`,
        priority: 'high',
      });
    }
    
    if (predictiveAnalytics.recommendations?.length > 0) {
      insights.push({
        type: 'recommendation',
        message: `${predictiveAnalytics.recommendations.length} recommendations available`,
        priority: 'medium',
      });
    }
    
    if (predictiveAnalytics.predictedTransactionsNextMonth > 1000) {
      insights.push({
        type: 'growth',
        message: 'High transaction volume predicted for next month',
        priority: 'low',
      });
    }
    
    return insights;
  }, [predictiveAnalytics]);

  // Export user analytics
  const exportUserAnalytics = useCallback(async (userId?: string, format: 'csv' | 'json' = 'csv') => {
    const analytics = userId ? await getUserAnalytics({ userId }) : userAnalytics;
    if (!analytics) return null;

    if (format === 'csv') {
      const data = [
        ['Metric', 'Value'],
        ['Total Transactions', analytics.summary?.totalTransactions || 0],
        ['Total Deposits', analytics.summary?.totalDeposits || 0],
        ['Total Withdrawals', analytics.summary?.totalWithdrawals || 0],
        ['Current Balance', analytics.summary?.currentBalance || 0],
        ['Average Transaction', getAverageTransactionAmount()],
        ['Transaction Frequency', getTransactionFrequency()],
      ];

      return data.map(row => row.join(',')).join('\n');
    }

    return analytics;
  }, [userAnalytics, getUserAnalytics, getAverageTransactionAmount, getTransactionFrequency]);

  return {
    // State
    adminDashboard,
    userAnalytics,
    topUsers,
    systemHealth,
    realtimeMetrics,
    predictiveAnalytics,
    spendingPatterns,
    transactionHistory,
    isLoading,
    error,

    // Actions
    getAdminDashboard,
    getTopUsers,
    getSystemHealth,
    exportAnalytics,
    getRealTimeMetrics,
    getPredictiveAnalytics,
    getUserAnalytics,
    getUserSpendingPatterns,
    getUserTransactionHistory,
    clearAnalytics,
    clearError,
    setLoading,

    // Utility functions
    formatCurrency,
    formatPercentage,
    formatNumber,
    getTopUsersByBalance,
    getTopUsersByTransactions,
    getAnalyticsForDateRange,
    getUserAnalyticsForDateRange,
    getSpendingByCategory,
    getTopMerchants,
    getMonthlySpendingTrend,
    getAverageTransactionAmount,
    getTransactionFrequency,
    getSystemHealthStatus,
    getRealtimeSummary,
    getPredictiveInsights,
    exportUserAnalytics,

    // Computed properties
    systemHealthStatus: getSystemHealthStatus(),
    realtimeSummary: getRealtimeSummary(),
    predictiveInsights: getPredictiveInsights(),
    topCategories: Object.entries(getSpendingByCategory())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({ category, amount })),
    monthlyTrend: getMonthlySpendingTrend(),
    averageTransaction: getAverageTransactionAmount(),
    transactionFreq: getTransactionFrequency(),
  };
};

// Hook for user-specific analytics
export const useUserAnalytics = () => {
  const {
    userAnalytics,
    spendingPatterns,
    transactionHistory,
    getUserAnalytics,
    getUserSpendingPatterns,
    getUserTransactionHistory,
    formatCurrency,
    getSpendingByCategory,
    getTopMerchants,
    getMonthlySpendingTrend,
    getAverageTransactionAmount,
    getTransactionFrequency,
  } = useAnalytics();

  // Get spending summary
  const getSpendingSummary = useCallback(() => {
    if (!spendingPatterns) return null;
    
    const totalSpending = Object.values(getSpendingByCategory()).reduce((sum, amount) => sum + amount, 0);
    const topCategory = Object.entries(getSpendingByCategory())
      .sort(([, a], [, b]) => b - a)[0] || ['None', 0];
    
    return {
      totalSpending,
      topCategory: {
        name: topCategory[0],
        amount: topCategory[1],
        percentage: (topCategory[1] / totalSpending) * 100,
      },
      averageMonthly: getMonthlySpendingTrend().reduce((sum, month) => sum + month.amount, 0) / 
        Math.max(getMonthlySpendingTrend().length, 1),
    };
  }, [spendingPatterns, getSpendingByCategory, getMonthlySpendingTrend]);

  // Get transaction insights
  const getTransactionInsights = useCallback(() => {
    if (!transactionHistory?.transactions || transactionHistory.transactions.length === 0) {
      return [];
    }

    const transactions = transactionHistory.transactions;
    const insights = [];

    // Check for large transactions
    const largeTransactions = transactions.filter((t: { amount: string; type: string; }) => 
      parseFloat(t.amount) > 1000 && t.type === 'withdrawal'
    );
    if (largeTransactions.length > 0) {
      insights.push({
        type: 'large_withdrawal',
        message: `${largeTransactions.length} large withdrawal(s) detected`,
        priority: 'medium',
      });
    }

    // Check for frequent transactions
    const recentTransactions = transactions.slice(0, 10);
    const timeDiff = recentTransactions.length > 1
      ? (new Date(recentTransactions[0].created_at).getTime() - 
         new Date(recentTransactions[recentTransactions.length - 1].created_at).getTime()) / 
        (1000 * 60 * 60)
      : 0;
    
    if (timeDiff < 24 && recentTransactions.length >= 5) {
      insights.push({
        type: 'frequent_activity',
        message: 'High transaction frequency detected',
        priority: 'low',
      });
    }

    // Check for recurring payments
    const recurringDescriptions = transactions
      .map((t: { description: string; }) => t.description?.toLowerCase())
      .filter((desc: string | string[]) => desc && (desc.includes('subscription') || desc.includes('monthly')));
    
    if (recurringDescriptions.length > 0) {
      insights.push({
        type: 'recurring_payments',
        message: `${recurringDescriptions.length} recurring payment(s) identified`,
        priority: 'low',
      });
    }

    return insights;
  }, [transactionHistory]);

  return {
    // State
    userAnalytics,
    spendingPatterns,
    transactionHistory,

    // Actions
    getUserAnalytics,
    getUserSpendingPatterns,
    getUserTransactionHistory,

    // Utility functions
    formatCurrency,
    getSpendingByCategory,
    getTopMerchants,
    getMonthlySpendingTrend,
    getAverageTransactionAmount,
    getTransactionFrequency,
    getSpendingSummary,
    getTransactionInsights,

    // Computed properties
    spendingSummary: getSpendingSummary(),
    transactionInsights: getTransactionInsights(),
    topSpendingCategories: Object.entries(getSpendingByCategory())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        formattedAmount: formatCurrency(amount, userAnalytics?.summary?.currency || 'USD'),
      })),
    monthlySpending: getMonthlySpendingTrend().map(month => ({
      ...month,
      formattedAmount: formatCurrency(month.amount, userAnalytics?.summary?.currency || 'USD'),
    })),
    averageTransaction: getAverageTransactionAmount(),
    transactionFrequency: getTransactionFrequency(),
  };
};