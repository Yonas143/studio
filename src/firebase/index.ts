
import {initializeApp, getApps, type FirebaseApp} from 'firebase/app';
import {getAuth, type Auth} from 'firebase/auth';
import {getFirestore, type Firestore} from 'firebase/firestore';
import {firebaseConfig} from './config';

import {FirebaseProvider, useFirebaseApp, useFirestore, useAuth} from './provider';
import {FirebaseClientProvider} from './client-provider';
import { useUser } from './auth/use-user';
import { useCollection } from './firestore/use-collection';
import { useDoc } from './firestore/use-doc';


function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return {app, auth, firestore};
}


export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useFirebaseApp,
  useFirestore,
  useAuth,
  useUser,
  useCollection,
  useDoc
};
