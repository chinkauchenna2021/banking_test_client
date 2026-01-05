// Remove the useAuthStore import
import { AuthState } from '@/stores/auth.store';

class TokenSync {
  // Pass the auth store state and setter functions as parameters
  static syncFromLocalStorage(
    setAuthState: (state: Partial<AuthState>) => void
  ) {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken || refreshToken) {
        // Get the current auth state without using hooks
        const authStorage = localStorage.getItem('auth-storage');
        let currentAuthState: Partial<AuthState> = {};

        if (authStorage) {
          try {
            currentAuthState = JSON.parse(authStorage);
          } catch (e) {
            console.error('Failed to parse auth storage', e);
          }
        }

        // Only update if tokens exist but Zustand doesn't have them
        if (
          (accessToken && !currentAuthState.accessToken) ||
          (refreshToken && !currentAuthState.refreshToken)
        ) {
          // Try to get user from API
          this.fetchAndSyncUser(accessToken as string, setAuthState);
        }
      }
    } catch (error) {
      console.error('Token sync error:', error);
    }
  }

  static async fetchAndSyncUser(
    accessToken: string,
    setAuthState: (state: Partial<AuthState>) => void
  ) {
    // Only run on client side
    if (typeof window === 'undefined') return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const userData = await response.json();

        // Update the auth state using the provided setter
        setAuthState({
          user: userData.data,
          accessToken: accessToken,
          refreshToken: localStorage.getItem('refresh_token'),
          isAuthenticated: true
        });
      } else {
        // If we can't validate the token, clear it
        this.clearAll(setAuthState);
      }
    } catch (error) {
      console.error('Failed to sync user:', error);
      // If there's an error, clear the potentially invalid tokens
      this.clearAll(setAuthState);
    }
  }

  static clearAll(setAuthState: (state: Partial<AuthState>) => void) {
    // Only run on client side
    if (typeof window === 'undefined') return;

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-storage');

    // Update the auth state using the provided setter
    setAuthState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });
  }
}

export default TokenSync;
