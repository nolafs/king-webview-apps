const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../..');

const isProduction = process.env.NODE_ENV === 'production';

const kingAliases = {
  '@': path.join(__dirname, 'src'),
  '@king/types': path.join(workspaceRoot, 'libs/types/src/index.ts'),
  '@king/firebase': path.join(workspaceRoot, 'libs/firebase/src/index.ts'),
  '@king/webview': path.join(workspaceRoot, 'libs/webview/src/index.ts'),
  '@king/i18n': path.join(workspaceRoot, 'libs/i18n/src/index.ts'),
  '@king/shared-ui': path.join(workspaceRoot, 'libs/shared-ui/src/index.ts'),
  '@king/cms': path.join(workspaceRoot, 'libs/cms/src/index.ts'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Firebase Hosting CDN (no Cloud Run / server)
  // Only applied during production builds — dev server runs without this
  // constraint so dynamic routes resolve normally at localhost.
  output: isProduction ? 'export' : undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
    ],
  },

  // Turbopack config (Next.js 16 default dev bundler)
  // Path aliases are resolved via tsconfig.json paths — no resolveAlias needed
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack config (used for production builds)
  webpack(config) {
    // Exclude SVGs from Next.js default asset handling (nested in oneOf)
    config.module.rules.forEach((rule) => {
      if (rule.oneOf) {
        rule.oneOf.forEach((r) => {
          if (r.test instanceof RegExp && r.test.test('.svg')) {
            r.exclude = /\.svg$/i;
          }
        });
      } else if (rule.test instanceof RegExp && rule.test.test('.svg')) {
        rule.exclude = /\.svg$/i;
      }
    });

    // SVG imports → React components via SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      ...kingAliases,
    };

    return config;
  },
};

module.exports = nextConfig;