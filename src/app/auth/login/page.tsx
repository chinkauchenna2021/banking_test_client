'use client';

import { useState } from 'react';
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
import { Shield, CheckCircle, XCircle, Key } from 'lucide-react';

export default function VerifyTwoFactorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyTwoFactor, error, clearError, isLoading } = useAuth();
  const { toast } = useToast();

  const tempToken = searchParams.get('temp_token') || '';
  const [code, setCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!code.trim() || code.length !== 6) {
      toast({
        title: 'Invalid Code',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive'
      });
      return;
    }

    try {
      await verifyTwoFactor(tempToken, code);
      setIsVerified(true);

      toast({
        title: '2FA Verification Successful!',
        description: 'You are now logged in.'
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error?.message || 'Invalid verification code',
        variant: 'destructive'
      });
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
            Two-Factor Authentication
          </CardTitle>
          <CardDescription className='text-center text-gray-600'>
            Enter the 6-digit verification code from your authenticator app
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
                  <p className='font-semibold'>✅ Verification Successful!</p>
                  <p className='mt-1 text-sm'>
                    Two-factor authentication verified. Redirecting to
                    dashboard...
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <>
              {error && (
                <Alert variant='destructive' className='mb-6'>
                  <XCircle className='h-4 w-4' />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleVerify} className='space-y-6'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='code'
                    className='text-sm font-medium text-gray-700'
                  >
                    6-Digit Verification Code *
                  </Label>
                  <Input
                    id='code'
                    type='text'
                    placeholder='123456'
                    maxLength={6}
                    pattern='[0-9]{6}'
                    className='h-12 text-center font-mono text-2xl tracking-widest'
                    value={code}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, '')
                        .slice(0, 6);
                      setCode(value);
                    }}
                    required
                    disabled={isLoading}
                  />
                  <p className='text-center text-xs text-gray-500'>
                    Enter the 6-digit code from your authenticator app
                  </p>
                </div>

                <Button
                  type='submit'
                  className='h-12 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Key className='mr-2 h-4 w-4' />
                      Verify & Continue
                    </>
                  )}
                </Button>
              </form>

              <div className='mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-700'>
                  🔒 Need help?
                </h4>
                <ul className='space-y-2 text-xs text-gray-600'>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>
                      Make sure the time on your device is synchronized
                    </span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>Check that you're entering the most recent code</span>
                  </li>
                  <li className='flex items-start gap-2'>
                    <div className='mt-0.5 h-2 w-2 rounded-full bg-gray-400'></div>
                    <span>If using SMS, check your text messages</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
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
