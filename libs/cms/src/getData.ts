import type { CmsApiConfig, CmsListResponse } from '@king/types';

export interface GetDataParams {
  contentTypeId: string;
  limit?: number;
  skip?: number;
}

/**
 * Fetch a paginated list of CMS pages for a given content type.
 *
 * URL: GET {apiUrl}/page/{siteId}/{contentTypeId}/{limit}/{skip}
 */
export async function getData(
  { contentTypeId, limit = 10, skip = 0 }: GetDataParams,
  { apiUrl, siteId }: CmsApiConfig,
): Promise<CmsListResponse | null> {
  try {
    const res = await fetch(
      `${apiUrl}/page/${siteId}/${contentTypeId}/${limit}/${skip}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as CmsListResponse;
  } catch (e) {
    console.error('[getData]', e);
    return null;
  }
}