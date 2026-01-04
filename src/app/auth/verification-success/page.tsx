'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Mail, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormContainer } from '@/components/auth/FormContainer';

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
    <FormContainer
      title='Email Verified Successfully! 🎉'
      description='Your email address has been verified and your account is now active'
      backText='Back to Login'
      backLink='/auth/login'
      footer={
        <div className='space-y-2 text-center text-xs text-gray-500'>
          <div className='flex items-center justify-center gap-2'>
            <div className='h-1.5 w-1.5 animate-pulse rounded-full bg-green-500' />
            <span>Account Verified • Ready to Login</span>
          </div>
        </div>
      }
    >
      <div className='space-y-6'>
        {/* Success Icon */}
        <div className='flex justify-center'>
          <div className='flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100'>
            <CheckCircle className='h-10 w-10 text-green-600' />
          </div>
        </div>

        {/* What's Next Section */}
        <div className='rounded-sm border border-green-200 bg-green-50 p-4'>
          <h4 className='mb-3 text-sm font-semibold text-green-800'>
            What's Next?
          </h4>
          <ul className='space-y-2.5 text-sm text-green-700'>
            <li className='flex items-start gap-3'>
              <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
              <span>Your account is now fully activated</span>
            </li>
            <li className='flex items-start gap-3'>
              <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
              <span>You can log in with your credentials</span>
            </li>
            <li className='flex items-start gap-3'>
              <CheckCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
              <span>Access all banking features immediately</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Button
            onClick={handleGoToLogin}
            className='h-12 w-full rounded-sm bg-gradient-to-r from-green-600 to-emerald-600 text-base shadow-lg transition-all duration-300 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl'
          >
            Go to Login
            <ArrowRight className='ml-2 h-5 w-5' />
          </Button>

          <Button
            onClick={handleGoToDashboard}
            variant='outline'
            className='h-12 w-full rounded-sm border-gray-300 text-base transition-all hover:border-green-500 hover:bg-green-50'
          >
            <Mail className='mr-2 h-5 w-5' />
            Continue to Dashboard
          </Button>
        </div>

        {/* Security Features */}
        <div className='rounded-sm border border-gray-200 bg-gray-50 p-4'>
          <div className='flex items-start gap-3'>
            <Shield className='mt-0.5 h-5 w-5 text-green-600' />
            <div>
              <h4 className='mb-1 text-sm font-semibold text-gray-800'>
                Your Account is Secure
              </h4>
              <p className='text-xs text-gray-600'>
                Your email has been verified and your account is protected with
                256-bit encryption. You can now enjoy secure banking with peace
                of mind.
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className='text-center text-xs text-gray-500'>
          <p>
            Need help?{' '}
            <a
              href='mailto:support@example.com'
              className='font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline'
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </FormContainer>
  );
}
