'use client';
import { useEffect } from 'react';

// Root redirect — sends the browser to the default language.
// Firebase Hosting's rewrite rules also handle this for first load.
export default function RootPage() {
  useEffect(() => {
    window.location.replace('/en/');
  }, []);

  return null;
}