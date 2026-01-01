import { useEffect, useCallback } from 'react';
import { usePaymentStore, PaymentMethod, Payment, PaymentFees } from '../stores/payment.store';

export const usePayment = () => {
  const {
    paymentMethods,
    payments,
    fees,
    isLoading,
    error,
    initiatePayment,
    verifyPayment,
    getPaymentHistory,
    getPaymentFees,
    getPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    clearPayments,
    clearError,
    setLoading,
  } = usePaymentStore();

  // Auto-fetch payment methods on mount
  useEffect(() => {
    const fetchMethods = async () => {
      if (paymentMethods.length === 0) {
        await getPaymentMethods();
      }
    };
    fetchMethods();
  }, []);

  // Get payment method by ID
  const getPaymentMethodById = useCallback((methodId: string): PaymentMethod | undefined => {
    return paymentMethods.find(method => method.id === methodId);
  }, [paymentMethods]);

  // Get default payment method
  const getDefaultPaymentMethod = useCallback((): PaymentMethod | undefined => {
    return paymentMethods.find(method => method.is_default);
  }, [paymentMethods]);

  // Get payment methods by type
  const getPaymentMethodsByType = useCallback((type: string): PaymentMethod[] => {
    return paymentMethods.filter(method => method.type === type);
  }, [paymentMethods]);

  // Get active payment methods
  const getActivePaymentMethods = useCallback((): PaymentMethod[] => {
    return paymentMethods.filter(method => method.status === 'active');
  }, [paymentMethods]);

  // Get payment by ID
  const getPaymentById = useCallback((paymentId: string): Payment | undefined => {
    return payments.find(payment => payment.id === paymentId);
  }, [payments]);

  // Get payments by status
  const getPaymentsByStatus = useCallback((status: string): Payment[] => {
    return payments.filter(payment => payment.status === status);
  }, [payments]);

  // Get recent payments
  const getRecentPayments = useCallback((count: number = 5): Payment[] => {
    return [...payments]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, count);
  }, [payments]);

  // Get total paid amount
  const getTotalPaid = useCallback(() => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + parseFloat(payment.amount), 0);
  }, [payments]);

  // Calculate payment with fees
  const calculatePaymentWithFees = useCallback(async (
    amount: number, 
    methodType: string, 
    currency: string = 'USD'
  ): Promise<PaymentFees> => {
    return await getPaymentFees(amount, currency, methodType);
  }, [getPaymentFees]);

  // Validate payment method
  const validatePaymentMethod = useCallback((methodData: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!methodData.type) {
      errors.push('Payment method type is required');
    }

    if (!methodData.name?.trim()) {
      errors.push('Payment method name is required');
    }

    // Type-specific validations
    switch (methodData.type) {
      case 'card':
        if (!methodData.card_number?.trim()) {
          errors.push('Card number is required');
        }
        if (!methodData.card_holder?.trim()) {
          errors.push('Card holder name is required');
        }
        if (!methodData.card_expiry?.trim()) {
          errors.push('Card expiry date is required');
        }
        break;
      
      case 'bank':
        if (!methodData.account_number?.trim()) {
          errors.push('Account number is required');
        }
        if (!methodData.account_holder?.trim()) {
          errors.push('Account holder name is required');
        }
        if (!methodData.bank_name?.trim()) {
          errors.push('Bank name is required');
        }
        break;
      
      case 'crypto':
        if (!methodData.crypto_wallet_address?.trim()) {
          errors.push('Crypto wallet address is required');
        }
        if (!methodData.crypto_type?.trim()) {
          errors.push('Crypto type is required');
        }
        break;
      
      case 'paypal':
        if (!methodData.paypal_email?.trim()) {
          errors.push('PayPal email is required');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }, []);

  // Format card number for display
  const formatCardNumber = useCallback((cardNumber: string): string => {
    if (!cardNumber) return '';
    const lastFour = cardNumber.slice(-4);
    return `**** **** **** ${lastFour}`;
  }, []);

  // Format payment amount
  const formatPaymentAmount = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Get payment status color
  const getPaymentStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'failed':
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  }, []);

  // Quick payment
  const quickPayment = useCallback(async (
    amount: number, 
    description: string, 
    paymentMethodId: string
  ) => {
    const paymentData = {
      amount,
      description,
      payment_method_id: paymentMethodId,
      currency: 'USD',
    };

    return await initiatePayment(paymentData);
  }, [initiatePayment]);

  return {
    // State
    paymentMethods,
    payments,
    fees,
    isLoading,
    error,

    // Actions
    initiatePayment,
    verifyPayment,
    getPaymentHistory,
    getPaymentFees,
    getPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    clearPayments,
    clearError,
    setLoading,

    // Utility functions
    getPaymentMethodById,
    getDefaultPaymentMethod,
    getPaymentMethodsByType,
    getActivePaymentMethods,
    getPaymentById,
    getPaymentsByStatus,
    getRecentPayments,
    getTotalPaid,
    calculatePaymentWithFees,
    validatePaymentMethod,
    formatCardNumber,
    formatPaymentAmount,
    getPaymentStatusColor,
    quickPayment,

    // Computed properties
    defaultPaymentMethod: getDefaultPaymentMethod(),
    activePaymentMethods: getActivePaymentMethods(),
    cardPaymentMethods: getPaymentMethodsByType('card'),
    bankPaymentMethods: getPaymentMethodsByType('bank'),
    cryptoPaymentMethods: getPaymentMethodsByType('crypto'),
    paypalPaymentMethods: getPaymentMethodsByType('paypal'),
    completedPayments: getPaymentsByStatus('completed'),
    pendingPayments: getPaymentsByStatus('pending'),
    recentPayments: getRecentPayments(),
    totalPaid: getTotalPaid(),
  };
};