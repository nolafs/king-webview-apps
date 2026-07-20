'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PageLoaderProps {
  children: React.ReactNode;
  timeout?: number;
}

export const PageLoader = ({ children, timeout = 5000 }: PageLoaderProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPriorityImages = async () => {
      const container = containerRef.current;
      if (!container) {
        if (!cancelled) setIsLoaded(true);
        return;
      }

      const priorityImages = Array.from(
        container.querySelectorAll<HTMLImageElement>(
          'img[fetchpriority="high"], img[data-priority="true"]'
        )
      );

      if (priorityImages.length === 0) {
        if (!cancelled) setIsLoaded(true);
        return;
      }

      const timeoutPromise = new Promise<void>((resolve) => {
        window.setTimeout(resolve, timeout);
      });

      const imagePromises = priorityImages.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete && img.naturalHeight !== 0) return resolve();
            const done = () => resolve();
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
          })
      );

      await Promise.race([Promise.all(imagePromises), timeoutPromise]);
      if (!cancelled) setIsLoaded(true);
    };

    loadPriorityImages();
    return () => {
      cancelled = true;
    };
  }, [timeout]);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;

    const kick = (hard = false) => {
      if (cancelled) return;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);

      raf1 = requestAnimationFrame(() => {
        if (cancelled) return;

        // update helps in WebViews where first scroll event is “odd”
        ScrollTrigger.update();

        if (hard) ScrollTrigger.refresh(true);

        raf2 = requestAnimationFrame(() => {
          if (cancelled) return;
          ScrollTrigger.update();
        });
      });
    };

    // initial settle: 2 rAF + a couple of delayed nudges
    kick(true);
    const t1 = window.setTimeout(() => kick(true), 150);
    const t2 = window.setTimeout(() => kick(true), 500);

    // fonts can shift layout
    document.fonts?.ready?.then(() => kick(true));

    // wake on first user interaction (classic WebView fix)
    const wake = () => kick(true);
    window.addEventListener('touchstart', wake, { passive: true, once: true });
    window.addEventListener('wheel', wake, { passive: true, once: true });

    // when wrapper fade-in finishes, kick again
    const wrapper = wrapperRef.current;
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.propertyName === 'opacity') kick(true);
    };
    wrapper?.addEventListener('transitionend', onTransitionEnd);

    // react to real layout changes
    let ro: ResizeObserver | null = null;
    const container = containerRef.current;
    if (container && 'ResizeObserver' in window) {
      ro = new ResizeObserver(() => kick(true));
      ro.observe(container);
    }

    // tab background/foreground
    const onVis = () => {
      if (!document.hidden) kick(true);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelled = true;
      clearTimeout(t1);
      clearTimeout(t2);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener('touchstart', wake);
      window.removeEventListener('wheel', wake);
      wrapper?.removeEventListener('transitionend', onTransitionEnd);
      ro?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [isLoaded]);

  return (
    <div id="main" ref={containerRef}>
      <div
        id="main-wrapper"
        ref={wrapperRef}
        className={clsx(isLoaded ? 'opacity-100' : 'opacity-0', 'transition-opacity duration-500')}
      >
        {children}
      </div>
    </div>
  );
};