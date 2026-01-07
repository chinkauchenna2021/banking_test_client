'use client';
import { useEffect, useCallback } from 'react';
import {
  useUserStore,
  User,
  UpdateUserDto,
  ChangePasswordDto,
  KYCDataDto
} from '../stores/user.store';

export const useUser = () => {
  const {
    user,
    profile,
    activityLog,
    dashboard,
    isLoading,
    error,
    getProfile,
    updateProfile,
    changePassword,
    submitKYC,
    getDashboard,
    getActivityLog,
    updatePreferences,
    enableTwoFactor,
    deleteAccount,
    setUser,
    clearError,
    setLoading
  } = useUserStore();

  // Auto-fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profile && !isLoading) {
        await getProfile();
      }
    };
    fetchProfile();
  }, []);

  // Auto-fetch dashboard on mount
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!dashboard && !isLoading) {
        await getDashboard();
      }
    };
    fetchDashboard();
  }, []);

  // Check if KYC is submitted
  const isKYCSubmitted = useCallback((): boolean => {
    return !!user?.account_status && user.account_status !== 'pending';
  }, [user]);

  // Check if KYC is approved
  const isKYCApproved = useCallback((): boolean => {
    return user?.account_status === 'active';
  }, [user]);

  // Check if account is verified
  const isAccountVerified = useCallback((): boolean => {
    return !!user?.email_verified_at;
  }, [user]);

  // Get full name
  const getFullName = useCallback((): string => {
    if (!user) return '';
    return `${user.first_name} ${user.last_name}`;
  }, [user]);

  // Get initials
  const getInitials = useCallback((): string => {
    if (!user) return '';
    return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
  }, [user]);

  // Format currency display
  const formatCurrency = useCallback(
    (amount: number): string => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: user?.currency || 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    },
    [user]
  );

  // Get account type display name
  const getAccountTypeDisplay = useCallback((): string => {
    if (!user) return '';

    const accountTypes: Record<string, string> = {
      personal: 'Personal Account',
      business: 'Business Account',
      premium: 'Premium Account',
      savings: 'Savings Account',
      checking: 'Checking Account'
    };

    return accountTypes[user.account_type] || user.account_type;
  }, [user]);

  // Get account status display
  const getAccountStatusDisplay = useCallback((): string => {
    if (!user) return '';

    const statuses: Record<string, string> = {
      active: 'Active',
      pending: 'Pending Verification',
      suspended: 'Suspended',
      closed: 'Closed'
    };

    return statuses[user.account_status] || user.account_status;
  }, [user]);

  // Get activity by type
  const getActivityByType = useCallback(
    (type: string) => {
      return activityLog.filter((activity) => activity.type === type);
    },
    [activityLog]
  );

  // Get recent activity
  const getRecentActivity = useCallback(
    (limit: number = 10) => {
      return activityLog.slice(0, limit);
    },
    [activityLog]
  );

  // Update user preference
  const updateUserPreference = useCallback(
    async (key: string, value: any) => {
      const preferences = user?.preferences || {};
      const updatedPreferences = { ...preferences, [key]: value };
      return await updatePreferences(updatedPreferences);
    },
    [user, updatePreferences]
  );

  // Refresh all user data
  const refreshUserData = useCallback(async () => {
    await Promise.all([getProfile(), getDashboard(), getActivityLog()]);
  }, [getProfile, getDashboard, getActivityLog]);

  return {
    // State
    user,
    profile,
    activityLog,
    dashboard,
    isLoading,
    error,

    // Actions
    getProfile,
    updateProfile,
    changePassword,
    submitKYC,
    getDashboard,
    getActivityLog,
    updatePreferences,
    enableTwoFactor,
    deleteAccount,
    setUser,
    clearError,
    setLoading,

    // Utility functions
    isKYCSubmitted,
    isKYCApproved,
    isAccountVerified,
    getFullName,
    getInitials,
    formatCurrency,
    getAccountTypeDisplay,
    getAccountStatusDisplay,
    getActivityByType,
    getRecentActivity,
    updateUserPreference,
    refreshUserData,

    // Computed properties
    fullName: getFullName(),
    initials: getInitials(),
    accountTypeDisplay: getAccountTypeDisplay(),
    accountStatusDisplay: getAccountStatusDisplay(),
    isActive: user?.is_active || false,
    isAdmin: user?.is_admin || false,
    hasTwoFactor: user?.two_factor_enabled || false,
    kycStatus: user?.account_status || 'pending',
    balance: user?.balance ? parseFloat(user.balance) : 0,
    formattedBalance: user?.balance
      ? formatCurrency(parseFloat(user.balance))
      : '$0.00',
    recentActivity: getRecentActivity(5)
  };
};

