import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWE50HwDkD2b0zrt30S7EeRMfa10038n4",
  authDomain: "tandoori-cafe.firebaseapp.com",
  projectId: "tandoori-cafe",
  storageBucket: "tandoori-cafe.appspot.com",
  messagingSenderId: "373797896097",
  appId: "1:373797896097:web:9012fade31e3dccc7515e0",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
