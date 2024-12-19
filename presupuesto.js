document.addEventListener("DOMContentLoaded", async () => {
  /* ============================
     VARIABLES GLOBALES
  ============================ */
  const productList = document.getElementById("product-list");
  const cartTableBody = document.querySelector("#cart-table tbody");
  const mobileCart = document.getElementById("mobile-cart");
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
  const logoutButton = document.getElementById("logout-button");

  let cart = [];
  let currentUser = null;
  let auth0 = null;

  /* ============================
     CONFIGURAR AUTH0
  ============================ */
  const configureAuth0 = async () => {
    auth0 = await createAuth0Client({
      domain: "dev-2zwsngd50sx2meco.us.auth0.com", // Reemplaza con tu dominio de Auth0
      client_Id: "Dy2cBcYHam3IFtXzYo3vTkvPEknafOa4", // Reemplaza con tu Client ID
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    });
  };

  /* ============================
     VALIDAR SESIÓN
  ============================ */
  const checkAuthentication = async () => {
    const isAuthenticated = await auth0.isAuthenticated();

    if (!isAuthenticated) {
      alert("No has iniciado sesión. Redirigiéndote a iniciar sesión...");
      window.location.href = "iniciar.html";
      return;
    }

    currentUser = await auth0.getUser();
    console.log("Usuario autenticado:", currentUser);
    alert(`¡Bienvenido, ${currentUser.name || "Usuario"}!`);
  };

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

    assignAddToCartEvents();
  };

  const assignAddToCartEvents = () => {
    productList.addEventListener("click", (event) => {
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
    if (isMobile) mobileCart.innerHTML = "";

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
  await configureAuth0();
  await checkAuthentication();
  renderProducts();
  updateCartUI();
});