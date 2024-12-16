document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // FUNCIONES PARA MANEJO DE COOKIES
  // ==========================================
  function setCookie(name, value, days) {
    if (!name || !value) return; // Validación de parámetros
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
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  // ==========================================
  // CARGAR GOOGLE ANALYTICS SOLO SI ACEPTA COOKIES
  // ==========================================
  function loadGoogleAnalytics() {
    // Evita cargar el script si ya existe
    if (document.querySelector('script[src*="googletagmanager"]')) return;

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-WGSGHHHYX5";
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-WGSGHHHYX5');
    };
  }

  // ==========================================
  // MOSTRAR/OCULTAR BANNER DE COOKIES
  // ==========================================
  const cookieBanner = document.getElementById("cookie-banner");

// Verifica existencia del banner y la cookie
if (cookieBanner && !getCookie("cookiesAccepted")) {
  cookieBanner.style.display = "flex"; // Muestra el banner si no se ha aceptado/rechazado
} else if (getCookie("cookiesAccepted") === "true") {
  loadGoogleAnalytics(); // Carga Google Analytics si las cookies ya están aceptadas
}

  const acceptCookiesBtn = document.getElementById("accept-cookies-btn");
  const rejectCookiesBtn = document.getElementById("reject-cookies-btn");

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener("click", function () {
      setCookie("cookiesAccepted", "true", 365);
      if (cookieBanner) cookieBanner.style.display = "none";
      loadGoogleAnalytics();
    });
  }

  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener("click", function () {
      setCookie("cookiesAccepted", "false", 365);
      if (cookieBanner) cookieBanner.style.display = "none";
      deleteCookie("optionalCookie1"); // Ejemplo de eliminación de cookies no esenciales
      deleteCookie("optionalCookie2");
    });
  }

  // ==========================================
  // INSTAGRAM FLOAT
  // ==========================================
  const instagramFloat = document.getElementById("instagram-float");
  if (instagramFloat) {
    instagramFloat.style.display = "none";
    setTimeout(function () {
      instagramFloat.style.display = "flex"; // Muestra el botón flotante después de 5 minutos
    }, 300000); // 5 min
  }

  const closeFloatBtn = document.getElementById("close-float");
  if (closeFloatBtn) {
    closeFloatBtn.addEventListener("click", function () {
      if (instagramFloat) {
        instagramFloat.style.display = "none"; // Oculta el botón flotante al hacer clic
      }
    });
  }

  // ==========================================
  // CERRAR MENÚ NAV CUANDO SE HACE CLIC FUERA
  // ==========================================
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menu-toggle");
  if (nav && menuToggle) {
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
        nav.classList.remove("active"); // Cierra el menú
        menuToggle.classList.remove("active"); // Cambia el estado del botón
      }
    });
  }
});