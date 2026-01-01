"use client"
import { useEffect, useCallback } from 'react';
import { 
  useTransactionStore, 
  Transaction, 
  TransactionQueryParams, 
  TransferRequest 
} from '../stores/transaction.store';

export const useTransaction = () => {
  const {
    transactions,
    currentTransaction,
    transactionSummary,
    recentTransactions,
    isLoading,
    error,
    getTransactions,
    getTransactionDetails,
    initiateTransfer,
    getTransactionSummary,
    exportTransactions,
    verifyTransaction,
    cancelTransaction,
    getRecentTransactions,
    getTransactionStats,
    searchTransactions,
    getTransactionByReference,
    setCurrentTransaction,
    clearError,
    setLoading,
  } = useTransactionStore();

  // Auto-fetch recent transactions on mount
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (recentTransactions.length === 0 && !isLoading) {
        await getRecentTransactions();
      }
    };
    fetchRecentTransactions();
  }, []);

  // Filter transactions by type
  const getTransactionsByType = useCallback((type: string): Transaction[] => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions]);

  // Filter transactions by status
  const getTransactionsByStatus = useCallback((status: string): Transaction[] => {
    return transactions.filter(transaction => transaction.status === status);
  }, [transactions]);

  // Filter transactions by date range
  const getTransactionsByDateRange = useCallback((startDate: Date, endDate: Date): Transaction[] => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions]);

  // Calculate total transaction amount
  const getTotalTransactionAmount = useCallback((): number => {
    return transactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
  }, [transactions]);

  // Calculate total fees
  const getTotalFees = useCallback((): number => {
    return transactions.reduce((total, transaction) => {
      return total + parseFloat(transaction.charge || '0');
    }, 0);
  }, [transactions]);

  // Get pending transactions
  const getPendingTransactions = useCallback((): Transaction[] => {
    return getTransactionsByStatus('pending');
  }, [getTransactionsByStatus]);

  // Get completed transactions
  const getCompletedTransactions = useCallback((): Transaction[] => {
    return getTransactionsByStatus('completed');
  }, [getTransactionsByStatus]);

  // Quick filter by account
  const getTransactionsByAccount = useCallback((accountId: string): Transaction[] => {
    return transactions.filter(transaction => transaction.account_id === accountId);
  }, [transactions]);

  // Format currency display
  const formatCurrency = useCallback((amount: string | number, currency: string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount);
  }, []);

  // Format date display
  const formatTransactionDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Refresh all transaction data
  const refreshTransactionData = useCallback(async () => {
    await Promise.all([
      getTransactions(),
      getTransactionSummary(),
      getRecentTransactions(),
    ]);
  }, [getTransactions, getTransactionSummary, getRecentTransactions]);

  // Quick transfer with validation
  const quickTransfer = useCallback(async (
    senderAccountId: string,
    receiverAccountNumber: string,
    amount: number,
    description?: string
  ): Promise<any> => {
    const transferData: TransferRequest = {
      senderAccountId,
      receiverAccountNumber,
      amount,
      description,
    };

    return await initiateTransfer(transferData);
  }, [initiateTransfer]);

  return {
    // State
    transactions,
    currentTransaction,
    transactionSummary,
    recentTransactions,
    isLoading,
    error,

    // Actions
    getTransactions,
    getTransactionDetails,
    initiateTransfer,
    getTransactionSummary,
    exportTransactions,
    verifyTransaction,
    cancelTransaction,
    getRecentTransactions,
    getTransactionStats,
    searchTransactions,
    getTransactionByReference,
    setCurrentTransaction,
    clearError,
    setLoading,

    // Utility functions
    getTransactionsByType,
    getTransactionsByStatus,
    getTransactionsByDateRange,
    getTotalTransactionAmount,
    getTotalFees,
    getPendingTransactions,
    getCompletedTransactions,
    getTransactionsByAccount,
    formatCurrency,
    formatTransactionDate,
    refreshTransactionData,
    quickTransfer,

    // Computed properties
    totalTransactions: transactions.length,
    totalAmount: getTotalTransactionAmount(),
    totalFees: getTotalFees(),
    pendingTransactions: getPendingTransactions(),
    completedTransactions: getCompletedTransactions(),
    transferTransactions: getTransactionsByType('transfer'),
    depositTransactions: getTransactionsByType('deposit'),
    withdrawalTransactions: getTransactionsByType('withdrawal'),
  };
};

// Hook for individual transaction management
export const useSingleTransaction = (transactionId?: string) => {
  const {
    transactions,
    currentTransaction,
    isLoading,
    error,
    getTransactionDetails,
    verifyTransaction,
    cancelTransaction,
    setCurrentTransaction,
    clearError,
  } = useTransactionStore();

  const transaction = transactionId 
    ? transactions.find(t => t.id === transactionId)
    : currentTransaction;

  // Load transaction details if not already loaded
  useEffect(() => {
    if (transactionId && !transaction) {
      getTransactionDetails(transactionId).catch(console.error);
    }
  }, [transactionId, transaction, getTransactionDetails]);

  const verifyCurrentTransaction = useCallback(async (otp: string) => {
    if (transaction) {
      return await verifyTransaction(transaction.id, otp);
    }
    return null;
  }, [transaction, verifyTransaction]);

  const cancelCurrentTransaction = useCallback(async (reason?: string) => {
    if (transaction) {
      return await cancelTransaction(transaction.id, reason);
    }
    return null;
  }, [transaction, cancelTransaction]);

  return {
    // State
    transaction,
    isLoading,
    error,

    // Actions
    getTransactionDetails: () => transactionId 
      ? getTransactionDetails(transactionId) 
      : Promise.resolve(transaction),
    verifyTransaction: verifyCurrentTransaction,
    cancelTransaction: cancelCurrentTransaction,
    setCurrentTransaction,
    clearError,

    // Computed properties
    isPending: transaction?.status === 'pending',
    isCompleted: transaction?.status === 'completed',
    isFailed: transaction?.status === 'failed',
    formattedAmount: transaction 
      ? `${transaction.amount} ${transaction.currency}`
      : '0.00 USD',
    formattedDate: transaction 
      ? new Date(transaction.created_at).toLocaleDateString()
      : '',
  };
};