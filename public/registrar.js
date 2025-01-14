document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");
    const errorMsg = document.getElementById("error-msg");
  
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      try {
        const response = await fetch("https://belo-link-527tvaci3-mateos-projects-ef5d7e66.vercel.app/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
  
        if (response.ok) {
          alert("Registro exitoso. Redirigiéndote a la página de inicio de sesión...");
          window.location.href = "iniciar.html";
        } else {
          errorMsg.textContent = data.message || "Error al registrar.";
        }
      } catch (error) {
        errorMsg.textContent = "Error al conectar con el servidor.";
      }
    });
  });