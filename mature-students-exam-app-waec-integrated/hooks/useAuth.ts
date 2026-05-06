import { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// This configuration is Outside the hook as it should not be re-declared on every render.
const firebaseConfig = {
    apiKey: "AIzaSyCsPdbCCfpkOg202G7X_cWQQJYEWYwg4P8",
    authDomain: "msee-math-aptitude-test-v1.firebaseapp.com",
    projectId: "msee-math-aptitude-test-v1",
    storageBucket: "msee-math-aptitude-test-v1.appspot.com",
    messagingSenderId: "404202764482",
    appId: "msee-math-aptitude-test-v1"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

export const useAuth = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(!currentUser.isAnonymous);
      } else {
        // No user is signed in. App will proceed with a null user.
        setUser(null);
        setIsAdmin(false);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      // `onAuthStateChanged` will handle the user state change.
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return { user, isAuthReady, isAdmin, handleSignOut };
};
