'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, type Query, type DocumentData, type CollectionReference, orderBy, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '../error-emitter';

export function useCollection<T = DocumentData>(path: string, options?: { where?: [string, any, any], orderBy?: [string, 'asc' | 'desc'], limit?: number }) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const optionsString = options ? JSON.stringify(options) : '';

  useEffect(() => {
    const parsedOptions = optionsString ? JSON.parse(optionsString) : {};
    let q: Query | CollectionReference = collection(firestore, path);
    
    if (parsedOptions.where) {
      q = query(q, where(...parsedOptions.where));
    }
    if (parsedOptions.orderBy) {
      q = query(q, orderBy(...parsedOptions.orderBy));
    }
    if (parsedOptions.limit) {
        q = query(q, limit(parsedOptions.limit));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: T[] = [];
      snapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(result);
      setLoading(false);
    }, (err: any) => {
      console.error(err);

      if (err.code === 'permission-denied') {
        setData([]);
        setLoading(false);
        setError(null);
        errorEmitter.emit('permission-error', {
          message: err.message,
          source: `useCollection: ${path}`,
        });
      } else {
        setError(err);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, path, optionsString]);

  return { data, loading, error };
}
