'use client';

import { ReactNode, useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useAccountStore } from '../../stores/account.store';
import { useCardStore } from '../../stores/card.store';
import { useLoanStore } from '../../stores/loan.store';
import { useReceiptStore } from '../../stores/receipt.store';
import { useTransactionStore } from '../../stores/transaction.store';
import { useTransferStore } from '../../stores/transfer.store';
import { useUserStore } from '../../stores/user.store';
import { useVoiceStore } from '../../stores/voice.store';
import { useDepositStore } from '../../stores/deposit.store';

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const { isAuthenticated, user } = useAuthStore();
  const { getAccounts } = useAccountStore();
  const { fetchUserCards } = useCardStore();
  const { fetchUserLoans } = useLoanStore();
  const { getReceipts } = useReceiptStore();
  const { getRecentTransactions } = useTransactionStore();
  const { fetchUserTransfers, fetchTransferLimits } = useTransferStore();
  const { getProfile: getUserProfile, getDashboard } = useUserStore();
  const { getBalanceRequests } = useVoiceStore();
  const { fetchUserDeposits } = useDepositStore();

  const [isInitialized, setIsInitialized] = useState(false);
  const initializedRef = useRef(false);

  // Initialize stores only once when authenticated
  useEffect(() => {
    const initializeStores = async () => {
      if (isAuthenticated && user && !initializedRef.current) {
        try {
          initializedRef.current = true;
          console.log('Initializing stores for user:', user.email);

          // Initialize stores in sequence to avoid overwhelming the API
          await Promise.allSettled([
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
            fetchUserDeposits()
          ]);

          setIsInitialized(true);
          console.log('Stores initialized successfully');
        } catch (error) {
          console.error('Failed to initialize stores:', error);
          initializedRef.current = false;
        }
      }
    };

    initializeStores();

    // Reset when user logs out
    if (!isAuthenticated) {
      initializedRef.current = false;
      setIsInitialized(false);
    }
  }, [
    isAuthenticated,
    user?.id // Only re-run if user ID changes, not on every auth state change
  ]);

  return <>{children}</>;
}
