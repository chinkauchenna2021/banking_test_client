'use client';

import { ReactNode, useEffect } from 'react';
import { useEnhancedAdmin } from '../../hooks/useEnhancedAdmin';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EnhancedAdminContainerProps {
  children: ReactNode;
  showLoading?: boolean;
}

export default function EnhancedAdminContainer({
  children,
  showLoading = true
}: EnhancedAdminContainerProps) {
  const {
    isLoading,
    error,
    criticalAlerts,
    depositsRequiringVerification,
    refreshEnhancedData
  } = useEnhancedAdmin();

  useEffect(() => {
    if (criticalAlerts.length > 0) {
      toast.warning(
        `${criticalAlerts.length} critical alerts require attention!`,
        {
          duration: 10000
        }
      );
    }
  }, [criticalAlerts]);

  if (isLoading && showLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='space-y-4 text-center'>
          <Loader2 className='text-primary mx-auto h-12 w-12 animate-spin' />
          <p className='text-muted-foreground'>
            Loading enhanced admin data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='max-w-md space-y-4 text-center'>
          <AlertTriangle className='text-destructive mx-auto h-12 w-12' />
          <div>
            <h3 className='mb-2 text-lg font-semibold'>
              Failed to load admin data
            </h3>
            <p className='text-muted-foreground mb-4'>
              {(error as any).message}
            </p>
            <Button onClick={refreshEnhancedData} variant='outline'>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Alert Banners */}
      {criticalAlerts.length > 0 && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <AlertTriangle className='h-5 w-5 text-red-600' />
              <div>
                <p className='font-medium text-red-900'>
                  {criticalAlerts.length} critical alert
                  {criticalAlerts.length > 1 ? 's' : ''} require immediate
                  attention
                </p>
                <p className='text-sm text-red-700'>
                  Review system alerts to prevent potential issues
                </p>
              </div>
            </div>
            <Button variant='destructive' size='sm' asChild>
              <a href='/admin/alerts'>View Alerts</a>
            </Button>
          </div>
        </div>
      )}

      {depositsRequiringVerification.length > 0 && (
        <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='h-5 w-5 text-yellow-600'>⏳</div>
              <div>
                <p className='font-medium text-yellow-900'>
                  {depositsRequiringVerification.length} deposit
                  {depositsRequiringVerification.length > 1 ? 's' : ''} pending
                  verification
                </p>
                <p className='text-sm text-yellow-700'>
                  Manual review required for proof of payment
                </p>
              </div>
            </div>
            <Button variant='outline' size='sm' asChild>
              <a href='/admin/deposits?filter=pending'>Review Deposits</a>
            </Button>
          </div>
        </div>
      )}

      {/* Content */}
      {children}
    </div>
  );
}
