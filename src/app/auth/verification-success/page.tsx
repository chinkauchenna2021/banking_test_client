'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VerificationSuccessPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Show success toast
    toast({
      title: 'Email Verified Successfully!',
      description: 'You can now log in to your account.'
    });
  }, []);

  const handleGoToLogin = () => {
    router.push('/auth/login');
  };

  const handleGoToDashboard = () => {
    // Check if there's a stored redirect path
    const redirectPath = localStorage.getItem('redirect_after_verification');
    if (redirectPath) {
      localStorage.removeItem('redirect_after_verification');
      router.push(redirectPath);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4'>
      <Card className='w-full max-w-md border-green-200 shadow-xl'>
        <CardHeader className='space-y-1 text-center'>
          <div className='mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100'>
            <CheckCircle className='h-10 w-10 text-green-600' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            Email Verified Successfully! 🎉
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Your email address has been verified and your account is now active.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
            <h4 className='mb-2 text-sm font-semibold text-green-800'>
              What's Next?
            </h4>
            <ul className='space-y-2 text-sm text-green-700'>
              <li className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>Your account is now fully activated</span>
              </li>
              <li className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>You can log in with your credentials</span>
              </li>
              <li className='flex items-start gap-2'>
                <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
                <span>Access all banking features immediately</span>
              </li>
            </ul>
          </div>

          <div className='space-y-3'>
            <Button
              onClick={handleGoToLogin}
              className='w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            >
              <ArrowRight className='mr-2 h-4 w-4' />
              Go to Login
            </Button>

            <Button
              onClick={handleGoToDashboard}
              variant='outline'
              className='w-full border-gray-300'
            >
              <Mail className='mr-2 h-4 w-4' />
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-4'>
          <div className='text-center text-xs text-gray-500'>
            <p>
              Need help?{' '}
              <a
                href='mailto:support@example.com'
                className='font-medium text-blue-600 hover:underline'
              >
                Contact our support team
              </a>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
