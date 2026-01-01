// components/providers/StoreProvider.tsx
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
import { useManualDepositStore } from '../../stores/manual-deposit.store'; // Add this import

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const { isAuthenticated, getProfile } = useAuthStore();
  const { getAccounts } = useAccountStore();
  const { getCards } = useCardStore();
  const { getLoanSummary } = useLoanStore();
  const { getReceiptStatistics } = useReceiptStore();
  const { getRecentTransactions } = useTransactionStore();
  const { getTransfers, getTransferLimits } = useTransferStore();
  const { getProfile: getUserProfile, getDashboard } = useUserStore();
  const { getSupportedLanguages, getSupportedVoiceTypes } = useVoiceStore();
  const { getDeposits } = useManualDepositStore(); // Add this

  // Initialize stores on mount
  useEffect(() => {
    const initializeStores = async () => {
      if (isAuthenticated) {
        try {
          await getProfile();
          await Promise.all([
            getAccounts(),
            getCards(),
            getLoanSummary(),
            getReceiptStatistics(),
            getRecentTransactions(),
            getTransfers(),
            getTransferLimits(),
            getUserProfile(),
            getDashboard(),
            getSupportedLanguages(),
            getSupportedVoiceTypes(),
            getDeposits(), // Add manual deposits initialization
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
    getCards, 
    getLoanSummary, 
    getReceiptStatistics,
    getRecentTransactions,
    getTransfers,
    getTransferLimits,
    getUserProfile,
    getDashboard,
    getSupportedLanguages,
    getSupportedVoiceTypes,
    getDeposits, // Add this dependency
  ]);

  return <>{children}</>;
}
