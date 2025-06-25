// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO4VUHmf5SOh9pabWAFOMpM-M1Tuqk5dA",
  authDomain: "pagematch-3a257.firebaseapp.com",
  projectId: "pagematch-3a257",
  storageBucket: "pagematch-3a257.appspot.com",
  messagingSenderId: "326166433186",
  appId: "1:326166433186:web:8d2d21310fe935aaedb6fb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore
