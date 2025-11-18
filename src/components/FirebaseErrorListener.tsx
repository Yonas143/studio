
'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

// This is a client-side only component that will listen for
// 'permission-error' events and throw them as uncaught exceptions
// to be picked up by Next.js's error overlay.
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: Error) => {
      // Throwing the error here will cause it to be caught by the Next.js
      // development error overlay, which is what we want for debugging.
      // In production, this should be handled by a proper error boundary.
      setTimeout(() => {
        throw error;
      }, 0);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null; // This component does not render anything.
}
