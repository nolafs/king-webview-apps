import { languages } from './languages';

const i18nConfig = {
  get locales() {
    return languages.map((lang) => lang.value);
  },
  defaultLocale: 'en',
  localeDetection: false,
  prefixDefault: true,
  fallbackLng: 'en',
  debug: false,
  ignoreRoutes: [
    '/api',
    '/startup',
    '/assets',
    '/_next',
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.webmanifest',
    '/sw.js',
  ],
};

export default i18nConfig;