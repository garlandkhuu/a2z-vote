import { useEffect, useState } from 'react';
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import db from './firebase';

export const CollectionContext = React.createContext();

export const CollectionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectionRef = collection(db, 'questions');

  //REALTIME GET FUNCTION
  useEffect(() => {
    const q = query(collectionRef, where('visible', '==', true), limit(1));

    setLoading(true);
    const unsub = onSnapshot(q, (querySnapshot) => {
      // const unsub = onSnapshot(collectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setQuestions(items);
      setLoading(false);
    });
    return () => {
      unsub();
    };

    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
        }}
      >
        <h1>Initializing...</h1>
      </div>
    );
  }

  return (
    <CollectionContext.Provider
      value={{
        questions,
        collectionRef,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};