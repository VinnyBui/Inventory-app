import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBNcqArdzHg_tuC_O4gwK42-AZPc1cZVd8",
  authDomain: "inventory-system-b00ce.firebaseapp.com",
  projectId: "inventory-system-b00ce",
  storageBucket: "inventory-system-b00ce.appspot.com",
  messagingSenderId: "114285483332",
  appId: "1:114285483332:web:1e1a1d3e75d512dffaf311",
  measurementId: "G-8HNDYWZ2J7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();