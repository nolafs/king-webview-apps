'use client';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { firebaseConfig } from './config';

let firebaseApp: FirebaseApp | null = null;

export const createFirebaseApp = (): FirebaseApp => {
  if (firebaseApp) return firebaseApp;

  if (getApps().length > 0) {
    firebaseApp = getApps()[0];
    return firebaseApp;
  }

  firebaseApp = initializeApp(firebaseConfig);

  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    getAnalytics(firebaseApp);
  }

  return firebaseApp;
};