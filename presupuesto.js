document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // VARIABLES GLOBALES
  // ================================
  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const subtotalElement = document.getElementById("subtotal");
  const laborCostElement = document.getElementById("labor-cost");
  const totalElement = document.getElementById("total");
  const backToTopBtn = document.getElementById("back-to-top");
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector("nav");
  const downloadBtn = document.getElementById("download-pdf");
  const modal = document.getElementById("cart-modal");
  const closeModal = document.getElementById("close-modal");
  let cart = [];

  // ================================
  // DATOS DE PRODUCTOS
  // ================================
  const products = [
    { id: 1, name: "Cámara Exterior Inteligente", price: 120, img: "img/Camaraexterior.webp" },
    { id: 2, name: "Luces Inteligentes Philips Hue", price: 50, img: "img/phillipshue.jpeg" },
    { id: 3, name: "Sensor de Movimiento", price: 30, img: "img/sensormov.jpeg" },
    { id: 4, name: "Switch Inteligente", price: 70, img: "img/switch.jpg" },
    { id: 5, name: "Cable de Red (10m)", price: 10, img: "img/cablered.jpg" },
    { id: 6, name: "Router Inteligente", price: 90, img: "img/router.webp" },
  ];

  // ================================
  // FUNCIONES GENERALES
  // ================================
  function renderProducts() {
    products.forEach(product => {
      const productCard = `
        <div class="product-card">
          <img src="${product.img}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>Precio: $${product.price}</p>
          <button onclick="addToCart(${product.id})">Agregar</button>
        </div>
      `;
      productList.innerHTML += productCard;
    });
  }

  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
  }

  function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
      item.quantity = parseInt(quantity, 10);
      renderCart();
    }
  }

  function calculateTotals() {
    let subtotal = 0;
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
    });
    const laborCost = subtotal * 0.15;
    const total = subtotal + laborCost;

    subtotalElement.textContent = subtotal.toFixed(2);
    laborCostElement.textContent = laborCost.toFixed(2);
    totalElement.textContent = total.toFixed(2);
  }

  function renderCart() {
    cartTableBody.innerHTML = "";
    cart.forEach(item => {
      const row = `
        <tr>
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td>
            <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)">
          </td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td>
            <button onclick="removeFromCart(${item.id})" class="remove-btn">Eliminar</button>
          </td>
        </tr>
      `;
      cartTableBody.innerHTML += row;
    });
    calculateTotals();
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleMenu() {
    nav.classList.toggle("active");
  }

  function downloadPDF() {
    const element = document.querySelector(".cart");
    const options = {
      margin: 10,
      filename: "presupuesto.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(options).from(element).save();
  }

  function openModal() {
    modal.style.display = "flex";
  }

  function closeModalFunc() {
    modal.style.display = "none";
  }

  // ================================
  // EVENTOS
  // ================================
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;

  backToTopBtn.addEventListener("click", scrollToTop);
  menuToggle.addEventListener("click", toggleMenu);
  downloadBtn.addEventListener("click", downloadPDF);
  closeModal.addEventListener("click", closeModalFunc);
  window.addEventListener("click", event => {
    if (event.target === modal) closeModalFunc();
  });

  // ================================
  // INICIALIZACIÓN
  // ================================
  renderProducts();
});