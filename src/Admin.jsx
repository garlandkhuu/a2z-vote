import { useState, useEffect, Fragment, useContext } from 'react';
import { Typography } from '@mui/material';
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
import db from './firebase/firebase';

function Admin() {
  const collectionRef = collection(db, 'questions');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [answerCount, setAnswerCount] = useState(2);

  //REALTIME GET FUNCTION
  useEffect(() => {
    const q = query(
      collectionRef
      //  where('owner', '==', currentUserId),
      //   where('title', '==', 'School1') // does not need index
      //  where('score', '<=', 100) // needs index  https://firebase.google.com/docs/firestore/query-data/indexing?authuser=1&hl=en
      // orderBy('score', 'asc'), // be aware of limitations: https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations
      // limit(1)
    );

    setLoading(true);
    // const unsub = onSnapshot(q, (querySnapshot) => {
    const unsub = onSnapshot(collectionRef, (querySnapshot) => {
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

  // ADD FUNCTION
  async function addQuestion() {
    const newQuestion = {
      title,
      question,
      visible: false,
      answers,
    };

    try {
      const questionRef = doc(collectionRef, newQuestion.title);
      await setDoc(questionRef, newQuestion);
    } catch (error) {
      console.error(error);
    }
  }

  // EDIT FUNCTION
  async function incrementTotal(question, index) {
    const updateAnswers = { answers: question.answers };
    ++updateAnswers.answers[index].total;

    try {
      const questionRef = doc(collectionRef, question.title);
      updateDoc(questionRef, updateAnswers);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <Typography variant="h1" my={2} fontSize={36} fontWeight="600">Admin Panel</Typography>
      <div className='inputBox'>
        <h3>Add New</h3>
        <h6>Title</h6>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <h6>Add your question</h6>
        <input
          type='text'
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {[...Array(answerCount)].map((x, i) => (
          <>
            <h6>Answer {i + 1}</h6>
            <input
              type='text'
              value={answers[i]?.text ?? ''}
              onChange={(e) => {
                let newAnswers = [...answers];
                if (newAnswers[i]) {
                  newAnswers[i].text = e.target.value;
                } else {
                  newAnswers.push({ text: e.target.value, total: 0 });
                }
                setAnswers(newAnswers);
              }}
            />
            {i + 1 > 2 ? (
              <button
                onClick={() => {
                  let newAnswers = [...answers];
                  newAnswers.splice(i, 1);
                  setAnswers(newAnswers);
                  setAnswerCount(answerCount - 1);
                }}
              >
                X
              </button>
            ) : (
              <></>
            )}
          </>
        ))}
        <button
          onClick={() => {
            setAnswerCount(answerCount + 1);
          }}
        >
          Add another answer
        </button>
        <button onClick={addQuestion}>Submit</button>
      </div>
      <hr />
      {loading ? <h1>Loading...</h1> : null}
      {questions.map((question) =>
        question.visible ? (
          <div className='question' key={question.title}>
            <h2>{question.title}</h2>
            <p>{question.question}</p>
            {question.answers.map((answer, index) => (
              <div key={index}>
                <button onClick={() => incrementTotal(question, index)}>
                  {answer.text}
                </button>{' '}
                <p>{answer.total}</p>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )
      )}
    </Fragment>
  );
}

export default Admin;
