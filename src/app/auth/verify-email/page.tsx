'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
  Shield,
  Timer,
  AlertTriangle
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { FormContainer } from '@/components/auth/FormContainer';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, error, clearError, isLoading } = useAuth();
  const { toast } = useToast();

  const email =
    searchParams.get('email') ||
    localStorage.getItem('pending_verification_email') ||
    '';
  const token = searchParams.get('token');
  const [verificationToken, setVerificationToken] = useState(token || '');
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [emailSent, setEmailSent] = useState(false);

  // Auto-verify if token is present in URL
  useEffect(() => {
    if (token && !isVerified && !isVerifying) {
      handleAutoVerify();
    }
  }, [token]);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleAutoVerify = async () => {
    setIsVerifying(true);
    try {
      await verifyEmail(token!);
      setIsVerified(true);

      toast({
        title: 'Email Verified!',
        description: 'Your account is now active. Redirecting to dashboard...'
      });

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description:
          error?.message || 'Failed to verify email. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setIsVerifying(true);

    if (!verificationToken.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your verification token',
        variant: 'destructive'
      });
      setIsVerifying(false);
      return;
    }

    try {
      await verifyEmail(verificationToken);
      setIsVerified(true);

      toast({
        title: 'Email Verified!',
        description: 'Your account is now active.'
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description:
          error?.message || 'Failed to verify email. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email.trim() || countdown > 0) return;

    setIsResending(true);
    clearError();

    try {
      await apiClient.post('/auth/resend-verification', { email });
      setEmailSent(true);
      setCountdown(60); // 60 seconds cooldown

      toast({
        title: 'Verification Email Sent!',
        description:
          'A new verification email has been sent to your email address.'
      });
    } catch (error: any) {
      toast({
        title: 'Failed to Resend',
        description:
          error?.message ||
          'Failed to resend verification email. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsResending(false);
    }
  };

  // Success state content
  if (isVerified) {
    return (
      <FormContainer
        title='Account Activated!'
        description='Your account has been successfully activated.'
        backText='Back to Login'
        backLink='/auth/login'
        footer={
          <div className='space-y-2 text-center text-xs text-gray-500'>
            <div className='flex items-center justify-center gap-2'>
              <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
              <span>Account Active • Ready to Login</span>
            </div>
          </div>
        }
      >
        <div className='space-y-6 text-center'>
          <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100'>
            <CheckCircle className='h-10 w-10 text-green-600' />
          </div>

          <Alert className='rounded-sm border-green-200 bg-green-50 text-left'>
            <AlertDescription className='text-green-800'>
              <p className='font-semibold'>
                🎉 Account Activated Successfully!
              </p>
              <p className='mt-1 text-sm'>
                Your email address has been verified and your account is now
                active. Redirecting to dashboard...
              </p>
            </AlertDescription>
          </Alert>

          <Button
            onClick={() => router.push('/dashboard')}
            className='h-12 w-full rounded-sm bg-gradient-to-r from-green-600 to-emerald-600 text-base shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl'
          >
            Go to Dashboard
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>
        </div>
      </FormContainer>
    );
  }

  // Verification form state
  return (
    <FormContainer
      title='Verify Your Email'
      description='Enter the verification token sent to your email address'
      backText='Back to Login'
      backLink='/auth/login'
      footer={
        <div className='space-y-2 text-center text-xs text-gray-500'>
          <div className='flex items-center justify-center gap-2'>
            <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500' />
            <span>Secure Verification • 256-bit Encryption</span>
          </div>
        </div>
      }
    >
      <div className='space-y-6'>
        {/* Important Notice */}
        <Alert className='rounded-sm border-amber-200 bg-amber-50'>
          <AlertTriangle className='h-4 w-4 text-amber-600' />
          <AlertDescription className='text-sm text-amber-800'>
            <strong>Important:</strong> You must verify your email before you
            can log in and use your account.
          </AlertDescription>
        </Alert>

        {/* Email Sent Success */}
        {emailSent && (
          <Alert className='rounded-sm border-blue-200 bg-blue-50'>
            <AlertDescription className='text-sm text-blue-800'>
              <CheckCircle className='mr-2 inline h-4 w-4' />A new verification
              email has been sent. Please check your inbox.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            variant='destructive'
            className='rounded-sm border-red-200 bg-red-50'
          >
            <XCircle className='h-4 w-4' />
            <AlertDescription className='text-sm text-red-700'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Verification Form */}
        <form onSubmit={handleManualVerify} className='space-y-6'>
          <div className='space-y-4'>
            <Label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              Email Address
            </Label>
            <div className='group relative'>
              <Mail className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400' />
              <Input
                id='email'
                type='email'
                value={email}
                readOnly
                style={{ color: 'black' }}
                className='h-12 rounded-sm border-gray-300 bg-gray-50 pl-12 text-base !text-black'
              />
            </div>
            <p className='text-xs text-gray-500'>
              Verification link was sent to this email address
            </p>
          </div>

          <div className='space-y-4'>
            <Label
              htmlFor='token'
              className='text-sm font-medium text-gray-700'
            >
              Verification Token *
            </Label>
            <div className='group relative'>
              <Shield className='absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400 transition-colors group-focus-within:text-blue-500' />
              <Input
                id='token'
                type='text'
                placeholder='Enter the token from your email'
                style={{ color: 'black' }}
                className='h-12 rounded-sm border-gray-300 pl-12 font-mono text-base !text-black transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500'
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                required
                disabled={isVerifying || isResending}
              />
            </div>
            <p className='text-xs text-gray-500'>
              Check your email for the verification token
            </p>
          </div>

          <Button
            type='submit'
            className='h-12 w-full rounded-sm bg-gradient-to-r from-blue-600 to-purple-600 text-base shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
            disabled={isVerifying || isResending}
          >
            {isVerifying ? (
              <>
                <div className='mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Activating Account...
              </>
            ) : (
              <>
                <CheckCircle className='mr-2 h-5 w-5' />
                Activate Account
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-200' />
          </div>
          <div className='relative flex justify-center text-xs'>
            <span className='bg-white px-3 text-gray-500'>
              Need a new token?
            </span>
          </div>
        </div>

        {/* Resend Button */}
        <Button
          type='button'
          variant='outline'
          className='h-12 w-full rounded-sm border-gray-300 text-base transition-all hover:border-blue-500 hover:bg-blue-50'
          onClick={handleResendVerification}
          disabled={
            !email.trim() || isResending || countdown > 0 || isVerifying
          }
        >
          {isResending ? (
            <>
              <RefreshCw className='mr-2 h-5 w-5 animate-spin' />
              Sending...
            </>
          ) : countdown > 0 ? (
            <>
              <Timer className='mr-2 h-5 w-5' />
              Resend available in {countdown}s
            </>
          ) : (
            <>
              <Mail className='mr-2 h-5 w-5' />
              Resend Verification Email
            </>
          )}
        </Button>

        {/* Help Section */}
        <div className='rounded-sm border border-gray-200 bg-gray-50 p-4'>
          <h4 className='mb-3 text-sm font-semibold text-gray-800'>
            📧 Didn't receive the email?
          </h4>
          <ul className='space-y-2 text-xs text-gray-600'>
            <li className='flex items-start gap-2'>
              <div className='mt-1 h-1.5 w-1.5 rounded-full bg-gray-400'></div>
              <span>Check your spam or junk folder</span>
            </li>
            <li className='flex items-start gap-2'>
              <div className='mt-1 h-1.5 w-1.5 rounded-full bg-gray-400'></div>
              <span>Make sure you entered the correct email address</span>
            </li>
            <li className='flex items-start gap-2'>
              <div className='mt-1 h-1.5 w-1.5 rounded-full bg-gray-400'></div>
              <span>Wait a few minutes - emails can sometimes be delayed</span>
            </li>
            <li className='flex items-start gap-2'>
              <div className='mt-1 h-1.5 w-1.5 rounded-full bg-gray-400'></div>
              <span>Click "Resend Verification Email" above</span>
            </li>
          </ul>
        </div>

        {/* Support Link */}
        <div className='text-center text-xs text-gray-500'>
          <p>
            Having trouble?{' '}
            <a
              href='mailto:support@example.com'
              className='font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline'
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </FormContainer>
  );
}
