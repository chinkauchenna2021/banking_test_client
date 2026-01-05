import { useAuthStore } from '@/stores/auth.store';

class TokenSync {
  static syncFromLocalStorage() {
    try {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (accessToken || refreshToken) {
        const authStore = useAuthStore.getState();

        // Only update if tokens exist but Zustand doesn't have them
        if (
          (accessToken && !authStore.accessToken) ||
          (refreshToken && !authStore.refreshToken)
        ) {
          // Try to get user from API
          this.fetchAndSyncUser(accessToken!);
        }
      }
    } catch (error) {
      console.error('Token sync error:', error);
    }
  }

  static async fetchAndSyncUser(accessToken: string) {
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
        useAuthStore.setState({
          user: userData.data,
          accessToken: accessToken,
          refreshToken: localStorage.getItem('refresh_token'),
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error('Failed to sync user:', error);
    }
  }

  static clearAll() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth-storage');
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    });
  }
}

export default TokenSync;
