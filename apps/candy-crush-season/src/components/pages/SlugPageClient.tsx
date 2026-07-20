'use client';
import { useParams } from 'next/navigation';
import { SimplePage } from './SimplePage';

export function SlugPageClient() {
  const { lng, slug } = useParams<{ lng: string; slug: string }>();

  return (
    <main className="container mx-auto px-4 py-10">
      <SimplePage slug={slug} language={lng} />
    </main>
  );
}