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

  // ==========================================
  // GESTIÓN DEL BANNER DE COOKIES
  // ==========================================
  const cookieBanner = document.getElementById("cookie-banner");
  const cookiesAccepted = getCookie("cookiesAccepted");

  if (cookieBanner) {
    if (cookiesAccepted === "true" || cookiesAccepted === "false") {
      cookieBanner.style.display = "none";
    } else {
      cookieBanner.style.display = "flex";
    }
  }

  const acceptCookiesBtn = document.getElementById("accept-cookies-btn");
  const rejectCookiesBtn = document.getElementById("reject-cookies-btn");

  if (acceptCookiesBtn) {
    acceptCookiesBtn.addEventListener("click", () => {
      setCookie("cookiesAccepted", "true", 365);
      cookieBanner.style.display = "none";
    });
  }

  if (rejectCookiesBtn) {
    rejectCookiesBtn.addEventListener("click", () => {
      setCookie("cookiesAccepted", "false", 365);
      cookieBanner.style.display = "none";
    });
  }

  // ==========================================
  // CARRITO DE PRESUPUESTO
  // ==========================================
  const products = [
    { id: 1, name: "Router Inteligente", price: 15000, img: "img/router.jpg" },
    { id: 2, name: "Switch Inteligente", price: 12000, img: "img/switch.jpg" },
    { id: 3, name: "Cable de Red 10m", price: 3000, img: "img/cable.jpg" },
    { id: 4, name: "Cámara Exterior", price: 25000, img: "img/camara.jpg" },
    { id: 5, name: "Luz Inteligente", price: 5000, img: "img/luz.jpg" },
    { id: 6, name: "Sensor Inteligente", price: 7000, img: "img/sensor.jpg" }
  ];

  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const subtotalElem = document.getElementById("subtotal");
  const laborCostElem = document.getElementById("labor-cost");
  const totalElem = document.getElementById("total");

  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  function renderProducts() {
    productList.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toLocaleString()}</p>
        <button onclick="addToCart(${product.id})">Agregar</button>
      `;
      productList.appendChild(card);
    });
  }

  window.addToCart = function (id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
      cartItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveAndRenderCart();
  };

  window.removeFromCart = function (id) {
    cart = cart.filter(item => item.id !== id);
    saveAndRenderCart();
  };

  function saveAndRenderCart() {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function renderCart() {
    cartTableBody.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
      const row = document.createElement("tr");
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toLocaleString()}</td>
        <td>${item.quantity}</td>
        <td>$${itemSubtotal.toLocaleString()}</td>
        <td><button onclick="removeFromCart(${item.id})">Eliminar</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    subtotalElem.textContent = subtotal.toLocaleString();
    laborCostElem.textContent = laborCost.toLocaleString();
    totalElem.textContent = total.toLocaleString();
  }

  // ==========================================
  // GENERAR PDF DEL PRESUPUESTO
  // ==========================================
  document.getElementById("download-pdf").addEventListener("click", function () {
    const cartSummary = document.querySelector("#cart-summary").innerHTML;
    let pdfContent = `
      <h2>Presupuesto</h2>
      <table border="1" cellspacing="0" cellpadding="10" style="width: 100%; text-align: center;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    cart.forEach(item => {
      pdfContent += `
        <tr>
          <td>${item.name}</td>
          <td>$${item.price.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>$${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `;
    });

    pdfContent += `
        </tbody>
      </table>
      ${cartSummary}
    `;

    const win = window.open("", "_blank");
    win.document.write(pdfContent);
    win.document.close();
    win.print();
  });

  // ==========================================
  // INICIALIZACIÓN
  // ==========================================
  renderProducts();
  renderCart();
});