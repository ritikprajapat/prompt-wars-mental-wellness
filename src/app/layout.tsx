import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Mental Wellness — Journal, Insights & Companion Chat',
    template: '%s · Mental Wellness',
  },
  description:
    'A calm space for exam aspirants to journal daily, receive gentle AI insights into emotional patterns, and chat with a supportive companion.',
  keywords: [
    'mental wellness',
    'journal',
    'exam stress',
    'mood tracker',
    'student wellbeing',
  ],
  applicationName: 'Mental Wellness',
};

export const viewport: Viewport = {
  themeColor: '#8b5cf6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preconnect"
          href="https://generativelanguage.googleapis.com"
        />
      </head>
      <body className="min-h-screen font-sans text-slate-800 antialiased">
        <div className="aurora" aria-hidden="true" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 rounded-full bg-white px-4 py-2 text-sm font-medium text-violet-600 shadow-lg"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
