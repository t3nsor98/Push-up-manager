// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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

function initializeFirebase() {
  return app;
}
function getFirebaseAnalytics() {
  return analytics;
}

// Export the functions
export { initializeFirebase, getFirebaseAnalytics };