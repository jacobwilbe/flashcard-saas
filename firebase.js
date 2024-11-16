import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithCustomToken } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7nJEoPm3dpI0i057Ibg8p12O4_wA4DgY",
  authDomain: "flashcardsaas-a3122.firebaseapp.com",
  projectId: "flashcardsaas-a3122",
  storageBucket: "flashcardsaas-a3122.appspot.com",
  messagingSenderId: "443208372348",
  appId: "1:443208372348:web:2373b36ed04cc53672f9f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)

export async function signInWithClerk() {
  try {
    const response = await fetch('/api/auth/firebase-token');
    const { token } = await response.json();
    await signInWithCustomToken(auth, token);
  } catch (error) {
    console.error('Error signing in with Clerk:', error);
  }
}

export {db, auth};
