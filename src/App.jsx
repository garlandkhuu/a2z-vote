import { CollectionProvider } from './firebase/Collection';
import Voting from './Voting';

function App() {
  return (
    <CollectionProvider>
      <Voting />
    </CollectionProvider>
  );
}

export default App;
