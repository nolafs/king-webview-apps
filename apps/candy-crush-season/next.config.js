const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../..');

const isProduction = process.env.NODE_ENV === 'production';

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

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      // App-local @/ alias
      '@': path.join(__dirname, 'src'),
      // NX workspace libs
      '@king/types': path.join(workspaceRoot, 'libs/types/src/index.ts'),
      '@king/firebase': path.join(workspaceRoot, 'libs/firebase/src/index.ts'),
      '@king/webview': path.join(workspaceRoot, 'libs/webview/src/index.ts'),
      '@king/i18n': path.join(workspaceRoot, 'libs/i18n/src/index.ts'),
      '@king/shared-ui': path.join(workspaceRoot, 'libs/shared-ui/src/index.ts'),
      '@king/cms': path.join(workspaceRoot, 'libs/cms/src/index.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;