import { useEffect, useCallback } from 'react';
import { 
  useTransferStore, 
  Transfer, 
  CreateTransferDto, 
  TransferQueryParams 
} from '../stores/transfer.store';

export const useTransfer = () => {
  const {
    transfers,
    currentTransfer,
    scheduledTransfers,
    transferFees,
    transferLimits,
    isLoading,
    error,
    initiateTransfer,
    getTransfers,
    getTransferDetails,
    cancelTransfer,
    scheduleTransfer,
    getScheduledTransfers,
    cancelScheduledTransfer,
    calculateFees,
    validateAccount,
    getTransferLimits,
    setCurrentTransfer,
    clearError,
    setLoading,
  } = useTransferStore();

  // Auto-fetch transfers on mount
  useEffect(() => {
    const fetchTransfers = async () => {
      if (transfers.length === 0 && !isLoading) {
        await getTransfers();
      }
    };
    fetchTransfers();
  }, []);

  // Auto-fetch transfer limits
  useEffect(() => {
    const fetchLimits = async () => {
      if (!transferLimits && !isLoading) {
        await getTransferLimits();
      }
    };
    fetchLimits();
  }, []);

  // Filter sent transfers
  const getSentTransfers = useCallback((): Transfer[] => {
    return transfers.filter(transfer => 
      transfer.status !== 'cancelled' && transfer.scheduled_for === undefined
    );
  }, [transfers]);

  // Filter received transfers
  const getReceivedTransfers = useCallback((): Transfer[] => {
    return transfers.filter(transfer => 
      transfer.status !== 'cancelled' && transfer.scheduled_for === undefined
    );
  }, [transfers]);

  // Filter pending transfers
  const getPendingTransfers = useCallback((): Transfer[] => {
    return transfers.filter(transfer => transfer.status === 'pending');
  }, [transfers]);

  // Filter completed transfers
  const getCompletedTransfers = useCallback((): Transfer[] => {
    return transfers.filter(transfer => transfer.status === 'completed');
  }, [transfers]);

  // Filter scheduled transfers by date
  const getScheduledTransfersByDate = useCallback((date: Date): Transfer[] => {
    return scheduledTransfers.filter(transfer => {
      if (!transfer.scheduled_for) return false;
      const scheduledDate = new Date(transfer.scheduled_for);
      return scheduledDate.toDateString() === date.toDateString();
    });
  }, [scheduledTransfers]);

  // Get upcoming scheduled transfers
  const getUpcomingScheduledTransfers = useCallback((): Transfer[] => {
    const now = new Date();
    return scheduledTransfers.filter(transfer => {
      if (!transfer.scheduled_for) return false;
      return new Date(transfer.scheduled_for) > now;
    });
  }, [scheduledTransfers]);

  // Calculate total transferred amount
  const getTotalTransferredAmount = useCallback((): number => {
    return transfers.reduce((total, transfer) => {
      if (transfer.status === 'completed') {
        return total + parseFloat(transfer.amount);
      }
      return total;
    }, 0);
  }, [transfers]);

  // Calculate total fees paid
  const getTotalFeesPaid = useCallback((): number => {
    return transfers.reduce((total, transfer) => {
      if (transfer.status === 'completed') {
        return total + parseFloat(transfer.fee || '0');
      }
      return total;
    }, 0);
  }, [transfers]);

  // Check if transfer limit would be exceeded
  const checkTransferLimit = useCallback((amount: number): boolean => {
    if (!transferLimits) return false;
    return amount > transferLimits.per_transaction_limit;
  }, [transferLimits]);

  // Check daily limit
  const checkDailyLimit = useCallback((amount: number): boolean => {
    if (!transferLimits) return false;
    return transferLimits.daily_used + amount > transferLimits.daily_limit;
  }, [transferLimits]);

  // Format currency display
  const formatCurrency = useCallback((amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Format date display
  const formatTransferDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Quick transfer with validation
  const quickTransfer = useCallback(async (
    senderAccountId: string,
    receiverAccountNumber: string,
    amount: number,
    description?: string,
    transactionPin?: string
  ): Promise<any> => {
    const transferData: CreateTransferDto = {
      sender_account_id: senderAccountId,
      receiver_account_number: receiverAccountNumber,
      amount,
      description,
      transaction_pin: transactionPin,
    };

    return await initiateTransfer(transferData);
  }, [initiateTransfer]);

  // Schedule transfer with validation
  const quickScheduleTransfer = useCallback(async (
    senderAccountId: string,
    receiverAccountNumber: string,
    amount: number,
    scheduledFor: Date,
    description?: string,
    transactionPin?: string
  ): Promise<any> => {
    const transferData: CreateTransferDto = {
      sender_account_id: senderAccountId,
      receiver_account_number: receiverAccountNumber,
      amount,
      description,
      transaction_pin: transactionPin,
      scheduled_for: scheduledFor,
    };

    return await scheduleTransfer(transferData);
  }, [scheduleTransfer]);

  // Refresh all transfer data
  const refreshTransferData = useCallback(async () => {
    await Promise.all([
      getTransfers(),
      getScheduledTransfers(),
      getTransferLimits(),
    ]);
  }, [getTransfers, getScheduledTransfers, getTransferLimits]);

  return {
    // State
    transfers,
    currentTransfer,
    scheduledTransfers,
    transferFees,
    transferLimits,
    isLoading,
    error,

    // Actions
    initiateTransfer,
    getTransfers,
    getTransferDetails,
    cancelTransfer,
    scheduleTransfer,
    getScheduledTransfers,
    cancelScheduledTransfer,
    calculateFees,
    validateAccount,
    getTransferLimits,
    setCurrentTransfer,
    clearError,
    setLoading,

    // Utility functions
    getSentTransfers,
    getReceivedTransfers,
    getPendingTransfers,
    getCompletedTransfers,
    getScheduledTransfersByDate,
    getUpcomingScheduledTransfers,
    getTotalTransferredAmount,
    getTotalFeesPaid,
    checkTransferLimit,
    checkDailyLimit,
    formatCurrency,
    formatTransferDate,
    quickTransfer,
    quickScheduleTransfer,
    refreshTransferData,

    // Computed properties
    totalTransfers: transfers.length,
    totalScheduledTransfers: scheduledTransfers.length,
    totalTransferredAmount: getTotalTransferredAmount(),
    totalFeesPaid: getTotalFeesPaid(),
    sentTransfers: getSentTransfers(),
    receivedTransfers: getReceivedTransfers(),
    pendingTransfers: getPendingTransfers(),
    completedTransfers: getCompletedTransfers(),
    upcomingScheduledTransfers: getUpcomingScheduledTransfers(),
  };
};

// Hook for individual transfer management
export const useSingleTransfer = (transferId?: string) => {
  const {
    transfers,
    currentTransfer,
    isLoading,
    error,
    getTransferDetails,
    cancelTransfer,
    setCurrentTransfer,
    clearError,
  } = useTransferStore();

  const transfer = transferId 
    ? transfers.find(t => t.id === transferId)
    : currentTransfer;

  // Load transfer details if not already loaded
  useEffect(() => {
    if (transferId && !transfer) {
      getTransferDetails(transferId).catch(console.error);
    }
  }, [transferId, transfer, getTransferDetails]);

  const cancelCurrentTransfer = useCallback(async (reason: string) => {
    if (transfer) {
      return await cancelTransfer(transfer.id, reason);
    }
    return null;
  }, [transfer, cancelTransfer]);

  return {
    // State
    transfer,
    isLoading,
    error,

    // Actions
    getTransferDetails: () => transferId 
      ? getTransferDetails(transferId) 
      : Promise.resolve(transfer),
    cancelTransfer: cancelCurrentTransfer,
    setCurrentTransfer,
    clearError,

    // Computed properties
    isScheduled: !!transfer?.scheduled_for,
    isPending: transfer?.status === 'pending',
    isCompleted: transfer?.status === 'completed',
    isCancelled: transfer?.status === 'cancelled',
    isFailed: transfer?.status === 'failed',
    formattedAmount: transfer 
      ? `${transfer.amount} ${transfer.currency}`
      : '0.00 USD',
    formattedDate: transfer 
      ? new Date(transfer.created_at).toLocaleDateString()
      : '',
    scheduledDate: transfer?.scheduled_for
      ? new Date(transfer.scheduled_for).toLocaleDateString()
      : null,
  };
};