document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // FUNCIONES PARA MANEJO DE COOKIES
  // ==========================================
  const setCookie = (name, value, days) => {
    if (!name || !value) return;
    let expires = days ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}` : "";
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  };

  const getCookie = (name) => document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1] || null;

  const deleteCookie = (name) => setCookie(name, "", -1);

  // ==========================================
  // CARGAR GOOGLE ANALYTICS SOLO SI ACEPTA COOKIES
  // ==========================================
  const loadGoogleAnalytics = () => {
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    const gaScript = Object.assign(document.createElement("script"), {
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-WGSGHHHYX5",
      onload: () => {
        window.dataLayer = window.dataLayer || [];
        const gtag = (...args) => dataLayer.push(args);
        gtag("js", new Date());
        gtag("config", "G-WGSGHHHYX5");
      }
    });
    document.head.appendChild(gaScript);
  };

  // ==========================================
  // MOSTRAR/OCULTAR BANNER DE COOKIES
  // ==========================================
  const cookieBanner = document.getElementById("cookie-banner"),
        cookiesAccepted = getCookie("cookiesAccepted");

  if (cookieBanner) {
    cookieBanner.style.display = cookiesAccepted ? "none" : "flex";
    if (cookiesAccepted === "true") loadGoogleAnalytics();
  }

  document.getElementById("accept-cookies-btn")?.addEventListener("click", () => {
    setCookie("cookiesAccepted", "true", 365);
    cookieBanner.style.display = "none";
    loadGoogleAnalytics();
  });

  document.getElementById("reject-cookies-btn")?.addEventListener("click", () => {
    setCookie("cookiesAccepted", "false", 365);
    cookieBanner.style.display = "none";
    ["optionalCookie1", "optionalCookie2"].forEach(deleteCookie);
  });

  // ==========================================
  // INSTAGRAM FLOAT
  // ==========================================
  const instagramFloat = document.getElementById("instagram-float");
  if (instagramFloat) {
    instagramFloat.style.display = "none";
    setTimeout(() => instagramFloat.style.display = "flex", 300000);
    document.getElementById("close-float")?.addEventListener("click", () => instagramFloat.style.display = "none");
  }

  // ==========================================
  // CERRAR MENÚ NAV CUANDO SE HACE CLIC FUERA
  // ==========================================
  const nav = document.getElementById("nav"),
        menuToggle = document.getElementById("menu-toggle");

  if (nav && menuToggle) {
    document.addEventListener("click", ({ target }) => {
      if (!nav.contains(target) && !menuToggle.contains(target)) {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }
});