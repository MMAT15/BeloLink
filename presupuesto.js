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
  const cart = [];

  /* ============================
     LISTA DE PRODUCTOS
  ============================ */
  const products = [
    { id: 1, name: "Cámara Exterior", price: 200, img: "img/Camaraexterior.webp" },
    { id: 2, name: "Luces Inteligentes", price: 50, img: "img/phillipshue.jpeg" },
    { id: 3, name: "Sensor de Movimiento", price: 40, img: "img/sensormov.jpeg" },
    { id: 4, name: "Switch Inteligente", price: 100, img: "img/switch.jpg" },
    { id: 5, name: "Cable de Red", price: 20, img: "img/cablered.jpg" },
    { id: 6, name: "Router Inteligente", price: 150, img: "img/router.webp" },
  ];

  /* ============================
     RENDERIZAR PRODUCTOS
  ============================ */
  function renderProducts() {
    products.forEach((product) => {
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
    const product = products.find((item) => item.id === productId);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
  };

  /* ============================
     ACTUALIZAR INTERFAZ DEL CARRITO
  ============================ */
  function updateCartUI() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

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
     ACTUALIZAR CANTIDAD
  ============================ */
  window.updateQuantity = (productId, change) => {
    const item = cart.find((item) => item.id === productId);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartUI();
    }
  };

  /* ============================
     REMOVER PRODUCTO DEL CARRITO
  ============================ */
  window.removeFromCart = (productId) => {
    const index = cart.findIndex((item) => item.id === productId);
    if (index !== -1) {
      cart.splice(index, 1);
    }
    updateCartUI();
  };

  /* ============================
     VACIAR CARRITO
  ============================ */
  clearCartButton.addEventListener("click", () => {
    cart.length = 0;
    updateCartUI();
  });

  /* ============================
     DESCARGAR PRESUPUESTO COMO PDF
  ============================ */
  downloadPDFButton.addEventListener("click", () => {
    const pdfContent = `
      <h1>Resumen de Presupuesto</h1>
      <table border="1" cellpadding="5">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${cart.map((item) => `
            <tr>
              <td>${item.name}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>${item.quantity}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
      <p><strong>Subtotal:</strong> $${subtotalSpan.textContent}</p>
      <p><strong>Mano de Obra (15%):</strong> $${laborCostSpan.textContent}</p>
      <p><strong>Total:</strong> $${totalSpan.textContent}</p>
    `;

    const win = window.open("", "", "width=800,height=900");
    win.document.write(pdfContent);
    win.document.close();
    win.print();
  });

  /* ============================
     BOTÓN VOLVER ARRIBA
  ============================ */
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  /* ============================
     MENU HAMBURGUESA
  ============================ */
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  /* ============================
     INICIALIZACIÓN
  ============================ */
  renderProducts();
});