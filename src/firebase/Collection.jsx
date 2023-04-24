import { useEffect, useState } from 'react';
import {
  onSnapshot,
  collection,
  query,
  where,
  limit,
} from 'firebase/firestore';
import db from './firebase';

export const CollectionContext = React.createContext();

export const CollectionProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const collectionRef = collection(db, 'questions');

  //REALTIME GET FUNCTION
  useEffect(() => {
    const q = query(collectionRef, where('visible', '==', true), limit(1));

    setLoading(true);
    const unsubVisibleQuestion = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setQuestions(items);
      setLoading(false);
    });
    const unsubAllQuestions = onSnapshot(collectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      setAllQuestions(items);
      setLoading(false);
    });
    return () => {
      unsubVisibleQuestion();
      unsubAllQuestions();
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
        allQuestions,
        questions,
        collectionRef,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
};
