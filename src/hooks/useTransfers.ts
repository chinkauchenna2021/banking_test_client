"use client"
import { useEffect } from 'react';
import { useTransferStore } from '../stores/transfer.store';
import { useUser } from './useUser';

export const useTransfers = () => {
  const transferState = useTransferStore();
  const { user } = useUser();

  const { fetchTransferLimits } = transferState;

  useEffect(() => {
    // Fetch transfer limits when the hook is first used
    if (!transferState.transferLimits && !transferState.isLoading) {
      fetchTransferLimits();
    }
  }, [transferState.transferLimits, transferState.isLoading, fetchTransferLimits]);

  return {
    ...transferState,
    currentUserAccount: user?.accounts?.[0], // Assuming the first account is the one to use
  };
};
