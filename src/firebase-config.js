// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAH4sR9oDNnr67o9W8NiKKdEe4PWMxyn40",
  authDomain: "headstarter-app.firebaseapp.com",
  projectId: "headstarter-app",
  storageBucket: "headstarter-app.appspot.com",
  messagingSenderId: "1077534116138",
  appId: "1:1077534116138:web:327e222830701e20fdf653",
  measurementId: "G-CER4BZFCJS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
