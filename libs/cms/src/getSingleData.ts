import type { CmsApiConfig, CmsPage } from '@king/types';

type LangDataContent = {
  default?: { content: Record<string, unknown> };
  content: Record<string, unknown>;
};

type LangData = {
  content: LangDataContent;
} & Omit<CmsPage, 'content'>;

/**
 * Fetch a single CMS page by slug and language.
 *
 * URL: GET {apiUrl}/{siteId}/{contentTypeId}/lang/{language}/{slug}
 *
 * The API returns content for the requested language plus a `default` block
 * (usually English). This function merges them so missing translations fall
 * back to the default language value, including deep-merging arrays by index.
 *
 * If the language request fails entirely, it retries with `defaultLanguage`.
 */
export async function getSingleData(
  slug: string,
  contentTypeId: string,
  language: string,
  { apiUrl, siteId }: CmsApiConfig,
  defaultLanguage = 'en',
): Promise<CmsPage | null> {
  const url = (lang: string) =>
    `${apiUrl}/${siteId}/${contentTypeId}/lang/${lang}/${slug}`;

  try {
    const res = await fetch(url(language));

    if (res.ok) {
      const langData = (await res.json()) as LangData;

      // No default block — return as-is with normalised shape
      if (!langData.content?.default) {
        return {
          ...langData,
          content: { content: langData.content.content as Record<string, unknown> },
        } as unknown as CmsPage;
      }

      // Merge: default content is base, language content overrides
      const defaultContent = langData.content.default.content;
      const langContent = langData.content.content;

      const merged: Record<string, unknown> = { ...defaultContent, ...langContent };

      // Deep merge arrays by index so individual items aren't lost
      for (const key in merged) {
        const defVal = defaultContent[key];
        const lngVal = langContent[key];

        if (Array.isArray(defVal) && Array.isArray(lngVal)) {
          const mergedArray = defVal.map((defItem, i) => {
            if (i < lngVal.length) {
              return { ...(defItem as object), ...(lngVal[i] as object) };
            }
            return defItem;
          });
          if (lngVal.length > defVal.length) {
            mergedArray.push(...lngVal.slice(defVal.length));
          }
          merged[key] = mergedArray;
        }
      }

      return {
        ...langData,
        content: { content: merged },
      } as unknown as CmsPage;
    }

    // Language not found — fall back to default language
    const fallbackRes = await fetch(url(defaultLanguage));
    if (!fallbackRes.ok) return null;
    return (await fallbackRes.json()) as CmsPage;
  } catch (e) {
    console.error('[getSingleData]', e);
    return null;
  }
}