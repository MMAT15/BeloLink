document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const errorMsg = document.getElementById("error-msg");
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      try {
        const response = await fetch("http://localhost:4000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Inicio de sesión exitoso. Redirigiéndote a la página de presupuesto...");
          window.location.href = "presupuesto.html";
        } else {
          errorMsg.textContent = data.message || "Error al iniciar sesión.";
        }
      } catch (error) {
        errorMsg.textContent = "Error al conectar con el servidor.";
      }
    });
  });