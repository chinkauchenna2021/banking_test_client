'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Mail, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormContainer } from '@/components/auth/FormContainer';

export default function ForgotPasswordPage() {
  const { forgotPassword, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Validation
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await forgotPassword(email);
      setSuccess(true);
      toast({
        title: 'Success! 📧',
        description: 'Password reset instructions sent to your email.',
        duration: 5000
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error?.message || 'Failed to send reset email. Please try again.',
        variant: 'destructive',
        duration: 5000
      });
      console.error('Password reset request failed:', error);
    }
  };

  return (
    <FormContainer
      title='Reset Your Password'
      description='Enter your email to receive password reset instructions'
    >
      {!success ? (
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-3'>
            <Label
              htmlFor='email'
              className='text-sm font-medium text-gray-700'
            >
              Email Address
            </Label>
            <div className='group relative'>
              <Mail className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-colors group-focus-within:text-blue-500' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                style={{ color: 'black' }}
                className='h-11 rounded-sm border-gray-300 pl-10 text-slate-900 transition-all focus:border-blue-500 focus:ring-blue-500'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <p className='text-xs text-gray-500'>
              We'll send you a secure link to reset your password
            </p>
          </div>

          {error && (
            <Alert variant='destructive' className='border-red-200 bg-red-50'>
              <AlertDescription className='text-sm text-red-700'>
                {error || 'Failed to send reset email. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type='submit'
            className='h-11 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Sending...
              </>
            ) : (
              <>
                Send Reset Link
                <ArrowRight className='ml-2 h-4 w-4' />
              </>
            )}
          </Button>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='space-y-6'
        >
          <Alert className='border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'>
            <div className='flex items-start gap-3'>
              <CheckCircle className='mt-0.5 h-5 w-5 flex-shrink-0 text-green-600' />
              <div>
                <AlertDescription className='text-green-800'>
                  <strong>Check your email!</strong> Password reset instructions
                  have been sent to{' '}
                  <span className='font-semibold'>{email}</span>
                </AlertDescription>
              </div>
            </div>
          </Alert>

          <div className='rounded-sm border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4'>
            <h4 className='mb-3 text-sm font-semibold text-blue-800'>
              Next Steps:
            </h4>
            <ol className='space-y-2 text-sm text-blue-700'>
              <li className='flex items-start gap-2'>
                <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800'>
                  1
                </div>
                <span>Check your inbox for our email</span>
              </li>
              <li className='flex items-start gap-2'>
                <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800'>
                  2
                </div>
                <span>Click the secure reset link (expires in 1 hour)</span>
              </li>
              <li className='flex items-start gap-2'>
                <div className='flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-800'>
                  3
                </div>
                <span>Create a new strong password</span>
              </li>
            </ol>
          </div>

          {/* Extra Information */}
          <div className='rounded-sm border border-amber-200 bg-amber-50 p-4'>
            <h4 className='mb-2 text-sm font-semibold text-amber-800'>
              ⏰ Important:
            </h4>
            <ul className='space-y-1 text-xs text-amber-700'>
              <li>• Reset link expires in 1 hour</li>
              <li>• Check spam folder if you don't see the email</li>
              <li>• Use a strong, unique password</li>
            </ul>
          </div>
        </motion.div>
      )}
    </FormContainer>
  );
}
