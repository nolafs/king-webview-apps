import { SlugPageClient } from '@/components/pages/SlugPageClient';

export function generateStaticParams() {
  return [{ slug: '_' }];
}

export default function Page() {
  return <SlugPageClient />;
}