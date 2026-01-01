'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useManualDepositStore, ManualDeposit, CompanyAccountDetails } from '../stores/manual-deposit.store';

export const useManualDeposit = () => {
  const {
    deposits,
    companyAccount,
    isLoading,
    error,
    createManualDeposit,
    uploadProof,
    getDeposits,
    getCompanyAccountDetails,
    clearDeposits,
    clearError,
    setLoading
  } = useManualDepositStore();

  const [selectedMethod, setSelectedMethod] = useState<string>('bank_transfer');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');

  // Load deposits on mount
  useEffect(() => {
    loadDeposits();
  }, []);

  // Load user deposits
  const loadDeposits = useCallback(async (filters?: any) => {
    try {
      await getDeposits(filters);
    } catch (error) {
      console.error('Failed to load deposits:', error);
    }
  }, [getDeposits]);

  // Load company account details for a method
  const loadCompanyAccountDetails = useCallback(async (method: string, currency: string = 'USD') => {
    try {
      await getCompanyAccountDetails(method, currency);
    } catch (error) {
      console.error('Failed to load company account details:', error);
    }
  }, [getCompanyAccountDetails]);

  // Get deposit by ID
  const getDepositById = useCallback((depositId: string): ManualDeposit | undefined => {
    return deposits.find(deposit => deposit.id === depositId);
  }, [deposits]);

  // Get deposits by status
  const getDepositsByStatus = useCallback((status: string): ManualDeposit[] => {
    return deposits.filter(deposit => deposit.status === status);
  }, [deposits]);

  // Get deposits by method
  const getDepositsByMethod = useCallback((method: string): ManualDeposit[] => {
    return deposits.filter(deposit => deposit.method === method);
  }, [deposits]);

  // Get recent deposits
  const getRecentDeposits = useCallback((count: number = 5): ManualDeposit[] => {
    return [...deposits]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  }, [deposits]);

  // Get total deposited amount
  const getTotalDeposited = useCallback(() => {
    return deposits
      .filter(deposit => deposit.status === 'completed')
      .reduce((total, deposit) => total + deposit.amount, 0);
  }, [deposits]);

  // Format currency amount
  const formatCurrency = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Get status badge color
  const getStatusColor = useCallback((status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'awaiting_confirmation':
      case 'awaiting_proof':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'failed':
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }, []);

  // Get status display text
  const getStatusText = useCallback((status: string): string => {
    const statusMap: Record<string, string> = {
      'pending': 'Pending',
      'processing': 'Processing',
      'awaiting_confirmation': 'Awaiting Proof',
      'awaiting_proof': 'Awaiting Proof',
      'completed': 'Completed',
      'confirmed': 'Confirmed',
      'failed': 'Failed',
      'rejected': 'Rejected',
      'cancelled': 'Cancelled',
    };
    return statusMap[status.toLowerCase()] || status;
  }, []);

  // Get method display text
  const getMethodText = useCallback((method: string): string => {
    const methodMap: Record<string, string> = {
      'bank_transfer': 'Bank Transfer',
      'crypto': 'Cryptocurrency',
      'card': 'Credit/Debit Card',
      'mobile_money': 'Mobile Money',
      'paypal': 'PayPal',
      'wire_transfer': 'Wire Transfer',
    };
    return methodMap[method.toLowerCase()] || method;
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Validate file upload
  const validateFile = useCallback((file: File): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'application/pdf',
      'image/webp'
    ];

    if (!file) {
      errors.push('No file selected');
      return { valid: false, errors };
    }

    if (file.size > maxSize) {
      errors.push(`File size must be less than ${formatFileSize(maxSize)}`);
    }

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      errors.push('File must be an image (JPEG, PNG, GIF, WEBP) or PDF');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }, [formatFileSize]);

  // Copy company account details to clipboard
  const copyCompanyAccountDetails = useCallback(async (): Promise<boolean> => {
    if (!companyAccount) return false;
    
    let detailsText = '';
    
    if (companyAccount.account_number) {
      // Bank account details
      detailsText = [
        companyAccount.bank_name && `Bank Name: ${companyAccount.bank_name}`,
        companyAccount.account_name && `Account Name: ${companyAccount.account_name}`,
        companyAccount.account_number && `Account Number: ${companyAccount.account_number}`,
        companyAccount.swift_code && `SWIFT Code: ${companyAccount.swift_code}`,
        companyAccount.iban && `IBAN: ${companyAccount.iban}`,
        companyAccount.bank_address && `Bank Address: ${companyAccount.bank_address}`,
        companyAccount.instructions?.length && `Instructions:\n${companyAccount.instructions.map(i => `• ${i}`).join('\n')}`
      ]
        .filter(Boolean)
        .join('\n')
        .trim();
    } else if (companyAccount.wallet_address) {
      // Crypto wallet details
      detailsText = [
        companyAccount.network && `Network: ${companyAccount.network}`,
        companyAccount.wallet_address && `Wallet Address: ${companyAccount.wallet_address}`,
        companyAccount.instructions?.length && `Instructions:\n${companyAccount.instructions.map(i => `• ${i}`).join('\n')}`
      ]
        .filter(Boolean)
        .join('\n')
        .trim();
    }

    try {
      await navigator.clipboard.writeText(detailsText);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, [companyAccount]);

  // Quick bank transfer deposit
  const quickBankTransfer = useCallback(async (
    amount: number,
    accountId: string,
    bankDetails: {
      sender_name: string;
      sender_bank?: string;
      sender_account?: string;
      additional_notes?: string;
    }
  ) => {
    const depositData = {
      amount,
      method: 'bank_transfer' as const,
      account_id: accountId,
      currency: selectedCurrency,
      ...bankDetails
    };
    
    return await createManualDeposit(depositData);
  }, [createManualDeposit, selectedCurrency]);

  // Quick crypto deposit
  const quickCryptoDeposit = useCallback(async (
    amount: number,
    accountId: string,
    cryptoDetails: {
      crypto_address?: string;
      crypto_transaction_hash?: string;
      additional_notes?: string;
    }
  ) => {
    const depositData = {
      amount,
      method: 'crypto' as const,
      account_id: accountId,
      currency: selectedCurrency,
      ...cryptoDetails
    };
    
    return await createManualDeposit(depositData);
  }, [createManualDeposit, selectedCurrency]);

  // Computed properties
  const pendingDeposits = useMemo(() => getDepositsByStatus('pending'), [getDepositsByStatus]);
  const awaitingConfirmationDeposits = useMemo(() => 
    getDepositsByStatus('awaiting_confirmation'), 
    [getDepositsByStatus]
  );
  const completedDeposits = useMemo(() => getDepositsByStatus('completed'), [getDepositsByStatus]);
  const failedDeposits = useMemo(() => getDepositsByStatus('failed'), [getDepositsByStatus]);
  
  const bankTransferDeposits = useMemo(() => getDepositsByMethod('bank_transfer'), [getDepositsByMethod]);
  const cryptoDeposits = useMemo(() => getDepositsByMethod('crypto'), [getDepositsByMethod]);
  
  const recentDeposits = useMemo(() => getRecentDeposits(5), [getRecentDeposits]);
  const totalDeposited = useMemo(() => getTotalDeposited(), [getTotalDeposited]);

  const hasPendingDeposits = useMemo(() => pendingDeposits.length > 0, [pendingDeposits]);
  const hasAwaitingConfirmationDeposits = useMemo(() => awaitingConfirmationDeposits.length > 0, [awaitingConfirmationDeposits]);
  const hasCompletedDeposits = useMemo(() => completedDeposits.length > 0, [completedDeposits]);

  // Reset all state
  const reset = useCallback(() => {
    clearDeposits();
    clearError();
    setSelectedMethod('bank_transfer');
    setSelectedCurrency('USD');
  }, [clearDeposits, clearError]);

  // Refresh data
  const refresh = useCallback(async () => {
    await loadDeposits();
    if (selectedMethod) {
      await loadCompanyAccountDetails(selectedMethod, selectedCurrency);
    }
  }, [loadDeposits, loadCompanyAccountDetails, selectedMethod, selectedCurrency]);

  return {
    // State
    deposits,
    companyAccount,
    isLoading,
    error,
    selectedMethod,
    selectedCurrency,
    
    // Actions
    createManualDeposit,
    uploadProof,
    getDeposits: loadDeposits,
    getCompanyAccountDetails: loadCompanyAccountDetails,
    clearDeposits,
    clearError,
    setLoading,
    
    // Method/currency setters
    setSelectedMethod,
    setSelectedCurrency,
    
    // Utility functions
    getDepositById,
    getDepositsByStatus,
    getDepositsByMethod,
    getRecentDeposits,
    getTotalDeposited,
    formatCurrency,
    getStatusColor,
    getStatusText,
    getMethodText,
    formatFileSize,
    validateFile,
    copyCompanyAccountDetails,
    
    // Quick deposit methods
    quickBankTransfer,
    quickCryptoDeposit,
    
    // Computed properties
    pendingDeposits,
    awaitingConfirmationDeposits,
    completedDeposits,
    failedDeposits,
    bankTransferDeposits,
    cryptoDeposits,
    recentDeposits,
    totalDeposited,
    
    // Boolean flags
    hasPendingDeposits,
    hasAwaitingConfirmationDeposits,
    hasCompletedDeposits,
    isEmpty: deposits.length === 0,
    
    // State management
    reset,
    refresh,
    
    // Convenience properties
    currentCompanyAccount: companyAccount,
    depositCount: deposits.length,
    pendingCount: pendingDeposits.length,
    completedCount: completedDeposits.length,
  };
};