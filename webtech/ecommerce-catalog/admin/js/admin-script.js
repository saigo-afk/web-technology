// Admin Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Admin default credentials
    const validEmail = 'admin@techgear.com';
    const validPassword = 'admin123';

    // Clear previous errors
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    emailInput.classList.remove('is-invalid');
    passwordInput.classList.remove('is-invalid');

    // Validate credentials
    if (email === validEmail && password === validPassword) {
        // Store login state in localStorage
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminEmail', email);
        
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 500);
    } else {
        // Show error message
        emailInput.classList.add('is-invalid');
        passwordInput.classList.add('is-invalid');
        
        showNotification('Invalid email or password. Please try again.', 'danger');
    }
}

// Check if admin is logged in
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    const currentPage = window.location.pathname;

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && !currentPage.includes('index.html') && !currentPage.includes('admin/')) {
        window.location.href = 'index.html';
    }
}

// Sidebar Toggle
function openSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.add('show');
        overlay.classList.add('show');
    }
}

function closeSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
    }
}

// Close sidebar on link click (mobile)
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        });
    });
});

// Product Management
function searchProducts() {
    const searchInput = document.getElementById('searchProducts');
    if (!searchInput) return;

    const searchTerm = searchInput.value.toLowerCase();
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const productName = row.querySelector('td:first-child').textContent.toLowerCase();
        const sku = row.querySelector('td:nth-child(2)').textContent.toLowerCase();

        if (productName.includes(searchTerm) || sku.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterProducts() {
    const filterSelect = document.getElementById('filterCategory');
    if (!filterSelect) return;

    const selectedCategory = filterSelect.value;
    const tableRows = document.querySelectorAll('tbody tr');

    tableRows.forEach(row => {
        const categoryBadge = row.querySelector('td:nth-child(3)').textContent;

        if (selectedCategory === '' || categoryBadge.toLowerCase().includes(selectedCategory)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add event listeners for search and filter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('keyup', searchProducts);
    }

    const filterSelect = document.getElementById('filterCategory');
    if (filterSelect) {
        filterSelect.addEventListener('change', filterProducts);
    }
});

// Order Management
function updateOrderStatus(orderId, newStatus) {
    const statusBadge = document.querySelector(`[data-order-id="${orderId}"] .order-status`);
    if (statusBadge) {
        statusBadge.innerHTML = `<span class="badge bg-${getStatusColor(newStatus)}">${newStatus}</span>`;
        showNotification(`Order ${orderId} status updated to ${newStatus}`);
    }
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'danger';
        case 'processing':
            return 'warning';
        case 'shipped':
            return 'info';
        case 'delivered':
            return 'success';
        default:
            return 'secondary';
    }
}

// Export Order as PDF/CSV
function exportOrder(orderId) {
    showNotification(`Exporting order ${orderId}...`);
    // In a real application, this would generate and download a file
    console.log('Export order:', orderId);
}

// User Management
function blockUser(userId) {
    if (confirm('Are you sure you want to block this user?')) {
        showNotification(`User ${userId} has been blocked`);
        // Update UI
    }
}

function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        showNotification(`User ${userId} has been deleted`);
        // Update UI
    }
}

// Utility Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 1050; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Dashboard Chart Animation
function animateChart() {
    const bars = document.querySelectorAll('.chart-svg rect');
    bars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.animation = 'slideUp 0.5s ease forwards';
        }, index * 50);
    });
}

// Settings Form Handling
function saveSettings(event) {
    event.preventDefault();
    showNotification('Settings saved successfully!');
}

// Logout
function logout() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    window.location.href = 'index.html';
}

// Auto-logout after inactivity (optional)
let inactivityTimeout;

function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    
    // Set timeout to 30 minutes of inactivity
    inactivityTimeout = setTimeout(() => {
        logout();
    }, 30 * 60 * 1000);
}

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);
document.addEventListener('click', resetInactivityTimer);

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    resetInactivityTimer();
});

// Window Resize Handler
window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
        closeSidebar();
    }
});

// Keyboard Shortcuts (optional)
document.addEventListener('keydown', function(event) {
    // Alt + D for Dashboard
    if (event.altKey && event.key === 'd') {
        window.location.href = 'dashboard.html';
    }
    // Alt + P for Products
    if (event.altKey && event.key === 'p') {
        window.location.href = 'products.html';
    }
    // Alt + O for Orders
    if (event.altKey && event.key === 'o') {
        window.location.href = 'orders.html';
    }
    // Alt + U for Users
    if (event.altKey && event.key === 'u') {
        window.location.href = 'users.html';
    }
});

// Form Validation Helper
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;

    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (field.value.trim() === '') {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });

    return isValid;
}

// Delete Confirmation
function confirmDelete(itemName) {
    return confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`);
}

// Responsive Card Height
function equalizeCardHeights() {
    if (window.innerWidth >= 768) {
        const cards = document.querySelectorAll('.stat-card');
        let maxHeight = 0;

        cards.forEach(card => {
            card.style.height = 'auto';
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });

        cards.forEach(card => {
            card.style.height = maxHeight + 'px';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    equalizeCardHeights();
});

window.addEventListener('resize', function() {
    equalizeCardHeights();
});

// Data Export
function exportToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;

    let csv = [];
    const rows = table.querySelectorAll('tr');

    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        let csvRow = [];

        cols.forEach(col => {
            csvRow.push(`"${col.textContent.trim()}"`);
        });

        csv.push(csvRow.join(','));
    });

    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}

// Print Table
function printTable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>body { font-family: Arial; } table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}
