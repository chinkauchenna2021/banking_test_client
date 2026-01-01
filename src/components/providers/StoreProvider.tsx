'use client';

import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useAccountStore } from '../../stores/account.store';
import { useCardStore } from '../../stores/card.store';
import { useLoanStore } from '../../stores/loan.store';
import { useReceiptStore } from '../../stores/receipt.store';
import { useTransactionStore } from '../../stores/transaction.store';
import { useTransferStore } from '../../stores/transfer.store';
import { useUserStore } from '../../stores/user.store';
import { useVoiceStore } from '../../stores/voice.store';
import { useDepositStore } from '../../stores/deposit.store'; // Corrected import

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const { isAuthenticated, getProfile } = useAuthStore();
  const { getAccounts } = useAccountStore();
  const { fetchUserCards } = useCardStore(); // Renamed
  const { fetchUserLoans } = useLoanStore(); // Renamed
  const { getReceipts } = useReceiptStore(); // Renamed
  const { getRecentTransactions } = useTransactionStore();
  const { fetchUserTransfers, fetchTransferLimits } = useTransferStore(); // Renamed
  const { getProfile: getUserProfile, getDashboard } = useUserStore();
  const { getBalanceRequests } = useVoiceStore(); // Renamed
  const { fetchUserDeposits } = useDepositStore(); // Renamed

  // Initialize stores on mount
  useEffect(() => {
    const initializeStores = async () => {
      if (isAuthenticated) {
        try {
          await getProfile();
          await Promise.all([
            getAccounts(),
            fetchUserCards(),
            fetchUserLoans(),
            getReceipts(),
            getRecentTransactions(),
            fetchUserTransfers(),
            fetchTransferLimits(),
            getUserProfile(),
            getDashboard(),
            getBalanceRequests(),
            fetchUserDeposits(),
          ]);
        } catch (error) {
          console.error('Failed to initialize stores:', error);
        }
      }
    };

    initializeStores();
  }, [
    isAuthenticated, 
    getProfile, 
    getAccounts, 
    fetchUserCards, 
    fetchUserLoans, 
    getReceipts,
    getRecentTransactions,
    fetchUserTransfers,
    fetchTransferLimits,
    getUserProfile,
    getDashboard,
    getBalanceRequests,
    fetchUserDeposits,
  ]);

  return <>{children}</>;
}
