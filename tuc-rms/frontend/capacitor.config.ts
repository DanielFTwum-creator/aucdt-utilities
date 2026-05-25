import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.tucrms',
  appName: 'TUC Results',
  webDir: 'dist',
  server: {
    hostname: 'ai-tools.techbridge.edu.gh',
    androidScheme: 'https',
    iosScheme: 'https',
    cleartext: false,
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    allowsLinkPreview: false,
    backgroundColor: '#6B0020',
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#6B0020',
    captureInput: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#6B0020',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'large',
    },
  },
};

export default config;
