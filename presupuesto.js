document.addEventListener("DOMContentLoaded", () => {
  /* ============================
     VARIABLES GLOBALES
  ============================ */
  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const subtotalSpan = document.getElementById("subtotal");
  const laborCostSpan = document.getElementById("labor-cost");
  const totalSpan = document.getElementById("total");
  const clearCartButton = document.getElementById("clear-cart");
  const downloadPDFButton = document.getElementById("download-pdf");
  const backToTopButton = document.getElementById("back-to-top");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

  const cart = [];

  /* ============================
     LISTA DE PRODUCTOS
  ============================ */
  const products = [
    { id: 1, name: "Cámara Exterior", price: 200, img: "img/Camaraexterior.webp", category: "camaras" },
    { id: 2, name: "Luces Inteligentes", price: 50, img: "img/phillipshue.jpeg", category: "luces" },
    { id: 3, name: "Sensor de Movimiento", price: 40, img: "img/sensormov.jpeg", category: "sensores" },
    { id: 4, name: "Switch Inteligente", price: 100, img: "img/switch.jpg", category: "switches" },
    { id: 5, name: "Cable de Red", price: 20, img: "img/cablered.jpg", category: "cables" },
    { id: 6, name: "Router Inteligente", price: 150, img: "img/router.webp", category: "routers" },
    { id: 7, name: "Cámara Inteligente", price: 220, img: "img/Camaraexterior.webp", category: "camaras" },
    { id: 8, name: "Foco Philips Hue", price: 60, img: "img/phillipshue.jpeg", category: "luces" },
  ];

  /* ============================
     RENDERIZAR PRODUCTOS
  ============================ */
  function renderProducts(filter = "all", searchQuery = "") {
    productList.innerHTML = ""; // Limpiar productos
    let filteredProducts = products;

    if (filter !== "all") {
      filteredProducts = filteredProducts.filter(product => product.category === filter);
    }

    if (searchQuery.trim() !== "") {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filteredProducts.length === 0) {
      productList.innerHTML = `<p class="no-results">No se encontraron productos.</p>`;
      return;
    }

    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${product.id})">Agregar</button>
      `;
      productList.appendChild(productCard);
    });
  }

  /* ============================
     AGREGAR PRODUCTO AL CARRITO
  ============================ */
  window.addToCart = (productId) => {
    const product = products.find(item => item.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    showNotification(`${product.name} agregado al carrito`);
    animateAddToCart();
    updateCartUI();
  };

  /* ============================
     ANIMACIÓN Y NOTIFICACIÓN
  ============================ */
  function animateAddToCart() {
    const cartIcon = document.querySelector(".cart-icon");
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 500);
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
  }

  /* ============================
     ACTUALIZAR INTERFAZ DEL CARRITO
  ============================ */
  function updateCartUI() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    if (cart.length === 0) {
      cartTableBody.innerHTML = `<tr><td colspan="5" class="empty-cart">Tu carrito está vacío</td></tr>`;
      subtotalSpan.textContent = "0.00";
      laborCostSpan.textContent = "0.00";
      totalSpan.textContent = "0.00";
      return;
    }

    cart.forEach((item) => {
      const row = document.createElement("tr");
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>
          <button onclick="updateQuantity(${item.id}, -1)">-</button>
          ${item.quantity}
          <button onclick="updateQuantity(${item.id}, 1)">+</button>
        </td>
        <td>$${itemSubtotal.toFixed(2)}</td>
        <td><button onclick="removeFromCart(${item.id})">❌</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    subtotalSpan.textContent = subtotal.toFixed(2);
    laborCostSpan.textContent = laborCost.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
  }

  /* ============================
     BÚSQUEDA Y FILTRO
  ============================ */
  searchInput.addEventListener("keyup", () => {
    renderProducts(categoryFilter.value, searchInput.value);
  });

  categoryFilter.addEventListener("change", () => {
    renderProducts(categoryFilter.value, searchInput.value);
  });

  /* ============================
     CARRITO Y VOLVER ARRIBA
  ============================ */
  window.updateQuantity = (productId, change) => {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  };

  window.removeFromCart = (productId) => {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
      cart.splice(index, 1);
    }
    updateCartUI();
  };

  clearCartButton.addEventListener("click", () => {
    cart.length = 0;
    updateCartUI();
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ============================
     INICIALIZACIÓN
  ============================ */
  renderProducts();
});