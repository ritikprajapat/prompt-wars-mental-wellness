import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: [
          'var(--font-display)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
      },
      colors: {
        brand: {
          50: '#eef9f7',
          100: '#d6f1ec',
          400: '#34d1bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        accent: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
      },
      boxShadow: {
        soft: '0 18px 50px -24px rgba(99, 102, 241, 0.35)',
        card: '0 12px 40px -20px rgba(79, 70, 229, 0.25)',
        glow: '0 0 0 1px rgba(255,255,255,0.6), 0 24px 60px -28px rgba(124, 58, 237, 0.4)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-30px,0) scale(1.08)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 16s ease-in-out infinite',
        'float-slow': 'float 24s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
