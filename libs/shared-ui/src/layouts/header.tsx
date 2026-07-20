'use client';
import type React from 'react';
import clsx from 'clsx';
import type { SettingsType } from '@king/types';
import { LanguageSelectorFlags } from '../components/LanguageSelectorFlags';
import { QuitButton } from '../components/quit-button';

interface HeaderProps {
  settings?: SettingsType | null;
  logo?: React.ReactNode;
  className?: string;
}

export function Header({ settings, logo, className }: HeaderProps) {
  return (
    <header className={clsx('relative z-20 w-full', className)}>
      <div className="flex w-full items-center justify-between px-5 py-4">
        <LanguageSelectorFlags languages={settings?.languages} />
        {logo && <div className="absolute left-1/2 -translate-x-1/2">{logo}</div>}
        <QuitButton settings={settings} />
      </div>
    </header>
  );
}

export default Header;