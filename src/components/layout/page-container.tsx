'use client';

import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heading } from '../ui/heading';

function PageSkeleton() {
  return (
    <div className='flex flex-1 animate-pulse flex-col gap-4 p-4 md:px-6'>
      <div className='flex items-center justify-between'>
        <div>
          <div className='bg-muted mb-2 h-8 w-48 rounded' />
          <div className='bg-muted h-4 w-96 rounded' />
        </div>
      </div>
      <div className='bg-muted mt-6 h-40 w-full rounded-lg' />
      <div className='bg-muted h-40 w-full rounded-lg' />
    </div>
  );
}

export default function PageContainer({
  children,
  scrollable = true,
  isloading = false,
  access = true,
  accessFallback,
  pageTitle,
  pageDescription,
  pageHeaderAction
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  isloading?: boolean;
  access?: boolean;
  accessFallback?: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  pageHeaderAction?: React.ReactNode;
}) {
  const [isSafari, setIsSafari] = React.useState(false);

  React.useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent;
    const safariDetected =
      /^((?!chrome|android|crios|fxios|edgios|opr).)*safari/i.test(ua);
    setIsSafari(safariDetected);
  }, []);

  if (!access) {
    return (
      <div className='flex flex-1 items-center justify-center p-4 md:px-6'>
        {accessFallback ?? (
          <div className='text-muted-foreground text-center text-lg'>
            You do not have access to this page.
          </div>
        )}
      </div>
    );
  }

  const content = isloading ? <PageSkeleton /> : children;
  const body = (
    <div className='flex flex-1 flex-col p-4 md:px-6'>
      <div className='mb-4 flex items-start justify-between'>
        <div>
          <Heading
            title={pageTitle ?? ''}
            description={pageDescription ?? ''}
          />
        </div>
        {pageHeaderAction ? <div>{pageHeaderAction}</div> : null}
      </div>
      {content}
    </div>
  );

  return scrollable ? (
    isSafari ? (
      <div className='h-[calc(100dvh-52px)] min-h-[calc(100vh-52px)] overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]'>
        {body}
      </div>
    ) : (
      <ScrollArea className='h-[calc(100dvh-52px)] min-h-[calc(100vh-52px)]'>
        {body}
      </ScrollArea>
    )
  ) : (
    <div className='flex flex-1 flex-col p-4 md:px-6'>
      <div className='mb-4 flex items-start justify-between'>
        <div>
          <Heading
            title={pageTitle ?? ''}
            description={pageDescription ?? ''}
          />
        </div>
        {pageHeaderAction ? <div>{pageHeaderAction}</div> : null}
      </div>
      {content}
    </div>
  );
}
