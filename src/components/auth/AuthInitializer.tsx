'use client';

import { useEffect } from 'react';
import { useTokenStorage } from '@/hooks/useTokenStorage';
import { useAuthStore } from '@/stores/auth.store';

export function AuthInitializer() {
  const { tokenData } = useTokenStorage();
  const { _setTokens } = useAuthStore();

  useEffect(() => {
    // Initialize auth store from localStorage on mount
    if (tokenData.accessToken) {
      _setTokens(tokenData.accessToken, tokenData.refreshToken, tokenData.user);
      console.log('Auth state initialized from localStorage');
    }
  }, []); // Run only once on mount

  return null; // This component doesn't render anything
}
