// app/layout.tsx
import Providers from '@/components/layout/providers';
import { fontVariables } from '@/lib/font';
import ThemeProvider from '@/components/layout/ThemeToggle/theme-provider';
import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import StoreProvider from '@/components/providers/StoreProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';
import './theme.css';
import DebugAuth from '@/components/DebugAuth';
import { Toaster } from '@/components/ui/toaster';

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
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get('active_theme')?.value;

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script src='//code.jivosite.com/widget/qqgMvccURQ' async></script>
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
              <AuthProvider>
                <StoreProvider>
                  <DebugAuth />
                  {children}
                </StoreProvider>
              </AuthProvider>
              {/* Only ONE Toaster */}
              <Toaster />
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
