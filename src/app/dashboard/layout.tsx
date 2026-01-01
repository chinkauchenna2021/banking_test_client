import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks';
import { Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const metadata: Metadata = {
  title: 'Banking Dashboard',
  description: 'Modern banking dashboard with advanced features'
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {


   const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"
    

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login')
      } else if (user?.is_admin) {
        // Redirect admin users to admin dashboard
        router.push('/admin')
      }
    }
  }, [user, isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }
  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}