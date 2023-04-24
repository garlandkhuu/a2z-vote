import { useState, useEffect, Fragment, useContext } from 'react';
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
import { Typography, Box } from '@mui/material';

import { CollectionContext } from './firebase/Collection';

function Voting() {
  const [customAnswer, setCustomAnswer] = useState('');
  const [customAnswerError, setCustomAnswerError] = useState('');
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const { questions, collectionRef } = useContext(CollectionContext);

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

  async function addAnswer(question) {
    if (!customAnswer.trim()) {
      setCustomAnswerError('Enter a new custom answer.');
      return;
    }

    const existingAnswers = question.answers
      .map((answer) => answer.text)
      .filter(
        (answer) => answer.toLowerCase() == customAnswer.toLowerCase().trim()
      );

    if (existingAnswers.length > 0) {
      setCustomAnswerError('Answer has already been added!');
      return;
    } else {
      setCustomAnswerError('');
    }

    const updatedAnswers = { answers: question.answers };
    updatedAnswers.answers.push({
      text: customAnswer,
      total: question.multipleSelection ? 0 : 1,
    });

    try {
      const questionRef = doc(collectionRef, question.title);
      updateDoc(questionRef, updatedAnswers);
      setCustomAnswer('');
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (question) => {
    const totalSelected = Object.keys(selectedAnswers).length;
    if (totalSelected == 0) return;

    Object.keys(selectedAnswers).forEach((i) => {
      incrementTotal(question, i);
    });
  };

  return (
    <Fragment>
      <div className='viewQuestions'>
        <h2>Voting View</h2>
        {questions.length == 0 ? <h1>Wait for the next question!</h1> : null}
        {questions.map((question) =>
          question.visible ? (
            <div className='question' key={question.title}>
              <h2>Title: {question.title}</h2>
              <p>Question: {question.question}</p>
              {question.multipleSelection
                ? question.answers.map((answer, index) => (
                    <div key={index}>
                      <input
                        type='checkbox'
                        name={answer.text}
                        value={index}
                        onClick={(e) => {
                          const newSelection = { ...selectedAnswers };
                          if (e.target.checked) {
                            newSelection[index] = e.target.checked;
                          } else {
                            delete newSelection[index];
                          }
                          setSelectedAnswers(newSelection);
                        }}
                      />
                      <label>{answer.text}</label>
                    </div>
                  ))
                : question.answers.map((answer, index) => (
                    <div key={index}>
                      <button onClick={() => incrementTotal(question, index)}>
                        {answer.text}
                      </button>
                    </div>
                  ))}
              {question.custom ? (
                <Box>
                  <input
                    type='text'
                    value={customAnswer}
                    onChange={(e) => {
                      setCustomAnswerError('');
                      setCustomAnswer(e.target.value);
                    }}
                  />
                  <button
                    onClick={() => {
                      addAnswer(question);
                    }}
                  >
                    Add New Answer
                  </button>
                  {customAnswerError ? (
                    <Typography variant='body1' color='red' my={2}>
                      {customAnswerError}
                    </Typography>
                  ) : (
                    <></>
                  )}
                </Box>
              ) : (
                <></>
              )}
              <button
                onClick={() => {
                  handleSubmit(question);
                }}
              >
                Submit
              </button>
            </div>
          ) : (
            <></>
          )
        )}
      </div>
    </Fragment>
  );
}

export default Voting;
