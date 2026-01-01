import { useLoanStore } from '../stores/loan.store';
import { useUser } from './useUser';

export const useLoans = () => {
  const loanState = useLoanStore();
  const { user } = useUser();

  return {
    ...loanState,
    currentUserAccount: user?.accounts?.[0],
  };
};

export const useAdminLoans = () => {
    const {
        pendingLoans,
        isLoading,
        error,
        pagination,
        fetchPendingLoans,
        approveLoan,
        rejectLoan,
        clearError,
    } = useLoanStore();

    return {
        pendingLoans,
        isLoading,
        error,
        pagination,
        fetchPendingLoans,
        approveLoan,
        rejectLoan,
        clearError,
    };
};
