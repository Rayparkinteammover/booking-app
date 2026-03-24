import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPNtbV0ARjzXTnRi_7AFaDHUK4JLs4QQo",
  authDomain: "team-mover-test.firebaseapp.com",
  projectId: "team-mover-test",
  storageBucket: "team-mover-test.firebasestorage.app",
  messagingSenderId: "394107444705",
  appId: "1:394107444705:web:c3d312b95e758a565d06a0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);