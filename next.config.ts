
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
  // output: 'export', // REMOVED: Not needed for Vercel deployment with server-side features
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // unoptimized: true, // REMOVED: Vercel handles Next.js image optimization
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
