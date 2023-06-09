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

import { CollectionContext } from '../firebase/Collection';
import {
  AppStateContext,
  ADD_ANSWER,
  CHANGE_ANSWER,
} from '../contexts/AppStateProvider';

function Voting() {
  const [customAnswer, setCustomAnswer] = useState('');
  const [customAnswerError, setCustomAnswerError] = useState('');

  const { questions, collectionRef } = useContext(CollectionContext);
  const {
    dispatch: dispatchAppState,
    hasSubmittedCurrent,
    answersCurrent,
  } = useContext(AppStateContext);

  const [selectedAnswers, setSelectedAnswers] = useState(
    answersCurrent?.answers || {}
  );
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (hasSubmittedCurrent) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [hasSubmittedCurrent]);

  useEffect(() => {
    setSelectedAnswers(answersCurrent?.answers || {});
  }, [questions]);

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

  async function decrementTotal(question, index) {
    const updateAnswers = { answers: question.answers };
    --updateAnswers.answers[index].total;

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

    dispatchAppState({
      type: ADD_ANSWER,
      payload: { title: question.title, answers: selectedAnswers },
    });
  };

  const handleResubmit = (question) => {
    const totalSelected = Object.keys(selectedAnswers).length;
    if (totalSelected == 0) return;

    Object.keys(answersCurrent.answers).forEach((i) => {
      decrementTotal(question, i);
    });

    Object.keys(selectedAnswers).forEach((i) => {
      incrementTotal(question, i);
    });

    dispatchAppState({
      type: CHANGE_ANSWER,
      payload: { title: question.title, answers: selectedAnswers },
    });

    setDisabled(true);
  };

  return (
    <Fragment>
      <div className='viewQuestions'>
        {questions.length == 0 ? (
          <div>
            <h1 className='header'>April Town Hall Voting Portal</h1>
            <div className='standby-subheader'>
              Stand by for the next spicy question
              <div className='loader' />
            </div>
          </div>
        ) : null}
        {questions.map((question) =>
          question.visible ? (
            <div className='question' key={question.title}>
              <Typography
                variant='h2'
                fontSize={24}
                fontWeight={600}
                mb={3}
                mt={1}
              >
                {question.question}
              </Typography>

              {question.questionImages ? (
                question.questionImages.map((image, index) => (
                  <Fragment key={`${image}-${index}`}>
                    <div className='image-container'>
                      <h3 className='image-label'>{image.label}</h3>
                      <br />
                      <img src={image.src} alt='' className='example-image' />
                    </div>
                  </Fragment>
                ))
              ) : (
                <Fragment />
              )}

              {question.multipleSelection
                ? question.answers.map((answer, index) => (
                    <div key={index}>
                      <input
                        type='checkbox'
                        name={answer.text}
                        value={index}
                        disabled={disabled}
                        defaultChecked={Object.keys(
                          answersCurrent?.answers || {}
                        ).includes(String(index))}
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
                      <button
                        disabled={disabled}
                        onClick={() => {
                          setSelectedAnswers({ [index]: true });
                        }}
                        style={
                          // Radio button effect
                          Object.keys(selectedAnswers).includes(
                            String(index)
                          ) ||
                          (Object.keys(answersCurrent?.answers || {}).includes(
                            String(index)
                          ) &&
                            disabled)
                            ? { backgroundColor: '#bfcaff' }
                            : {}
                        }
                      >
                        {answer.text}
                      </button>
                    </div>
                  ))}
              {question.custom ? (
                <Box>
                  <input
                    type='text'
                    value={customAnswer}
                    maxlength='30'
                    disabled={disabled}
                    onChange={(e) => {
                      setCustomAnswerError('');
                      setCustomAnswer(e.target.value);
                    }}
                  />
                  <button
                    disabled={disabled}
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
              {hasSubmittedCurrent ? (
                disabled ? (
                  <button
                    className='edit-button'
                    onClick={() => setDisabled(false)}
                  >
                    Edit Answer
                  </button>
                ) : (
                  <button
                    className='submit-button'
                    onClick={() => handleResubmit(question)}
                  >
                    Resubmit
                  </button>
                )
              ) : (
                <button
                  className='submit-button'
                  onClick={() => {
                    handleSubmit(question);
                  }}
                >
                  Submit
                </button>
              )}
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
