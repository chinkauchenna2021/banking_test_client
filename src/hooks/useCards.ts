import { useCardStore } from '../stores/card.store';
import { useUser } from './useUser';

export const useCards = () => {
  const cardState = useCardStore();
  const { user } = useUser();

  return {
    ...cardState,
    currentUserAccount: user?.accounts?.[0],
  };
};

export const useAdminCards = () => {
    const {
        pendingCardRequests,
        isLoading,
        error,
        pagination,
        fetchPendingCardRequests,
        approveCardRequest,
        rejectCardRequest,
        clearError,
    } = useCardStore();

    return {
        pendingCardRequests,
        isLoading,
        error,
        pagination,
        fetchPendingCardRequests,
        approveCardRequest,
        rejectCardRequest,
        clearError,
    };
};
