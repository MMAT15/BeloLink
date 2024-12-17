// Importa solo lo necesario de Firebase
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD0iRqg1delAO9hVB_c7LgN0BM9xvhYkPA",
  authDomain: "belolink.firebaseapp.com",
  projectId: "belolink",
  storageBucket: "belolink.appspot.com", // Corregí el dominio de storage
  messagingSenderId: "202108226574",
  appId: "1:202108226574:web:ed35e546b18c36f030005f",
  measurementId: "G-PRTXFGN64T"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Registro de Usuario
const registerUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      sendEmailVerification(userCredential.user);
      alert("Registro exitoso. Por favor verifica tu correo electrónico.");
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

// Inicio de Sesión
const loginUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      if (userCredential.user.emailVerified) {
        alert("Inicio de sesión exitoso.");
      } else {
        alert("Por favor verifica tu correo electrónico antes de iniciar sesión.");
      }
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
};

// Eventos del formulario
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  // Registro
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    registerUser(email, password);
  });

  // Inicio de Sesión
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(email, password);
  });
});