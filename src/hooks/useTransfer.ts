'use client';
import { useEffect, useCallback } from 'react';
import {
  useTransferStore,
  UserTransfer,
  CreateTransferDto,
  TransferQueryParams
} from '../stores/transfer.store';

export const useTransfer = () => {
  const {
    userTransfers: transfers,
    scheduledTransfers,
    transferFees,
    transferLimits,
    isLoading,
    error,
    initiateTransfer,
    fetchUserTransfers: getTransfers,
    getTransferDetails,
    cancelTransfer,
    scheduleTransfer,
    fetchScheduledTransfers: getScheduledTransfers,
    cancelScheduledTransfer,
    calculateFees,
    validateAccount,
    fetchTransferLimits: getTransferLimits,
    clearError
  } = useTransferStore();

  // No auto-fetch on mount; fetch on demand via getTransfers/getScheduledTransfers

  const getSentTransfers = useCallback((): UserTransfer[] => {
    return transfers.filter(
      (transfer) =>
        transfer.status !== 'cancelled' && transfer.scheduled_for === null
    );
  }, [transfers]);

  const getReceivedTransfers = useCallback((): UserTransfer[] => {
    return transfers.filter(
      (transfer) =>
        transfer.status !== 'cancelled' && transfer.scheduled_for === null
    );
  }, [transfers]);

  const getPendingTransfers = useCallback((): UserTransfer[] => {
    return transfers.filter((transfer) => transfer.status === 'pending');
  }, [transfers]);

  const getCompletedTransfers = useCallback((): UserTransfer[] => {
    return transfers.filter((transfer) => transfer.status === 'completed');
  }, [transfers]);

  const getScheduledTransfersByDate = useCallback(
    (date: Date): UserTransfer[] => {
      return scheduledTransfers.filter((transfer) => {
        if (!transfer.scheduled_for) return false;
        const scheduledDate = new Date(transfer.scheduled_for);
        return scheduledDate.toDateString() === date.toDateString();
      });
    },
    [scheduledTransfers]
  );

  const getUpcomingScheduledTransfers = useCallback((): UserTransfer[] => {
    const now = new Date();
    return scheduledTransfers.filter((transfer) => {
      if (!transfer.scheduled_for) return false;
      return new Date(transfer.scheduled_for) > now;
    });
  }, [scheduledTransfers]);

  const getTotalTransferredAmount = useCallback((): number => {
    return transfers.reduce((sum, transfer) => {
      if (transfer.status === 'completed') {
        return sum + (transfer.amount as number);
      }
      return sum;
    }, 0);
  }, [transfers]);

  const getTotalFeesPaid = useCallback((): number => {
    return transfers.reduce((sum, transfer) => {
      if (transfer.status === 'completed') {
        return sum + (transfer.fee as number);
      }
      return sum;
    }, 0);
  }, [transfers]);

  const checkTransferLimit = useCallback(
    (amount: number): boolean => {
      if (!transferLimits) return false;
      return amount > transferLimits.per_transaction_limit;
    },
    [transferLimits]
  );

  const checkDailyLimit = useCallback(
    (amount: number): boolean => {
      if (!transferLimits) return false;
      return transferLimits.daily_used + amount > transferLimits.daily_limit;
    },
    [transferLimits]
  );

  const formatCurrency = useCallback(
    (amount: number, currency: string): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },
    []
  );

  const formatTransferDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const quickTransfer = useCallback(
    async (
      senderAccountId: bigint,
      receiverAccountNumber: string,
      amount: number,
      description?: string,
      transactionPin?: string,
      recipientBank?: string,
      recipientAddress?: string,
      recipientRoutingNumber?: string
    ): Promise<any> => {
      const transferData: CreateTransferDto = {
        sender_account_id: senderAccountId,
        receiver_account_number: receiverAccountNumber,
        amount,
        description,
        transaction_pin: transactionPin,
        recipient_bank: recipientBank,
        recipient_address: recipientAddress,
        recipient_routing_number: recipientRoutingNumber
      };
      return await initiateTransfer(transferData);
    },
    [initiateTransfer]
  );

  const quickScheduleTransfer = useCallback(
    async (
      senderAccountId: bigint,
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
        scheduled_for: scheduledFor
      };
      return await scheduleTransfer(transferData);
    },
    [scheduleTransfer]
  );

  const refreshTransferData = useCallback(async () => {
    await Promise.all([
      getTransfers(),
      getScheduledTransfers(),
      getTransferLimits()
    ]);
  }, [getTransfers, getScheduledTransfers, getTransferLimits]);

  return {
    transfers,
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
    clearError,
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
    totalTransfers: transfers.length,
    totalScheduledTransfers: scheduledTransfers.length,
    totalTransferredAmount: getTotalTransferredAmount(),
    totalFeesPaid: getTotalFeesPaid(),
    sentTransfers: getSentTransfers(),
    receivedTransfers: getReceivedTransfers(),
    pendingTransfers: getPendingTransfers(),
    completedTransfers: getCompletedTransfers(),
    upcomingScheduledTransfers: getUpcomingScheduledTransfers()
  };
};

export const useSingleTransfer = (transferId?: string) => {
  const {
    userTransfers: transfers,
    isLoading,
    error,
    getTransferDetails,
    cancelTransfer,
    clearError
  } = useTransferStore();
  const transfer = transferId
    ? transfers.find((t) => t.id === transferId)
    : undefined;

  useEffect(() => {
    if (transferId && !transfer) {
      getTransferDetails(transferId).catch(console.error);
    }
  }, [transferId, transfer, getTransferDetails]);

  const cancelCurrentTransfer = useCallback(
    async (reason: string) => {
      if (transfer) {
        return await cancelTransfer(transfer.id, reason);
      }
      return null;
    },
    [transfer, cancelTransfer]
  );

  return {
    transfer,
    isLoading,
    error,
    getTransferDetails: () =>
      transferId ? getTransferDetails(transferId) : Promise.resolve(transfer),
    cancelTransfer: cancelCurrentTransfer,
    clearError,
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
      : null
  };
};
