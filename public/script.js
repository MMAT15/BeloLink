document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // UTILIDADES BÁSICAS
  // ==========================================
  const setCookie = (name, value, days) => {
    if (!name || typeof value === 'undefined') return;
    const expires = days ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}` : "";
    document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/`;
  };

  const getCookie = (name) => document.cookie.split("; ").find(row => row.startsWith(name + "="))?.split("=")[1] || null;
  const deleteCookie = (name) => setCookie(name, "", -1);

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // ==========================================
  // CONSENTIMIENTO: COOKIES + ANALYTICS (opt-in)
  // ==========================================
  const cookieBanner = $("#cookie-banner");
  const cookiesAccepted = getCookie("cookiesAccepted");

  const loadGoogleAnalytics = () => {
    if (document.querySelector('script[src*="googletagmanager"]')) return;
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-WGSGHHHYX5";
    gaScript.onload = () => {
      window.dataLayer = window.dataLayer || [];
      const gtag = (...args) => window.dataLayer.push(args);
      gtag("js", new Date());
      gtag("config", "G-WGSGHHHYX5");
    };
    document.head.appendChild(gaScript);
  };

  if (cookieBanner) {
    cookieBanner.style.display = cookiesAccepted ? "none" : "flex";
    if (cookiesAccepted === "true") loadGoogleAnalytics();
  }

  $("#accept-cookies-btn")?.addEventListener("click", () => {
    setCookie("cookiesAccepted", "true", 365);
    if (cookieBanner) cookieBanner.style.display = "none";
    loadGoogleAnalytics();
    showToast("Preferencias guardadas: cookies aceptadas.");
  });

  $("#reject-cookies-btn")?.addEventListener("click", () => {
    setCookie("cookiesAccepted", "false", 365);
    if (cookieBanner) cookieBanner.style.display = "none";
    ["optionalCookie1", "optionalCookie2"].forEach(deleteCookie);
    showToast("Preferencias guardadas: cookies rechazadas.");
  });

  // ==========================================
  // TEMA: oscuro fijo
  // ==========================================
  document.body.classList.add('dark');

// ==========================================
  // MENÚ: Cerrar al hacer clic fuera + bloquear scroll
  // ==========================================
  const nav = $("#nav");
  const menuToggle = $("#menu-toggle");
  if (menuToggle && !menuToggle.hasAttribute('aria-expanded')) menuToggle.setAttribute('aria-expanded','false');

  if (nav && menuToggle) {
    document.addEventListener("click", ({ target }) => {
      if (!nav.contains(target) && !menuToggle.contains(target)) {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.classList.remove('no-scroll', 'nav-open');
        menuToggle.setAttribute('aria-expanded','false');
      }
    });

    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.classList.toggle('active');
      document.body.classList.toggle('no-scroll', expanded);
      document.body.classList.toggle('nav-open', expanded);
      nav.classList.toggle('active', expanded);
      menuToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992 && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('no-scroll', 'nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ==========================================
  // PROGRESS BAR DE SCROLL
  // ==========================================
  const progressContainerId = 'scroll-progress-container';
  if (!$("#" + progressContainerId)) {
    const container = document.createElement('div');
    container.id = progressContainerId;
    container.innerHTML = '<div id="scroll-progress-bar"></div>';
    document.body.appendChild(container);
  }
  const updateProgress = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    const bar = $("#scroll-progress-bar");
    if (bar) bar.style.width = `${progress}%`;
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ==========================================
  // REVEAL ANIMATIONS EN SCROLL
  // ==========================================
  const revealables = [
    ...$$('main section'),
    ...$$('.beneficio'),
    ...$$('.contacto-item'),
    ...$$('.producto'),
    ...$$('.paquete')
  ];
  revealables.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealables.forEach(el => io.observe(el));

  // ==========================================
  // BACK TO TOP: visibilidad dinámica
  // ==========================================
  const backToTopBtn = $(".back-to-top");
  const updateBackToTop = () => {
    if (!backToTopBtn) return;
    const show = window.scrollY > 400;
    backToTopBtn.style.opacity = show ? '1' : '0';
    backToTopBtn.style.pointerEvents = show ? 'auto' : 'none';
  };
  document.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();

  // ==========================================
  // HEADER SHRINK AL HACER SCROLL
  // ==========================================
  const header = document.querySelector('header');
  const applyShrink = () => {
    if (!header) return;
    const s = window.scrollY > 20;
    header.classList.toggle('shrink', s);
  };
  document.addEventListener('scroll', applyShrink, { passive: true });
  applyShrink();

  // ==========================================
  // ACCESIBILIDAD: teclado para menú hamburguesa
  // ==========================================
  if (menuToggle) {
    menuToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        menuToggle.click();
      }
    });
  }

  // ==========================================
  // ENLACES ACTIVOS EN NAV
  // ==========================================
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });

  // ==========================================
  // FLOAT INSTAGRAM (retardo)
  // ==========================================
  const instagramFloat = $("#instagram-float");
  if (instagramFloat) {
    instagramFloat.style.display = "none";
    setTimeout(() => instagramFloat.style.display = "flex", 300000);
    $("#close-float")?.addEventListener("click", () => instagramFloat.style.display = "none");
  }

  // ==========================================
  // COPIAR MAIL RÁPIDO (mejora UX)
  // ==========================================
  $$('a[href^="mailto:"]')
    .filter(a => a.href.toLowerCase().includes('belolink@proton.me'))
    .forEach(a => {
      a.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        const email = 'Belolink@proton.me';
        navigator.clipboard?.writeText(email).then(() => showToast('Email copiado: ' + email));
      });
    });

  // ==========================================
  // TOAST UTIL
  // ==========================================
  function showToast(msg = '') {
    if (!msg) return;
    let toast = $("#toast");
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ==========================================
  // Endurecer seguridad de enlaces externos
  // ==========================================
  $$('a[target="_blank"]').forEach(a => {
    const rel = (a.getAttribute('rel') || '').toLowerCase();
    if (!rel.includes('noopener')) a.setAttribute('rel', (rel + ' noopener noreferrer').trim());
  });

  // ==========================================
  // Mejora de rendimiento de imágenes
  // ==========================================
  $$('img').forEach(img => {
    if (!img.hasAttribute('decoding')) img.setAttribute('decoding','async');
    if (!img.hasAttribute('loading')) img.setAttribute('loading','lazy');
    img.setAttribute('referrerpolicy','no-referrer');
  });
});
