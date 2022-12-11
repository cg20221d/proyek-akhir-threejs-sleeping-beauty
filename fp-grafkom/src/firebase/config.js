// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0APgcvMKt4XU3jRB0fO9HAX3_doI3m48",
  authDomain: "minumbre-4fb57.firebaseapp.com",
  projectId: "minumbre-4fb57",
  storageBucket: "minumbre-4fb57.appspot.com",
  messagingSenderId: "74620809112",
  appId: "1:74620809112:web:a35484864d4da508f985ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const projectFirestore = firebase.firestore();
export { projectFirestore }