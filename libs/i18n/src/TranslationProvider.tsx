'use client';
import { I18nextProvider } from 'react-i18next';
import { createInstance, type i18n, type ResourceLanguage } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { type ReactNode } from 'react';
import i18nConfig from './i18nConfig';

interface TranslationProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  // Pre-fetched resources from the server layout — no function needed
  resources: ResourceLanguage;
}

export default function TranslationProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationProviderProps) {
  const instance: i18n = createInstance();

  // Synchronous init — resources are already available (pre-fetched server-side)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error — i18next Resource type is overly strict
  instance.use(initReactI18next).init({
    lng: locale.toLowerCase(),
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    interpolation: { escapeValue: false },
  });

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}