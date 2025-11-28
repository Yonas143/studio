'use client';

import { useState, useEffect, type ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import { initializeFirebase, FirebaseProvider } from '.';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type FirebaseClientProviderProps = {
  children: ReactNode;
};

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage: FirebaseStorage;
  } | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const instances = initializeFirebase();
      setFirebase(instances);
    } catch (err: any) {
      console.error('Firebase initialization error:', err);
      setError(err);
    }
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Application Error</AlertTitle>
          <AlertDescription>
            Failed to initialize the application. Please check your configuration.
            <br />
            <span className="text-xs opacity-70 mt-2 block font-mono bg-black/10 p-2 rounded">
              {error.message}
            </span>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!firebase) {
    // You can show a loading spinner here
    return null;
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
      storage={firebase.storage}
    >
      {children}
    </FirebaseProvider>
  );
}
