export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  content: unknown;
  language: string;
}

export interface CmsApiResponse<T = unknown> {
  data: T;
  error?: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  preCache?: boolean;
}