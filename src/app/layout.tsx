import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Recipe Ready',
  description: 'AI-powered recipe generation and interactive culinary assistant.',
  manifest: '/manifest.json', // Link to manifest
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="application-name" content="Recipe Ready" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Recipe Ready" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" /> 
        <meta name="msapplication-TileColor" content="#db2777" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#db2777" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#16141f" media="(prefers-color-scheme: dark)" />
        
        {/* Favicon links */}
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" sizes="any" />
        {/* 
          It's recommended to generate PNG versions of your icon for broader compatibility,
          especially for favicons and Apple touch icons.
          e.g., <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* You should generate an apple-touch-icon.png (e.g., 180x180) from your SVG */}
        
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 pt-20 pb-8">
            {children}
          </main>
          <footer className="py-6 text-center text-sm text-muted-foreground border-t">
            © {new Date().getFullYear()} Recipe Ready. All rights reserved.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
