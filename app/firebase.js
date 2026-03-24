import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  // 본인 config
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// ⭐ 추가
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();