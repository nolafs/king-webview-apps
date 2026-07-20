'use client';
import { useTranslation } from 'react-i18next';
import { useWebView } from '@king/webview';

export default function HomePage() {
  const { t } = useTranslation('default');
  const { isWebViewOpened, isOnline } = useWebView();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <h1 className="text-4xl font-bold text-primary mb-4">
        {t('meta.title')}
      </h1>
      <p className="text-muted-foreground text-sm">
        WebView: {isWebViewOpened ? 'opened' : 'not opened'} · Online: {isOnline ? 'yes' : 'no'}
      </p>
    </main>
  );
}