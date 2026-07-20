'use client';
import { useState, useEffect } from 'react';
import type { SettingsType } from '@king/types';
import { fetchSettings } from '../fetchSettings';

export function useSettings(language = 'en') {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSettings(language)
      .then((data) => {
        if (!cancelled) {
          setSettings(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e as Error);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [language]);

  return { settings, loading, error };
}