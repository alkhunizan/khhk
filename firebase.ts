// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDLKXb0DO78r1Dp8KsL4iLKLAF4yG4CS3A",
  authDomain: "monthly-ee5fe.firebaseapp.com",
  projectId: "monthly-ee5fe",
  storageBucket: "monthly-ee5fe.firebasestorage.app",
  messagingSenderId: "102271009552",
  appId: "1:102271009552:web:38344a6d04b62cbd785b95",
  measurementId: "G-JHXGWLQ5P1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
