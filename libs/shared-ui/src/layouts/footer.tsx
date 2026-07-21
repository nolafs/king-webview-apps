'use client';
import type React from 'react';
import clsx from 'clsx';
import { ExternalLink, type ExternalLinkProps } from '../components/external-links';
import Image from 'next/image';

export type FooterLinkItem = Omit<ExternalLinkProps, 'type'>;

interface FooterProps {
  links?: FooterLinkItem[];
  primaryColor?: string;
  copyright?: string;
  logo?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Footer({ links, copyright, logo, className, primaryColor, children }: FooterProps) {
  const activeLinks = links?.filter((l) => l.active && l.url && l.label) ?? [];

  return (
    <footer className={clsx('relative isolate z-10 w-full mt-20', className)}>


    <div  style={{backgroundColor: primaryColor || 'transparent'}}>

      {children}

      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-8 pb-10">
        {logo && <div>


          <Image
            src={logo}
            alt={'king-logo'}
            width={70}
            height={70}
          />

        </div>}

        {copyright && (
          <p
            className="text-center text-[11px] mb-10 text-white/70"
            dangerouslySetInnerHTML={{ __html: copyright }}
          />
        )}

        {activeLinks.length > 0 && (
          <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {activeLinks.map((link, i) => (
              <ExternalLink key={i} {...link} type="link" />
            ))}
          </nav>
        )}


      </div>
    </div>
    </footer>
  );
}

export default Footer;