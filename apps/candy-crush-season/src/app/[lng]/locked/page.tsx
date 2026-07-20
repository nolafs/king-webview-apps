'use client';
import { useTranslation } from 'react-i18next';
import { useWebView } from '@king/webview';

export default function LockedPage() {
  const { t } = useTranslation('default');
  const { exitWebView } = useWebView();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <h1 className="text-2xl font-bold text-secondary mb-4">
        {t('common.locked')}
      </h1>
      <button
        onClick={() => void exitWebView()}
        className="mt-6 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold"
      >
        {t('common.back')}
      </button>
    </main>
  );
}