const sharedPreset = require('../../libs/shared-ui/src/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [sharedPreset],
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    // Include shared libs so Tailwind can detect classes used there
    '../../libs/shared-ui/src/**/*.{js,ts,jsx,tsx}',
    '../../libs/webview/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-primary)', 'system-ui', 'sans-serif'],
        header: ['var(--font-header)', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            h1: { fontFamily: 'var(--font-header), system-ui, sans-serif' },
            h2: { fontFamily: 'var(--font-header), system-ui, sans-serif' },
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
};