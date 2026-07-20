# King Webview Frontend Apps

NX monorepo for King's in-game webview client applications. Apps are built with Next.js as **static exports** and hosted on **Firebase Hosting** (CDN only — no server-side rendering, no Cloud Run).

Each app runs inside the game's native webview and communicates with the game client via the King webview message bus. Data is fetched from Firebase Cloud Functions endpoints; the frontend never accesses Firebase databases directly.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | [NX](https://nx.dev) (integrated, single `node_modules`) |
| Framework | [Next.js 15](https://nextjs.org) — App Router, `output: 'export'` |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) + CSS custom properties |
| i18n | [i18next](https://www.i18next.com) + react-i18next (24 languages) |
| Animation | [GSAP 3](https://gsap.com) |
| Webview | King webview message bus (ported from game client) |
| Hosting | [Firebase Hosting](https://firebase.google.com/docs/hosting) (static CDN) |
| Data | Firebase Cloud Functions REST endpoints |
| Analytics | Firebase Analytics (client-side, lazy init) |

> **Why Tailwind v3?** v3 has broader support for older Android WebView versions present on the game's target devices.

> **Why static export?** Apps are served from Firebase Hosting's global CDN. There is no Node.js server — all data is fetched by the browser at runtime from Firebase Functions.

---

## Repository Structure

```
king-webview-apps/
├── apps/
│   └── candy-crush-season/        # Candy Crush Season webview app
│       ├── src/
│       │   ├── app/               # Next.js App Router
│       │   │   ├── layout.tsx     # Root layout — WebViewProvider, Firebase init
│       │   │   ├── page.tsx       # Root redirect → /en/
│       │   │   └── [lng]/         # Language-prefixed routes
│       │   │       ├── layout.tsx # Loads settings + i18n for the language
│       │   │       ├── page.tsx   # Home page
│       │   │       └── locked/    # Locked state page
│       │   ├── components/        # App-specific React components
│       │   ├── data/              # Static data (supported languages, navigation)
│       │   ├── lib/               # App utilities
│       │   │   ├── config.ts      # Env var constants
│       │   │   ├── fetchSettings.ts  # Fetch CMS settings from Firebase Functions
│       │   │   ├── hooks/         # React hooks (useSettings, etc.)
│       │   │   └── i18n/          # App-specific i18n wiring (locale import map)
│       │   ├── locales/           # Translation JSON files (one folder per language)
│       │   └── styles/
│       ├── .env.example           # Environment variable template (commit this)
│       ├── firebase.json          # Firebase Hosting config — points to out/
│       ├── next.config.js         # output: export, webpack aliases for @king/* libs
│       ├── tailwind.config.js     # Extends shared preset, app-specific theme
│       └── project.json           # NX targets: dev, build, deploy
│
├── libs/
│   ├── types/                     # @king/types
│   │   └── src/
│   │       ├── settings.types.ts  # SettingsType, LanguageConfig
│   │       ├── cms.types.ts       # CmsPage, NavigationItem
│   │       ├── webview.types.ts   # CandyCrushSagaClientInfo
│   │       └── language.types.ts  # Language
│   │
│   ├── firebase/                  # @king/firebase
│   │   └── src/
│   │       ├── config.ts          # Reads NEXT_PUBLIC_FIREBASE_* env vars
│   │       └── client-app.ts      # Lazy Firebase app init + Analytics
│   │
│   ├── webview/                   # @king/webview
│   │   └── src/
│   │       ├── WebViewProvider.tsx  # React context — wraps entire app
│   │       ├── useWebView.ts        # Hook to consume webview context
│   │       └── king/
│   │           ├── webview-core/    # Message bus (ported from game client)
│   │           │   ├── message-bus/ # Core bus, adapter, hook/callback handlers
│   │           │   ├── enums/       # MessageResult, HapticStyle
│   │           │   ├── types/       # Payload, HookFunction, HookResponder
│   │           │   ├── constants/   # Message name definitions
│   │           │   └── utils/       # Serialization, platform detection
│   │           └── floss-ui/        # DevPanel (debug overlay, dev-only)
│   │
│   ├── i18n/                      # @king/i18n
│   │   └── src/
│   │       ├── initTranslations.ts  # Factory: createInitTranslations(localeMap)
│   │       ├── TranslationProvider.tsx  # Client provider wrapping I18nextProvider
│   │       ├── i18nConfig.ts        # Default locale, fallback, ignored routes
│   │       └── languages.ts         # Language list + setLanguages(settings)
│   │
│   └── shared-ui/                 # @king/shared-ui
│       └── src/
│           └── tailwind-preset.js   # Shared Tailwind theme (CSS var → token map)
│
├── nx.json                        # NX workspace config
├── tsconfig.base.json             # Base TS config + @king/* path aliases
└── package.json                   # Workspace dependencies (shared node_modules)
```

---

## Apps

### `candy-crush-season`

The Candy Crush Season in-game event hub. Displayed inside the game's native webview when a player opens a seasonal event.

- **Firebase project:** `king-ccs-campaign-cms-prod`
- **Hosting URL:** `https://candy-crush-seasons.web.app`
- **API:** `https://us-central1-king-ccs-campaign-cms-prod.cloudfunctions.net/app`

---

## Shared Libraries

Libraries live in `libs/` and are imported by apps via `@king/*` aliases. They are resolved at build time via webpack aliases in each app's `next.config.js` — they are not published npm packages.

### `@king/webview`

The core of every app. `WebViewProvider` wraps the root layout and establishes the message bus connection with the game client.

```tsx
// apps/my-app/src/app/layout.tsx
import { WebViewProvider } from '@king/webview';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WebViewProvider startingRoute="/en/" widgetIcon={settings.widgetIcon}>
          {children}
        </WebViewProvider>
      </body>
    </html>
  );
}
```

```tsx
// Any client component
import { useWebView } from '@king/webview';

export function ExitButton() {
  const { exitWebView, isOnline, sendTracking } = useWebView();
  return <button onClick={() => exitWebView()}>Close</button>;
}
```

**Message bus hooks available via `useWebView()`:**

| Method | Description |
|---|---|
| `exitWebView()` | Tell the game to close the webview |
| `hideWidget()` / `showWidget()` | Show/hide the game's floating widget |
| `sendTracking(payload)` | Send analytics events to the game |
| `getClientInfo()` | Get player data (userId, country, progress, etc.) |
| `startMedia()` / `stopMedia()` | Signal media playback state to the game |
| `setBackButtonHandler(fn)` | Override the Android back button |
| `isWebViewOpened` | Whether the player has opened the webview |
| `isOnline` | Browser online status |

### `@king/i18n`

i18next setup shared across apps. Each app creates its own `initTranslations` instance bound to its locale JSON files.

```ts
// apps/my-app/src/lib/i18n/initTranslations.ts
import { createInitTranslations } from '@king/i18n';

const initTranslations = createInitTranslations({
  en: { default: () => import('@/locales/en/default.json') },
  de: { default: () => import('@/locales/de/default.json') },
  // ...
});

export default initTranslations;
```

### `@king/firebase`

Lazy Firebase client initialisation. Safe to call multiple times — returns the existing app if already initialised.

```ts
import { createFirebaseApp } from '@king/firebase';

const app = createFirebaseApp(); // init once, reuse after
```

### `@king/shared-ui` · `@king/types`

- `@king/shared-ui` — Tailwind preset imported in each app's `tailwind.config.js`. Defines colour tokens as CSS variable references so each app can theme itself via `:root` variables in `globals.css`.
- `@king/types` — Shared TypeScript types (`SettingsType`, `NavigationItem`, `CandyCrushSagaClientInfo`, etc.).

---

## Getting Started

### Prerequisites

- Node.js 20+
- `npm install` (installs NX and all dependencies)
- `firebase-tools` installed globally: `npm i -g firebase-tools`
- Firebase CLI authenticated: `firebase login`

### Environment setup

```bash
cp apps/candy-crush-season/.env.example apps/candy-crush-season/.env.local
# Fill in NEXT_PUBLIC_* values
```

### Development

```bash
# Start dev server for candy-crush-season
npm run dev:candy-crush-season
# or
npx nx dev candy-crush-season
```

The app runs at `http://localhost:3000`. The webview message bus falls back to a simulation mode when not inside the game client — all messages resolve immediately.

---

## Building & Deploying

All apps use `output: 'export'` — `next build` generates a static `out/` directory which is uploaded directly to Firebase Hosting.

```bash
# Build with local env vars
npx nx build candy-crush-season

# Build with production env vars + deploy to Firebase
npx nx deploy candy-crush-season
```

The `deploy` target runs `dotenv -e .env.prod -- next build` then `firebase deploy --only hosting:candy-crush-season`. The `.env.prod` file is gitignored and must exist locally.

### Build output

```
apps/candy-crush-season/out/
├── en/index.html      # Static shell for English
├── de/index.html      # Static shell for German
├── …/                 # One folder per supported language (24 total)
└── _next/             # Shared JS/CSS chunks
```

Firebase Hosting serves these files directly. Per-language SPA rewrites in `firebase.json` ensure client-side navigation within each language path works correctly.

---

## Adding a New App

1. Create `apps/my-new-app/` following the same structure as `candy-crush-season`
2. Add a `project.json` with `build`, `dev`, `deploy` targets
3. Add an alias to `next.config.js` webpack config pointing to `libs/`
4. Add a hosting target in `firebase.json` and `.firebaserc`
5. Add scripts to root `package.json`:
   ```json
   "dev:my-new-app": "nx dev my-new-app",
   "build:my-new-app": "nx build my-new-app",
   "deploy:my-new-app": "nx deploy my-new-app"
   ```

---

## i18n

Translation files live in `apps/<app>/src/locales/<lang>/default.json`. Languages are defined in `src/data/supportedLanguages.ts` — this list drives `generateStaticParams` so Next.js pre-generates an HTML shell for each language at build time.

To add a language:

1. Add the language code to `supportedLanguages.ts`
2. Create `src/locales/<lang>/default.json`
3. Add the import entry in `src/lib/i18n/localeImports.ts`

---

## Theming

Each app sets its own colour palette via CSS custom properties in `src/app/globals.css`. The shared Tailwind preset maps Tailwind colour utilities (e.g. `bg-primary`, `text-foreground`) to these variables, so swapping the variables changes the entire app's theme.

```css
/* apps/my-app/src/app/globals.css */
:root {
  --primary: 33 100 56;       /* HSL values — no hsl() wrapper */
  --primary-foreground: 0 0 100;
  --background: 255 240 220;
  --foreground: 30 10 50;
  /* ... */
}
```