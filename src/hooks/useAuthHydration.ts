// hooks/useAuthHydration.ts
'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

export const useAuthHydration = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Zustand persist API methods
    const unsubscribeHydrate = useAuthStore.persist.onHydrate(() => {
      setIsHydrated(false);
    });

    const unsubscribeFinishHydration = useAuthStore.persist.onFinishHydration(
      () => {
        setIsHydrated(true);
      }
    );

    // Check if already hydrated on mount
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    // Manual rehydration if needed (for edge cases)
    const handleRehydrate = async () => {
      try {
        await useAuthStore.persist.rehydrate();
      } catch (error) {
        console.error('Error rehydrating auth store:', error);
      }
    };

    // Rehydrate on mount for safety
    handleRehydrate();

    return () => {
      unsubscribeHydrate();
      unsubscribeFinishHydration();
    };
  }, []);

  return isHydrated;
};
