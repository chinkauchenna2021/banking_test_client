"use client"
import { useEffect, useCallback } from 'react';
import { useCardStore, UserCard, CardTransaction, CardUsageSummary } from '../stores/card.store';

export const useCard = () => {
  const {
    userCards: cards, // Renamed for clarity in the hook
    // currentCard, // Removed
    // virtualCard, // Removed
    cardTransactions,
    usageSummary,
    isLoading,
    error,
    requestCard,
    fetchUserCards: getCards, // Renamed for clarity in the hook
    getCardDetails,
    updateCard,
    activateCard,
    blockCard,
    reportCardLost,
    reportCardStolen,
    updateCardLimits,
    fetchCardTransactions: getCardTransactions, // Renamed
    fetchCardUsageSummary: getCardUsageSummary, // Renamed
    getVirtualCardDetails,
    generateVirtualCard,
    // setCurrentCard, // Not directly exposed by the store
    clearError,
    // setLoading, // Not directly exposed by the store
  } = useCardStore();

  // Auto-fetch cards on mount
  useEffect(() => {
    const fetchCards = async () => {
      if (cards.length === 0 && !isLoading) {
        await getCards();
      }
    };
    fetchCards();
  }, [cards.length, isLoading, getCards]);

  // Get card by ID
  const getCardById = useCallback((cardId: string): UserCard | undefined => {
    return cards.find(card => card.id === cardId);
  }, [cards]);

  // Get active cards
  const getActiveCards = useCallback((): UserCard[] => {
    return cards.filter(card => card.status === 'active');
  }, [cards]);

  // Get blocked cards
  const getBlockedCards = useCallback((): UserCard[] => {
    return cards.filter(card => card.status === 'blocked');
  }, [cards]);

  // Get virtual cards
  const getVirtualCards = useCallback((): UserCard[] => {
    return cards.filter(card => card.is_virtual);
  }, [cards]);

  // Get physical cards
  const getPhysicalCards = useCallback((): UserCard[] => {
    return cards.filter(card => !card.is_virtual);
  }, [cards]);

  // Get default card
  const getDefaultCard = useCallback((): UserCard | undefined => {
    return cards.find(card => card.is_default);
  }, [cards]);

  // Filter transactions by type
  const getTransactionsByType = useCallback((type: string): CardTransaction[] => {
    return cardTransactions.filter(transaction => transaction.type === type);
  }, [cardTransactions]);

  // Get total spent
  const getTotalSpent = useCallback((): number => {
    return cardTransactions.reduce((total, transaction) => {
      return total + transaction.amount; // amount is already number
    }, 0);
  }, [cardTransactions]);

  // Get recent transactions
  const getRecentTransactions = useCallback((count: number = 5): CardTransaction[] => {
    return [...cardTransactions]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  }, [cardTransactions]);

  // Format card number for display
  const formatCardNumber = useCallback((cardNumber: string): string => {
    const parts = cardNumber.match(/.{1,4}/g);
    return parts ? parts.join(' ') : cardNumber;
  }, []);

  // Format expiry date
  const formatExpiryDate = useCallback((month: string, year: string): string => {
    return `${month.padStart(2, '0')}/${year.slice(-2)}`;
  }, []);

  // Check if card is expired
  const isCardExpired = useCallback((card: UserCard): boolean => {
    const expiryDate = new Date(card.expiry_date);
    return expiryDate < new Date();
  }, []);

  // Get remaining limit
  const getRemainingLimit = useCallback((card: UserCard): number => {
    if (!card.limits?.daily_limit) return 0;
    return card.limits.daily_limit - (usageSummary?.summary.total_spent || 0);
  }, [usageSummary]);

  // Quick actions
  const quickActivateCard = useCallback(async (cardId: string) => {
    const card = await activateCard(cardId);
    return card;
  }, [activateCard]);

  const quickBlockCard = useCallback(async (cardId: string, reason: string = 'Suspicious activity') => {
    const card = await blockCard(cardId, reason);
    return card;
  }, [blockCard]);

  return {
    // State
    cards,
    // currentCard, // Removed
    // virtualCard, // Removed
    cardTransactions,
    usageSummary,
    isLoading,
    error,

    // Actions
    requestCard,
    getCards,
    getCardDetails,
    updateCard,
    activateCard,
    blockCard,
    reportCardLost,
    reportCardStolen,
    updateCardLimits,
    getCardTransactions,
    getCardUsageSummary,
    getVirtualCardDetails,
    generateVirtualCard,
    // setCurrentCard,
    clearError,
    // setLoading,

    // Utility functions
    getCardById,
    getActiveCards,
    getBlockedCards,
    getVirtualCards,
    getPhysicalCards,
    getDefaultCard,
    getTransactionsByType,
    getTotalSpent,
    getRecentTransactions,
    formatCardNumber,
    formatExpiryDate,
    isCardExpired,
    getRemainingLimit,
    quickActivateCard,
    quickBlockCard,

    // Computed properties
    activeCards: getActiveCards(),
    virtualCards: getVirtualCards(),
    physicalCards: getPhysicalCards(),
    defaultCard: getDefaultCard(),
    totalSpent: getTotalSpent(),
    recentTransactions: getRecentTransactions(),
  };
};