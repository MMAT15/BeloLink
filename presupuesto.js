document.addEventListener("DOMContentLoaded", function () {
    const products = [
      { id: 1, name: "Router Inteligente", price: 12000, image: "router.jpg" },
      { id: 2, name: "Switch 8 Puertos", price: 8000, image: "switch.jpg" },
      { id: 3, name: "Cable de Red 10m", price: 1500, image: "cable.jpg" },
      { id: 4, name: "Cámara Exterior", price: 25000, image: "camara.jpg" },
      { id: 5, name: "Luz Inteligente", price: 3000, image: "luz.jpg" },
      { id: 6, name: "Sensor Inteligente", price: 5000, image: "sensor.jpg" },
    ];
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const productList = document.getElementById("product-list");
    const cartTableBody = document.querySelector("#cart-table tbody");
  
    // Mostrar productos
    function renderProducts() {
      productList.innerHTML = products.map(product => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>Precio: $${product.price}</p>
          <button onclick="addToCart(${product.id})">Agregar</button>
        </div>
      `).join("");
    }
  
    // Agregar producto al carrito
    window.addToCart = function (id) {
      const product = products.find(p => p.id === id);
      const existing = cart.find(p => p.id === id);
      if (existing) existing.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      updateCart();
    };
  
    // Eliminar producto
    window.removeFromCart = function (id) {
      const index = cart.findIndex(p => p.id === id);
      if (index !== -1) cart.splice(index, 1);
      updateCart();
    };
  
    // Actualizar carrito
    function updateCart() {
      cartTableBody.innerHTML = cart.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>$${item.price}</td>
          <td><input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${item.id}, this.value)"></td>
          <td>$${item.price * item.quantity}</td>
          <td><button onclick="removeFromCart(${item.id})">Eliminar</button></td>
        </tr>
      `).join("");
      calculateSummary();
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    window.updateQuantity = function (id, quantity) {
      const product = cart.find(p => p.id === id);
      if (product) product.quantity = parseInt(quantity);
      updateCart();
    };
  
    function calculateSummary() {
      const subtotal = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const laborCost = subtotal * 0.15;
      const total = subtotal + laborCost;
  
      document.getElementById("subtotal").textContent = subtotal.toFixed(2);
      document.getElementById("labor-cost").textContent = laborCost.toFixed(2);
      document.getElementById("total").textContent = total.toFixed(2);
    }
  
    // Descargar PDF
    document.getElementById("download-pdf").addEventListener("click", () => {
      const content = document.querySelector(".cart").innerHTML;
      const pdf = window.open();
      pdf.document.write(`<html><head><title>Presupuesto</title></head><body>${content}</body></html>`);
      pdf.document.close();
      pdf.print();
    });
  
    renderProducts();
    updateCart();
  });