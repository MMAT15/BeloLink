document.addEventListener("DOMContentLoaded", () => {
  /* ============================
     VARIABLES GLOBALES
  ============================ */
  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const mobileCart = document.getElementById("mobile-cart"); // Nuevo contenedor móvil
  const subtotalSpan = document.getElementById("subtotal");
  const laborCostSpan = document.getElementById("labor-cost");
  const totalSpan = document.getElementById("total");
  const clearCartButton = document.getElementById("clear-cart");
  const downloadPDFButton = document.getElementById("download-pdf");
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const floatingButton = document.getElementById("floating-button");
  const floatingMenu = document.getElementById("floating-menu");

  let cart = [];
 
  /* ============================
     LISTA DE PRODUCTOS
  ============================ */
  const products = [
    { id: 1, name: "Cámara Exterior", price: 200, img: "img/ezviz.jpg", category: "camaras" },
    { id: 2, name: "Luces Inteligentes", price: 50, img: "img/phillipshue.jpeg", category: "luces" },
    { id: 3, name: "Sensor de Movimiento", price: 40, img: "img/sensormov.jpeg", category: "sensores" },
    { id: 4, name: "Switch Inteligente", price: 100, img: "img/switch.jpg", category: "switches" },
    { id: 5, name: "Cable de Red", price: 20, img: "img/cablered.jpg", category: "cables" },
    { id: 6, name: "Router Inteligente", price: 150, img: "img/router.webp", category: "routers" },
    { id: 7, name: "Cámara Inteligente", price: 220, img: "img/eufy.jpg", category: "camaras" },
    { id: 8, name: "Foco Philips Hue", price: 60, img: "img/phillipshue.jpeg", category: "luces" },
  ];

  /* ============================
     RENDERIZAR PRODUCTOS
  ============================ */
  const renderProducts = (filter = "all", searchQuery = "") => {
    productList.innerHTML = "";

    const filteredProducts = products.filter((product) => {
      const matchesCategory = filter === "all" || product.category === filter;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

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
        <button data-id="${product.id}" class="add-to-cart">Agregar</button>
      `;
      productList.appendChild(productCard);
    });

    assignAddToCartEvents(); // Asigna eventos
  };

  const assignAddToCartEvents = () => {
    // Usa un Event Delegation para garantizar que los botones respondan en cualquier situación
    productList.addEventListener("click", (event) => {
      // Verifica que el clic se realizó en un botón con la clase "add-to-cart"
      if (event.target.classList.contains("add-to-cart")) {
        const productId = parseInt(event.target.dataset.id);
        if (!isNaN(productId)) {
          addToCart(productId);
        }
      }
    });
  };

  /* ============================
     CARRITO DE COMPRAS
  ============================ */
  const updateCartUI = () => {
    const isMobile = window.innerWidth <= 768;
    cartTableBody.innerHTML = "";
    if (isMobile) mobileCart.innerHTML = ""; // Limpia el contenedor móvil

    let subtotal = 0;

    cart.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      if (isMobile) {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("cart-item");
        itemDiv.innerHTML = `
          <p><strong>${item.name}</strong></p>
          <p>Precio: $${item.price.toFixed(2)}</p>
          <p>Cantidad: ${item.quantity}</p>
          <p>Subtotal: $${itemSubtotal.toFixed(2)}</p>
          <button onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        mobileCart.appendChild(itemDiv);
      } else {
        const row = `
          <tr>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
              <button onclick="updateQuantity(${item.id}, -1)">-</button>
              ${item.quantity}
              <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </td>
            <td>$${itemSubtotal.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${item.id})">❌</button></td>
          </tr>
        `;
        cartTableBody.insertAdjacentHTML("beforeend", row);
      }
    });

    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    subtotalSpan.textContent = subtotal.toFixed(2);
    laborCostSpan.textContent = laborCost.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
  };

  const addToCart = (productId) => {
    const product = products.find((item) => item.id === productId);
    const item = cart.find((item) => item.id === productId);

    if (item) {
      item.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
  };

  window.updateQuantity = (productId, change) => {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) removeFromCart(productId);
      updateCartUI();
    }
  };

  window.removeFromCart = (productId) => {
    cart = cart.filter((item) => item.id !== productId);
    updateCartUI();
  };

  /* ============================
     LIMPIAR CARRITO
  ============================ */
  clearCartButton.addEventListener("click", () => {
    cart = [];
    updateCartUI();
    alert("Carrito vacío.");
  });

  /* ============================
     INICIALIZACIÓN
  ============================ */
  renderProducts();
  updateCartUI();
});