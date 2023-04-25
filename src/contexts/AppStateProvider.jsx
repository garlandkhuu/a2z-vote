import {
  useState,
  useEffect,
  useReducer,
  useContext,
  createContext,
} from 'react';
import { CollectionContext } from '../firebase/Collection';

const APP_STATE_KEY = 'appState';
export const ADD_ANSWER = 'ADD_ANSWER';
export const CHANGE_ANSWER = 'CHANGE_ANSWER';

export const AppStateContext = createContext(null);

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_ANSWER: {
      // Don't add question if already stored
      if (
        state.submitted.some(
          (question) => question.title === action.payload.title
        )
      ) {
        return state;
      }
      state.submitted.push(action.payload);
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
      return state;
    }
    case CHANGE_ANSWER: {
      const newSubmitted = state.submitted.filter(
        (question) => question.title !== action.payload.title
      );
      newSubmitted.push(action.payload);
      state.submitted = newSubmitted;
      localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
      return state;
    }
  }
};

export const AppStateProvider = ({ children }) => {
  const defaultSettings = JSON.parse(
    localStorage.getItem(APP_STATE_KEY) || '{"submitted":[]}'
  );
  const [appState, dispatch] = useReducer(reducer, defaultSettings);
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState();

  const { questions } = useContext(CollectionContext);
  const activeQuestion = questions[0] ?? {};
  const answersCurrent = appState.submitted.find(
    (question) => question.title === activeQuestion?.title
  );

  // Toggle hasSubmittedCurrent depending if user submits or if question changes
  useEffect(() => {
    if (
      appState.submitted.some(
        (question) => question.title === activeQuestion?.title
      )
    ) {
      setHasSubmittedCurrent(true);
    } else {
      setHasSubmittedCurrent(false);
    }
  }, [appState, activeQuestion]);

  const value = { appState, dispatch, hasSubmittedCurrent, answersCurrent };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};
