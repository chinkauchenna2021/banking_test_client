// lib/hooks/useReceipt.ts
import { useEffect, useCallback } from 'react';
import { useReceiptStore, Receipt, ReceiptStatistics } from '../stores/receipt.store';

export const useReceipt = () => {
  const {
    receipts,
    currentReceipt,
    statistics,
    isLoading,
    error,
    generateReceipt,
    getReceipts,
    getReceiptDetails,
    downloadReceipt,
    resendReceipt,
    verifyReceipt,
    getReceiptStatistics,
    clearReceipts,
    clearError,
    setLoading,
  } = useReceiptStore();

  // Auto-fetch receipts on mount
  useEffect(() => {
    const fetchReceipts = async () => {
      if (receipts.length === 0) {
        await getReceipts();
      }
    };
    fetchReceipts();
  }, []);

  // Get receipt by ID
  const getReceiptById = useCallback((receiptId: string): Receipt | undefined => {
    return receipts.find(receipt => receipt.id === receiptId);
  }, [receipts]);

  // Get receipts by type
  const getReceiptsByType = useCallback((type: string): Receipt[] => {
    return receipts.filter(receipt => receipt.type === type);
  }, [receipts]);

  // Get recent receipts
  const getRecentReceipts = useCallback((count: number = 5): Receipt[] => {
    return [...receipts]
      .sort((a, b) => new Date(b.issued_at).getTime() - new Date(a.issued_at).getTime())
      .slice(0, count);
  }, [receipts]);

  // Get total receipt amount
  const getTotalReceiptAmount = useCallback(() => {
    return receipts.reduce((total, receipt) => total + parseFloat(receipt.amount), 0);
  }, [receipts]);

  // Get verified receipts
  const getVerifiedReceipts = useCallback((): Receipt[] => {
    return receipts.filter(receipt => receipt.is_verified);
  }, [receipts]);

  // Get expired receipts
  const getExpiredReceipts = useCallback((): Receipt[] => {
    const now = new Date();
    return receipts.filter(receipt => new Date(receipt.expires_at) < now);
  }, [receipts]);

  // Generate receipt from transaction
  const generateTransactionReceipt = useCallback(async (transactionId: string) => {
    return await generateReceipt({ transaction_id: transactionId });
  }, [generateReceipt]);

  // Generate receipt from deposit
  const generateDepositReceipt = useCallback(async (depositId: string) => {
    return await generateReceipt({ deposit_id: depositId });
  }, [generateReceipt]);

  // Generate receipt from transfer
  const generateTransferReceipt = useCallback(async (transferId: string) => {
    return await generateReceipt({ transfer_id: transferId });
  }, [generateReceipt]);

  // Format receipt amount
  const formatReceiptAmount = useCallback((amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Format receipt date
  const formatReceiptDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Check if receipt is expired
  const isReceiptExpired = useCallback((receipt: Receipt): boolean => {
    return new Date(receipt.expires_at) < new Date();
  }, []);

  // Check if receipt is verified
  const isReceiptVerified = useCallback((receipt: Receipt): boolean => {
    return receipt.is_verified;
  }, []);

  // Download receipt as PDF
  const downloadReceiptAsPDF = useCallback(async (receiptId: string) => {
    const blob = await downloadReceipt(receiptId, 'pdf') as Blob;
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${receiptId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, [downloadReceipt]);

  // Export receipts to CSV
  const exportReceiptsToCSV = useCallback((receiptsToExport: Receipt[]): string => {
    if (receiptsToExport.length === 0) return '';
    
    const headers = ['Receipt Number', 'Type', 'Date', 'Amount', 'Currency', 'Payer', 'Receiver', 'Status'];
    const rows = receiptsToExport.map(receipt => [
      receipt.receipt_number,
      receipt.type,
      formatReceiptDate(receipt.issued_at),
      receipt.amount,
      receipt.currency,
      receipt.payer_name,
      receipt.receiver_name,
      receipt.is_verified ? 'Verified' : 'Unverified',
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }, [formatReceiptDate]);

  return {
    // State
    receipts,
    currentReceipt,
    statistics,
    isLoading,
    error,

    // Actions
    generateReceipt,
    getReceipts,
    getReceiptDetails,
    downloadReceipt,
    resendReceipt,
    verifyReceipt,
    getReceiptStatistics,
    clearReceipts,
    clearError,
    setLoading,

    // Utility functions
    getReceiptById,
    getReceiptsByType,
    getRecentReceipts,
    getTotalReceiptAmount,
    getVerifiedReceipts,
    getExpiredReceipts,
    generateTransactionReceipt,
    generateDepositReceipt,
    generateTransferReceipt,
    formatReceiptAmount,
    formatReceiptDate,
    isReceiptExpired,
    isReceiptVerified,
    downloadReceiptAsPDF,
    exportReceiptsToCSV,

    // Computed properties
    recentReceipts: getRecentReceipts(),
    totalReceiptAmount: getTotalReceiptAmount(),
    verifiedReceipts: getVerifiedReceipts(),
    expiredReceipts: getExpiredReceipts(),
    depositReceipts: getReceiptsByType('deposit'),
    withdrawalReceipts: getReceiptsByType('withdrawal'),
    transferReceipts: getReceiptsByType('transfer'),
    paymentReceipts: getReceiptsByType('payment'),
  };
};