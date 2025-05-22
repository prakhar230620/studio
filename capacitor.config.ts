
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeready.app', // TODO: Change to your unique app ID
  appName: 'Recipe Ready', // TODO: Change to your app name
  // webDir: 'out', // Commented out: Not needed when loading a remote URL
  bundledWebRuntime: false, // Recommended for modern web apps
  server: {
    // Replace with your Vercel deployment URL after deploying your Next.js app
    url: 'YOUR_DEPLOYED_NEXTJS_APP_URL', 
    cleartext: true, // Set to true if your URL is HTTP for local testing (not recommended for production)
                     // For Vercel (HTTPS), this can often be false or removed, but true is safer for initial setup.
    // allowNavigation: ['YOUR_DEPLOYED_NEXTJS_APP_URL'] // Optional: Restrict navigation to only your domain
  }
};

export default config;
