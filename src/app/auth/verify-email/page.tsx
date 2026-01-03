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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Mail,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
  Shield,
  Timer
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyEmail, error, clearError, isLoading } = useAuth();
  const { toast } = useToast();

  const token = searchParams.get('token');
  const [email, setEmail] = useState('');
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
        description:
          'Your email has been verified successfully. Redirecting to login...'
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
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
        description: 'Your email has been verified successfully.'
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login');
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
      const response = await apiClient.post('/auth/resend-verification', {
        email
      });

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

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-4'>
      <Card className='w-full max-w-md border-gray-200 shadow-xl'>
        <CardHeader className='space-y-1'>
          <div className='mb-4 flex justify-center'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-purple-100'>
              <Shield className='h-8 w-8 text-blue-600' />
            </div>
          </div>
          <CardTitle className='text-center text-2xl font-bold text-gray-900'>
            {isVerified ? 'Email Verified!' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription className='text-center text-gray-600'>
            {isVerified
              ? 'Your email has been successfully verified. You can now log in to your account.'
              : 'Enter the verification token sent to your email address.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isVerified ? (
            <div className='space-y-6 text-center'>
              <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100'>
                <CheckCircle className='h-10 w-10 text-green-600' />
              </div>
              <Alert className='border-green-200 bg-green-50'>
                <AlertDescription className='text-green-800'>
                  <p className='font-semibold'>🎉 Verification Successful!</p>
                  <p className='mt-1 text-sm'>
                    Your email address has been verified. Redirecting to
                    login...
                  </p>
                </AlertDescription>
              </Alert>
              <div className='pt-4'>
                <Button
                  onClick={() => router.push('/auth/login')}
                  className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                >
                  Go to Login
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </div>
            </div>
          ) : (
            <>
              {emailSent && (
                <Alert className='mb-6 border-blue-200 bg-blue-50'>
                  <AlertDescription className='text-blue-800'>
                    <CheckCircle className='mr-2 inline h-4 w-4' />A new
                    verification email has been sent. Please check your inbox.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant='destructive' className='mb-6'>
                  <XCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleManualVerify} className='space-y-6'>
                {!token && (
                  <div className='space-y-2'>
                    <Label
                      htmlFor='email'
                      className='text-sm font-medium text-gray-700'
                    >
                      Email Address *
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='Enter the email you registered with'
                      className='h-11 rounded-lg border-gray-300'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isVerifying || isResending}
                    />
                  </div>
                )}

                <div className='space-y-2'>
                  <Label
                    htmlFor='token'
                    className='text-sm font-medium text-gray-700'
                  >
                    Verification Token *
                  </Label>
                  <Input
                    id='token'
                    type='text'
                    placeholder='Enter your 32-character verification token'
                    className='h-11 rounded-lg border-gray-300 font-mono'
                    value={verificationToken}
                    onChange={(e) => setVerificationToken(e.target.value)}
                    required
                    disabled={isVerifying || isResending}
                  />
                  <p className='text-xs text-gray-500'>
                    The token was sent to your email address after registration
                  </p>
                </div>

                <Button
                  type='submit'
                  className='h-11 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  disabled={isVerifying || isResending}
                >
                  {isVerifying ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className='mr-2 h-4 w-4' />
                      Verify Email
                    </>
                  )}
                </Button>
              </form>

              <div className='relative my-6'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300'></div>
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='bg-white px-2 text-gray-500'>
                    Need a new token?
                  </span>
                </div>
              </div>

              <Button
                type='button'
                variant='outline'
                className='h-11 w-full rounded-lg border-gray-300'
                onClick={handleResendVerification}
                disabled={
                  !email.trim() || isResending || countdown > 0 || isVerifying
                }
              >
                {isResending ? (
                  <>
                    <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                    Sending...
                  </>
                ) : countdown > 0 ? (
                  <>
                    <Timer className='mr-2 h-4 w-4' />
                    Resend available in {countdown}s
                  </>
                ) : (
                  <>
                    <Mail className='mr-2 h-4 w-4' />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <div className='mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-700'>
                  📧 Didn't receive the email?
                </h4>
                <ul className='space-y-2 text-xs text-gray-600'>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>Check your spam or junk folder</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>Make sure you entered the correct email address</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>
                      Wait a few minutes - emails can sometimes be delayed
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>Click "Resend Verification Email" above</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-xs text-gray-500'>
            <p>
              Having trouble?{' '}
              <a
                href='mailto:support@example.com'
                className='font-medium text-blue-600 hover:underline'
              >
                Contact support
              </a>
            </p>
          </div>
          <Button
            variant='ghost'
            onClick={() => router.push('/auth/login')}
            className='w-full text-gray-600 hover:text-gray-900'
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
