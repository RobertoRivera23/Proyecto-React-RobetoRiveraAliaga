// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDjWDsDCk09L-82TcrUCAhBwFILDuVStNs",
  authDomain: "mi-ecomerce-react-rr.firebaseapp.com",
  projectId: "mi-ecomerce-react-rr",
  storageBucket: "mi-ecomerce-react-rr.firebasestorage.app",
  messagingSenderId: "872110200933",
  appId: "1:872110200933:web:f2ffa500701b231af44e8c",
  measurementId: "G-XJKGYCPDCX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth= getAuth(app);

//pasamos la bd a una variable

export { db, auth };