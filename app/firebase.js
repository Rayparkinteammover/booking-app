import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTzhugHaCNAUKgHUphZT2L9yhEIS0Wt6I",
  authDomain: "booking-app-465e4.firebaseapp.com",
  projectId: "booking-app-465e4",
  storageBucket: "booking-app-465e4.firebasestorage.app",
  messagingSenderId: "189934759712",
  appId: "1:189934759712:web:707cd80d7439bc4ff6f145"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);