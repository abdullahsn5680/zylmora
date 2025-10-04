// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// const firebaseConfig = {
//   apiKey: "AIzaSyCsaolOkm_j7evgSV-tvHkrvXCg71GZyKw",
//   authDomain: "zymora-b0af8.firebaseapp.com",
//   projectId: "zymora-b0af8",
//   storageBucket: "zymora-b0af8.firebasestorage.app",
//   messagingSenderId: "15891351117",
//   appId: "1:15891351117:web:b844183a3397d20f067e04",
//   measurementId: "G-RC1VGCF8DW"
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



