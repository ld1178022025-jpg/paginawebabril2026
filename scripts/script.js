// ============================================
// ADMINISTRADOR DE PRODUCTOS - SCRIPT.JS
// ============================================

// Estado global
const appState = {
    products: [
        {
            id: 1,
            name: 'Laptop Pro X1',
            sku: 'LPX1-2024',
            category: 'Electrónica',
            specialty: 'Premium',
            price: 1299,
            stock: 34,
            sold: 245,
            status: 'En Stock'
        },
        {
            id: 2,
            name: 'Monitor 4K',
            sku: 'MON-4K24',
            category: 'Electrónica',
            specialty: 'Premium',
            price: 599,
            stock: 12,
            sold: 124,
            status: 'Bajo Stock'
        },
        {
            id: 3,
            name: 'Teclado Mecánico',
            sku: 'KBD-MEC24',
            category: 'Accesorios',
            specialty: 'Profesional',
            price: 189,
            stock: 56,
            sold: 156,
            status: 'En Stock'
        },
        {
            id: 4,
            name: 'Mouse Inalámbrico',
            sku: 'MSE-WLS24',
            category: 'Accesorios',
            specialty: 'Económico',
            price: 49,
            stock: 2,
            sold: 189,
            status: 'Agotado'
        },
        {
            id: 5,
            name: 'Headphones Pro',
            sku: 'HPH-PRO24',
            category: 'Accesorios',
            specialty: 'Premium',
            price: 299,
            stock: 23,
            sold: 87,
            status: 'En Stock'
        }
    ],
    customers: [
        { id: 1, name: 'María García', email: 'maria@example.com', total: 1299, lastPurchase: 'hace 2 min' },
        { id: 2, name: 'Carlos López', email: 'carlos@example.com', total: 599, lastPurchase: 'hace 15 min' },
        { id: 3, name: 'Ana Martínez', email: 'ana@example.com', total: 189, lastPurchase: 'hace 28 min' }
    ]
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeNavigationEvents();
    console.log('[ProduAdmin] Dashboard iniciado correctamente');
});

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Botón agregar producto
    const btnAddProduct = document.querySelector('.btn-primary');
    if (btnAddProduct) {
        btnAddProduct.addEventListener('click', openProductModal);
    }

    // Botones editar y eliminar
    const editButtons = document.querySelectorAll('.btn-icon:not(.btn-danger)');
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('[ProduAdmin] Editar producto');
            showNotification('Función de edición en desarrollo', 'info');
        });
    });

    const deleteButtons = document.querySelectorAll('.btn-icon.btn-danger');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                deleteProduct(e.target);
                showNotification('Producto eliminado', 'success');
            }
        });
    });

    // Filtros
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            applyFilters();
        });
    });

    // Modal
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeProductModal);
    }

    // Overlay modal
    const modalOverlay = document.getElementById('addProductModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeProductModal();
            }
        });
    }

    // Botones del modal
    const modalBtnSave = document.querySelector('.modal-footer .btn-primary');
    const modalBtnCancel = document.querySelector('.modal-footer .btn-secondary');

    if (modalBtnSave) {
        modalBtnSave.addEventListener('click', saveNewProduct);
    }

    if (modalBtnCancel) {
        modalBtnCancel.addEventListener('click', closeProductModal);
    }
}

// ============================================
// NAVEGACIÓN DEL SIDEBAR
// ============================================
function initializeNavigationEvents() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') {
                navItems.forEach(i => i.classList.remove('active'));
                if (e.target.tagName === 'A') {
                    e.target.classList.add('active');
                } else {
                    e.target.closest('.nav-item').classList.add('active');
                }
            }
        });
    });
}

// ============================================
// FUNCIONES DEL MODAL
// ============================================
function openProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.add('active');
    console.log('[ProduAdmin] Modal de agregar producto abierto');
}

function closeProductModal() {
    const modal = document.getElementById('addProductModal');
    modal.classList.remove('active');
    resetProductForm();
    console.log('[ProduAdmin] Modal de agregar producto cerrado');
}

function resetProductForm() {
    const form = document.querySelector('.product-form');
    if (form) {
        form.reset();
    }
}

// ============================================
// GUARDAR PRODUCTO
// ============================================
function saveNewProduct() {
    const form = document.querySelector('.product-form');
    
    const formData = {
        id: appState.products.length + 1,
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        specialty: document.getElementById('productSpecialty').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value
    };

    // Validar datos
    if (!formData.name || !formData.price || formData.stock === undefined) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    // Agregar al estado
    appState.products.push(formData);
    
    console.log('[ProduAdmin] Nuevo producto guardado:', formData);
    showNotification(`Producto "${formData.name}" agregado correctamente`, 'success');
    
    closeProductModal();
    updateProductsTable();
}

