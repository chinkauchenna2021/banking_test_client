'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback
} from 'react';
import { useAuthStore, User } from '@/stores/auth.store';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
  verifyTwoFactor: (tempToken: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  getProfile: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isAuthenticated: storeAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    verifyEmail: storeVerifyEmail,
    forgotPassword: storeForgotPassword,
    resetPassword: storeResetPassword,
    changePassword: storeChangePassword,
    verifyTwoFactor: storeVerifyTwoFactor,
    getProfile: storeGetProfile,
    clearError: storeClearError,
    setLoading: storeSetLoading
  } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize auth state once on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        // Wait for Zustand to hydrate
        const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
          unsubscribe();
          setIsInitialized(true);
          setIsLoading(false);
        });

        // If hydration doesn't fire, set a timeout
        const timeout = setTimeout(() => {
          setIsInitialized(true);
          setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setIsInitialized(true);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle redirects based on auth state
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    const isAuthPage = pathname?.startsWith('/auth');
    const isPublicPage = [
      '/',
      '/about',
      '/contact',
      '/privacy',
      '/terms',
      '/faq',
      '/calculator'
    ].includes(pathname || '');

    // Redirect authenticated users away from auth pages
    if (
      storeAuthenticated &&
      isAuthPage &&
      !pathname?.includes('reset-password')
    ) {
      const redirectPath = user?.is_admin ? '/admin' : '/dashboard';
      console.log(
        'Redirecting authenticated user from auth page to:',
        redirectPath
      );
      router.replace(redirectPath);
      return;
    }

    // Redirect unauthenticated users from protected pages
    if (!storeAuthenticated && !isAuthPage && !isPublicPage) {
      console.log('Redirecting unauthenticated user to login');
      router.replace('/auth/login');
      return;
    }

    // Redirect non-admin users from admin pages
    if (pathname?.startsWith('/admin') && user && !user.is_admin) {
      console.log('Redirecting non-admin user from admin page');
      router.replace('/dashboard');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive'
      });
      return;
    }

    // Redirect admin users from dashboard to admin
    if (
      pathname?.startsWith('/dashboard') &&
      user?.is_admin &&
      pathname !== '/admin'
    ) {
      console.log('Redirecting admin user to admin panel');
      router.replace('/admin');
      return;
    }
  }, [storeAuthenticated, isInitialized, isLoading, pathname, router, user]);

  // Error handling
  useEffect(() => {
    if (storeError) {
      setError(storeError);
      toast({
        title: 'Authentication Error',
        description: storeError,
        variant: 'destructive'
      });
    }
  }, [storeError]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        const result = await storeLogin(email, password);

        toast({
          title: 'Welcome back!',
          description: 'Successfully signed in to your account'
        });

        return result;
      } catch (error: any) {
        if (error.requiresTwoFactor) {
          throw error;
        }

        const errorMessage =
          error.response?.data?.error || error.message || 'Login failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeLogin, storeSetLoading]
  );

  const register = useCallback(
    async (userData: any) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        await storeRegister(userData);

        toast({
          title: 'Account created!',
          description: 'Your account has been created successfully'
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error || error.message || 'Registration failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeRegister, storeSetLoading]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await storeLogout();

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out'
      });

      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storeLogout, router]);

  const verifyTwoFactor = useCallback(
    async (tempToken: string, code: string) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        await storeVerifyTwoFactor(tempToken, code);

        toast({
          title: '2FA Verified',
          description: 'Two-factor authentication successful'
        });

        const currentUser = useAuthStore.getState().user;
        router.replace(currentUser?.is_admin ? '/admin' : '/dashboard');
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          '2FA verification failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeVerifyTwoFactor, storeSetLoading, router]
  );

  const forgotPassword = useCallback(
    async (email: string) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        await storeForgotPassword(email);

        toast({
          title: 'Reset email sent',
          description: 'Check your email for password reset instructions'
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          'Failed to send reset email';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeForgotPassword, storeSetLoading]
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        await storeResetPassword(token, newPassword);

        toast({
          title: 'Password reset',
          description: 'Your password has been reset successfully'
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          'Password reset failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeResetPassword, storeSetLoading]
  );

  const changePassword = useCallback(
    async (data: { current_password: string; new_password: string }) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        await storeChangePassword(data);

        toast({
          title: 'Password changed',
          description: 'Your password has been updated successfully'
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          'Password change failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeChangePassword, storeSetLoading]
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      try {
        setIsLoading(true);
        setError(null);
        storeSetLoading(true);

        await storeVerifyEmail(token);

        toast({
          title: 'Email verified',
          description: 'Your email has been verified successfully'
        });
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          'Email verification failed';
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
        storeSetLoading(false);
      }
    },
    [storeVerifyEmail, storeSetLoading]
  );

  const getProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await storeGetProfile();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to load profile';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeGetProfile]);

  const clearError = useCallback(() => {
    setError(null);
    storeClearError();
  }, [storeClearError]);

  const value = {
    user,
    isAuthenticated: storeAuthenticated,
    isLoading: isLoading || storeLoading,
    error,
    login,
    logout,
    register,
    verifyTwoFactor,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    getProfile,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
