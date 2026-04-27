import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCN9aPitRKzo34WPzpEGq_EwFcKw1qNpsk",
  authDomain: "meu-app-financeiro-d3f14.firebaseapp.com",
  projectId: "meu-app-financeiro-d3f14",
  storageBucket: "meu-app-financeiro-d3f14.firebasestorage.app",
  messagingSenderId: "1057365258804",
  appId: "1:1057365258804:web:b16d57df9caeb56f1a5061",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
