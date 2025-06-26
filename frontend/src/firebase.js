// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO4VUHmf5SOh9pabWAFOMpM-M1Tuqk5dA",
  authDomain: "pagematch-3a257.firebaseapp.com",
  projectId: "pagematch-3a257",
  storageBucket: "pagematch-3a257.appspot.com",
  messagingSenderId: "326166433186",
  appId: "1:326166433186:web:8d2d21310fe935aaedb6fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Optional: Add auth state debugger
onAuthStateChanged(auth, (user) => {
  console.log('Current user:', user ? user.uid : 'No user');
  if (!app) throw new Error("Firebase not initialized");
});

export { auth, db };  // Only export after full initialization