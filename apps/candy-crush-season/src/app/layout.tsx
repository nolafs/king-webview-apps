import type { Viewport } from 'next';
import './globals.scss';
import { WebViewProvider } from '@king/webview';
import { navigationData } from '@/data/navigation';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <WebViewProvider
          startingRoute="/en/"
          pagesPreCache={navigationData}
          appVersion={process.env.NEXT_PUBLIC_ENV ?? '1.0.0'}
        >
          {children}
        </WebViewProvider>
      </body>
    </html>
  );
}