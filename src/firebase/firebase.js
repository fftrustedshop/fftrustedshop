import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDzQQw7Jol5hDOOY9mknAyVuHUO2uIY9Fg",
  authDomain: "fftrustedshop-5bd61.firebaseapp.com",
  projectId: "fftrustedshop-5bd61",
  storageBucket: "fftrustedshop-5bd61.firebasestorage.app",
  messagingSenderId: "1069927716447",
  appId: "1:1069927716447:web:402532d0fa9e47f07b6dea",
  measurementId: "G-5WY7NFL56G"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);