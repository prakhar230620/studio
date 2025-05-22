
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeready.app', // TODO: Change to your unique app ID
  appName: 'Recipe Ready', // TODO: Change to your app name
  webDir: 'out', // Corresponds to `next export` output directory
  bundledWebRuntime: false, // Recommended for modern web apps
  // If you decide to load a remote URL (Option 1 for Genkit):
  // server: {
  //   url: 'YOUR_DEPLOYED_NEXTJS_APP_URL',
  //   cleartext: true, // If your deployed URL is HTTP for local testing (not recommended for prod)
  //   allowNavigation: ['YOUR_DEPLOYED_NEXTJS_APP_URL'] // Allow navigation only to your domain
  // }
};

export default config;
