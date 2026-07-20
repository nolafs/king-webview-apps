// Static import map — required for bundler compatibility.
// Each language/namespace pair must be a static import() expression.
// Add new languages here as the project grows.

const localeImports: Record<string, Record<string, () => Promise<unknown>>> = {
  en: {
    default: () => import('@/locales/en/default.json'),
  },
  de: {
    default: () => import('@/locales/de/default.json'),
  },
  fr: {
    default: () => import('@/locales/fr/default.json'),
  },
  es: {
    default: () => import('@/locales/es/default.json'),
  },
  it: {
    default: () => import('@/locales/it/default.json'),
  },
  nl: {
    default: () => import('@/locales/nl/default.json'),
  },
  pl: {
    default: () => import('@/locales/pl/default.json'),
  },
  ru: {
    default: () => import('@/locales/ru/default.json'),
  },
  ja: {
    default: () => import('@/locales/ja/default.json'),
  },
  ko: {
    default: () => import('@/locales/ko/default.json'),
  },
  zh: {
    default: () => import('@/locales/zh/default.json'),
  },
  tr: {
    default: () => import('@/locales/tr/default.json'),
  },
  'pt-br': {
    default: () => import('@/locales/pt-br/default.json'),
  },
  sv: {
    default: () => import('@/locales/sv/default.json'),
  },
  da: {
    default: () => import('@/locales/da/default.json'),
  },
  no: {
    default: () => import('@/locales/no/default.json'),
  },
  fi: {
    default: () => import('@/locales/fi/default.json'),
  },
  cs: {
    default: () => import('@/locales/cs/default.json'),
  },
  sk: {
    default: () => import('@/locales/sk/default.json'),
  },
  hu: {
    default: () => import('@/locales/hu/default.json'),
  },
  ro: {
    default: () => import('@/locales/ro/default.json'),
  },
  hr: {
    default: () => import('@/locales/hr/default.json'),
  },
  id: {
    default: () => import('@/locales/id/default.json'),
  },
  th: {
    default: () => import('@/locales/th/default.json'),
  },
};

export default localeImports;