// Navbar responsive (menu hamburguesa)
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.getElementById("main-nav").querySelector("ul");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active"); // Activa o desactiva el menú
    });

    // Variables globales para el carrito
    const cartButton = document.querySelector(".cart-button");
    const cartCount = document.getElementById("cartCount");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Actualiza el contador del carrito
    function updateCartCount() {
        const totalCount = cart.reduce((total, item) => {
            return total + (item.quantity || 0); // Asegúrate de que quantity siempre sea un número
        }, 0);
        cartCount.textContent = totalCount;
    }

    // Guardar el carrito en localStorage
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Renderiza productos en cards
    async function renderProducts() {
        const productsContainer = document.getElementById("products");
        const mensClothingUrl = "https://fakestoreapi.com/products/category/men's%20clothing";
        const womensClothingUrl = "https://fakestoreapi.com/products/category/women's%20clothing";

        try {
            const [mensClothing, womensClothing] = await Promise.all([
                fetch(mensClothingUrl).then(res => res.json()),
                fetch(womensClothingUrl).then(res => res.json())
            ]);

            const products = [...mensClothing, ...womensClothing];

            productsContainer.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price ? product.price.toFixed(2) : "0.00"}</p>
                    <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price || 0}" data-image="${product.image}">Agregar al carrito</button>
                </div>
            `).join("");

            // Agregar eventos a los botones de agregar al carrito
            document.querySelectorAll(".add-to-cart").forEach(button => {
                button.addEventListener("click", addToCart);
            });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Agregar productos al carrito
    function addToCart(event) {
        const button = event.target;
        const id = button.dataset.id;
        const title = button.dataset.title;
        const price = parseFloat(button.dataset.price);
        const image = button.dataset.image;

        // Valida que el precio sea un número
        if (isNaN(price)) {
            console.error("El precio del producto no es válido:", price);
            return;
        }

        // Busca el producto en el carrito
        const existingProduct = cart.find(item => item.id === id);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.push({ id, title, price, image, quantity: 1 });
        }

        saveCart(); // Guarda en localStorage
        updateCartCount(); // Actualiza el contador
    }

    // Redirigir al carrito
    cartButton.addEventListener("click", () => {
        window.location.href = "carrito.html";
    });

    // Inicializa el carrito en la página carrito.html
    function renderCartPage() {
        const cartTableBody = document.querySelector("#cartTable tbody");
        const cartTotalElement = document.getElementById("cartTotal");
        const clearCartButton = document.getElementById("clearCart");

        function updateCartDisplay() {
            cartTableBody.innerHTML = cart.map(item => `
                <tr>
                    <td><img src="${item.image}" alt="${item.title}" class="cart-product-image"></td>
                    <td>${item.title}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" min="1" value="${item.quantity || 1}" data-id="${item.id}" class="quantity-input">
                    </td>
                    <td>$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</td>
                    <td>
                        <button class="remove-item" data-id="${item.id}">Eliminar</button>
                    </td>
                </tr>
            `).join("");

            // Calcula el total general del carrito
            const total = cart.reduce((sum, item) => {
                return sum + ((item.price || 0) * (item.quantity || 1)); // Asegúrate de evitar NaN
            }, 0);
            cartTotalElement.textContent = `$${total.toFixed(2)}`;
        }

        cartTableBody.addEventListener("input", event => {
            if (event.target.classList.contains("quantity-input")) {
                const id = event.target.dataset.id;
                const newQuantity = parseInt(event.target.value, 10);
                const product = cart.find(item => item.id === id);

                if (product && newQuantity > 0) {
                    product.quantity = newQuantity;
                    saveCart();
                    updateCartDisplay();
                    updateCartCount();
                }
            }
        });

        cartTableBody.addEventListener("click", event => {
            if (event.target.classList.contains("remove-item")) {
                const id = event.target.dataset.id;
                cart = cart.filter(item => item.id !== id);
                saveCart();
                updateCartDisplay();
                updateCartCount();
            }
        });

        clearCartButton.addEventListener("click", () => {
            cart = [];
            saveCart();
            updateCartDisplay();
            updateCartCount();
        });

        updateCartDisplay();
    }

    // Detectar si estamos en la página carrito.html
    if (window.location.pathname.includes("carrito.html")) {
        renderCartPage();
    }

    // Renderizar sección de reseñas
    function renderReviews() {
        const reviewTexts = document.querySelectorAll(".review-text");

        reviewTexts.forEach(review => {
            if (review.textContent.length > 100) {
                const originalText = review.textContent;
                const truncatedText = originalText.slice(0, 100) + "...";

                review.textContent = truncatedText;

                const readMoreBtn = document.createElement("button");
                readMoreBtn.textContent = "Leer más";
                readMoreBtn.style.background = "none";
                readMoreBtn.style.color = "#3498db";
                readMoreBtn.style.border = "none";
                readMoreBtn.style.cursor = "pointer";

                review.parentElement.appendChild(readMoreBtn);

                readMoreBtn.addEventListener("click", () => {
                    if (review.textContent === truncatedText) {
                        review.textContent = originalText;
                        readMoreBtn.textContent = "Leer menos";
                    } else {
                        review.textContent = truncatedText;
                        readMoreBtn.textContent = "Leer más";
                    }
                });
            }
        });
    }

    // Inicializar
    updateCartCount();
    if (document.getElementById("products")) {
        renderProducts();
    }
    if (document.getElementById("reviews")) {
        renderReviews();
    }
});



