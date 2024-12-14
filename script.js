document.addEventListener("DOMContentLoaded", function () {
  // Función para manejar cookies
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function deleteCookie(name) {
    document.cookie = name + "=; Max-Age=-99999999; path=/;";
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Mostrar el banner de cookies si no se ha aceptado previamente
  if (!getCookie("cookiesAccepted")) {
    document.getElementById("cookie-banner").style.display = "flex";
  }

  // Aceptar cookies
  document.getElementById("accept-cookies-btn").addEventListener("click", function () {
    setCookie("cookiesAccepted", "true", 365);
    document.getElementById("cookie-banner").style.display = "none";
  });

  // Rechazar cookies y eliminar cookies opcionales
  document.getElementById("reject-cookies-btn").addEventListener("click", function () {
    setCookie("cookiesAccepted", "false", 365);
    document.getElementById("cookie-banner").style.display = "none";
    deleteCookie("optionalCookie1");
    deleteCookie("optionalCookie2");
  });

  // Ocultar el float de Instagram al cargar la página
  const instagramFloat = document.getElementById("instagram-float");
  if (instagramFloat) {
    instagramFloat.style.display = "none";
  }

  // Mostrar el float de Instagram después de 5 minutos (300000 ms)
  setTimeout(function () {
    if (instagramFloat) {
      instagramFloat.style.display = "flex"; // O cambiar a "block" si prefieres
    }
  }, 300000); // 5 minutos en milisegundos

  // Funcionalidad para cerrar el float de Instagram
  document.getElementById("close-float").addEventListener("click", function () {
    if (instagramFloat) {
      instagramFloat.style.display = "none";
    }
  });

  // Cerrar el menú nav cuando se hace clic fuera
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menu-toggle");

  if (nav && menuToggle) {
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }
});