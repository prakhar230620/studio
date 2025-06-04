import {NextIntlClientProvider, useMessages} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales} from '@/i18n';
import type {Metadata} from 'next';
import './globals.css';
import {Providers} from '@/components/Providers';
import {Navbar} from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Recipe Ready',
  description: 'AI-powered recipe generation and interactive culinary assistant.',
  manifest: '/manifest.json',
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = useMessages();
 
  return (
    <html lang={locale} suppressHydrationWarning>
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
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 pt-20 pb-8">
              {children}
            </main>
            <footer className="py-6 text-center text-sm text-muted-foreground border-t">
              © {new Date().getFullYear()} Recipe Ready. All rights reserved.
            </footer>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}