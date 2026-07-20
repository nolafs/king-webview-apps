'use client';
import type React from 'react';
import type { SettingsType } from '@king/types';
import { useWebView } from '@king/webview';
import Link from 'next/link';

interface QuitButtonProps {
  settings?: SettingsType | null;
}

export function QuitButton({ settings }: QuitButtonProps) {
  const { isWebViewOpened, exitWebView } = useWebView();

  const headerNav = settings?.header_nav;
  const webviewActive = settings?.header_nav_active_platform_webview;

  if (!webviewActive) return null;

  if (isWebViewOpened) {
    return (
      <button
        onClick={exitWebView}
        className="flex h-10 w-10 items-center justify-center rounded-full text-white opacity-80 hover:opacity-100"
        aria-label="Exit"
      >
        ✕
      </button>
    );
  }

  if (headerNav) {
    return (
      <Link
        href={headerNav}
        className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black"
      >
        Play Now
      </Link>
    );
  }

  return null;
}

export default QuitButton;