import { notFound } from 'next/navigation';
import { supportedLanguages } from '@/data/supportedLanguages';
import initTranslations from '@/lib/i18n/initTranslations';
import { TranslationProvider } from '@king/i18n';
import type { Metadata } from 'next';
import type { ResourceLanguage } from 'i18next';

const i18nNamespaces = ['default'];

export function generateStaticParams() {
  return supportedLanguages.map((lng) => ({ lng }));
}

type Props = { params: Promise<{ lng: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lng } = await params;
  return {
    title: 'Candy Crush Season',
    description: '',
    alternates: {
      languages: Object.fromEntries(supportedLanguages.map((l) => [l, `/${l}/`])),
      canonical: `/${lng}/`,
    },
  };
}

export default async function LngLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;

  if (!supportedLanguages.includes(lng)) notFound();

  const { resources } = await initTranslations(lng, i18nNamespaces);

  return (
    <TranslationProvider
      locale={lng}
      namespaces={i18nNamespaces}
      resources={resources as ResourceLanguage}
    >
      {children}
    </TranslationProvider>
  );
}