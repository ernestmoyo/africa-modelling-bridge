import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f7f7f5',
          100: '#ecece7',
          200: '#d4d4c9',
          400: '#7d7d72',
          600: '#4a4a42',
          800: '#252521',
          900: '#13130f',
        },
        cream: {
          50: '#fbf8f1',
          100: '#f6f0e3',
          200: '#ede4ce',
          300: '#e1d3b0',
        },
        bridge: {
          50: '#e7f1f0',
          100: '#c1ddda',
          200: '#8bbeb9',
          300: '#5ba29c',
          500: '#1a6e6b',
          600: '#0f4c4a',
          700: '#0a3736',
          800: '#062626',
        },
        ember: {
          50: '#fdf3eb',
          100: '#fadcc1',
          200: '#f4b88e',
          400: '#e88a5f',
          500: '#d4663f',
          600: '#b3502d',
          700: '#8a3d22',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.045em',
        snug: '-0.015em',
      },
      maxWidth: {
        prose: '68ch',
        readable: '76ch',
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 76 74 / 0.04), 0 8px 24px -8px rgb(15 76 74 / 0.10)',
        lift: '0 12px 36px -12px rgb(15 76 74 / 0.18)',
      },
      backgroundImage: {
        'grain':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.06  0 0 0 0 0.30  0 0 0 0 0.29  0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [typography],
};
