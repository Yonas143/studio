import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getStorage, Storage } from 'firebase-admin/storage';

let app: App;
let firestore: Firestore;
let auth: Auth;
let storage: Storage;

/**
 * Initialize Firebase Admin SDK
 * Uses Application Default Credentials in production
 * For local development, set GOOGLE_APPLICATION_CREDENTIALS environment variable
 */
export function initializeFirebaseAdmin() {
    if (getApps().length === 0) {
        // In production (Firebase/GCP), use Application Default Credentials
        // In development, you can use a service account key file
        app = initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
    } else {
        app = getApps()[0];
    }

    firestore = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);

    return { app, firestore, auth, storage };
}

/**
 * Get Firebase Admin Firestore instance
 */
export function getAdminFirestore(): Firestore {
    if (!firestore) {
        const initialized = initializeFirebaseAdmin();
        return initialized.firestore;
    }
    return firestore;
}

/**
 * Get Firebase Admin Auth instance
 */
export function getAdminAuth(): Auth {
    if (!auth) {
        const initialized = initializeFirebaseAdmin();
        return initialized.auth;
    }
    return auth;
}

/**
 * Get Firebase Admin Storage instance
 */
export function getAdminStorage(): Storage {
    if (!storage) {
        const initialized = initializeFirebaseAdmin();
        return initialized.storage;
    }
    return storage;
}
