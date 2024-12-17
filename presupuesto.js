document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // MENU HAMBURGUESA
  // ==========================================
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (!menuToggle.contains(event.target) && !nav.contains(event.target)) {
      nav.classList.remove("active");
      menuToggle.classList.remove("active");
    }
  });

  // ==========================================
  // BOTÓN VOLVER ARRIBA
  // ==========================================
  const backToTopButton = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopButton.style.display = "flex";
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

  // ==========================================
  // PRODUCTOS Y CARRITO DE COMPRAS
  // ==========================================
  const products = [
    { id: 1, name: "Cámara Inteligente Exterior", price: 15000, img: "img/Camaraexterior.webp" },
    { id: 2, name: "Luces Inteligentes Philips Hue", price: 8000, img: "img/phillipshue.jpeg" },
    { id: 3, name: "Sensor de Movimiento", price: 5000, img: "img/sensormov.jpeg" },
    { id: 4, name: "Switch de Red", price: 12000, img: "img/switch.jpg" },
    { id: 5, name: "Cable de Red", price: 1000, img: "img/cablered.jpg" },
    { id: 6, name: "Router Inteligente", price: 20000, img: "img/router.webp" },
  ];

  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const subtotalSpan = document.getElementById("subtotal");
  const laborCostSpan = document.getElementById("labor-cost");
  const totalSpan = document.getElementById("total");
  const clearCartButton = document.getElementById("clear-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderProducts() {
    products.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toLocaleString()}</p>
        <button data-id="${product.id}">Agregar</button>
      `;
      productList.appendChild(card);
    });
  }

  function renderCart() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
      subtotal += item.price * item.quantity;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toLocaleString()}</td>
        <td>
          <button class="quantity-btn decrease" data-index="${index}">-</button>
          ${item.quantity}
          <button class="quantity-btn increase" data-index="${index}">+</button>
        </td>
        <td>$${(item.price * item.quantity).toLocaleString()}</td>
        <td><button class="delete-btn" data-index="${index}">Eliminar</button></td>
      `;
      cartTableBody.appendChild(row);
    });

    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    subtotalSpan.textContent = subtotal.toLocaleString();
    laborCostSpan.textContent = laborCost.toLocaleString();
    totalSpan.textContent = total.toLocaleString();

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function addToCart(id) {
    const product = products.find((p) => p.id == id);
    const existing = cart.find((item) => item.id == id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }

  function updateCart(index, action) {
    if (action === "increase") {
      cart[index].quantity += 1;
    } else if (action === "decrease") {
      cart[index].quantity -= 1;
      if (cart[index].quantity === 0) cart.splice(index, 1);
    }
    renderCart();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
  }

  productList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      addToCart(e.target.dataset.id);
    }
  });

  cartTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("quantity-btn")) {
      updateCart(e.target.dataset.index, e.target.classList.contains("increase") ? "increase" : "decrease");
    }

    if (e.target.classList.contains("delete-btn")) {
      removeFromCart(e.target.dataset.index);
    }
  });

  clearCartButton.addEventListener("click", () => {
    cart = [];
    renderCart();
  });

  renderProducts();
  renderCart();

  // ==========================================
  // DESCARGAR PRESUPUESTO EN PDF
  // ==========================================
  document.getElementById("download-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Presupuesto - BeloLink", 10, 10);
    let y = 20;

    cart.forEach((item) => {
      doc.text(`${item.name} - $${item.price} x ${item.quantity} = $${item.price * item.quantity}`, 10, y);
      y += 10;
    });

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    doc.text(`Subtotal: $${subtotal}`, 10, y + 10);
    doc.text(`Mano de Obra (15%): $${laborCost}`, 10, y + 20);
    doc.text(`Total: $${total}`, 10, y + 30);

    doc.save("presupuesto_belolink.pdf");
  });
});