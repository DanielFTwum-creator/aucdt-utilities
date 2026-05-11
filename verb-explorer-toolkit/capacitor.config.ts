import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.verbexplorer',
  appName: 'Verb Explorer',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#a8edea",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
    },
  },
};

export default config;
