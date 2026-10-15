
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC87uY77N61DV2sT8QGW1Lu2cmeZ6Pfz2Q",
  authDomain: "clone-e1fa0.firebaseapp.com",
  projectId: "clone-e1fa0",
  storageBucket: "clone-e1fa0.firebasestorage.app",
  messagingSenderId: "1086354442997",
  appId: "1:1086354442997:web:af3af2ae04f711e1e413bc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

export { app, auth, db };

