'use client';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export function NotFoundLayout() {
  const { t } = useTranslation('default');

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center">
      <h2 className="font-header text-3xl text-white">{t('error404_header')}</h2>
      <Link
        href="/"
        className="rounded-full bg-white px-6 py-2 text-sm font-medium text-black hover:opacity-90"
      >
        {t('bt_back_home')}
      </Link>
    </main>
  );
}

export default NotFoundLayout;