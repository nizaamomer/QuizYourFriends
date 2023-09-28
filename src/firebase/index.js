import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAEVzc4AijNKSsoT6KzA4CFmcaIVG6J1Is",
  authDomain: "quizyourfriends-1.firebaseapp.com",
  projectId: "quizyourfriends-1",
  storageBucket: "quizyourfriends-1.appspot.com",
  messagingSenderId: "1042437545008",
  appId: "1:1042437545008:web:259fb4e6dc78b4df0121f5"
};
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);
export default db



