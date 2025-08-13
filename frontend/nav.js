import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Config de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJR317CGtPIRnQeans4-HVJh1-1gWQUyA",
  authDomain: "videogame-store-a1846.firebaseapp.com",
  projectId: "videogame-store-a1846",
  appId: "1:363585521202:web:7ffca0b4c4a7777550de2b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Elementos del navbar
const linkProductos = document.getElementById("link-productos");
const linkLogin = document.getElementById("link-login");
const linkLogout = document.getElementById("link-logout");
const userEmailEl = document.getElementById("user-email");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Usuario logueado
    linkProductos.style.display = "inline-block";
    linkLogout.style.display = "inline-block";
    linkLogin.style.display = "none";
    userEmailEl.textContent = user.email;
  } else {
    // Usuario no logueado
    linkProductos.style.display = "none";
    linkLogout.style.display = "none";
    linkLogin.style.display = "inline-block";
    userEmailEl.textContent = "";

    // Bloquear acceso si la página es productos.html
    if (location.pathname.includes("productos.html")) {
      location.href = "/login.html";
    }
  }
});

// Cerrar sesión
if (linkLogout) {
  linkLogout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth);
  });
}
