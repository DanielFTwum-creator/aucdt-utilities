import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.tab',
  appName: 'Techbridge AI Blueprint',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
