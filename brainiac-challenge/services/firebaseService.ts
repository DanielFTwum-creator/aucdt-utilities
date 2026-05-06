
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, setDoc } from 'firebase/firestore';
import { AuditLog } from '../types';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

export const isFirebaseEnabled = !!firebaseConfig.apiKey;

let auth: any;
let db: any;
let currentUser: User | null = null;

if (isFirebaseEnabled) {
    try {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (e) {
        console.error("Firebase initialization failed:", e);
    }
}

export const signIn = (): Promise<User | null> => {
    if (!isFirebaseEnabled || !auth) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            unsubscribe();
            if (user) {
                currentUser = user;
                resolve(user);
            } else {
                try {
                    const userCredential = await signInAnonymously(auth);
                    currentUser = userCredential.user;
                    resolve(currentUser);
                } catch (error) {
                    console.error("Anonymous sign-in failed:", error);
                    reject(error);
                }
            }
        }, reject);
    });
};

const getAuditLogCollection = () => {
    if (!db || !currentUser) throw new Error("Firebase not ready or user not signed in.");
    return collection(db, 'users', currentUser.uid, 'auditLogs');
};

export const addAuditLog = async (log: AuditLog): Promise<void> => {
    if (!isFirebaseEnabled) return;
    try {
        const auditLogRef = doc(getAuditLogCollection(), log.id);
        await setDoc(auditLogRef, log);
    } catch (error) {
        console.error("Error adding audit log to Firestore:", error);
        throw error;
    }
};

export const getAuditLogs = async (): Promise<AuditLog[]> => {
    if (!isFirebaseEnabled) return [];
    try {
        const q = query(getAuditLogCollection(), orderBy('timestamp', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        const logs: AuditLog[] = [];
        querySnapshot.forEach((doc) => {
            logs.push(doc.data() as AuditLog);
        });
        return logs;
    } catch (error) {
        console.error("Error fetching audit logs from Firestore:", error);
        throw error;
    }
};