// ============================================
// ELIMINAR PRODUCTO
// ============================================
function deleteProduct(button) {
    const row = button.closest('tr');
    const productName = row.querySelector('.product-cell span:nth-child(2)').textContent;
    row.remove();
    console.log('[ProduAdmin] Producto eliminado:', productName);
}

// ============================================
// FILTROS
// ============================================
function applyFilters() {
    const categoryFilter = document.querySelector('select').value;
    console.log('[ProduAdmin] Filtros aplicados - Categoría:', categoryFilter);
    
    const tableRows = document.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
        // Lógica de filtrado aquí
        row.style.display = 'table-row';
    });
}

// ============================================
// ACTUALIZAR TABLA
// ============================================
function updateProductsTable() {
    const tbody = document.querySelector('tbody');
    
    // Obtener filas existentes
    const newRows = appState.products.map((product, index) => {
        if (index < 5) return null; // Las primeras 5 ya están en la tabla
        
        return `
            <tr>
                <td class="product-cell">
                    <span class="product-icon">📦</span>
                    <span>${product.name}</span>
                </td>
                <td>${product.sku || 'N/A'}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.sold || 0}</td>
                <td><span class="status-badge status-active">En Stock</span></td>
                <td class="action-buttons">
                    <button class="btn-icon" title="Editar">✏️</button>
                    <button class="btn-icon btn-danger" title="Eliminar">🗑️</button>
                </td>
            </tr>
        `;
    });

    // Agregar nuevas filas
    newRows.forEach(row => {
        if (row) tbody.insertAdjacentHTML('beforeend', row);
    });
}

// ============================================
// NOTIFICACIONES
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);

    console.log(`[ProduAdmin] Notificación (${type}):`, message);
}

// ============================================
// ESTADÍSTICAS
// ============================================
function updateStatistics() {
    const stats = {
        totalSales: appState.products.reduce((sum, p) => sum + (p.price * p.sold), 0),
        totalProducts: appState.products.length,
        totalStock: appState.products.reduce((sum, p) => sum + p.stock, 0),
        lowStock: appState.products.filter(p => p.stock < 10).length
    };

    console.log('[ProduAdmin] Estadísticas actualizadas:', stats);
    return stats;
}

// ============================================
// BÚSQUEDA
// ============================================
const searchInput = document.querySelector('.search-bar input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            const productName = row.querySelector('.product-cell span:nth-child(2)').textContent.toLowerCase();
            row.style.display = productName.includes(query) ? 'table-row' : 'none';
        });

        if (query) {
            console.log('[ProduAdmin] Búsqueda:', query);
        }
    });
}

// ============================================
// GESTIÓN DE CATEGORÍAS
// ============================================

// Estado de categorías
const categories = [
    {
        id: 1,
        name: 'Electrónica',
        icon: '💻',
        description: 'Dispositivos electrónicos de última generación',
        color: '#486282',
        productCount: 12
    },
    {
        id: 2,
        name: 'Accesorios',
        icon: '🖱️',
        description: 'Periféricos y accesorios para computadoras',
        color: '#a68088',
        productCount: 8
    },
    {
        id: 3,
        name: 'Software',
        icon: '💾',
        description: 'Aplicaciones y programas de software',
        color: '#a4b5c4',
        productCount: 5
    },
    {
        id: 4,
        name: 'Cables y Conectores',
        icon: '🔌',
        description: 'Cables, adaptadores y accesorios de conexión',
        color: '#e3c39d',
        productCount: 15
    }
];

// Funciones de categorías
function openCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeCategoryModal() {
    const modal = document.getElementById('addCategoryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function addNewCategory() {
    const nameInput = document.getElementById('categoryName');
    const iconInput = document.getElementById('categoryIcon');
    const descInput = document.getElementById('categoryDescription');
    const colorInput = document.getElementById('categoryColor');

    const name = nameInput.value.trim();
    const icon = iconInput.value.trim();
    const description = descInput.value.trim();
    const color = colorInput.value;

    if (!name) {
        showNotification('Por favor ingresa el nombre de la categoría', 'error');
        return;
    }

    const newCategory = {
        id: categories.length + 1,
        name: name,
        icon: icon || '📦',
        description: description || 'Nueva categoría',
        color: color,
        productCount: 0
    };

    categories.push(newCategory);
    renderCategories();
    resetCategoryForm();
    closeCategoryModal();
    showNotification(`Categoría "${name}" creada exitosamente`, 'success');
}

function deleteCategory(categoryId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        const index = categories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            const categoryName = categories[index].name;
            categories.splice(index, 1);
            renderCategories();
            showNotification(`Categoría "${categoryName}" eliminada`, 'success');
        }
    }
}

