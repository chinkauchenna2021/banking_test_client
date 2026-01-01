import { useDepositStore, ManualDeposit } from '../stores/deposit.store';
import { useUser } from './useUser'; // To get the current user's account

export const useDeposits = () => {
  const depositState = useDepositStore();
  const { user } = useUser();

  // You can add more specific utility functions here if needed.
  // For example, filtering deposits by status or method.

  const findDepositById = (depositId: string) => {
    return depositState.userDeposits.find((d: ManualDeposit) => d.id === depositId);
  };

  return {
    ...depositState,
    // Add any derived state or utility functions here
    findDepositById,
    currentUserAccount: user?.accounts?.[0], // Assuming the first account is the one to use
  };
};

// A specific hook for the admin dashboard might be cleaner
export const useAdminDeposits = () => {
    const {
        pendingDeposits,
        isLoading,
        error,
        pagination,
        fetchPendingDeposits,
        confirmDeposit,
        rejectDeposit,
        clearError,
    } = useDepositStore();

    return {
        pendingDeposits,
        isLoading,
        error,
        pagination,
        fetchPendingDeposits,
        confirmDeposit,
        rejectDeposit,
        clearError,
    };
};
