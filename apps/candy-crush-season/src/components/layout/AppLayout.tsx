'use client';
import type React from 'react';
import { useParams } from 'next/navigation';
import { Header, Footer } from '@king/shared-ui';
import { useSettings } from '@/lib/hooks/useSettings';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { lng } = useParams<{ lng: string }>();
  const { settings } = useSettings(lng);

  const footerLinks = settings
    ? [
        {
          url: settings.terms_url,
          label: settings.terms_label,
          target: settings.terms_target,
          active: settings.terms_nav_active,
          webviewActive: settings.terms_nav_webview_active,
        },
        {
          url: settings.cookies_url,
          label: settings.cookies_label,
          target: settings.cookies_target,
          active: settings.cookies_nav_active,
          webviewActive: settings.cookies_nav_webview_active,
        },
        {
          url: settings.privacy_url,
          label: settings.privacy_label,
          target: settings.privacy_target ,
          active: settings.privacy_nav_active,
          webviewActive: settings.privacy_nav_webview_active,
        },
        {
          url: settings.not_sell_url,
          label: settings.not_sell_label,
          target: settings.not_sell_target,
          active: settings.not_sell_active,
          webviewActive: settings.not_sell_webview_active,
        },
        {
          url: settings.california_privacy_url ,
          label: settings.california_privacy_label,
          target: settings.california_privacy_target,
          active: settings.california_privacy_active,
          webviewActive: settings.california_privacy_webview_active,
        },
      ]
    : [];

  return (
    <div className="flex min-h-screen flex-col">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer
        links={footerLinks}
        logo={settings?.footer_logo?.location}
        copyright={settings?.footer_copyright_text as string | undefined}
      />
    </div>
  );
}