function renderCategories() {
    const categoriesGrid = document.querySelector('.categories-grid');
    if (!categoriesGrid) return;

    categoriesGrid.innerHTML = categories.map(category => `
        <div class="category-card">
            <div class="category-header">
                <span class="category-icon">${category.icon}</span>
                <h3 class="category-name">${category.name}</h3>
            </div>
            <div class="category-info">
                <p class="category-products">${category.productCount} productos</p>
                <p class="category-description">${category.description}</p>
            </div>
            <div class="category-actions">
                <button class="btn-secondary-small" onclick="editCategory(${category.id})" title="Editar">✏️ Editar</button>
                <button class="btn-danger-small" onclick="deleteCategory(${category.id})" title="Eliminar">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryIcon').value = category.icon;
        document.getElementById('categoryDescription').value = category.description;
        document.getElementById('categoryColor').value = category.color;
        updateColorPreview();
        openCategoryModal();
    }
}

function resetCategoryForm() {
    document.getElementById('categoryName').value = '';
    document.getElementById('categoryIcon').value = '';
    document.getElementById('categoryDescription').value = '';
    document.getElementById('categoryColor').value = '#486282';
    updateColorPreview();
}

function updateColorPreview() {
    const colorInput = document.getElementById('categoryColor');
    const preview = document.getElementById('colorPreview');
    if (preview && colorInput) {
        preview.style.backgroundColor = colorInput.value;
    }
}

// Funciones de navegación
function navigateToSection(sectionId) {
    // Ocultar todas las secciones
    const allSections = document.querySelectorAll('.dashboard-section, .products-section, .inventory-section, .categories-section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });

    // Mostrar la sección seleccionada
    if (sectionId === 'dashboard') {
        const dashboardSection = document.querySelector('.dashboard-section');
        if (dashboardSection) dashboardSection.style.display = 'block';
        document.querySelector('.page-title').textContent = 'Dashboard';
    } else if (sectionId === 'productos') {
        const productsSection = document.querySelector('.products-section');
        if (productsSection) productsSection.style.display = 'block';
        document.querySelector('.page-title').textContent = 'Gestión de Productos';
    } else if (sectionId === 'inventario') {
        const inventorySection = document.querySelector('.inventory-section');
        if (inventorySection) inventorySection.style.display = 'block';
        document.querySelector('.page-title').textContent = 'Estado del Inventario';
    } else if (sectionId === 'categorias') {
        const categoriesSection = document.querySelector('.categories-section');
        if (categoriesSection) categoriesSection.style.display = 'block';
        document.querySelector('.page-title').textContent = 'Gestión de Categorías';
    }

    // Actualizar nav items activos
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
}

// Event listeners para categorías
document.addEventListener('DOMContentLoaded', () => {
    // Navegación
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                navigateToSection(sectionId);
            }
        });
    });

    // Botón para abrir modal de nueva categoría
    const addCategoryBtn = document.getElementById('addCategoryBtn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', openCategoryModal);
    }

    // Botón para guardar categoría
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    if (saveCategoryBtn) {
        saveCategoryBtn.addEventListener('click', addNewCategory);
    }

    // Botón para cancelar
    const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', closeCategoryModal);
    }

    // Color picker listener
    const colorInput = document.getElementById('categoryColor');
    if (colorInput) {
        colorInput.addEventListener('change', updateColorPreview);
    }

    // Cerrar modal al hacer clic en overlay
    const categoryModal = document.getElementById('addCategoryModal');
    if (categoryModal) {
        categoryModal.addEventListener('click', (e) => {
            if (e.target === categoryModal) {
                closeCategoryModal();
            }
        });
    }

    // Cerrar modal con botón X
    const closeButtons = document.querySelectorAll('.modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal-overlay');
            if (modal) {
                if (modal.id === 'addCategoryModal') {
                    closeCategoryModal();
                }
            }
        });
    });

    // Renderizar categorías iniciales
    renderCategories();
});

// ============================================
// ANIMACIONES CSS ADICIONALES
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    /* Estilos de notificaciones */
    .notification-success {
        background-color: #4CAF50 !important;
    }

    .notification-error {
        background-color: #f44336 !important;
    }

    .notification-info {
        background-color: #2196F3 !important;
    }
`;
document.head.appendChild(style);

// ============================================
// EXPORTAR FUNCIONES PARA DEPURACIÓN
// ============================================
window.ProduAdmin = {
    appState,
    categories,
    updateStatistics,
    showNotification,
    openProductModal,
    closeProductModal,
    openCategoryModal,
    closeCategoryModal,
    addNewCategory,
    deleteCategory,
    editCategory,
    renderCategories,
    updateColorPreview
};

console.log('[ProduAdmin] Sistema completamente inicializado - Usa window.ProduAdmin para acceder a funciones');
