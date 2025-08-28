// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-fb409.firebaseapp.com",
  projectId: "mern-estate-fb409",
  storageBucket: "mern-estate-fb409.firebasestorage.app",
  messagingSenderId: "668369511122",
  appId: "1:668369511122:web:892efb31dcec65731bc30b"
};

// Initialize Firebase
export  const app = initializeApp(firebaseConfig);