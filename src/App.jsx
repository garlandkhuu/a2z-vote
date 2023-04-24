import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import { CollectionProvider } from './firebase/Collection';
import Voting from './Voting';
import Admin from './Admin';
import Result from './Result';

function App() {
  return (
    <CollectionProvider>
      <Box p={5}>
        <Routes>
          <Route path='/' element={<Voting />} />
          <Route path='admin' element={<Admin />} />
          <Route path='result' element={<Result />} />
        </Routes>
      </Box>
    </CollectionProvider>
  );
}

export default App;
