// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAY0oz7gIxaKvCg0qJhZRmadVS2sjCBDoc",
  authDomain: "devlink-ee367.firebaseapp.com",
  projectId: "devlink-ee367",
  storageBucket: "devlink-ee367.appspot.com",
  messagingSenderId: "763943101996",
  appId: "1:763943101996:web:a13c6daf6d6a9805659389",
  measurementId: "G-P81WC5T471"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
