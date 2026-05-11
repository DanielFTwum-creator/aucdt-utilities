// This service is a remnant of a previous architecture and is now only used as a potential
// fallback for offline functionality. The primary data source and authentication provider
// is the Node.js backend server connected to a MySQL database.

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';


// These variables are expected to be populated by the build environment or a script tag.
declare global {
  var __firebase_config: string | undefined;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  const firebaseConfigStr = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
  const firebaseConfig = JSON.parse(firebaseConfigStr);

  if (Object.keys(firebaseConfig).length > 0 && firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
    if (!getApps().length) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }
    db = getFirestore(app);
  } else {
    console.warn("Firebase configuration is missing. The application will rely solely on the backend server. Offline features may be limited.");
  }
} catch (error) {
  console.error("Error initializing Firebase for offline fallback:", error);
}

export { app, db };