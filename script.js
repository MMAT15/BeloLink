<script>
document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // FUNCIONES PARA MANEJO DE COOKIES
  // ==========================================
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
    // Inyectar dinámicamente el script de GA
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-WGSGHHHYX5";
    document.head.appendChild(gaScript);

    gaScript.onload = () => {
      // Inicializar GA
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-WGSGHHHYX5');
    };
  }

  // ==========================================
  // MOSTRAR/OCULTAR BANNER DE COOKIES
  // ==========================================
  // Si 'cookiesAccepted' es distinto de 'true', mostramos el banner.
  if (getCookie("cookiesAccepted") !== "true") {
    document.getElementById("cookie-banner").style.display = "flex";
  } else {
    // Si el usuario ya aceptó cookies previamente, cargamos GA de inmediato
    loadGoogleAnalytics();
  }

  // Aceptar cookies
  document.getElementById("accept-cookies-btn").addEventListener("click", function () {
    setCookie("cookiesAccepted", "true", 365);
    document.getElementById("cookie-banner").style.display = "none";
    loadGoogleAnalytics(); // Cargar GA únicamente si aceptan
  });

  // Rechazar cookies
  document.getElementById("reject-cookies-btn").addEventListener("click", function () {
    setCookie("cookiesAccepted", "false", 365);
    document.getElementById("cookie-banner").style.display = "none";
    // Eliminar cookies opcionales si deseas
    deleteCookie("optionalCookie1");
    deleteCookie("optionalCookie2");
  });

  // ==========================================
  // INSTAGRAM FLOAT
  // ==========================================
  const instagramFloat = document.getElementById("instagram-float");
  if (instagramFloat) {
    // Ocultar al cargar la página
    instagramFloat.style.display = "none";
    // Mostrar el float de Instagram después de 5 minutos (300000 ms)
    setTimeout(function () {
      instagramFloat.style.display = "flex"; 
    }, 300000); // 5 min
  }
  // Cerrar el float de Instagram manualmente
  const closeFloatBtn = document.getElementById("close-float");
  if (closeFloatBtn) {
    closeFloatBtn.addEventListener("click", function () {
      if (instagramFloat) {
        instagramFloat.style.display = "none";
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
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }
});
</script>
