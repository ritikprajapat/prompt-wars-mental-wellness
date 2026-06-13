import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "mental-wellness",
  description: "A Next.js mental wellness journal and companion chat app.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
