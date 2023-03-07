import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyARzjIk24RqasgstRMBv6uAHCxcZ7qUonw",
  authDomain: "blog-52ab1.firebaseapp.com",
  projectId: "blog-52ab1",
  storageBucket: "blog-52ab1.appspot.com",
  messagingSenderId: "507833642546",
  appId: "1:507833642546:web:0678d310589d90fa13962b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
