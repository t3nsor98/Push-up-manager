// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCpR8QcSEItw2jhONzDFmvd_ekn_h9FLQ",
  authDomain: "exercise-manager-7f3ee.firebaseapp.com",
  projectId: "exercise-manager-7f3ee",
  storageBucket: "exercise-manager-7f3ee.firebasestorage.app",
  messagingSenderId: "655231297084",
  appId: "1:655231297084:web:9775cbc84949bf2e048539",
  measurementId: "G-V30DDWWKQK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Export the functions
export { analytics, app, auth, provider, db };
