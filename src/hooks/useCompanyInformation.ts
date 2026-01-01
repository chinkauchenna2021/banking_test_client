import { useEffect } from 'react';
import { useCompanyStore } from '../stores/company.store';

export const useCompanyInformation = () => {
  const {
    information,
    isLoading,
    error,
    getCompanyInformation,
    updateBankAccounts,
    updateCryptoWallets,
    clearError,
  } = useCompanyStore();

  // Auto-fetch company info on mount if it's not already loaded
  useEffect(() => {
    if (!information && !isLoading) {
      getCompanyInformation();
    }
  }, [information, isLoading, getCompanyInformation]);

  return {
    // State
    information,
    isLoading,
    error,

    // Actions
    getCompanyInformation,
    updateBankAccounts,
    updateCryptoWallets,
    clearError,

    // Derived state
    bankAccounts: information?.bank_accounts || {},
    cryptoWallets: information?.crypto_wallets || {},
  };
};
