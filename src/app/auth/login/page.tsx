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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      const response = await login(loginData.email, loginData.password);
      setLoginSuccess(true);

      toast({
        title: 'Success',
        description: 'Login successful! Redirecting...'
      });

      // The AuthProvider will handle the redirect based on user role
      // Don't try to redirect here, let the AuthProvider handle it
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Login failed. Please try again.',
        variant: 'destructive'
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
      await login(demoCredentials[type].email, demoCredentials[type].password);
      setLoginSuccess(true);

      // Since we can't access useAuth hook here synchronously,
      // we'll handle the redirection based on the login type
      setTimeout(() => {
        router.push(type === 'admin' ? '/admin' : '/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  return (
    <FormContainer
      title='Welcome Back'
      description='Sign in to your account to continue'
      //   icon={<LogIn className="h-7 w-7 text-white" />}
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
        {/* Demo Login Buttons */}
        {/* <div className="grid grid-cols-2 gap-3">
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
        </div> */}

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
                // prefix={<Mail className="h-5 w-5 text-gray-400" />}
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
                onClick={() => setShowPassword(!showPassword)}
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
                onCheckedChange={(checked) =>
                  setLoginData({ ...loginData, rememberMe: checked as boolean })
                }
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
    </FormContainer>
  );
}
