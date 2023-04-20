import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAGzxOyRiuQcizHxjXR2GI09E1nD2M4L20",
  authDomain: "townhall-375b3.firebaseapp.com",
  projectId: "townhall-375b3",
  storageBucket: "townhall-375b3.appspot.com",
  messagingSenderId: "448402437246",
  appId: "1:448402437246:web:1b16966b1c55145f19142f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();

export default getFirestore(app);