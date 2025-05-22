
import type {NextConfig} from 'next';
// @ts-ignore Expected error because of the PWA package type
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true,
  skipWaiting: true, // Automatically activate new service worker
  cacheOnFrontEndNav: true, // Cache pages navigated to on the client side
  aggressiveFrontEndNavCaching: true, // More aggressive caching for client-side navigations
  reloadOnOnline: true, // Reload PWA when back online
});

const nextConfig: NextConfig = {
  output: 'export', // Added for static export, compatible with Capacitor
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // When using `next export`, next/image needs to be unoptimized
    // or use a custom loader if not deploying to a platform that supports it.
    // For Capacitor's local serving, unoptimized is often the simplest.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
