import { createInstance, type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import i18nConfig from './i18nConfig';

// Apps must provide their own locale import map and pass it here.
// This function is a factory — call createInitTranslations(localeImports) to create
// an initTranslations function bound to a specific app's locale files.

type LocaleImportMap = Record<string, Record<string, () => Promise<unknown>>>;

export function createInitTranslations(localeImports: LocaleImportMap) {
  return async function initTranslations(
    locale: string,
    namespaces: string[],
    i18nInstance?: i18n,
    resources?: Record<string, Record<string, unknown>>,
  ) {
    i18nInstance = i18nInstance || createInstance();
    i18nInstance.use(initReactI18next);

    if (!resources) {
      i18nInstance.use(
        resourcesToBackend((language: string, namespace: string) => {
          const langImports =
            localeImports[language] ||
            localeImports[language.toLowerCase()] ||
            localeImports['en'];
          const importFn = langImports?.[namespace] || langImports?.['default'];
          return importFn?.();
        }),
      );
    }

    const normalizedLocale = locale.toLowerCase();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error — i18next typing mismatch
    await i18nInstance.init({
      lng: normalizedLocale,
      resources,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: namespaces[0],
      fallbackNS: namespaces[0],
      ns: namespaces,
      preload: resources ? [] : i18nConfig.locales,
      lowerCaseLng: true,
    });

    return {
      i18n: i18nInstance,
      resources: i18nInstance.services.resourceStore.data,
      t: i18nInstance.t,
    };
  };
}

// Default export — apps pass their locale map; this re-exports the factory
export default createInitTranslations;