import type { CmsApiConfig } from '@king/types';

export const appConfig = {
  siteId: process.env.NEXT_PUBLIC_SITE_ID ?? 'ccs-season',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
  env: process.env.NEXT_PUBLIC_ENV ?? 'development',
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? '',
} as const;

// Passed to @king/cms functions so the lib stays env-var agnostic
export const cmsConfig: CmsApiConfig = {
  apiUrl: appConfig.apiUrl,
  siteId: appConfig.siteId,
};