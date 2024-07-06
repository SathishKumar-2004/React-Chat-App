// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage"

// web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "react-chat-79c4c.firebaseapp.com",
  projectId: "react-chat-79c4c",
  storageBucket: "react-chat-79c4c.appspot.com",
  messagingSenderId: "1018388104754",
  appId: "1:1018388104754:web:7106e7e569520b4bc05e2b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 

export const authentication = getAuth()
export const db = getFirestore()
export const storage = getStorage()