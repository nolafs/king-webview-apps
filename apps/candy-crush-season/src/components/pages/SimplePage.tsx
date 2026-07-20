'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSingleData } from '@king/cms';
import { cmsConfig } from '@/lib/config';
import type { CmsPage } from '@king/types';
import { ContentBlock } from './ContentBlock';

// Content type ID for simple/legal pages in this app's CMS
// Set via NEXT_PUBLIC_CONTENT_TYPE_ID env var or override per page
const DEFAULT_CONTENT_TYPE = process.env.NEXT_PUBLIC_CONTENT_TYPE_ID ?? '';

interface SimplePageProps {
  slug: string;
  language: string;
  contentTypeId?: string;
}

export function SimplePage({ slug, language, contentTypeId = DEFAULT_CONTENT_TYPE }: SimplePageProps) {
  const { t } = useTranslation('default');
  const [data, setData] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    getSingleData(slug, contentTypeId, language, cmsConfig).then((result) => {
      if (cancelled) return;
      if (!result?.content?.content?.body) {
        setNotFound(true);
      } else {
        setData(result);
      }
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [slug, language, contentTypeId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-muted-foreground text-sm">{t('common.loading')}</span>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-muted-foreground text-sm">{t('common.error')}</span>
      </div>
    );
  }

  return <ContentBlock body={data.content.content.body as string} />;
}