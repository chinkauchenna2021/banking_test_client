import { useEffect, useCallback } from 'react';
import { useDepositStore, ManualDeposit, DepositMethod, DepositMethodItem } from '../stores/deposit.store';

export const useDeposit = () => {
  const {
    depositMethods,
    deposits,
    currentDeposit,
    isLoading,
    error,
    getDepositMethods,
    initiateDeposit,
    bankTransferDeposit,
    cryptoDeposit,
    cardDeposit,
    getDeposits,
    getDepositDetails,
    cancelDeposit,
    clearDeposits,
    clearError,
    setLoading,
  } = useDepositStore();

  // Auto-fetch deposit methods on mount
  useEffect(() => {
    const fetchMethods = async () => {
      if (depositMethods.length === 0) {
        await getDepositMethods();
      }
    };
    fetchMethods();
  }, []);

  // Get deposit by ID
  const getDepositById = useCallback((depositId: string): ManualDeposit | undefined => {
    return deposits.find((deposit: ManualDeposit) => deposit.id === depositId);
  }, [deposits]);

  // Get deposits by status
  const getDepositsByStatus = useCallback((status: string): ManualDeposit[] => {
    return deposits.filter((deposit: ManualDeposit) => deposit.status === status);
  }, [deposits]);

  // Get deposits by method
  const getDepositsByMethod = useCallback((method: string): ManualDeposit[] => {
    return deposits.filter((deposit: ManualDeposit) => deposit.method === method);
  }, [deposits]);

  // Get total deposited amount
  const getTotalDeposited = useCallback(() => {
    return deposits
      .filter((deposit: ManualDeposit) => deposit.status === 'completed')
      .reduce((total: number, deposit: ManualDeposit) => total + deposit.amount, 0);
  }, [deposits]);

  // Get pending deposits
  const getPendingDeposits = useCallback((): ManualDeposit[] => {
    return deposits.filter((deposit: ManualDeposit) => 
      deposit.status === 'pending' || deposit.status === 'awaiting_confirmation'
    );
  }, [deposits]);

  // Get deposit method by type
  const getDepositMethodByType = useCallback((methodType: string): DepositMethodItem | undefined => {
    return depositMethods.find((method: DepositMethodItem) => method.method === methodType);
  }, [depositMethods]);

  // Calculate deposit fees
  const calculateDepositFees = useCallback((amount: number, methodType: string): {
    fee: number;
    total: number;
    netAmount: number;
  } => {
    const method = getDepositMethodByType(methodType);
    if (!method) {
      return { fee: 0, total: amount, netAmount: amount };
    }

    const fee = (amount * (method.fee_percentage / 100)) + method.fee_fixed;
    const total = amount + fee;
    const netAmount = amount - fee;

    return { fee, total, netAmount };
  }, [getDepositMethodByType]);

  // Validate deposit amount
  const validateDepositAmount = useCallback((amount: number, methodType: string): {
    valid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    const method = getDepositMethodByType(methodType);

    if (!method) {
      errors.push('Invalid deposit method');
      return { valid: false, errors };
    }

    if (amount < method.min_amount) {
      errors.push(`Minimum deposit amount is ${method.min_amount}`);
    }

    if (amount > method.max_amount) {
      errors.push(`Maximum deposit amount is ${method.max_amount}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }, [getDepositMethodByType]);

  // Format deposit amount
  const formatDepositAmount = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Get deposit status color
  const getDepositStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
      case 'awaiting_confirmation':
        return 'yellow';
      case 'cancelled':
        return 'red';
      case 'failed':
        return 'red';
      default:
        return 'gray';
    }
  }, []);

  // Quick deposit
  const quickDeposit = useCallback(async (amount: number, method: string, accountId: string) => {
    const depositData = {
      account_id: accountId,
      amount,
      method,
      payment_method_id: 'quick', // This would be the user's default payment method
    };

    return await initiateDeposit(depositData);
  }, [initiateDeposit]);

  return {
    // State
    depositMethods,
    deposits,
    currentDeposit,
    isLoading,
    error,

    // Actions
    getDepositMethods,
    initiateDeposit,
    bankTransferDeposit,
    cryptoDeposit,
    cardDeposit,
    getDeposits,
    getDepositDetails,
    cancelDeposit,
    clearDeposits,
    clearError,
    setLoading,

    // Utility functions
    getDepositById,
    getDepositsByStatus,
    getDepositsByMethod,
    getTotalDeposited,
    getPendingDeposits,
    getDepositMethodByType,
    calculateDepositFees,
    validateDepositAmount,
    formatDepositAmount,
    getDepositStatusColor,
    quickDeposit,

    // Computed properties
    totalDeposited: getTotalDeposited(),
    pendingDeposits: getPendingDeposits(),
    completedDeposits: getDepositsByStatus('completed'),
    cancelledDeposits: getDepositsByStatus('cancelled'),
    bankTransferDeposits: getDepositsByMethod('bank_transfer'),
    cryptoDeposits: getDepositsByMethod('crypto'),
    cardDeposits: getDepositsByMethod('card'),
  };
};