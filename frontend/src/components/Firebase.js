// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7D6dkG4Og6TvU1z-kwcMQFvP_9AEuc0g",
  authDomain: "tandoori-cafe-17023.firebaseapp.com",
  projectId: "tandoori-cafe-17023",
  storageBucket: "tandoori-cafe-17023.firebasestorage.app",
  messagingSenderId: "849583161304",
  appId: "1:849583161304:web:ac2379e7e4f8c6fdadfcad",
  measurementId: "G-WBQ3H1NV4P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
