'use client';
import type React from 'react';
import clsx from 'clsx';
import { ExternalLink, type ExternalLinkProps } from '../components/external-links';
import Image from 'next/image';

export type FooterLinkItem = Omit<ExternalLinkProps, 'type'>;

interface FooterProps {
  links?: FooterLinkItem[];
  copyright?: string;
  logo?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Footer({ links, copyright, logo, className, children }: FooterProps) {
  const activeLinks = links?.filter((l) => l.active && l.url && l.label) ?? [];

  return (
    <footer className={clsx('relative z-10 w-full bg-gradient-to-t from-black/30 to-transparent px-4 py-8', className)}>
      {children}

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4">
        {logo && <div>


          <Image
            src={logo}
            alt={'king-logo'}
            width={70}
            height={70}
          />

        </div>}

        {activeLinks.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {activeLinks.map((link, i) => (
              <ExternalLink key={i} {...link} type="link" />
            ))}
          </nav>
        )}

        {copyright && (
          <p
            className="text-center text-[11px] text-white/70"
            dangerouslySetInnerHTML={{ __html: copyright }}
          />
        )}
      </div>
    </footer>
  );
}

export default Footer;