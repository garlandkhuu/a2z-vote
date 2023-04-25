import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

import { CollectionProvider } from './firebase/Collection';
import { AppStateProvider } from './contexts/AppStateProvider';
import Voting from './pages/Voting';
import Admin from './pages/Admin';
import Result from './pages/Result';
import useIsMobile from './hooks/useIsMobile';

function App() {
  const isMobile = useIsMobile();
  return (
    <Box p={isMobile ? 2 : 5}>
      <CollectionProvider>
        <AppStateProvider>
          <Routes>
            <Route path='/' element={<Voting />} />
            <Route path='admin' element={<Admin />} />
            <Route path='result' element={<Result />} />
          </Routes>
        </AppStateProvider>
      </CollectionProvider>
    </Box>
  );
}

export default App;
