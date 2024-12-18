// URL del Google Apps Script
const scriptURL = "https://script.google.com/macros/s/AKfycbwU1qGf3bC4cnXxnN2B1S3pZLO1L9aZmP1neq6QQ2PFcR1nPnrrOjcv_NRpCpFKsUHO/exec";

// Función de Registro de Usuario
const registerUser = async (email, password, name) => {
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        email: email,
        password: password,
        name: name,
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      window.location.href = "login.html"; // Redirige a la página de inicio de sesión
    } else {
      alert(result.message || "Error en el registro.");
    }
  } catch (error) {
    console.error("Error en el registro:", error);
    alert("Hubo un problema al registrar al usuario.");
  }
};

// Función de Inicio de Sesión
const loginUser = async (email, password) => {
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        email: email,
        password: password,
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert(`¡Bienvenido, ${result.name || "Usuario"}!`);
      window.location.href = "index.html"; // Redirige a la página principal
    } else {
      alert(result.message || "Correo o contraseña incorrectos.");
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    alert("Hubo un problema al iniciar sesión.");
  }
};

// Eventos del formulario
document.addEventListener("DOMContentLoaded", () => {
  // Verificamos que los formularios existan en el DOM
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  // Registro
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const name = document.getElementById("register-name").value || "Usuario"; // Opcional: campo de nombre

      if (email && password) {
        registerUser(email, password, name); // Llamar la función de registro
      } else {
        alert("Por favor, llena todos los campos.");
      }
    });
  }

  // Inicio de Sesión
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      if (email && password) {
        loginUser(email, password); // Llamar la función de login
      } else {
        alert("Por favor, ingresa tu correo y contraseña.");
      }
    });
  }
});