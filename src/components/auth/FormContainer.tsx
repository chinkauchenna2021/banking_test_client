'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface FormContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  backLink?: string;
  backText?: string;
  footer?: ReactNode;
  icon?: ReactNode;
}

export function FormContainer({
  title,
  description,
  children,
  backLink = '/auth/login',
  backText = 'Back to Login',
  footer,
  icon
}: FormContainerProps) {
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-white p-4'>
      <div className='w-full max-w-md'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className='space-y-6'
        >
          {/* Header */}
          <div className='text-center'>
            {icon && (
              <div className='mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg'>
                {icon}
              </div>
            )}
            <h1 className='bg-linear-to-r from-gray-500 to-gray-700 bg-clip-text text-3xl font-bold text-transparent'>
              {title}
            </h1>
            <p className='mx-auto mt-3 max-w-sm text-sm text-gray-600'>
              {description}
            </p>
          </div>

          {/* Form Card */}
          <Card className='overflow-hidden rounded-2xl border border-gray-200/50 bg-white/95 shadow-xl backdrop-blur-sm'>
            <CardContent className='px-6 pt-8 pb-6'>{children}</CardContent>

            {/* Footer with back link */}
            <CardFooter className='border-t bg-gray-50/50 px-6 pt-6 pb-8'>
              <div className='w-full space-y-4'>
                {footer}
                <Link
                  href={backLink}
                  className='group flex items-center justify-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900'
                >
                  <ArrowLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
                  {backText}
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
