'use client';
import type React from 'react';
import { useWebView } from '@king/webview';
import clsx from 'clsx';

export interface ExternalLinkProps {
  url?: string;
  label?: string;
  lng?: string;
  target?: string;
  dialog?: boolean;
  slug?: string;
  active?: boolean;
  webviewActive?: boolean;
  type?: 'link' | 'button' | 'action';
  className?: string;
}

export function ExternalLink({
  url,
  label,
  target,
  active = true,
  webviewActive = true,
  type = 'link',
  className,
}: ExternalLinkProps) {
  const { isWebViewOpened } = useWebView();

  if (!active || !label || !url) return null;
  if (isWebViewOpened && !webviewActive) return null;

  const baseClass =
    type === 'link'
      ? 'text-[12px] text-white underline hover:opacity-80 transition-opacity'
      : 'inline-block rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black hover:opacity-90 transition-opacity';

  return (
    <a
      href={url}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className={clsx(baseClass, className)}
    >
      {label}
    </a>
  );
}

export default ExternalLink;