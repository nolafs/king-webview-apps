export interface ContentType {
  contentTypeId: string;
  name: string;
  count?: number;
  creatededBy: string | null;
}

export interface Language {
  code: string;
  label: string;
  default: boolean;
  name: string;
  active: boolean;
  id: string;
}

export interface ImageFirebase {
  thumb: {
    name: string;
    url: string[];
  };
  path: string;
  type: string;
  extention: string;
  fileName: string;
  location: string;
  name: string;
  siteId: string;
}

interface Content {
  header_logo: ImageFirebase;
  social_default_image?: ImageFirebase;
  privacy_slug: string;
  social_default_description: string;
  social_default_title: string;
  social_default_url: string;
  not_sell_target: string;
  cookies_nav_active: boolean;
  california_privacy_active: boolean;
  terms_nav_active: boolean;
  not_sell_active: boolean;
  privacy_nav_active: boolean;
  privacy_url: string;
  cookies_label: string;
  privacy_label: string;
  not_sell_label: string;
  cookies_url: string;
  blog_footer_active: boolean;
  privacy_target: string;
  cookies_target: string;
  footer_copyright_text: string;
  california_privacy_target: string;
  california_privacy_label: string;
  california_privacy_url: string;
  cookies_slug: string;
  footer_logo: ImageFirebase;
  cookies_use_dialog: boolean;
  not_sell_url: string;
}

export interface Config {
  code: string;
  content: Content;
}

export interface SettingsType {
  language_supported: boolean;
  header_logo: ImageFirebase;
  header_image?: ImageFirebase;

  header_nav_active: boolean;
  header_nav_active_platform_ios: boolean;
  header_nav_active_platform_android: boolean;
  header_nav_active_platform_desktop: boolean;
  header_nav_active_platform_webview: boolean;

  game_pusher_active: boolean;
  game_pusher_title: string;
  game_pusher_body: string;
  game_pusher_url: string;
  game_pusher_icon?: ImageFirebase;

  header_nav?: string;
  widgetIcon: ImageFirebase;
  uid: string;
  googleUA: string;
  baseurl: string;
  storageExpiration: number;
  draft: boolean;
  name: string;
  description: string;
  active: boolean;

  social_default_image?: ImageFirebase;
  social_default_description: string;
  social_default_title: string;
  social_default_url: string;
  social_default_keys: string;

  primary_colour: string;
  secondary_colour: string;


  terms_nav_active: boolean;
  terms_nav_webview_active: boolean;
  terms_use_dialog: boolean;
  terms_url: string;
  terms_slug: string;
  terms_target: string;
  terms_label: string;

  not_sell_active: boolean;
  not_sell_webview_active: boolean;
  not_sell_use_dialog: boolean;
  not_sell_label: string;
  not_sell_url: string;
  not_sell_slug: string;
  not_sell_target: string;

  privacy_nav_active: boolean;
  privacy_nav_webview_active: boolean;
  privacy_url: string;
  privacy_slug: string;
  privacy_label: string;
  privacy_use_dialog: boolean;
  privacy_target: string;

  cookies_nav_active: boolean;
  cookies_nav_webview_active: boolean;
  cookies_label: string;
  cookies_slug: string;
  cookies_target: string;
  cookies_url: string;
  cookies_use_dialog: boolean;

  california_privacy_active: boolean;
  california_privacy_webview_active: boolean;
  california_privacy_use_dialog: boolean;
  california_privacy_target: string;
  california_privacy_label: string;
  california_privacy_url: string;
  california_privacy_slug: string;

  blog_footer_active: boolean;
  footer_copyright_text: string;

  footer_logo: ImageFirebase;

  creatededBy: string | null;
  contentTypes: ContentType[];
  languages: Language[];
  config?: Config[];
}
