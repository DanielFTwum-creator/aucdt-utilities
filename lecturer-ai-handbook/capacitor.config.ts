import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.techbridge.lecturerai',
  appName: 'LecturerAI',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#002147',
      androidSplashResourceName: 'splash',
      iosSplashResourceName: 'Default'
    }
  }
};

export default config;
