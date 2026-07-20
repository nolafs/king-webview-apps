'use client';
import { useWebView } from '@king/webview';
import { clsx } from 'clsx';

interface ContentBlockProps {
  body: string;
}

export function ContentBlock({ body }: ContentBlockProps) {
  const { isWebViewOpened } = useWebView();

  return (
    <div
      className={clsx(
        // Tailwind typography prose — add @tailwindcss/typography to tailwind.config if needed
        'prose prose-sm max-w-full sm:prose-sm md:prose-base lg:prose-lg',
        // Disable links when inside the webview (game handles navigation)
        isWebViewOpened && 'pointer-events-none prose-a:text-foreground prose-a:no-underline',
      )}
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
