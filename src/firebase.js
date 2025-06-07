import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Voeg je Firebase-configuratie hier toe
const firebaseConfig = {
  apiKey: "AIzaSyAaEqjnND0nDkE4G7nkUUFPTi0FWx9j7uU",
  authDomain: "easyplanner-c738d.firebaseapp.com",
  projectId: "easyplanner-c738d",
  storageBucket: "easyplanner-c738d.firebasestorage.app",
  messagingSenderId: "540122887560",
  appId: "1:540122887560:web:4d655dc36d687bb36bb63d",
  measurementId: "G-93CQH6SG9T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };
