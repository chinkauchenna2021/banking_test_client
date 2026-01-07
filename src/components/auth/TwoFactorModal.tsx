'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Lock, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';

interface TwoFactorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tempToken: string;
  onSuccess: () => void;
}

export default function TwoFactorModal({
  open,
  onOpenChange,
  tempToken,
  onSuccess
}: TwoFactorModalProps) {
  const { verifyTwoFactor, isLoading, error, clearError } = useAuth();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300); // 5 minutes in seconds

  // Countdown timer
  React.useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const handleVerify = async () => {
    clearError();
    try {
      await verifyTwoFactor(tempToken, code);
      setVerificationSuccess(true);
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error('2FA verification failed:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCodeChange = (value: string) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setCode(numericValue);
  };

  const handleResendCode = () => {
    toast({
      title: 'Use your authenticator',
      description:
        'Two-factor codes are generated in your authenticator app. Please open it for the latest code.'
    });
    setRemainingTime(300); // Reset timer
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='mb-4 flex items-center justify-center'>
            <div className='rounded-full bg-blue-100 p-3'>
              <Lock className='h-8 w-8 text-blue-600' />
            </div>
          </div>
          <DialogTitle className='text-center text-2xl'>
            Two-Factor Authentication
          </DialogTitle>
          <DialogDescription className='text-center'>
            Enter the 6-digit code from your authenticator app
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          {/* Instructions */}
          <div className='rounded-lg border bg-gray-50 p-4'>
            <div className='flex items-start gap-3'>
              <Smartphone className='mt-0.5 h-5 w-5 text-gray-600' />
              <div className='text-sm text-gray-600'>
                <p className='mb-1 font-medium'>Using Authenticator App</p>
                <p>
                  Open your authenticator app (Google Authenticator, Authy,
                  etc.) and enter the 6-digit code.
                </p>
              </div>
            </div>
          </div>

          {/* Timer Alert */}
          {remainingTime < 60 && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Code Expiring Soon</AlertTitle>
              <AlertDescription>
                Your code will expire in {formatTime(remainingTime)}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {verificationSuccess && (
            <Alert className='border-green-200 bg-green-50'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertTitle className='text-green-800'>
                Verification Successful!
              </AlertTitle>
              <AlertDescription className='text-green-700'>
                Redirecting you to your dashboard...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && !verificationSuccess && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>Verification Failed</AlertTitle>
              <AlertDescription>
                {error || 'Invalid verification code. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Code Input */}
          <div className='space-y-2'>
            <Label htmlFor='2fa-code'>Verification Code</Label>
            <div className='relative'>
              <Input
                id='2fa-code'
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder='Enter 6-digit code'
                className='h-14 text-center text-2xl tracking-widest'
                maxLength={6}
                disabled={isLoading || verificationSuccess}
                autoComplete='one-time-code'
              />
              <div className='absolute top-1/2 right-3 -translate-y-1/2 transform text-sm text-gray-500'>
                {formatTime(remainingTime)}
              </div>
            </div>
            <p className='text-xs text-gray-500'>
              Code expires in {formatTime(remainingTime)}
            </p>
          </div>

          {/* Resend Code */}
          <div className='text-center'>
            <Button
              variant='link'
              onClick={handleResendCode}
              disabled={isLoading || remainingTime > 240}
              className='text-sm'
            >
              Didn&apos;t receive a code? Resend
            </Button>
          </div>

          {/* Security Note */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
            <p className='text-center text-xs text-blue-700'>
              <span className='font-medium'>Security Note:</span> This code adds
              an extra layer of security to your account. Never share it with
              anyone.
            </p>
          </div>
        </div>

        <DialogFooter className='flex flex-col space-y-3 sm:flex-col'>
          <Button
            onClick={handleVerify}
            disabled={code.length !== 6 || isLoading || verificationSuccess}
            className='w-full'
          >
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </Button>

          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            className='w-full'
            disabled={isLoading}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
