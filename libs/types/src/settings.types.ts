export interface LanguageConfig {
  name: string;
  code: string;
  default?: boolean;
}

export interface LanguageContent {
  [key: string]: unknown;
}

export interface LanguageConfigEntry {
  code: string;
  content: LanguageContent;
}

export interface MediaAsset {
  location: string;
  alt?: string;
}

export interface SettingsType {
  languages: LanguageConfig[];
  config?: LanguageConfigEntry[];
  widgetIcon?: MediaAsset;
  social_default_title?: string;
  social_default_description?: string;
  social_default_keys?: string;
  social_default_image?: MediaAsset;
  [key: string]: unknown;
}