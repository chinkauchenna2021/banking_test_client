import { useEffect, useCallback } from 'react';
import { 
  useVoiceStore, 
  VoiceBalanceRequest, 
  VoiceStatistics 
} from '../stores/voice.store';

export const useVoice = () => {
  const {
    voiceRequests,
    currentRequest,
    voiceStatistics,
    supportedLanguages,
    supportedVoiceTypes,
    isLoading,
    error,
    requestBalance,
    getBalanceRequests,
    getRequestDetails,
    getSupportedLanguages,
    getSupportedVoiceTypes,
    getVoiceStatistics,
    testVoiceCall,
    setCurrentRequest,
    clearError,
    setLoading,
  } = useVoiceStore();

  // Auto-fetch supported languages on mount
  useEffect(() => {
    const fetchLanguages = async () => {
      if (supportedLanguages.length === 0 && !isLoading) {
        await getSupportedLanguages();
      }
    };
    fetchLanguages();
  }, []);

  // Auto-fetch supported voice types on mount
  useEffect(() => {
    const fetchVoiceTypes = async () => {
      if (supportedVoiceTypes.length === 0 && !isLoading) {
        await getSupportedVoiceTypes();
      }
    };
    fetchVoiceTypes();
  }, []);

  // Filter successful requests
  const getSuccessfulRequests = useCallback((): VoiceBalanceRequest[] => {
    return voiceRequests.filter(request => request.is_successful === true);
  }, [voiceRequests]);

  // Filter failed requests
  const getFailedRequests = useCallback((): VoiceBalanceRequest[] => {
    return voiceRequests.filter(request => request.is_successful === false);
  }, [voiceRequests]);

  // Filter requests by language
  const getRequestsByLanguage = useCallback((language: string): VoiceBalanceRequest[] => {
    return voiceRequests.filter(request => request.language === language);
  }, [voiceRequests]);

  // Filter requests by status
  const getRequestsByStatus = useCallback((status: string): VoiceBalanceRequest[] => {
    return voiceRequests.filter(request => request.call_status === status);
  }, [voiceRequests]);

  // Get recent requests
  const getRecentRequests = useCallback((limit: number = 10): VoiceBalanceRequest[] => {
    return voiceRequests.slice(0, limit).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [voiceRequests]);

  // Get language name by code
  const getLanguageName = useCallback((code: string): string => {
    const language = supportedLanguages.find(lang => lang.code === code);
    return language?.name || code.toUpperCase();
  }, [supportedLanguages]);

  // Get voice type name by code
  const getVoiceTypeName = useCallback((code: string): string => {
    const voiceType = supportedVoiceTypes.find(type => type.code === code);
    return voiceType?.name || code.charAt(0).toUpperCase() + code.slice(1);
  }, [supportedVoiceTypes]);

  // Format balance amount
  const formatBalance = useCallback((amount: number, currency: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  // Format date display
  const formatRequestDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Get call duration
  const getCallDuration = useCallback((request: VoiceBalanceRequest): string => {
    if (!request.call_initiated_at || !request.call_completed_at) {
      return 'N/A';
    }
    
    const start = new Date(request.call_initiated_at);
    const end = new Date(request.call_completed_at);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000);
    
    if (duration < 60) {
      return `${duration} seconds`;
    } else {
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }, []);

  // Quick balance request
  const quickBalanceRequest = useCallback(async (
    phoneNumber: string,
    language: string = 'en',
    voiceType: string = 'female'
  ): Promise<VoiceBalanceRequest> => {
    return await requestBalance({
      phone_number: phoneNumber,
      language,
      voice_type: voiceType,
    });
  }, [requestBalance]);

  // Refresh all voice data
  const refreshVoiceData = useCallback(async () => {
    await Promise.all([
      getBalanceRequests(),
      getVoiceStatistics(),
    ]);
  }, [getBalanceRequests, getVoiceStatistics]);

  return {
    // State
    voiceRequests,
    currentRequest,
    voiceStatistics,
    supportedLanguages,
    supportedVoiceTypes,
    isLoading,
    error,

    // Actions
    requestBalance,
    getBalanceRequests,
    getRequestDetails,
    getSupportedLanguages,
    getSupportedVoiceTypes,
    getVoiceStatistics,
    testVoiceCall,
    setCurrentRequest,
    clearError,
    setLoading,

    // Utility functions
    getSuccessfulRequests,
    getFailedRequests,
    getRequestsByLanguage,
    getRequestsByStatus,
    getRecentRequests,
    getLanguageName,
    getVoiceTypeName,
    formatBalance,
    formatRequestDate,
    getCallDuration,
    quickBalanceRequest,
    refreshVoiceData,

    // Computed properties
    totalRequests: voiceRequests.length,
    successfulRequests: getSuccessfulRequests().length,
    failedRequests: getFailedRequests().length,
    successRate: voiceStatistics?.success_rate || '0.00',
    recentRequests: getRecentRequests(5),
    pendingRequests: getRequestsByStatus('initiated').length,
    inProgressRequests: getRequestsByStatus('in_progress').length,
    completedRequests: getRequestsByStatus('completed').length,
  };
};

// Hook for individual voice request management
export const useSingleVoiceRequest = (requestId?: string) => {
  const {
    voiceRequests,
    currentRequest,
    isLoading,
    error,
    getRequestDetails,
    setCurrentRequest,
    clearError,
    getLanguageName,
    getVoiceTypeName,
    getCallDuration,
  } = useVoice();

  const request = requestId 
    ? voiceRequests.find(r => r.id === requestId)
    : currentRequest;

  // Load request details if not already loaded
  useEffect(() => {
    if (requestId && !request) {
      getRequestDetails(requestId).catch(console.error);
    }
  }, [requestId, request, getRequestDetails]);

  // Get call status display
  const getCallStatusDisplay = useCallback((): string => {
    if (!request) return '';
    
    const statuses: Record<string, string> = {
      'initiated': 'Initiated',
      'in_progress': 'In Progress',
      'completed': 'Completed',
      'failed': 'Failed',
    };
    
    return statuses[request.call_status] || request.call_status;
  }, [request]);

  // Check if call was successful
  const isCallSuccessful = useCallback((): boolean => {
    return request?.is_successful || false;
  }, [request]);

  // Get formatted balance
  const getFormattedBalance = useCallback((): string => {
    if (!request) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: request.currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(request.balance_amount);
  }, [request]);

  return {
    // State
    request,
    isLoading,
    error,

    // Actions
    getRequestDetails: () => requestId 
      ? getRequestDetails(requestId) 
      : Promise.resolve(request),
    setCurrentRequest,
    clearError,

    // Computed properties
    callStatusDisplay: getCallStatusDisplay(),
    isSuccessful: isCallSuccessful(),
    formattedBalance: getFormattedBalance(),
    formattedInitiatedDate: request 
      ? new Date(request.call_initiated_at).toLocaleDateString()
      : '',
    callDuration: request ? getCallDuration(request) : 'N/A',
    languageName: request ? getLanguageName(request.language) : '',
    voiceTypeName: request ? getVoiceTypeName(request.voice_type) : '',
  };
};