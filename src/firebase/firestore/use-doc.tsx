'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, type DocumentData, type DocumentReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useDoc<T = DocumentData>(pathOrRef: string | null | DocumentReference) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!pathOrRef) {
      setData(null);
      setLoading(false);
      return;
    }
    
    const docRef = typeof pathOrRef === 'string' ? doc(firestore, pathOrRef) : pathOrRef;

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData({ id: snapshot.id, ...snapshot.data() } as T);
      } else {
        setData(null); // Document does not exist
      }
      setLoading(false);
    }, (err) => {
      console.error(`Error fetching doc from ${docRef.path}:`, err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [firestore, pathOrRef]);

  return { data, loading, error };
}
