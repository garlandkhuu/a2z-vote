import React, { useState, useEffect, Fragment, useContext } from 'react';
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

function Voting() {
  const colletionRef = collection(db, 'questions');

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  //REALTIME GET FUNCTION
  useEffect(() => {
    const q = query(
      colletionRef
      //  where('owner', '==', currentUserId),
      //   where('title', '==', 'School1') // does not need index
      //  where('score', '<=', 100) // needs index  https://firebase.google.com/docs/firestore/query-data/indexing?authuser=1&hl=en
      // orderBy('score', 'asc'), // be aware of limitations: https://firebase.google.com/docs/firestore/query-data/order-limit-data#limitations
      // limit(1)
    );

    setLoading(true);
    // const unsub = onSnapshot(q, (querySnapshot) => {
    const unsub = onSnapshot(colletionRef, (querySnapshot) => {
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
      const questionRef = doc(colletionRef, newQuestion.title);
      await setDoc(questionRef, newQuestion);
    } catch (error) {
      console.error(error);
    }
  }

  // EDIT FUNCTION
  async function editQuestion(question, index) {
    const updateAnswers = { answers: question.answers };
    ++updateAnswers.answers[index].total;

    try {
      const questionRef = doc(colletionRef, question.title);
      updateDoc(questionRef, updateAnswers);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <h1>Voting/Questions POC</h1>
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
        <h6>Answer 1</h6>
        <input
          type='text'
          value={answer1}
          onChange={(e) => setAnswer1(e.target.value)}
        />
        <h6>Answer 2</h6>
        <input
          type='text'
          value={answer2}
          onChange={(e) => setAnswer2(e.target.value)}
        />
        <h6>Add your answer</h6>
        <button
          onClick={() => {
            setAnswers([
              { text: answer1, total: 0 },
              { text: answer2, total: 0 },
            ]);
            addQuestion();
          }}
        >
          Submit
        </button>
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
                <button onClick={() => editQuestion(question, index)}>
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

export default Voting;
