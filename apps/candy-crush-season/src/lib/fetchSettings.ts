import type { SettingsType } from '@king/types';
import { appConfig } from './config';

export async function fetchSettings(language = 'en'): Promise<SettingsType | null> {
  try {
    const res = await fetch(`${appConfig.apiUrl}/${appConfig.siteId}/meta`, {
      headers: { 'Accept-Language': language },
    });
    if (!res.ok) throw new Error(`Settings fetch failed: ${res.status}`);

    const settings = (await res.json()) as SettingsType;
    const defaultLang = settings.languages?.find((l) => l.default);

    if (!defaultLang || !settings.config) return settings;

    // Merge default-language content with requested-language content
    const defaultContent = settings.config.find((c) => c.code === defaultLang.code)?.content ?? {};
    const langContent = settings.config.find((c) => c.code === language)?.content ?? {};

    return { ...settings, ...defaultContent, ...langContent };
  } catch (e) {
    console.error('[fetchSettings]', e);
    return null;
  }
}