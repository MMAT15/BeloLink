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
  const categoryFilter = document.getElementById("category-filter");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");

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

    document.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => addToCart(parseInt(button.dataset.id)));
    });
  };

  /* ============================
     CARRITO DE COMPRAS
  ============================ */
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

  const updateCartUI = () => {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

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
    });

    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    subtotalSpan.textContent = subtotal.toFixed(2);
    laborCostSpan.textContent = laborCost.toFixed(2);
    totalSpan.textContent = total.toFixed(2);
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
    alert("El carrito ha sido vaciado.");
  });

  /* ============================
     DESCARGAR PDF
  ============================ */
  downloadPDFButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let y = 10;

    pdf.text("Resumen del Carrito", 10, y);
    y += 10;

    cart.forEach((item) => {
      pdf.text(`${item.name} x${item.quantity} - $${item.price}`, 10, y);
      y += 10;
    });

    pdf.text(`Subtotal: $${subtotalSpan.textContent}`, 10, y += 10);
    pdf.text(`Mano de Obra: $${laborCostSpan.textContent}`, 10, y += 10);
    pdf.text(`Total: $${totalSpan.textContent}`, 10, y += 10);

    pdf.save("resumen-carrito.pdf");
  });

  /* ============================
     FILTRAR Y BUSCAR PRODUCTOS
  ============================ */
  categoryFilter.addEventListener("change", () => renderProducts(categoryFilter.value, searchInput.value));
  searchButton.addEventListener("click", () => renderProducts(categoryFilter.value, searchInput.value));
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") renderProducts(categoryFilter.value, searchInput.value);
  });

  /* ============================
     INICIALIZACIÓN
  ============================ */
  renderProducts();
  updateCartUI();
});