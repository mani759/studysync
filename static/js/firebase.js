// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfAQ0DTJTtU2SyJJVsJMUUX98CrG6rG0w",
  authDomain: "studysync-2fd4f.firebaseapp.com",
  projectId: "studysync-2fd4f",
  storageBucket: "studysync-2fd4f.firebasestorage.app",
  messagingSenderId: "860684500308",
  appId: "1:860684500308:web:a263fa09f4643b75c49cc1",
  measurementId: "G-W3598YNJQR"
};

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);
export {auth};
export{db};

console.log("Firebase loaded");