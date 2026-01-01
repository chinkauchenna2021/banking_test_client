'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuthStore, User } from '@/stores/auth.store'
import { useRouter, usePathname } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: any) => Promise<void>
  verifyTwoFactor: (tempToken: string, code: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  changePassword: (data: { current_password: string; new_password: string }) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  getProfile: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  const {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: storeAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    login: storeLogin,
    register: storeRegister,
    logout: storeLogout,
    refreshAccessToken,
    verifyEmail: storeVerifyEmail,
    forgotPassword: storeForgotPassword,
    resetPassword: storeResetPassword,
    changePassword: storeChangePassword,
    verifyTwoFactor: storeVerifyTwoFactor,
    getProfile: storeGetProfile,
    clearError: storeClearError,
    setLoading: storeSetLoading,
  } = useAuthStore()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
    const { isAuthenticated } = useAuth()


useEffect(() => {
  if (!isLoading && user) {
    const isAuthPage = pathname?.startsWith('/auth')
    const isAdminPage = pathname?.startsWith('/admin')
    const isDashboardPage = pathname?.startsWith('/dashboard')
    
    // If user is on admin page but not admin
    if (isAdminPage && !user.is_admin) {
      router.push('/dashboard')
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access the admin area',
        variant: 'destructive',
      })
      return
    }
    
    // If user is admin and trying to access dashboard, redirect to admin
    if (isDashboardPage && user.is_admin && pathname !== '/admin') {
      router.push('/admin')
      return
    }
    
    // If authenticated and trying to access auth pages
    if (isAuthenticated && isAuthPage && !pathname?.includes('reset-password')) {
      // Redirect based on user role
      if (user.is_admin) {
        router.push('/admin')
      } else {
        router.push('/dashboard')
      }
    }
    
    // If not authenticated on protected pages
    if (!isAuthenticated && !isAuthPage) {
      router.push('/auth/login')
    }
  }
}, [isAuthenticated, isLoading, pathname, router, user])



  // Initialize authentication
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        
        // Check if we have an access token
        if (accessToken) {
          // Verify token validity (you might want to add token validation here)
          try {
            await storeGetProfile()
          } catch (error) {
            console.error('Failed to get profile:', error)
            // Token might be expired, try to refresh
            try {
              await refreshAccessToken()
              await storeGetProfile()
            } catch (refreshError) {
              console.error('Failed to refresh token:', refreshError)
              // Clear invalid tokens
              await storeLogout()
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [accessToken])

  // Handle token refresh on 401 responses
  useEffect(() => {
    const handleUnauthorized = async () => {
      if (accessToken) {
        try {
          await refreshAccessToken()
        } catch (error) {
          console.error('Token refresh failed:', error)
          await storeLogout()
          router.push('/auth/login')
          toast({
            title: 'Session expired',
            description: 'Please sign in again to continue',
            variant: 'destructive',
          })
        }
      }
    }

    // You might want to set up an axios interceptor here
    // For now, we'll handle it globally
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const response = await originalFetch(...args)
      if (response.status === 401) {
        await handleUnauthorized()
      }
      return response
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [accessToken, refreshAccessToken, storeLogout, router])

  // Error handling
  useEffect(() => {
    if (storeError) {
      setError(storeError)
      toast({
        title: 'Authentication Error',
        description: storeError,
        variant: 'destructive',
      })
    }
  }, [storeError])

  // Protected route checking
  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname?.startsWith('/auth')
      const isPublicPage = [
        '/',
        '/about',
        '/contact',
        '/privacy',
        '/terms',
        '/faq',
        '/calculator',
        // '/dashboard',
        // '/dashboard/account',
        // '/dashboard/cards',
        // '/dashboard/loans',
        // '/dashboard/billing',
        // '/dashboard/profile',
        // '/dashboard/receipts',
        // '/dashboard/voice',
        // '/dashboard/transfers',
        // '/dashboard/deposits',
        // '/dashboard/contact',
        // '/admin/deposits',
        // '/admin/settings',
        // '/admin/transactions',
        // '/admin/system',
        // '/admin/users',
        // '/admin/'
      ].includes(pathname || '')

      if (!storeAuthenticated && !isAuthPage && !isPublicPage) {
        // Redirect to login if not authenticated on protected pages
        router.push('/auth/login')
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to access this page',
        })
      }

      if (storeAuthenticated && isAuthPage && !pathname?.includes('reset-password')) {
        // Redirect to dashboard if authenticated and trying to access auth pages
        router.push('/dashboard')
      }
    }
  }, [storeAuthenticated, isLoading, pathname, router])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      const result = await storeLogin(email, password)
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in to your account',
      })
      
      // Check if 2FA is required
    //   if (result && result.requiresTwoFactor) {
    //     throw { requiresTwoFactor: true, tempToken: result.tempToken }
    //   }
      
      return result
    } catch (error: any) {
      if (error.requiresTwoFactor) {
        throw error // Let the component handle 2FA
      }
      
      const errorMessage = error.response?.data?.error || error.message || 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      await storeRegister(userData)
      
      toast({
        title: 'Account created!',
        description: 'Your account has been created successfully',
      })
      
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await storeLogout()
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      })
      
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyTwoFactor = async (tempToken: string, code: string) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      await storeVerifyTwoFactor(tempToken, code)
      
      toast({
        title: '2FA Verified',
        description: 'Two-factor authentication successful',
      })
      
      router.push('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || '2FA verification failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      await storeForgotPassword(email)
      
      toast({
        title: 'Reset email sent',
        description: 'Check your email for password reset instructions',
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send reset email'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      await storeResetPassword(token, newPassword)
      
      toast({
        title: 'Password reset',
        description: 'Your password has been reset successfully',
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Password reset failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const changePassword = async (data: { current_password: string; new_password: string }) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      await storeChangePassword(data)
      
      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully',
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Password change failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      setIsLoading(true)
      setError(null)
      storeSetLoading(true)
      
      await storeVerifyEmail(token)
      
      toast({
        title: 'Email verified',
        description: 'Your email has been verified successfully',
      })
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Email verification failed'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
      storeSetLoading(false)
    }
  }

  const getProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      await storeGetProfile()
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to load profile'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
    storeClearError()
  }

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
    clearError,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}