// Hook for user settings management
export const useUserSettings = () => {
  const {
    user,
    isLoading,
    error,
    updateProfile,
    changePassword,
    submitKYC,
    updatePreferences,
    enableTwoFactor,
    deleteAccount,
    clearError
  } = useUserStore();

  // Update profile picture
  const updateProfilePicture = useCallback(
    async (file: File) => {
      return await updateProfile({ profile_image: file });
    },
    [updateProfile]
  );

  // Update contact information
  const updateContactInfo = useCallback(
    async (contactInfo: {
      phone?: string;
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      zip_code?: string;
    }) => {
      return await updateProfile(contactInfo);
    },
    [updateProfile]
  );

  // Update personal information
  const updatePersonalInfo = useCallback(
    async (personalInfo: {
      first_name?: string;
      last_name?: string;
      date_of_birth?: string;
      gender?: string;
      occupation?: string;
      employer?: string;
    }) => {
      return await updateProfile(personalInfo);
    },
    [updateProfile]
  );

  // Update notification preferences
  const updateNotificationPreferences = useCallback(
    async (preferences: {
      email_notifications?: boolean;
      push_notifications?: boolean;
      sms_notifications?: boolean;
      transaction_alerts?: boolean;
      security_alerts?: boolean;
      marketing_emails?: boolean;
    }) => {
      const currentPreferences = user?.preferences || {};
      const updatedPreferences = {
        ...currentPreferences,
        notifications: preferences
      };
      return await updatePreferences(updatedPreferences);
    },
    [user, updatePreferences]
  );

  // Update security preferences
  const updateSecurityPreferences = useCallback(
    async (preferences: {
      login_alerts?: boolean;
      device_alerts?: boolean;
      withdrawal_confirmation?: boolean;
      transfer_confirmation?: boolean;
    }) => {
      const currentPreferences = user?.preferences || {};
      const updatedPreferences = {
        ...currentPreferences,
        security: preferences
      };
      return await updatePreferences(updatedPreferences);
    },
    [user, updatePreferences]
  );

  // Submit KYC with documents
  const submitKYCDocuments = useCallback(
    async (
      identificationType: string,
      identificationNumber: string,
      identificationFile: File,
      taxId?: string,
      monthlyIncome?: number,
      sourceOfFunds?: string
    ) => {
      const kycData: KYCDataDto = {
        identification_type: identificationType,
        identification_number: identificationNumber,
        identification_image: identificationFile,
        tax_id: taxId,
        monthly_income: monthlyIncome,
        source_of_funds: sourceOfFunds
      };

      return await submitKYC(kycData);
    },
    [submitKYC]
  );

  return {
    // State
    user,
    isLoading,
    error,

    // Actions
    updateProfile,
    changePassword,
    submitKYC,
    updatePreferences,
    enableTwoFactor,
    deleteAccount,
    clearError,

    // Specialized functions
    updateProfilePicture,
    updateContactInfo,
    updatePersonalInfo,
    updateNotificationPreferences,
    updateSecurityPreferences,
    submitKYCDocuments
  };
};
