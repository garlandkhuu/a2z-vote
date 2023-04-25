import { useContext } from 'react';
import { Typography } from '@mui/material';

import { CollectionContext } from './firebase/Collection';
import ResultChart from './components/ResultChart';
import useIsMobile from './hooks/useIsMobile';

function Result() {
  const { questions } = useContext(CollectionContext);
  const activeQuestion = questions.find((question) => question.visible);
  const isMobile = useIsMobile();

  const chartOptions = {
    width:
      isMobile && document?.body?.clientWidth
        ? document?.body?.clientWidth - 110
        : 800,
    height:
      isMobile && document?.body?.clientHeight
        ? document?.body?.clientHeight - 126
        : 800,
    titleSize: isMobile ? 18 : 20,
    labelSize: isMobile ? 14 : 16,
  };
  return activeQuestion ? (
    <ResultChart question={activeQuestion} chartOptions={chartOptions} />
  ) : (
    <Typography variant='p'>Loading...</Typography>
  );
}

export default Result;
