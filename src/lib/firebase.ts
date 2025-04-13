import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { RecaptchaVerifier } from 'firebase/auth';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBRe-alFvroLc2pDtm43agABkXprTi63Vg",
  authDomain: "team-leader-c82cc.firebaseapp.com",
  projectId: "team-leader-c82cc",
  storageBucket: "team-leader-c82cc.firebasestorage.app",
  messagingSenderId: "564896336771",
  appId: "1:564896336771:web:a1e9a7c2a765bcc94104b6"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Add reCAPTCHA verification
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}