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
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  }

  function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
      let c = cookiesArray[i].trim();
      if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length));
    }
    return null;
  }

  function deleteCookie(name) {
    setCookie(name, "", -1); // Expira la cookie
  }

  // ==========================================
  // CARGAR GOOGLE ANALYTICS SOLO SI ACEPTA COOKIES
  // ==========================================
  function loadGoogleAnalytics() {
    if (document.querySelector('script[src*="googletagmanager"]')) return; // Evita duplicados

    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-WGSGHHHYX5";
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "G-WGSGHHHYX5");
    };
  }

  // ==========================================
  // MOSTRAR/OCULTAR BANNER DE COOKIES
  // ==========================================
  const cookieBanner = document.getElementById("cookie-banner");
  const cookiesAccepted = getCookie("cookiesAccepted");

  if (cookieBanner) {
    if (cookiesAccepted === "true") {
      cookieBanner.style.display = "none"; // Oculta el banner si ya se aceptaron las cookies
      loadGoogleAnalytics();
    } else if (cookiesAccepted === "false") {
      cookieBanner.style.display = "none"; // Oculta si fueron rechazadas
    } else {
      cookieBanner.style.display = "flex"; // Muestra si no hay cookies
    }
  }

  const acceptCookiesBtn = document.getElementById("accept-cookies-btn");
  const rejectCookiesBtn = document.getElementById("reject-cookies-btn");

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener("click", function () {
      setCookie("cookiesAccepted", "true", 365);
      cookieBanner.style.display = "none";
      loadGoogleAnalytics();
    });
  }

  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener("click", function () {
      setCookie("cookiesAccepted", "false", 365); // Establece la cookie como "false"
      cookieBanner.style.display = "none"; // Oculta el banner
      deleteCookie("optionalCookie1"); // Ejemplo de cookies no esenciales
      deleteCookie("optionalCookie2");
    });
  }
  }

  // ==========================================
  // INSTAGRAM FLOAT
  // ==========================================
  const instagramFloat = document.getElementById("instagram-float");
  if (instagramFloat) {
    instagramFloat.style.display = "none";
    setTimeout(() => {
      instagramFloat.style.display = "flex";
    }, 300000); // 5 minutos
  }

  const closeFloatBtn = document.getElementById("close-float");
  if (closeFloatBtn) {
    closeFloatBtn.addEventListener("click", () => {
      instagramFloat.style.display = "none";
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
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }
});