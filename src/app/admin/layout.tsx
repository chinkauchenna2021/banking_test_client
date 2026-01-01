"use client";

import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // Your custom auth hook
import AdminSidebar from '@/components/admin/admin-sidebar';
import PageContainer from '@/components/layout/page-container';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
      } else if (user && !user.is_admin) {
        router.push('/dashboard')
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  if (!user?.is_admin) {
    return null
  }






  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying credentials...</p>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and is_admin
  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 md:ml-64">
        <PageContainer scrollable>
          {children}
        </PageContainer>
      </div>
    </div>
  );
}