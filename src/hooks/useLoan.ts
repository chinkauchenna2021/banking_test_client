"use client"
import { useEffect, useCallback } from 'react';
import { useLoanStore, UserLoan, LoanRepayment, LoanEligibility, LoanCalculator, LoanDocument, LoanType } from '../stores/loan.store';

export const useLoan = () => {
  const {
    userLoans: loans, // Renamed for clarity in the hook
    // currentLoan, // Removed
    eligibility,
    calculator,
    repaymentSchedule,
    documents,
    summary,
    isLoading,
    error,
    applyForLoan,
    fetchUserLoans: getLoans, // Renamed for clarity in the hook
    // getLoanDetails, // Removed
    cancelLoanApplication,
    checkEligibility,
    calculateLoan,
    makeRepayment,
    getRepaymentSchedule,
    getLoanDocuments,
    uploadLoanDocument,
    getLoanSummary,
    // clearLoans, // Not directly exposed by the store
    clearError,
    // setLoading, // Not directly exposed by the store
  } = useLoanStore();

  // Auto-fetch loan summary on mount
  useEffect(() => {
    const fetchSummary = async () => {
      if (!summary) {
        await getLoanSummary();
      }
    };
    fetchSummary();
  }, [summary, getLoanSummary]);

  // Get loan by ID
  const getLoanById = useCallback((loanId: string): UserLoan | undefined => {
    return loans.find(loan => loan.id === loanId);
  }, [loans]);

  // Get loans by status
  const getLoansByStatus = useCallback((status: string): UserLoan[] => {
    return loans.filter(loan => loan.status === status);
  }, [loans]);

  // Get loans by type
  const getLoansByType = useCallback((type: string): UserLoan[] => {
    return loans.filter(loan => loan.loan_type === type);
  }, [loans]);

  // Get active loans
  const getActiveLoans = useCallback((): UserLoan[] => {
    return loans.filter(loan => loan.status === 'active');
  }, [loans]);

  // Get pending loans
  const getPendingLoans = useCallback((): UserLoan[] => {
    return loans.filter(loan => loan.status === 'pending');
  }, [loans]);

  // Get total borrowed amount
  const getTotalBorrowed = useCallback((): number => {
    return loans.reduce((total, loan) => total + loan.amount, 0); // amount is already number
  }, [loans]);

  // Get total repaid amount
  const getTotalRepaid = useCallback((): number => {
    return loans.reduce((total, loan) => total + loan.paid_amount, 0); // paid_amount is already number
  }, [loans]);

  // Get outstanding balance
  const getOutstandingBalance = useCallback((): number => {
    return loans.reduce((total, loan) => total + loan.remaining_amount, 0); // remaining_amount is already number
  }, [loans]);

  // Get next repayment
  const getNextRepayment = useCallback((): LoanRepayment | null => {
    if (!repaymentSchedule) return null;
    
    const pendingRepayments = repaymentSchedule.filter(repayment => 
      repayment.status === 'pending' || repayment.status === 'overdue'
    );
    
    return pendingRepayments.length > 0 ? pendingRepayments[0] : null;
  }, [repaymentSchedule]);

  // Get overdue repayments
  const getOverdueRepayments = useCallback((): LoanRepayment[] => {
    if (!repaymentSchedule) return [];
    
    const now = new Date();
    return repaymentSchedule.filter(repayment => 
      repayment.status === 'overdue' || 
      (repayment.status === 'pending' && new Date(repayment.due_date) < now)
    );
  }, [repaymentSchedule]);

  // Calculate loan affordability
  const calculateAffordability = useCallback((monthlyIncome: number): number => {
    // Maximum loan payment should be 30% of monthly income
    return monthlyIncome * 0.3;
  }, []);

  // Format loan amount
  const formatLoanAmount = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Format interest rate
  const formatInterestRate = useCallback((rate: number): string => {
    return `${rate.toFixed(2)}%`;
  }, []);

  // Get loan status color
  const getLoanStatusColor = useCallback((status: string): string => {
    switch (status) {
      case 'active':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'approved':
        return 'blue';
      case 'rejected':
      case 'cancelled':
        return 'red';
      case 'paid':
        return 'purple';
      default:
        return 'gray';
    }
  }, []);

  // Check if loan is overdue
  const isLoanOverdue = useCallback((loan: UserLoan): boolean => {
    const overdueRepayments = getOverdueRepayments();
    return overdueRepayments.length > 0;
  }, [getOverdueRepayments]);

  // Quick apply for loan
  const quickApplyForLoan = useCallback(async (
    amount: number, 
    termMonths: number, 
    purpose: string,
    accountId: bigint
  ) => {
    const loanData = {
      account_id: accountId,
      amount,
      term_months: termMonths,
      purpose,
      loan_type: LoanType.personal, // Default to personal loan
    };

    return await applyForLoan(loanData);
  }, [applyForLoan]);

  return {
    // State
    loans,
    // currentLoan, // Removed
    eligibility,
    calculator,
    repaymentSchedule,
    documents,
    summary,
    isLoading,
    error,

    // Actions
    applyForLoan,
    getLoans,
    // getLoanDetails, // Removed
    cancelLoanApplication,
    checkEligibility,
    calculateLoan,
    makeRepayment,
    getRepaymentSchedule,
    getLoanDocuments,
    uploadLoanDocument,
    getLoanSummary,
    // clearLoans,
    clearError,
    // setLoading,

    // Utility functions
    getLoanById,
    getLoansByStatus,
    getLoansByType,
    getActiveLoans,
    getPendingLoans,
    getTotalBorrowed,
    getTotalRepaid,
    getOutstandingBalance,
    getNextRepayment,
    getOverdueRepayments,
    calculateAffordability,
    formatLoanAmount,
    formatInterestRate,
    getLoanStatusColor,
    isLoanOverdue,
    quickApplyForLoan,

    // Computed properties
    activeLoans: getActiveLoans(),
    pendingLoans: getPendingLoans(),
    totalBorrowed: getTotalBorrowed(),
    totalRepaid: getTotalRepaid(),
    outstandingBalance: getOutstandingBalance(),
    nextRepayment: getNextRepayment(),
    overdueRepayments: getOverdueRepayments(),
    personalLoans: getLoansByType('personal'),
    businessLoans: getLoansByType('business'),
    mortgageLoans: getLoansByType('mortgage'),
    autoLoans: getLoansByType('auto'),
  };
};