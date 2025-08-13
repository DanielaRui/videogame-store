// Reemplaza con TU config real
const firebaseConfig = {
  apiKey: "AIzaSyCJR317CGtPIRnQeans4-HVJh1-1gWQUyA",
  authDomain: "videogame-store-a1846.firebaseapp.com",
  projectId: "videogame-store-a1846",
  appId: "1:363585521202:web:7ffca0b4c4a7777550de2b"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth, setPersistence, browserLocalPersistence,
  onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Persistencia local
await setPersistence(auth, browserLocalPersistence);

// Pequeños helpers
export { onAuthStateChanged, signOut };
