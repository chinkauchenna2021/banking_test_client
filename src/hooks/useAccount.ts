import { useEffect, useCallback } from 'react';
import { useAccountStore, Account, Transaction } from '../stores/account.store';

export const useAccount = () => {
  const {
    accounts,
    currentAccount,
    transactions,
    accountStats,
    isLoading,
    error,
    createAccount,
    getAccounts,
    getAccountDetails,
    updateAccount,
    closeAccount,
    getAccountBalance,
    getAccountTransactions,
    getAccountStatement,
    internalTransfer,
    setCurrentAccount,
    clearError,
    setLoading,
  } = useAccountStore();

  // Auto-fetch accounts on mount if authenticated
  useEffect(() => {
    const fetchAccounts = async () => {
      if (accounts.length === 0 && !isLoading) {
        await getAccounts();
      }
    };
    fetchAccounts();
  }, []);

  // Get account by ID
  const getAccountById = useCallback((accountId: string): Account | undefined => {
    return accounts.find(account => account.id === accountId);
  }, [accounts]);

  // Get default account
  const getDefaultAccount = useCallback((): Account | undefined => {
    return accounts.find(account => account.is_default);
  }, [accounts]);

  // Get total balance across all accounts
  const getTotalBalance = useCallback(() => {
    return accounts.reduce((total, account) => {
      return total + parseFloat(account.balance);
    }, 0);
  }, [accounts]);

  // Get accounts by type
  const getAccountsByType = useCallback((type: string): Account[] => {
    return accounts.filter(account => account.account_type === type);
  }, [accounts]);

  // Get active accounts
  const getActiveAccounts = useCallback((): Account[] => {
    return accounts.filter(account => account.status === 'active');
  }, [accounts]);

  // Filter transactions by type
  const getTransactionsByType = useCallback((type: string): Transaction[] => {
    return transactions.filter(transaction => transaction.type === type);
  }, [transactions]);

  // Filter transactions by date range
  const getTransactionsByDateRange = useCallback((startDate: Date, endDate: Date): Transaction[] => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.created_at);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }, [transactions]);

  // Calculate total transaction amount by type
  const getTotalTransactionAmountByType = useCallback((type: string): number => {
    return getTransactionsByType(type).reduce((total, transaction) => {
      return total + parseFloat(transaction.amount);
    }, 0);
  }, [getTransactionsByType]);

  // Refresh all account data
  const refreshAccountData = useCallback(async () => {
    await Promise.all([
      getAccounts(),
      currentAccount && getAccountTransactions(currentAccount.id),
    ]);
  }, [getAccounts, currentAccount, getAccountTransactions]);

  // Quick transfer between user's own accounts
  const quickTransfer = useCallback(async (
    fromAccountId: string,
    toAccountNumber: string,
    amount: number,
    description?: string
  ) => {
    const toAccount = accounts.find(acc => acc.account_number === toAccountNumber);
    if (!toAccount) {
      throw new Error('Recipient account not found');
    }

    return await internalTransfer({
      from_account_id: fromAccountId,
      to_account_id: toAccount.id,
      amount,
      description,
    });
  }, [accounts, internalTransfer]);

  // Format currency display
  const formatCurrency = useCallback((amount: string | number, currency: string): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(numAmount);
  }, []);

  return {
    // State
    accounts,
    currentAccount,
    transactions,
    accountStats,
    isLoading,
    error,

    // Actions
    createAccount,
    getAccounts,
    getAccountDetails,
    updateAccount,
    closeAccount,
    getAccountBalance,
    getAccountTransactions,
    getAccountStatement,
    internalTransfer,
    setCurrentAccount,
    clearError,
    setLoading,

    // Utility functions
    getAccountById,
    getDefaultAccount,
    getTotalBalance,
    getAccountsByType,
    getActiveAccounts,
    getTransactionsByType,
    getTransactionsByDateRange,
    getTotalTransactionAmountByType,
    refreshAccountData,
    quickTransfer,
    formatCurrency,

    // Computed properties
    totalBalance: getTotalBalance(),
    defaultAccount: getDefaultAccount(),
    activeAccounts: getActiveAccounts(),
    checkingAccounts: getAccountsByType('checking'),
    savingsAccounts: getAccountsByType('savings'),
    recentTransactions: transactions.slice(0, 10),
  };
};

// Hook for individual account management
export const useSingleAccount = (accountId?: string) => {
  const {
    accounts,
    currentAccount,
    transactions,
    isLoading,
    error,
    getAccountDetails,
    getAccountTransactions,
    getAccountBalance,
    getAccountStatement,
    updateAccount,
    closeAccount,
    setCurrentAccount,
    clearError,
  } = useAccountStore();

  const account = accountId 
    ? accounts.find(acc => acc.id === accountId)
    : currentAccount;

  // Load account details if not already loaded
  useEffect(() => {
    if (accountId && !account) {
      getAccountDetails(accountId).catch(console.error);
    }
  }, [accountId, account, getAccountDetails]);

  // Load account transactions
  useEffect(() => {
    if (account && transactions.length === 0) {
      getAccountTransactions(account.id).catch(console.error);
    }
  }, [account, transactions.length, getAccountTransactions]);

  const loadAccountBalance = useCallback(async () => {
    if (account) {
      return await getAccountBalance(account.id);
    }
    return null;
  }, [account, getAccountBalance]);

  const loadAccountStatement = useCallback(async (params?: any) => {
    if (account) {
      return await getAccountStatement(account.id, params);
    }
    return null;
  }, [account, getAccountStatement]);

  const updateCurrentAccount = useCallback(async (updateData: any) => {
    if (account) {
      return await updateAccount(account.id, updateData);
    }
    return null;
  }, [account, updateAccount]);

  const closeCurrentAccount = useCallback(async (reason: string, transferAccountId?: string) => {
    if (account) {
      return await closeAccount(account.id, reason, transferAccountId);
    }
    return null;
  }, [account, closeAccount]);

  return {
    // State
    account,
    transactions,
    isLoading,
    error,

    // Actions
    getAccountDetails: () => accountId ? getAccountDetails(accountId) : Promise.resolve(account),
    getAccountTransactions: (params?: any) => account ? getAccountTransactions(account.id, params) : Promise.resolve({ transactions: [], pagination: {} }),
    getAccountBalance: loadAccountBalance,
    getAccountStatement: loadAccountStatement,
    updateAccount: updateCurrentAccount,
    closeAccount: closeCurrentAccount,
    setCurrentAccount,
    clearError,

    // Computed properties
    isDefaultAccount: account?.is_default || false,
    isActive: account?.status === 'active',
    formattedBalance: account ? `${account.balance} ${account.currency}` : '0.00 USD',
  };
};