// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import ThemeProvider from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alexmorgan.dev";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0A09" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vijay Chauhan — Full Stack Developer",
    template: "%s | Vijay Chauhan",
  },
  description:
    "Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js. Building performant, elegant web experiences.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Web Developer",
    "Portfolio",
  ],
  authors: [{ name: "Vijay Chauhan" }],
  creator: "Vijay Chauhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Vijay Chauhan Portfolio",
    title: "Vijay Chauhan — Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vijay Chauhan — Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, TypeScript, and Node.js.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Vijay Chauhan",
  url: siteUrl,
  jobTitle: "Full Stack Developer",
  sameAs: ["https://github.com", "https://linkedin.com"],
  knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "MongoDB"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}