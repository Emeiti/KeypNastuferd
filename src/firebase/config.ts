import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDHvemcftiN1L_VC-xHXXQGKR2wW6en9Ro",
  authDomain: "paddel-booking-tracker.firebaseapp.com",
  projectId: "paddel-booking-tracker",
  storageBucket: "paddel-booking-tracker.firebasestorage.app",
  messagingSenderId: "290253000292",
  appId: "1:290253000292:web:39fb11e44d988b243dd971"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

export { db };