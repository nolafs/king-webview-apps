'use client';
import React, { useMemo, useState, useEffect, useTransition, useRef } from 'react';
import { CircleFlag } from 'react-circle-flags';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import type { Language } from '@king/types';

// Language code → ISO 3166-1 alpha-2 country code for flags
const languageToCountry: Record<string, string> = {
  ar: 'sa',
  cs: 'cz',
  da: 'dk',
  de: 'de',
  en: 'gb',
  es: 'es',
  fi: 'fi',
  fr: 'fr',
  hr: 'hr',
  hu: 'hu',
  id: 'id',
  it: 'it',
  ja: 'jp',
  ko: 'kr',
  nl: 'nl',
  no: 'no',
  pl: 'pl',
  'pt-br': 'br',
  pt: 'pt',
  ro: 'ro',
  ru: 'ru',
  sk: 'sk',
  sv: 'se',
  th: 'th',
  tr: 'tr',
  zh: 'cn',
};

interface LanguageSelectorFlagsProps {
  languages?: Language[];
  showName?: boolean;
  className?: string;
}

export function LanguageSelectorFlags({
  languages = [],
  showName = false,
  className,
}: LanguageSelectorFlagsProps) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const sortedLanguages = useMemo(
    () =>
      [...languages]
        .map((l) => ({ code: l.code.toLowerCase(), name: l.name, label: l.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [languages],
  );

  const currentLocale = i18n.language;

  const currentLanguage = useMemo(
    () => sortedLanguages.find((l) => l.code === currentLocale),
    [currentLocale, sortedLanguages],
  );

  const handleChange = (code: string) => {
    setOpen(false);

    // Persist locale cookie for 30 days
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `NEXT_LOCALE=${code};expires=${expires};path=/`;

    // Replace locale segment in pathname
    const segments = pathname.split('/').filter(Boolean);
    const langCodes = languages.map((l) => l.code.toLowerCase());
    const hasLocaleSegment = segments[0] && langCodes.includes(segments[0]);
    const pathWithoutLocale = hasLocaleSegment ? '/' + segments.slice(1).join('/') : pathname;
    const qs = searchParams.toString();
    const newPath = `/${code}${pathWithoutLocale}${qs ? `?${qs}` : ''}`;

    i18n.changeLanguage(code);

    startTransition(() => {
      router.push(newPath);
    });
  };

  // Avoid hydration mismatch
  if (!mounted || sortedLanguages.length <= 1) return null;

  const countryCode = languageToCountry[currentLocale] ?? currentLanguage?.code ?? 'xx';

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
      >
        <CircleFlag countryCode={countryCode} width={20} height={20} className="h-auto w-5 shrink-0" />
        {showName && currentLanguage && <span className="leading-none">{currentLanguage.name}</span>}
        <svg
          className={clsx('h-3 w-3 transition-transform', open && 'rotate-180')}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul className="absolute left-0 top-full z-50 mt-1 max-h-60 w-44 overflow-y-auto rounded-xl border border-white/10 bg-white py-1 shadow-xl">
          {sortedLanguages.map((lang) => (
            <li key={lang.code}>
              <button
                type="button"
                onClick={() => handleChange(lang.code)}
                className={clsx(
                  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100',
                  lang.code === currentLocale && 'bg-gray-100 font-medium',
                )}
              >
                <CircleFlag
                  countryCode={languageToCountry[lang.code] ?? 'xx'}
                  width={20}
                  height={20}
                  className="h-auto w-5 shrink-0"
                />
                <span>{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelectorFlags;