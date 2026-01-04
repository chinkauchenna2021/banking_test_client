// import {
//   Geist,
//   Geist_Mono,
//   Instrument_Sans,
//   Inter,
//   Mulish,
//   Noto_Sans_Mono
// } from 'next/font/google';

// import { cn } from '@/lib/utils';

// const geistSans = Geist({
//   subsets: ['latin'],
//   variable: '--font-geist-sans'
//   // No weight needed for variable fonts
// });

// // Configure Geist Mono (typically a variable font)
// const geistMono = Geist_Mono({
//   subsets: ['latin'],
//   variable: '--font-geist-mono'
// });

// // Configure Instrument Sans (check if it's variable on fonts.google.com)
// const instrumentSans = Instrument_Sans({
//   subsets: ['latin'],
//   variable: '--font-instrument-sans',
//   weight: ['400', '500', '600', '700'] // Specify weights if not variable
// });

// // Configure Inter (a popular variable font)
// const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter'
// });

// // Configure Mulish (check if variable)
// const mulish = Mulish({
//   subsets: ['latin'],
//   variable: '--font-mulish',
//   weight: ['400', '700'] // Specify if needed
// });

// // Configure Noto Sans Mono (a monospace font)
// const notoSansMono = Noto_Sans_Mono({
//   subsets: ['latin'],
//   variable: '--font-noto-sans-mono',
//   weight: ['400', '700'] // Specify if needed
// });
// export const fontVariables = cn(
//   geistSans.variable,
//   geistMono.variable,
//   instrumentSans.variable,
//   inter.variable,
//   mulish.variable,
//   notoSansMono.variable
// );

import { cn } from '@/lib/utils';

// Use CSS custom properties for system fonts
export const fontVariables = cn(
  'font-sans', // Tailwind default
  'antialiased' // For better rendering
);
