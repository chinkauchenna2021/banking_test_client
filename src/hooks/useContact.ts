import { useEffect, useCallback } from 'react';
import { useContactStore, ContactMessage, ContactCategory, FAQ, SupportHours, ResponseTime } from '../stores/contact.store';

export const useContact = () => {
  const {
    messages,
    categories,
    faqs,
    supportHours,
    responseTime,
    isLoading,
    error,
    sendMessage,
    getContactCategories,
    getFaqs,
    getSupportHours,
    getResponseTime,
    getMessages,
    getMessageDetails,
    updateMessage,
    deleteMessage,
    sendTestMessage,
    clearMessages,
    clearError,
    setLoading,
  } = useContactStore();

  // Auto-fetch categories and FAQs on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (categories.length === 0) {
        await getContactCategories();
      }
      if (faqs.length === 0) {
        await getFaqs();
      }
      if (!supportHours) {
        await getSupportHours();
      }
    };
    fetchInitialData();
  }, []);

  // Get messages by status
  const getMessagesByStatus = useCallback((status: string): ContactMessage[] => {
    return messages.filter(message => message.status === status);
  }, [messages]);

  // Get messages by priority
  const getMessagesByPriority = useCallback((priority: string): ContactMessage[] => {
    return messages.filter(message => message.priority === priority);
  }, [messages]);

  // Get unread messages count
  const getUnreadCount = useCallback((): number => {
    return messages.filter(message => message.status === 'new').length;
  }, [messages]);

  // Get urgent messages
  const getUrgentMessages = useCallback((): ContactMessage[] => {
    return messages.filter(message => message.priority === 'urgent');
  }, [messages]);

  // Get FAQ by category
  const getFaqsByCategory = useCallback((category: string): FAQ[] => {
    return faqs.filter(faq => faq.category === category);
  }, [faqs]);

  // Search FAQs
  const searchFaqs = useCallback((query: string): FAQ[] => {
    const lowerQuery = query.toLowerCase();
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(lowerQuery) ||
      faq.answer.toLowerCase().includes(lowerQuery)
    );
  }, [faqs]);

  // Validate contact form
  const validateContactForm = useCallback((formData: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!formData.name?.trim()) {
      errors.push('Name is required');
    }
    
    if (!formData.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Invalid email format');
    }
    
    if (!formData.subject?.trim()) {
      errors.push('Subject is required');
    }
    
    if (!formData.message?.trim()) {
      errors.push('Message is required');
    } else if (formData.message.length > 5000) {
      errors.push('Message is too long (max 5000 characters)');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }, []);

  // Format message date
  const formatMessageDate = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, []);

  // Get response time status
  const getResponseTimeStatus = useCallback((): 'fast' | 'normal' | 'slow' => {
    if (!responseTime) return 'normal';
    
    if (responseTime.average_hours < 12) return 'fast';
    if (responseTime.average_hours > 48) return 'slow';
    return 'normal';
  }, [responseTime]);

  return {
    // State
    messages,
    categories,
    faqs,
    supportHours,
    responseTime,
    isLoading,
    error,

    // Actions
    sendMessage,
    getContactCategories,
    getFaqs,
    getSupportHours,
    getResponseTime,
    getMessages,
    getMessageDetails,
    updateMessage,
    deleteMessage,
    sendTestMessage,
    clearMessages,
    clearError,
    setLoading,

    // Utility functions
    getMessagesByStatus,
    getMessagesByPriority,
    getUnreadCount,
    getUrgentMessages,
    getFaqsByCategory,
    searchFaqs,
    validateContactForm,
    formatMessageDate,
    getResponseTimeStatus,

    // Computed properties
    unreadCount: getUnreadCount(),
    urgentMessages: getUrgentMessages(),
    newMessages: getMessagesByStatus('new'),
    readMessages: getMessagesByStatus('read'),
    repliedMessages: getMessagesByStatus('replied'),
    responseTimeStatus: getResponseTimeStatus(),
  };
};