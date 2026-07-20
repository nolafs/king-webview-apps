'use client';
import React, { useState } from 'react';

interface DevAction {
  label: string;
  action: () => void;
}

interface DevInfo {
  label: string;
  data: Record<string, unknown>;
}

interface DevPanelProps {
  active: boolean;
  appVersion?: string;
  devActionList?: DevAction[];
  devInfoList?: DevInfo[];
}

export function DevPanel({ active, appVersion, devActionList = [], devInfoList = [] }: DevPanelProps) {
  const [open, setOpen] = useState(false);

  if (!active) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, right: 0, zIndex: 9999, fontFamily: 'monospace', fontSize: 11 }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ background: '#222', color: '#0f0', padding: '4px 8px', border: 'none', cursor: 'pointer' }}
      >
        DEV {appVersion}
      </button>
      {open && (
        <div style={{ background: '#111', color: '#eee', padding: 8, maxWidth: 280, maxHeight: 400, overflow: 'auto' }}>
          {devActionList.map((a) => (
            <button
              key={a.label}
              onClick={a.action}
              style={{ display: 'block', width: '100%', marginBottom: 4, background: '#333', color: '#fff', border: 'none', padding: '4px 6px', cursor: 'pointer', textAlign: 'left' }}
            >
              {a.label}
            </button>
          ))}
          {devInfoList.map((info) => (
            <details key={info.label} style={{ marginTop: 6 }}>
              <summary style={{ cursor: 'pointer', color: '#aef' }}>{info.label}</summary>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: 10 }}>
                {JSON.stringify(info.data, null, 2)}
              </pre>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}