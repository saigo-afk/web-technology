// Shopping Cart Functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadCartFromStorage();
});

// Add product to cart
function addToCart(productName, price) {
    const product = {
        id: Date.now(),
        name: productName,
        price: price,
        quantity: 1
    };

    // Check if product already exists in cart
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();

    // Show success message
    showNotification(`${productName} added to cart!`, 'success');
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

// Update quantity
function updateQuantity(productId, newQuantity) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity = parseInt(newQuantity);
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-muted">Your cart is empty</p>';
        cartTotalElement.textContent = '0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h6>${item.name}</h6>
                    <p>$${item.price.toFixed(2)} × ${item.quantity} = $${itemTotal.toFixed(2)}</p>
                </div>
                <button class="cart-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    cartTotalElement.textContent = total.toFixed(2);
    updateCartCount();
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    cartSidebar.classList.toggle('show');
    cartOverlay.classList.toggle('show');
}

// Load cart from storage
function loadCartFromStorage() {
    updateCartDisplay();
}

// Product Filter and Search Functions
function applyFilters() {
    const categoryFilters = {
        'Audio': document.getElementById('category-audio')?.checked || false,
        'Charging': document.getElementById('category-charging')?.checked || false,
        'Protection': document.getElementById('category-protection')?.checked || false,
        'Accessories': document.getElementById('category-accessories')?.checked || false
    };

    const priceFilters = {
        '0-25': document.getElementById('price-0-25')?.checked || false,
        '25-50': document.getElementById('price-25-50')?.checked || false,
        '50-100': document.getElementById('price-50-100')?.checked || false,
        '100plus': document.getElementById('price-100plus')?.checked || false
    };

    const ratingFilters = {
        '5': document.getElementById('rating-5')?.checked || false,
        '4': document.getElementById('rating-4')?.checked || false,
        '3': document.getElementById('rating-3')?.checked || false
    };

    const products = document.querySelectorAll('.product-item');

    products.forEach(product => {
        let show = true;

        // Category filter
        const category = product.getAttribute('data-category');
        const categoryActive = Object.values(categoryFilters).some(v => v);
        if (categoryActive && !categoryFilters[category]) {
            show = false;
        }

        // Price filter
        const price = parseFloat(product.getAttribute('data-price'));
        const priceActive = Object.values(priceFilters).some(v => v);
        if (priceActive) {
            let priceMatch = false;
            if (priceFilters['0-25'] && price <= 25) priceMatch = true;
            if (priceFilters['25-50'] && price > 25 && price <= 50) priceMatch = true;
            if (priceFilters['50-100'] && price > 50 && price <= 100) priceMatch = true;
            if (priceFilters['100plus'] && price > 100) priceMatch = true;

            if (!priceMatch) show = false;
        }

        // Rating filter
        const rating = parseFloat(product.getAttribute('data-rating'));
        const ratingActive = Object.values(ratingFilters).some(v => v);
        if (ratingActive) {
            let ratingMatch = false;
            if (ratingFilters['5'] && rating === 5) ratingMatch = true;
            if (ratingFilters['4'] && rating >= 4) ratingMatch = true;
            if (ratingFilters['3'] && rating >= 3) ratingMatch = true;

            if (!ratingMatch) show = false;
        }

        product.style.display = show ? 'block' : 'none';
    });
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const products = document.querySelectorAll('.product-item');

    products.forEach(product => {
        const productName = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
        const productDesc = product.querySelector('.product-description')?.textContent.toLowerCase() || '';

        if (productName.includes(searchInput) || productDesc.includes(searchInput)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// Sort products
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect')?.value || 'featured';
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(productsGrid.querySelectorAll('.product-item'));

    products.sort((a, b) => {
        const getPrice = (el) => parseFloat(el.getAttribute('data-price'));
        const getRating = (el) => parseFloat(el.getAttribute('data-rating'));

        switch(sortSelect) {
            case 'price-low':
                return getPrice(a) - getPrice(b);
            case 'price-high':
                return getPrice(b) - getPrice(a);
            case 'rating':
                return getRating(b) - getRating(a);
            case 'newest':
                return b.dataset.new - a.dataset.new;
            default:
                return 0;
        }
    });

    productsGrid.innerHTML = '';
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

// Clear filters
function clearFilters() {
    // Uncheck all checkboxes
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Show all products
    const products = document.querySelectorAll('.product-item');
    products.forEach(product => {
        product.style.display = 'block';
    });
}

// Contact Form Validation and Submission
function handleContactForm(event) {
    event.preventDefault();

    // Get form elements
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const agree = document.getElementById('agree');

    // Validate form
    let isValid = true;

    // First Name validation
    if (firstName.value.trim() === '') {
        document.getElementById('firstNameError').classList.remove('d-none');
        isValid = false;
    } else {
        document.getElementById('firstNameError').classList.add('d-none');
    }

    // Last Name validation
    if (lastName.value.trim() === '') {
        document.getElementById('lastNameError').classList.remove('d-none');
        isValid = false;
    } else {
        document.getElementById('lastNameError').classList.add('d-none');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        document.getElementById('emailError').classList.remove('d-none');
        isValid = false;
    } else {
        document.getElementById('emailError').classList.add('d-none');
    }

    // Subject validation
    if (subject.value === '') {
        document.getElementById('subjectError').classList.remove('d-none');
        isValid = false;
    } else {
        document.getElementById('subjectError').classList.add('d-none');
    }

    // Message validation
    if (message.value.trim().length < 10) {
        document.getElementById('messageError').classList.remove('d-none');
        isValid = false;
    } else {
        document.getElementById('messageError').classList.add('d-none');
    }

    // Agreement validation
    if (!agree.checked) {
        document.getElementById('agreeError').classList.remove('d-none');
        isValid = false;
    } else {
        document.getElementById('agreeError').classList.add('d-none');
    }

    if (isValid) {
        // Show success message
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.remove('d-none');

        // Reset form
        document.getElementById('contactForm').reset();

        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('d-none');
        }, 5000);
    }
}

// Notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
    });
}

// Close cart sidebar when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartToggleBtns = document.querySelectorAll('[onclick="toggleCart()"]');
    
    if (cartSidebar && cartSidebar.classList.contains('show')) {
        let isClickInside = false;
        
        if (cartSidebar.contains(event.target)) {
            isClickInside = true;
        }
        
        cartToggleBtns.forEach(btn => {
            if (btn.contains(event.target)) {
                isClickInside = true;
            }
        });

        if (!isClickInside) {
            toggleCart();
        }
    }
});
