
import type {NextConfig} from 'next';
// @ts-ignore Expected error because of the PWA package type
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
  register: true,
  cacheOnFrontEndNav: true, // Cache pages navigated to on the client side
  aggressiveFrontEndNavCaching: true, // More aggressive caching for client-side navigations
  reloadOnOnline: true, // Reload PWA when back online
});

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for Genkit AI dependencies
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    
    // Ignore problematic modules during client-side build
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@opentelemetry/sdk-node': false,
        'handlebars': false,
      };
    }
    
    return config;
  },
  serverExternalPackages: ['@genkit-ai/core', 'genkit'],
};

export default withPWA(nextConfig);
