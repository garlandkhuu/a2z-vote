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
import { Typography } from '@mui/material';

// import VoterView from './VoterView';
// import ResultsView from './ResultsView';
import { CollectionContext } from './firebase/Collection';

function Voting() {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [answers, setAnswers] = useState([]);
  const [answerCount, setAnswerCount] = useState(2);
  const [custom, setCustom] = useState(false);
  const [customAnswer, setCustomAnswer] = useState('');

  const { questions, collectionRef } = useContext(CollectionContext);

  // ADD FUNCTION
  async function addQuestion() {
    const newQuestion = {
      title,
      question,
      visible: false,
      answers,
      custom,
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

  async function addAnswer(question) {
    const updatedAnswers = { answers: question.answers };
    updatedAnswers.answers.push({ text: customAnswer, total: 1 });

    try {
      const questionRef = doc(collectionRef, question.title);
      updateDoc(questionRef, updatedAnswers);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <Typography variant="h1" my={2} fontSize={36} fontWeight="600">Admin Panel</Typography>
      <div className='addQuestions'>
        <div className='inputBox'>
          <h2>Add a New Question</h2>
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
          <br />
          <br />
          <span>Custom answers</span>
          <input
            type='checkbox'
            onClick={(e) => {
              setCustom(e.target.checked);
            }}
          />
          {[...Array(answerCount)].map((x, i) => (
            <Fragment key={i}>
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
            </Fragment>
          ))}
          <div style={{ margin: '20px' }}>
            <button
              onClick={() => {
                setAnswerCount(answerCount + 1);
              }}
            >
              Add another answer
            </button>
            <button onClick={addQuestion}>Submit</button>
          </div>
        </div>
      </div>
      <hr />
      <div className='viewResults'>
        <h2>Results View</h2>
        {questions.map((question) =>
          question.visible ? (
            <div className='question' key={question.title}>
              <h2>Title: {question.title}</h2>
              <p>Question: {question.question}</p>
              <p>Answers:</p>
              {question.answers.map((answer, index) => (
                <div key={index}>
                  {answer.text}: {answer.total}
                </div>
              ))}
            </div>
          ) : (
            <></>
          )
        )}
      </div>
      <hr />
      <div className='viewQuestions'>
        <h2>Voting View</h2>
        {questions.length == 0 ? <h1>Wait for the next question!</h1> : null}
        {questions.map((question) =>
          question.visible ? (
            <div className='question' key={question.title}>
              <h2>Title: {question.title}</h2>
              <p>Question: {question.question}</p>
              {question.answers.map((answer, index) => (
                <div key={index}>
                  <button onClick={() => incrementTotal(question, index)}>
                    {answer.text}
                  </button>
                </div>
              ))}
              {question.custom ? (
                <Fragment>
                  <input
                    type='text'
                    value={customAnswer}
                    onChange={(e) => setCustomAnswer(e.target.value)}
                  />
                  <button
                    onClick={() => {
                      addAnswer(question);
                    }}
                  >
                    Submit
                  </button>
                </Fragment>
              ) : (
                <></>
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
