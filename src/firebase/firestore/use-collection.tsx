'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, collection, query, where, type Query, type DocumentData, type CollectionReference } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

export function useCollection<T = DocumentData>(path: string, options?: { where?: [string, any, any] }) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const whereString = options?.where ? JSON.stringify(options.where) : '';

  useEffect(() => {
    const whereClause = whereString ? JSON.parse(whereString) : undefined;
    let q: Query | CollectionReference = collection(firestore, path);
    
    if (whereClause) {
      q = query(q, where(...whereClause));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result: T[] = [];
      snapshot.forEach(doc => {
        result.push({ id: doc.id, ...doc.data() } as T);
      });
      setData(result);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, path, whereString]);

  return { data, loading, error };
}
