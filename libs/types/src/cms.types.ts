export interface NavigationItem {
  href: string;
  label: string;
  preCache?: boolean;
}

// --- CMS Page types (matches the API response from Firebase Functions) ---

export interface PageContent {
  title: string;
  hasLegals?: boolean;
  body: string;
  [key: string]: unknown;
}

export interface ContentDetail {
  uid: string | null;
  code: string;
  contentId: string;
  active: boolean;
  siteId: string;
  content: PageContent;
}

export interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface CmsPage {
  preview: boolean;
  featured: boolean;
  categoriesFilter: string | null;
  created: Timestamp;
  weight: number;
  menu: boolean;
  title: string;
  type: string;
  taxFilter: string | null;
  createdBy: string;
  siteId: string;
  typeId: string;
  modifiedBy: string;
  id: string;
  slug: string;
  uid: string;
  publish: Timestamp;
  tax: unknown[];
  categories: unknown[];
  content: {
    content: PageContent;
  };
  active: boolean;
  modified: Timestamp;
}

export interface CmsListResponse {
  data: CmsPage[];
  total?: number;
}

export interface CmsApiConfig {
  apiUrl: string;
  siteId: string;
}