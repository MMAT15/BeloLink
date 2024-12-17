document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // VARIABLES Y ELEMENTOS DOM
  // ==========================================
  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const subtotalElement = document.getElementById("subtotal");
  const laborCostElement = document.getElementById("labor-cost");
  const totalElement = document.getElementById("total");
  const floatingCartBtn = document.getElementById("floating-cart-btn");
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("close-modal");
  const downloadPdfBtn = document.getElementById("download-pdf");

  const LABOR_PERCENTAGE = 0.15;
  let cart = [];

  // ==========================================
  // PRODUCTOS DISPONIBLES
  // ==========================================
  const products = [
    {
      id: 1,
      name: "Cámara Inteligente Exterior",
      price: 12000,
      image: "img/Camaraexterior.webp",
    },
    {
      id: 2,
      name: "Luces Inteligentes Phillips Hue",
      price: 8000,
      image: "img/phillipshue.jpeg",
    },
    {
      id: 3,
      name: "Sensor de Movimiento Inteligente",
      price: 4500,
      image: "img/sensormov.jpeg",
    },
    {
      id: 4,
      name: "Switch Gigabit",
      price: 7000,
      image: "img/switch.jpg",
    },
    {
      id: 5,
      name: "Cables de Red 20m",
      price: 3000,
      image: "img/cablered.jpg",
    },
    {
      id: 6,
      name: "Router Inteligente",
      price: 15000,
      image: "img/router.webp",
    },
  ];

  // ==========================================
  // FUNCIONES PRINCIPALES
  // ==========================================
  function displayProducts() {
    productList.innerHTML = "";
    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>Precio: $${product.price.toLocaleString()}</p>
        <button class="add-to-cart-btn" data-id="${product.id}">Agregar</button>
      `;
      productList.appendChild(productCard);
    });
  }

  function addToCart(productId) {
    const product = products.find((item) => item.id === productId);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
    showFloatingCart();
  }

  function updateCart() {
    cartTableBody.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, index) => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.name}</td>
        <td>$${item.price.toLocaleString()}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1" data-index="${index}" class="cart-quantity-input" />
        </td>
        <td>$${itemSubtotal.toLocaleString()}</td>
        <td>
          <button class="remove-btn" data-index="${index}">🗑️</button>
        </td>
      `;
      cartTableBody.appendChild(row);
    });

    const laborCost = subtotal * LABOR_PERCENTAGE;
    const total = subtotal + laborCost;

    subtotalElement.textContent = subtotal.toLocaleString();
    laborCostElement.textContent = laborCost.toLocaleString();
    totalElement.textContent = total.toLocaleString();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
  }

  function changeQuantity(index, newQuantity) {
    cart[index].quantity = parseInt(newQuantity, 10);
    updateCart();
  }

  function showFloatingCart() {
    floatingCartBtn.classList.add("active");
  }

  function downloadPDF() {
    const doc = new jsPDF();
    doc.text("Resumen del Presupuesto", 10, 10);

    let y = 20;
    cart.forEach((item) => {
      doc.text(
        `${item.name} - Cantidad: ${item.quantity} - Precio: $${item.price.toLocaleString()}`,
        10,
        y
      );
      y += 10;
    });

    doc.text(`Subtotal: $${subtotalElement.textContent}`, 10, y + 10);
    doc.text(`Mano de Obra (15%): $${laborCostElement.textContent}`, 10, y + 20);
    doc.text(`Total: $${totalElement.textContent}`, 10, y + 30);

    doc.save("presupuesto.pdf");
  }

  // ==========================================
  // EVENTOS
  // ==========================================
  productList.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart-btn")) {
      const productId = parseInt(e.target.dataset.id, 10);
      addToCart(productId);
    }
  });

  cartTableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const index = parseInt(e.target.dataset.index, 10);
      removeFromCart(index);
    }
  });

  cartTableBody.addEventListener("input", (e) => {
    if (e.target.classList.contains("cart-quantity-input")) {
      const index = parseInt(e.target.dataset.index, 10);
      const newQuantity = e.target.value;
      if (newQuantity > 0) {
        changeQuantity(index, newQuantity);
      }
    }
  });

  floatingCartBtn.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  downloadPdfBtn.addEventListener("click", downloadPDF);

  // ==========================================
  // INICIALIZAR
  // ==========================================
  displayProducts();
});