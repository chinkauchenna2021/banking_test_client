import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/sonner';
import { fontVariables } from '@/lib/font';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import { cn } from '@/lib/utils';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import StoreProvider from '@/components/providers/StoreProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster as Toasters } from '@/components/ui/toaster';
import './globals.css';
import './theme.css';
import { useAuthDebug } from '@/hooks/useAuthDebug';
import DebugAuth from '@/components/DebugAuth';

const META_THEME_COLORS = {
  light: '#ffffff',
  dark: '#09090b'
};

export const metadata: Metadata = {
  title: 'Fidelity Offshore',
  description: 'Best for offshore banking services'
};

export const viewport: Viewport = {
  themeColor: META_THEME_COLORS.light
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  useAuthDebug(); // for monitoring auth state
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;
  const isScaled = activeThemeValue?.endsWith('-scaled');

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
        // dangerouslySetInnerHTML={{
        //   __html: `
        //     try {
        //       if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        //         document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.light}')
        //       }
        //     } catch (_) {}
        //   `
        // }}
        />
      </head>
      <body className={`${fontVariables}`}>
        <NextTopLoader color='var(--primary)' showSpinner={false} />
        <NuqsAdapter>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
            enableColorScheme
          >
            <Providers activeThemeValue={activeThemeValue as string}>
              <Toaster />
              <AuthProvider>
                <StoreProvider>
                  <DebugAuth />
                  {children}
                  <Toasters />
                  <Toaster />
                </StoreProvider>
              </AuthProvider>
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
