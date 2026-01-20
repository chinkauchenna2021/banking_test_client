'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormContainer } from '@/components/auth/FormContainer';
import TwoFactorModal from '@/components/auth/TwoFactorModal';
import { useAuthStore } from '@/stores/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { login, error, clearError, isLoading } = useAuth();
  const { toast } = useToast();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!loginData.email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }

    if (!loginData.password.trim()) {
      toast({
        title: 'Password Required',
        description: 'Please enter your password.',
        variant: 'destructive'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await login(loginData.email, loginData.password);
      const requiresTwoFactor =
        response?.requires_two_factor || response?.data?.requires_two_factor;

      if (requiresTwoFactor) {
        const tempToken =
          response?.temp_token || response?.data?.temp_token || '';
        if (!tempToken) {
          throw new Error('Two-factor token missing');
        }
        setTwoFactorToken(tempToken);
        setTwoFactorOpen(true);
        setLoginSuccess(false);
        toast({
          title: 'Verification Required',
          description: 'Enter the 2FA code from your authenticator app.',
          duration: 5000
        });
        return;
      }

      setLoginSuccess(true);

      toast({
        title: 'Login Successful! 🎉',
        description: 'Welcome back! Redirecting to your dashboard...',
        duration: 5000
      });

      const user = response?.data?.user || response?.user;
      router.replace(user?.is_admin ? '/admin' : '/dashboard');

      // Show toast for remember me choice
      if (loginData.rememberMe) {
        toast({
          title: 'Remembered',
          description: 'Your login will be remembered on this device.',
          duration: 3000
        });
      }
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description:
          error?.message || 'Invalid email or password. Please try again.',
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  const handleDemoLogin = async (type: 'user' | 'admin') => {
    clearError();

    const demoCredentials = {
      user: {
        email: 'user@demo.com',
        password: 'demo123'
      },
      admin: {
        email: 'admin@demo.com',
        password: 'admin123'
      }
    };

    try {
      toast({
        title: 'Demo Login',
        description: `Logging in as ${type}...`,
        duration: 3000
      });

      await login(demoCredentials[type].email, demoCredentials[type].password);
      setLoginSuccess(true);

      toast({
        title: 'Demo Login Successful!',
        description: `Logged in as ${type} demo account.`,
        duration: 3000
      });

      setTimeout(() => {
        router.push(type === 'admin' ? '/admin' : '/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Demo login failed:', error);
      toast({
        title: 'Demo Login Failed',
        description: 'Could not log in with demo credentials.',
        variant: 'destructive'
      });
    }
  };

  return (
    <FormContainer
      title='Welcome Back'
      description='Sign in to your account to continue'
      backText='Need an account? Sign up'
      backLink='/auth/register'
      footer={
        <div className='space-y-2 text-center text-xs text-gray-500'>
          <div className='flex items-center justify-center gap-2'>
            <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
            <span>Secure Connection • 256-bit Encryption</span>
          </div>
        </div>
      }
    >
      <div className='space-y-6'>
        {/* Demo Login Buttons - Uncomment if needed */}
        {/*
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => handleDemoLogin('user')}
            variant="outline"
            className="h-12 rounded-lg border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
            disabled={isLoading}
          >
            <span className="text-sm">User Demo</span>
          </Button>
          <Button
            onClick={() => handleDemoLogin('admin')}
            variant="outline"
            className="h-12 rounded-lg border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all"
            disabled={isLoading}
          >
            <span className="text-sm">Admin Demo</span>
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-gray-500">Or sign in with email</span>
          </div>
        </div>
        */}

        {/* Login Form */}
        <form onSubmit={handleLogin} className='space-y-6'>
          <div className='space-y-4'>
            <Label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              Email Address
            </Label>
            <div className='group relative'>
              <Mail className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400 transition-colors group-focus-within:text-blue-500' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                style={{ color: 'black' }}
                className='h-12 rounded-sm border-gray-300 pl-12 text-base !text-black transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500'
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <Label
                htmlFor='password'
                className='text-sm font-medium text-gray-700'
              >
                Password
              </Label>
              <Link
                href='/auth/forgot-password'
                className='text-sm text-blue-600 transition-colors hover:text-blue-800 hover:underline'
              >
                Forgot password?
              </Link>
            </div>
            <div className='group relative'>
              <Lock className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400 transition-colors group-focus-within:text-blue-500' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                style={{ color: 'black' }}
                className='h-12 rounded-sm border-gray-300 pr-12 pl-12 !text-black transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500'
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
                disabled={isLoading}
              />
              <button
                type='button'
                onClick={() => {
                  setShowPassword(!showPassword);
                  // Show toast when password visibility changes
                  toast({
                    title: showPassword
                      ? 'Password Hidden'
                      : 'Password Visible',
                    description: showPassword
                      ? 'Your password is now hidden.'
                      : 'Your password is now visible.',
                    duration: 3000
                  });
                }}
                className='absolute top-1/2 right-4 -translate-y-1/2 transform p-1 text-gray-400 transition-colors hover:text-gray-600'
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
          </div>

          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Checkbox
                id='remember'
                checked={loginData.rememberMe}
                onCheckedChange={(checked) => {
                  setLoginData({
                    ...loginData,
                    rememberMe: checked as boolean
                  });
                  // Show toast when remember me is toggled
                  if (checked) {
                    toast({
                      title: 'Login Will Be Remembered',
                      description: 'Your login will be saved on this device.',
                      duration: 3000
                    });
                  }
                }}
                disabled={isLoading}
                className='h-5 w-5'
              />
              <Label htmlFor='remember' className='text-sm text-gray-600'>
                Remember me
              </Label>
            </div>
          </div>

          {error && (
            <Alert
              variant='destructive'
              className='rounded-sm border-red-200 bg-red-50'
            >
              <AlertDescription className='text-sm text-red-700'>
                {error || 'Invalid email or password'}
              </AlertDescription>
            </Alert>
          )}

          {loginSuccess && (
            <Alert className='rounded-sm border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'>
              <AlertDescription className='text-sm text-green-800'>
                <strong>Login successful!</strong> Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            className='h-12 w-full rounded-sm bg-gradient-to-r from-blue-600 to-purple-600 text-base shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
            disabled={isLoading || loginSuccess}
          >
            {isLoading ? (
              <>
                <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className='ml-2 h-5 w-5' />
              </>
            )}
          </Button>
        </form>
      </div>
      <TwoFactorModal
        open={twoFactorOpen}
        onOpenChange={(open) => {
          setTwoFactorOpen(open);
          if (!open) {
            setTwoFactorToken('');
          }
        }}
        tempToken={twoFactorToken}
        onSuccess={() => {
          const currentUser = useAuthStore.getState().user;
          router.replace(currentUser?.is_admin ? '/admin' : '/dashboard');
        }}
      />
    </FormContainer>
  );
}
