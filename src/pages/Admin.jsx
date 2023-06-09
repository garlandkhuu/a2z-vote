import { useState, Fragment, useContext } from 'react';
import {
  Typography,
  Box,
  TextField,
  Paper,
  Autocomplete,
  Button,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EditIcon from '@mui/icons-material/Edit';
import EditOffIcon from '@mui/icons-material/EditOff';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import { doc, updateDoc, setDoc } from 'firebase/firestore';

import { CollectionContext } from '../firebase/Collection';

function Admin() {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [questionImages, setQuestionImages] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answerCount, setAnswerCount] = useState(2);
  const [custom, setCustom] = useState(false);
  const [multipleSelection, setMultipleSelection] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(localStorage.getItem('admin'));
  const [loginError, setLoginError] = useState(false);

  const { allQuestions, questions, collectionRef } =
    useContext(CollectionContext);

  // ADD FUNCTION
  async function addQuestion() {
    const newQuestion = {
      title,
      question,
      visible: false,
      questionImages,
      answers,
      custom,
      multipleSelection,
    };

    try {
      const questionRef = doc(collectionRef, newQuestion.title);
      await setDoc(questionRef, newQuestion);
    } catch (error) {
      console.error(error);
    }
  }

  async function addQuestionImage() {
    const newImage = {
      label:'',
      src:''
    };

    let images = [...questionImages];
    images.push(newImage);
    await setQuestionImages(images);
  }

  const makeVisible = async (title) => {
    try {
      allQuestions.forEach((question) => {
        if (question.visible) {
          const questionRef = doc(collectionRef, question.title);
          updateDoc(questionRef, { visible: false });
        }
        if (question.title === title) {
          const questionRef = doc(collectionRef, question.title);
          updateDoc(questionRef, { visible: true });
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      sx={{ width: 'calc(100vw - 80px)' }}
    >
      {login ? (
        <Fragment>
          <Typography variant='h1' my={2}>
            Admin Panel
          </Typography>
          <Box m={2}>
            <Typography variant='h2' my={2}>
              All Results
            </Typography>
            <div>
              <Typography>Visible Question</Typography>
              <Autocomplete
                disableClearable
                value={questions[0]?.title ?? 'empty'}
                onChange={(e, newValue) => {
                  makeVisible(newValue);
                }}
                options={allQuestions.map((question) => question.title)}
                renderInput={(params) => (
                  <TextField {...params} variant='outlined' />
                )}
              />
            </div>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {allQuestions.map((question) => (
                <Box m={2} key={question.title}>
                  <Paper
                    elevation={10}
                    sx={{
                      backgroundColor: 'rgb(18, 18, 18)',
                      color: 'rgb(255, 255, 255)',
                    }}
                  >
                    <Box p={2}>
                      <Typography variant='h5'>{question.title}</Typography>
                      <Typography>Question: {question.question}</Typography>
                      <Box display='flex'>
                        <Typography>
                          {question.visible ? (
                            <VisibilityIcon color='primary' />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </Typography>
                        <Typography>
                          {question.custom ? (
                            <EditIcon color='primary' />
                          ) : (
                            <EditOffIcon />
                          )}
                        </Typography>
                        <Typography>
                          {question.multipleSelection ? (
                            <DoneAllIcon color='primary' />
                          ) : (
                            <DoneIcon />
                          )}
                        </Typography>
                      </Box>
                      <Typography>Answers:</Typography>
                      {question.answers.map((answer, index) => (
                        <Typography key={index}>
                          {answer.text}: {answer.total}
                        </Typography>
                      ))}
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
          <Box m={2}>
            <Typography variant='h2' my={2}>
              Add a New Question
            </Typography>
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
            
            {questionImages.map((image, index) => (
                <Fragment key={`image-${index}`} >
                  <h6>Image{index} Label/title</h6>
                  <input 
                    type='text' 
                    value={image.label} 
                    
                    onChange={(e) => {
                      let updatedImages = [...questionImages];
                      updatedImages[index].label = e.target.value;
                      setQuestionImages(updatedImages)
                    }}/>
                  <br/>
                  <br/>
                  <h6>Image{index} src</h6>
                  <input 
                    type='text' 
                    value={image.src} 
                    
                    onChange={(e) => {
                      let updatedImages = [...questionImages];
                      updatedImages[index].src = e.target.value;
                      setQuestionImages(updatedImages)
                    }}/>
                </Fragment>
                
            ))}

            <br />
            <br />
            <button
                onClick={() => {
                  addQuestionImage();
                }}
              >
                Add a supporting Image?
            </button>
            <br />
            <br />
            <span>Custom answers</span>
            <input
              type='checkbox'
              onClick={(e) => {
                setCustom(e.target.checked);
              }}
            />
            <br />
            <span>Allow multiple selection</span>
            <input
              type='checkbox'
              onClick={(e) => {
                setMultipleSelection(e.target.checked);
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
          </Box>
        </Fragment>
      ) : (
        <Box
          component='form'
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete='off'
        >
          <TextField
            error={loginError}
            id='username-input'
            label='Username'
            variant='outlined'
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            error={loginError}
            id='password-input'
            label='Password'
            type='password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="login-btn"
            onClick={() => {
              // Shhh don't look over here
              if (username === 'admin' && password === 'townhalladmin') {
                localStorage.setItem('admin', true);
                setLogin(true);
              } else {
                setLoginError(true);
              }
            }}
          >
            Login
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default Admin;
