'use client';

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { createMessageBus, defineMessages } from './king/webview-core';
import { DevPanel } from './king/floss-ui';
import type { CandyCrushSagaClientInfo, NavigationItem } from '@king/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageBusType = any;

export interface WebViewContextType {
  isReady: boolean;
  isWebViewLoaded: boolean;
  isWebViewOpened: boolean;
  isOnline: boolean;
  exitWebView: () => void;
  hideWidget: () => void;
  showWidget: () => void;
  sendTracking: (payload: unknown) => void;
  getClientInfo: () => Promise<CandyCrushSagaClientInfo | null>;
  startMedia: () => void;
  stopMedia: () => void;
  setBackButtonHandler: (handler: () => void) => void;
  messageBus: MessageBusType | null;
}

const WebViewContext = createContext<WebViewContextType | null>(null);

const WEBVIEW_OPENED_KEY = 'webview_opened';

function getPersistedWebViewOpened(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(WEBVIEW_OPENED_KEY) === 'true';
  } catch {
    return false;
  }
}

function setPersistedWebViewOpened(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      sessionStorage.setItem(WEBVIEW_OPENED_KEY, 'true');
    } else {
      sessionStorage.removeItem(WEBVIEW_OPENED_KEY);
    }
  } catch {
    // ignore
  }
}

export interface WebViewProviderProps {
  children: React.ReactNode;
  widgetIcon?: string;
  startingRoute?: string;
  pagesPreCache?: NavigationItem[];
  languages?: string[];
  onWebViewOpened?: () => void;
  appVersion?: string;
}

export function WebViewProvider({
  children,
  widgetIcon,
  startingRoute = '/en',
  pagesPreCache,
  onWebViewOpened,
  appVersion = '1.0.0',
}: WebViewProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);
  const [isWebViewOpened, setIsWebViewOpened] = useState(() => getPersistedWebViewOpened());
  const [isOnline, setIsOnline] = useState(true);
  const isOnlineRef = useRef(true);
  const messageBusRef = useRef<MessageBusType | null>(null);
  const onWebViewOpenedRef = useRef(onWebViewOpened);

  onWebViewOpenedRef.current = onWebViewOpened;
  isOnlineRef.current = isOnline;

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const receiverMessages = defineMessages('PING', 'WEB_VIEW_OPENED', 'systemBackButton', 'SendPayload');
    const senderMessages = defineMessages('SCRIPT_LOADED', 'exit', 'getCCSInfo', 'mediaStarted', 'mediaFinished', 'SEND_TRACKING');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bus = createMessageBus({ receiverMessages, senderMessages }) as any;
    messageBusRef.current = bus;

    bus.setMessageHook('PING', () => {
      setIsWebViewLoaded(true);
    });

    bus.setMessageHook('WEB_VIEW_OPENED', () => {
      setIsWebViewLoaded(true);
      setIsWebViewOpened(true);
      setPersistedWebViewOpened(true);
      onWebViewOpenedRef.current?.();
      window.location.href = startingRoute;
    });

    if (widgetIcon) {
      bus.setMessageHook('SendPayload', () => ({
        widget: { show: isOnlineRef.current, image: widgetIcon },
      }));
    }

    void bus.postMessageAsync({ message: 'SCRIPT_LOADED' });
    setIsReady(true);

    return () => {
      messageBusRef.current = null;
    };
  }, [widgetIcon, startingRoute]);

  const exitWebView = useCallback(async () => {
    try {
      await messageBusRef.current?.postMessageAsync({ message: 'exit' });
      setIsWebViewOpened(false);
      setPersistedWebViewOpened(false);
    } catch (e) {
      console.error('exitWebView failed', e);
    }
  }, []);

  const hideWidget = useCallback(async () => {
    await messageBusRef.current?.postMessageAsync({ message: 'SendPayload', payload: { widget: { show: false } } });
  }, []);

  const showWidget = useCallback(async () => {
    await messageBusRef.current?.postMessageAsync({ message: 'SendPayload', payload: { widget: { show: true } } });
  }, []);

  const sendTracking = useCallback(async (payload: unknown) => {
    await messageBusRef.current?.postMessageAsync({ message: 'SEND_TRACKING', payload });
  }, []);

  const getClientInfo = useCallback(async (): Promise<CandyCrushSagaClientInfo | null> => {
    if (!messageBusRef.current) return null;
    try {
      return (await messageBusRef.current.postMessageAsync({ message: 'getCCSInfo' })) as CandyCrushSagaClientInfo;
    } catch {
      return null;
    }
  }, []);

  const startMedia = useCallback(() => {
    messageBusRef.current?.postMessageAsync({ message: 'mediaStarted' });
  }, []);

  const stopMedia = useCallback(() => {
    messageBusRef.current?.postMessageAsync({ message: 'mediaFinished' });
  }, []);

  const setBackButtonHandler = useCallback((handler: () => void) => {
    messageBusRef.current?.setMessageHook('systemBackButton', handler);
  }, []);

  const value: WebViewContextType = {
    isReady,
    isWebViewLoaded,
    isWebViewOpened,
    isOnline,
    exitWebView,
    hideWidget,
    showWidget,
    sendTracking,
    getClientInfo,
    startMedia,
    stopMedia,
    setBackButtonHandler,
    messageBus: messageBusRef.current,
  };

  return (
    <WebViewContext.Provider value={value}>
      {children}
      <DevPanel
        active={process.env.NEXT_PUBLIC_ENV === 'development'}
        appVersion={appVersion}
        devActionList={[
          { label: 'Reload page', action: () => window.location.reload() },
        ]}
        devInfoList={[
          {
            label: 'WebView State',
            data: { isReady, isWebViewLoaded, isWebViewOpened, isOnline },
          },
        ]}
      />
    </WebViewContext.Provider>
  );
}

const defaultContextValue: WebViewContextType = {
  isReady: false,
  isWebViewLoaded: false,
  isWebViewOpened: false,
  isOnline: true,
  sendTracking: async () => {},
  exitWebView: async () => {},
  hideWidget: async () => {},
  showWidget: async () => {},
  getClientInfo: async () => null,
  startMedia: () => {},
  stopMedia: () => {},
  setBackButtonHandler: () => {},
  messageBus: null,
};

export function useWebView(): WebViewContextType {
  return useContext(WebViewContext) ?? defaultContextValue;
}

export { WebViewContext };