import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.orbitwalk',
  appName: 'Orbit Walk',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
