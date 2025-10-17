// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDr8vA9bANWyWzvraQDGFpVW509zdA7CfY',
  authDomain: 'vynce-8ebe4.firebaseapp.com',
  projectId: 'vynce-8ebe4',
  storageBucket: 'vynce-8ebe4.firebasestorage.app',
  messagingSenderId: '783559511745',
  appId: '1:783559511745:web:b17f42ad801138b81a8e40',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
