import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.ai.blueprint',
  appName: 'Techbridge AI Blueprint',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
