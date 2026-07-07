import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookmarkProvider } from "@/context/BookmarkContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = 'https://periodic-elements-explorer.vercel.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Periodic Elements Explorer',
    template: '%s | Periodic Elements Explorer',
  },
  description: 'A modern, interactive periodic table of elements for chemistry students, educators, and researchers. Explore 118 elements with 3D atomic models, comparison tools, and periodic trends.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Periodic Elements Explorer',
    description: 'A modern, interactive periodic table of elements with 3D atomic models, comparison tools, and periodic trends.',
    url: baseUrl,
    siteName: 'Periodic Elements Explorer',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Periodic Elements Explorer',
    description: 'A modern, interactive periodic table of elements with 3D atomic models, comparison tools, and periodic trends.',
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Periodic Elements Explorer',
    url: baseUrl,
    description: 'An interactive 3D periodic table of all 118 elements built with Next.js, featuring atomic models, element comparison, and periodic trends.',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Priyanshu',
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <BookmarkProvider>
          {children}
        </BookmarkProvider>
      </body>
    </html>
  );
}
