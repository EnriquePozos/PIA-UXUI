// Función modificada para pasar el producto seleccionado
function irACompra(productoImagen = null) {
    if (productoImagen) {
        // Redirigir con parámetro del producto seleccionado
        window.location.href = `compra.html?producto=${productoImagen}`;
    } else {
        // Redirigir sin producto específico (comportamiento por defecto)
        window.location.href = 'compra.html';
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Función para obtener parámetros URL
    function obtenerParametroURL(nombre) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(nombre);
    }
    
    // Función para seleccionar el producto
    function seleccionarProducto(imagenProducto) {
        // Buscar el select del jugo
        const selectJugo = document.getElementById('selectJugo');
        if (selectJugo) {
            // Buscar la opción que coincida con la imagen
            for (let i = 0; i < selectJugo.options.length; i++) {
                if (selectJugo.options[i].value === imagenProducto) {
                    selectJugo.selectedIndex = i;
                    // Disparar el evento change para actualizar la interfaz
                    selectJugo.dispatchEvent(new Event('change'));
                    break;
                }
            }
        }
        
        // También actualizar la miniatura activa
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.classList.remove('active');
            if (thumb.dataset.image === imagenProducto) {
                thumb.classList.add('active');
                // Actualizar la imagen principal
                const imagenJugo = document.getElementById('imagenJugo');
                if (imagenJugo) {
                    imagenJugo.src = `imagenes/${imagenProducto}`;
                }
                
                // Actualizar nombre y precio
                const productName = document.getElementById('productName');
                const currentPrice = document.getElementById('currentPrice');
                const totalPrice = document.getElementById('totalPrice');
                
                if (productName) productName.textContent = thumb.dataset.name;
                if (currentPrice) currentPrice.textContent = `$${thumb.dataset.price} MXN`;
                if (totalPrice) totalPrice.textContent = `$${thumb.dataset.price} MXN`;
            }
        });
    }
    
    // Verificar si hay un producto seleccionado en la URL
    const productoSeleccionado = obtenerParametroURL('producto');
    if (productoSeleccionado) {
        // Esperar un poco para que se cargue completamente la página
        setTimeout(() => {
            seleccionarProducto(productoSeleccionado);
        }, 100);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- GESTIÓN DEL CARRITO ---
    let cart = JSON.parse(localStorage.getItem('pennyJuiceCart')) || [];

    // Funciones del carrito
    function saveCartToStorage() {
        localStorage.setItem('pennyJuiceCart', JSON.stringify(cart));
    }

    function addToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.push({ ...product });
        }
        saveCartToStorage();
        updateCartCount();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToStorage();
        updateCartCount();
    }

    function updateCartItemQuantity(productId, newQuantity) {
        const product = cart.find(item => item.id === productId);
        if (product) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                product.quantity = newQuantity;
                saveCartToStorage();
            }
        }
        updateCartCount();
    }

    function clearCart() {
        cart = [];
        saveCartToStorage();
        updateCartCount();
    }

    function getCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function getCartItemCount() {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }

    function updateCartCount() {
        const cartCountElement = document.getElementById('cartCount');
        const count = getCartItemCount();
        if (cartCountElement) {
            cartCountElement.textContent = count;
            if (count > 0) {
                cartCountElement.style.display = 'flex';
                cartCountElement.classList.remove('bounce');
                void cartCountElement.offsetWidth; 
                cartCountElement.classList.add('bounce');
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

    // --- MODAL DEL CARRITO ---
    function createCartModal() {
        const existingModal = document.getElementById('cartModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'cartModalTitle');
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1050',
            fontFamily: 'Arial, sans-serif'
        });

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: 'var(--bg-color, white)',
            color: 'var(--text-color, #333)',
            padding: '0',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '80vh',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
        });

        // Header del modal
        const header = document.createElement('div');
        Object.assign(header.style, {
            padding: '20px 25px',
            borderBottom: '1px solid var(--border-color, #e0e0e0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--highlight-bg, #f6f8fa)'
        });

        const title = document.createElement('h2');
        title.id = 'cartModalTitle';
        title.textContent = 'Carrito de Compras';
        Object.assign(title.style, {
            margin: '0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: 'var(--text-color, #24292f)'
        });

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        Object.assign(closeBtn.style, {
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            cursor: 'pointer',
            color: 'var(--text-color, #666)',
            padding: '0',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            transition: 'all 0.3s ease'
        });
        closeBtn.addEventListener('click', () => modal.remove());
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.backgroundColor = 'var(--border-color, #e0e0e0)';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Contenido del carrito
        const cartContent = document.createElement('div');
        Object.assign(cartContent.style, {
            flex: '1',
            overflow: 'auto',
            padding: '20px 25px'
        });

        if (cart.length === 0) {
            const emptyMessage = document.createElement('div');
            Object.assign(emptyMessage.style, {
                textAlign: 'center',
                padding: '40px',
                color: 'var(--text-color, #666)'
            });
            emptyMessage.innerHTML = `
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px; opacity: 0.5;"></i>
                <p style="font-size: 1.2rem; margin-bottom: 10px;">Tu carrito está vacío</p>
                <p style="opacity: 0.7;">Agrega algunos productos para comenzar</p>
            `;
            cartContent.appendChild(emptyMessage);
        } else {
            // Lista de productos
            cart.forEach(item => {
                const productRow = document.createElement('div');
                Object.assign(productRow.style, {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 0',
                    borderBottom: '1px solid var(--border-color, #e0e0e0)',
                    gap: '15px'
                });

                // Imagen del producto
                const productImage = document.createElement('img');
                productImage.src = `imagenes/${item.image}`;
                productImage.alt = item.name;
                Object.assign(productImage.style, {
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    backgroundColor: 'var(--highlight-bg, #f6f8fa)',
                    padding: '5px'
                });

                // Información del producto
                const productInfo = document.createElement('div');
                Object.assign(productInfo.style, {
                    flex: '1'
                });

                const productName = document.createElement('h4');
                productName.textContent = item.name;
                Object.assign(productName.style, {
                    margin: '0 0 5px 0',
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: 'var(--text-color, #24292f)'
                });

                const productPrice = document.createElement('p');
                productPrice.textContent = `$${item.price.toFixed(2)} MXN`;
                Object.assign(productPrice.style, {
                    margin: '0',
                    color: 'var(--accent-color, #0969da)',
                    fontWeight: '500'
                });

                productInfo.appendChild(productName);
                productInfo.appendChild(productPrice);

                // Controles de cantidad
                const quantityControls = document.createElement('div');
                Object.assign(quantityControls.style, {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                });

                const minusBtn = document.createElement('button');
                minusBtn.innerHTML = '<i class="fas fa-minus"></i>';
                Object.assign(minusBtn.style, {
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-color, #d0d7de)',
                    backgroundColor: 'var(--bg-color, white)',
                    color: 'var(--text-color, #24292f)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease'
                });

                const quantitySpan = document.createElement('span');
                quantitySpan.textContent = item.quantity;
                Object.assign(quantitySpan.style, {
                    fontWeight: '600',
                    minWidth: '30px',
                    textAlign: 'center',
                    fontSize: '1rem'
                });

                const plusBtn = document.createElement('button');
                plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
                Object.assign(plusBtn.style, {
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--border-color, #d0d7de)',
                    backgroundColor: 'var(--accent-color, #0969da)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease'
                });

                // Botón eliminar
                const removeBtn = document.createElement('button');
                removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
                Object.assign(removeBtn.style, {
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: '1px solid var(--btn-compra-bg, #D74B4B)',
                    backgroundColor: 'var(--btn-compra-bg, #D74B4B)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease'
                });

                // Event listeners
                minusBtn.addEventListener('click', () => {
                    updateCartItemQuantity(item.id, item.quantity - 1);
                    modal.remove();
                    createCartModal();
                });

                plusBtn.addEventListener('click', () => {
                    updateCartItemQuantity(item.id, item.quantity + 1);
                    modal.remove();
                    createCartModal();
                });

                removeBtn.addEventListener('click', () => {
                    removeFromCart(item.id);
                    showNotification(`${item.name} eliminado del carrito`, 'info');
                    modal.remove();
                    createCartModal();
                });

                // Hover effects
                [minusBtn, plusBtn, removeBtn].forEach(btn => {
                    btn.addEventListener('mouseover', () => {
                        btn.style.transform = 'scale(1.1)';
                    });
                    btn.addEventListener('mouseout', () => {
                        btn.style.transform = 'scale(1)';
                    });
                });

                quantityControls.appendChild(minusBtn);
                quantityControls.appendChild(quantitySpan);
                quantityControls.appendChild(plusBtn);
                quantityControls.appendChild(removeBtn);

                productRow.appendChild(productImage);
                productRow.appendChild(productInfo);
                productRow.appendChild(quantityControls);

                cartContent.appendChild(productRow);
            });
        }

        // Footer del modal
        if (cart.length > 0) {
            const footer = document.createElement('div');
            Object.assign(footer.style, {
                padding: '20px 25px',
                borderTop: '1px solid var(--border-color, #e0e0e0)',
                backgroundColor: 'var(--highlight-bg, #f6f8fa)'
            });

            // Total
            const totalSection = document.createElement('div');
            Object.assign(totalSection.style, {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                fontSize: '1.2rem',
                fontWeight: '600'
            });

            const totalLabel = document.createElement('span');
            totalLabel.textContent = 'Total:';
            totalLabel.style.color = 'var(--text-color, #24292f)';

            const totalValue = document.createElement('span');
            totalValue.textContent = `$${getCartTotal().toFixed(2)} MXN`;
            totalValue.style.color = 'var(--accent-color, #0969da)';

            totalSection.appendChild(totalLabel);
            totalSection.appendChild(totalValue);

            // Botones
            const buttonsDiv = document.createElement('div');
            Object.assign(buttonsDiv.style, {
                display: 'flex',
                gap: '10px',
                justifyContent: 'space-between'
            });

            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Vaciar Carrito';
            Object.assign(clearBtn.style, {
                flex: '1',
                padding: '12px',
                border: '2px solid var(--btn-compra-bg, #D74B4B)',
                backgroundColor: 'transparent',
                color: 'var(--btn-compra-bg, #D74B4B)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
            });

            const checkoutBtn = document.createElement('button');
            checkoutBtn.textContent = 'Proceder al Pago';
            Object.assign(checkoutBtn.style, {
                flex: '2',
                padding: '12px',
                border: 'none',
                backgroundColor: 'var(--btn-compra-bg, #D74B4B)',
                color: 'white',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease'
            });

            // Event listeners para botones
            clearBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    clearCart();
                    showNotification('Carrito vaciado', 'info');
                    modal.remove();
                }
            });

            checkoutBtn.addEventListener('click', () => {
                if(validarSesion() == false){
                    showNotification('Debes iniciar sesión para proceder al pago.', 'error');
                    return;
                }

                modal.remove();
                showPurchaseModal(getCartItemCount(), "artículos en tu carrito", getCartTotal(), false);
            });

            // Hover effects
            clearBtn.addEventListener('mouseover', () => {
                clearBtn.style.backgroundColor = 'var(--btn-compra-bg, #D74B4B)';
                clearBtn.style.color = 'white';
            });
            clearBtn.addEventListener('mouseout', () => {
                clearBtn.style.backgroundColor = 'transparent';
                clearBtn.style.color = 'var(--btn-compra-bg, #D74B4B)';
            });

            checkoutBtn.addEventListener('mouseover', () => {
                checkoutBtn.style.backgroundColor = 'var(--btn-compra-hover, #e67b7b)';
            });
            checkoutBtn.addEventListener('mouseout', () => {
                checkoutBtn.style.backgroundColor = 'var(--btn-compra-bg, #D74B4B)';
            });

            buttonsDiv.appendChild(clearBtn);
            buttonsDiv.appendChild(checkoutBtn);

            footer.appendChild(totalSection);
            footer.appendChild(buttonsDiv);
            modalContent.appendChild(footer);
        }

        modalContent.appendChild(header);
        modalContent.appendChild(cartContent);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Cerrar modal al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // Cerrar modal con ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        return modal;
    }

    // --- User State and Authentication ---
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let isLoggedIn = currentUser !== null;

    // DOM Elements for User Dropdown
    const userButton = document.getElementById('userButton');
    const userNameElement = document.getElementById('userName');
    const userDropdownElement = document.getElementById('userDropdown');
    const userDropdownHeader = document.getElementById('userDropdownHeader');
    const logoutBtn = document.getElementById('logoutBtn');

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    function showSuccess(message) {
        console.log("Success: ", message);
        announceToScreenReader(message);
    }

    function setupUserInterface() {
        if (userButton) {
            userButton.addEventListener('click', toggleUserDropdown);
        }
        
        document.addEventListener('click', (e) => {
            if (userButton && userDropdownElement && !userButton.contains(e.target) && !userDropdownElement.contains(e.target)) {
                closeUserDropdown();
            }
        });
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
      
    function updateUserInterface() {
        if (!userNameElement || !userDropdownHeader) return;

        if (isLoggedIn && currentUser) {
            const displayName = currentUser.displayName || currentUser.usuario || 'Usuario';
            userNameElement.textContent = displayName;
            if (userDropdownHeader) {
                userDropdownHeader.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>¡Hola, ${displayName}!</span>
                `;
            }
            
            document.querySelectorAll('.user-only').forEach(el => el.style.display = 'flex');
            document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
            if (logoutBtn) logoutBtn.style.display = 'flex';
            
        } else {
            userNameElement.textContent = 'Iniciar sesión';
            if (userDropdownHeader) {
                userDropdownHeader.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>¡Hola!</span>
                `;
            }
            
            document.querySelectorAll('.user-only').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'flex');
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    }
      
    function toggleUserDropdown() {
        if (!userDropdownElement) return;
        const isOpen = userDropdownElement.classList.contains('show');
        if (isOpen) {
            closeUserDropdown();
        } else {
            openUserDropdown();
        }
    }
      
    function openUserDropdown() {
        if (!userDropdownElement || !userButton) return;
        userDropdownElement.classList.add('show');
        userButton.setAttribute('aria-expanded', 'true');
        announceToScreenReader('Menú de usuario abierto');
    }
      
    function closeUserDropdown() {
        if (!userDropdownElement || !userButton) return;
        userDropdownElement.classList.remove('show');
        userButton.setAttribute('aria-expanded', 'false');
    }
      
    function handleLogout() {
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('currentUser');
        
        showSuccess('Sesión cerrada correctamente');
        
        updateUserInterface();
        closeUserDropdown();
        
        setTimeout(() => {
            if (window.location.pathname.includes('compra.html') || window.location.pathname.includes('InfoNutrimental.html')) {
                 // window.location.href = 'index.html';
            }
        }, 1500);
    }

    // Initialize User Interface parts
    if (document.getElementById('userButton')) {
        setupUserInterface();
        updateUserInterface();
    }  
  
    // DOM Elements from compra.html
    const cartBtn = document.getElementById('btnCarrito');
    const addToCartButton = document.getElementById('btn-add-cart');
    const buyNowButton = document.getElementById('btnCompra');
    const quantityInput = document.getElementById('selectCantidad');
    const btnPlus = document.getElementById('btnPlus');
    const btnMinus = document.getElementById('btnMinus');
    const currentPriceElement = document.getElementById('currentPrice');
    const totalPriceElement = document.getElementById('totalPrice');
    const selectJugo = document.getElementById('selectJugo');
    const imagenJugo = document.getElementById('imagenJugo');
    const productNameElement = document.getElementById('productName');
    const thumbnails = document.querySelectorAll('.thumbnail');

    let currentProductPrice = 0;

    // Event listener para abrir el carrito
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            createCartModal();
        });
    }

    // --- Helper Functions ---
    function showNotification(message, type = 'info', duration = 3500) {
        const notificationArea = document.getElementById('pageNotificationArea') || createPageNotificationArea();
        
        const notification = document.createElement('div');
        notification.className = `page-notification type-${type}`;
        notification.setAttribute('role', 'alert');
        notification.textContent = message;
        
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '12px 25px';
        notification.style.borderRadius = '6px';
        notification.style.zIndex = '1050';
        notification.style.boxShadow = '0 3px 12px rgba(0,0,0,0.15)';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.fontSize = '1rem';

        if (type === 'success') {
            notification.style.backgroundColor = 'var(--btn-compra-bg, #28a745)';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = 'var(--error-color, #dc3545)';
            notification.style.color = 'white';
        } else {
            notification.style.backgroundColor = 'var(--accent-color, #17a2b8)';
            notification.style.color = 'white';
        }

        notificationArea.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, duration);
    }

    function createPageNotificationArea() {
        let area = document.createElement('div');
        area.id = 'pageNotificationArea';
        document.body.appendChild(area);
        return area;
    }

    // --- UI Update Functions ---
    function updateTotalProductPrice() {
        const quantity = parseInt(quantityInput.value) || 0;
        const total = quantity * currentProductPrice;
        if (totalPriceElement) {
            totalPriceElement.textContent = `$${total.toFixed(2)} MXN`;
        }
    }

    function updateProductDetails(name, price, imagePath) {
        if (productNameElement) productNameElement.textContent = name;
        
        const priceValue = parseFloat(price);
        if (currentPriceElement) currentPriceElement.textContent = `$${priceValue.toFixed(2)} MXN`;
        
        if (imagenJugo) {
            imagenJugo.src = imagePath.startsWith('imagenes/') ? imagePath : `imagenes/${imagePath}`;
        }
        
        currentProductPrice = priceValue;
        updateTotalProductPrice();
    }

    // --- Event Handlers ---
    if (btnPlus) {
        btnPlus.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < (parseInt(quantityInput.max) || 99)) {
                quantityInput.value = currentValue + 1;
                updateTotalProductPrice();
            }
        });
    }

    if (btnMinus) {
        btnMinus.addEventListener('click', () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > (parseInt(quantityInput.min) || 1)) {
                quantityInput.value = currentValue - 1;
                updateTotalProductPrice();
            }
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', () => { 
            let value = parseInt(quantityInput.value);
            const minVal = parseInt(quantityInput.min) || 1;
            const maxVal = parseInt(quantityInput.max) || 99;

            if (isNaN(value) || value < minVal) {
                quantityInput.value = minVal;
            } else if (value > maxVal) {
                quantityInput.value = maxVal;
            }
            updateTotalProductPrice();
        });
    }
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            document.querySelector('.thumbnail.active')?.classList.remove('active');
            this.classList.add('active');

            const imageName = this.dataset.image;
            const productName = this.dataset.name;
            const productPrice = this.dataset.price;

            updateProductDetails(productName, productPrice, imageName);

            if (selectJugo) {
                const optionToSelect = Array.from(selectJugo.options).find(opt => opt.value === imageName);
                if (optionToSelect) {
                    selectJugo.value = imageName;
                }
            }
        });
    });

    if (selectJugo) {
        selectJugo.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            const imageName = selectedOption.value;
            const productName = selectedOption.dataset.name;
            const productPrice = selectedOption.dataset.price;

            updateProductDetails(productName, productPrice, imageName);

            document.querySelector('.thumbnail.active')?.classList.remove('active');
            const activeThumbnail = document.querySelector(`.thumbnail[data-image="${imageName}"]`);
            if (activeThumbnail) {
                 activeThumbnail.classList.add('active');
            }
        });
    }

    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            const quantityToAdd = parseInt(quantityInput.value);
            if (quantityToAdd > 0) {
                const selectedOption = selectJugo.options[selectJugo.selectedIndex];
                const product = {
                    id: selectedOption.dataset.id || selectedOption.value,
                    name: selectedOption.dataset.name,
                    price: parseFloat(selectedOption.dataset.price),
                    image: selectedOption.value,
                    quantity: quantityToAdd
                };
                
                addToCart(product);
                const productName = productNameElement.textContent || "Producto seleccionado";
                showNotification(`${quantityToAdd} unidad(es) de ${productName} añadidas al carrito`, 'success');
            } else {
                showNotification('Por favor, selecciona una cantidad mayor a cero.', 'error');
            }
        });
    }

    if (buyNowButton) {
        buyNowButton.addEventListener('click', () => {
            const currentProductQuantity = parseInt(quantityInput.value);
            const currentProductName = productNameElement.textContent;
            const currentItemTotalValue = currentProductQuantity * currentProductPrice;

            if (cart.length === 0) { 
                if (currentProductQuantity <= 0) {
                    showNotification('Por favor, selecciona una cantidad para el artículo que deseas comprar.', 'info');
                    return;
                }
                showPurchaseModal(currentProductQuantity, currentProductName, currentItemTotalValue, true);
            } else { 
                showPurchaseModal(getCartItemCount(), "artículos en tu carrito", getCartTotal(), false);
            }
        });
    }

    function showPurchaseModal(items, itemName, itemPrice, isDirectBuy) {
        const existingModal = document.getElementById('purchaseModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'purchaseModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'purchaseModalTitle');
        Object.assign(modal.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: '1000',
            fontFamily: 'Arial, sans-serif'
        });

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            backgroundColor: 'var(--bg-color, white)', color: 'var(--text-color, #333)',
            padding: '25px 35px', borderRadius: '10px', textAlign: 'center',
            minWidth: '320px', maxWidth: '480px', boxShadow: '0 5px 20px rgba(0,0,0,0.25)'
        });

        const title = document.createElement('h2');
        title.id = 'purchaseModalTitle';
        title.textContent = 'Confirmar Compra';
        title.style.marginBottom = '15px';
        title.style.fontSize = '1.5rem';

        const message = document.createElement('p');
        if (isDirectBuy && itemName && itemPrice !== null) {
             message.textContent = `Estás a punto de comprar ${items} unidad(es) de "${itemName}" por un total de ${itemPrice.toFixed(2)} MXN.`;
        } else {
             message.textContent = `Estás a punto de comprar ${items} artículo(s) de tu carrito por un total de ${itemPrice.toFixed(2)} MXN. ¿Continuar?`;
        }
        message.style.marginBottom = '30px';
        message.style.fontSize = '1.1rem';
        message.style.lineHeight = '1.6';

        const buttonStyles = {
            padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: '600', margin: '0 8px', minWidth: '120px',
            transition: 'background-color 0.3s ease, transform 0.2s ease'
        };

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirmar';
        Object.assign(confirmButton.style, buttonStyles, {
            backgroundColor: 'var(--btn-compra-bg, #D74B4B)', color: 'white'
        });
        confirmButton.onmouseover = () => confirmButton.style.backgroundColor = 'var(--btn-compra-hover, #e67b7b)';
        confirmButton.onmouseout = () => confirmButton.style.backgroundColor = 'var(--btn-compra-bg, #D74B4B)';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
         Object.assign(cancelButton.style, buttonStyles, {
            backgroundColor: 'var(--border-color, #6c757d)', color: 'var(--text-color, #333)'
        });
        cancelButton.onmouseover = () => cancelButton.style.backgroundColor = '#5a6268';
        cancelButton.onmouseout = () => cancelButton.style.backgroundColor = 'var(--border-color, #6c757d)';

        confirmButton.addEventListener('click', () => {
            modal.remove();
            showBankTransactionModal(items, itemName, itemPrice, isDirectBuy);
        });

        cancelButton.addEventListener('click', () => {
            modal.remove();
            showNotification('Compra cancelada.', 'info');
        });
        
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.marginTop = '20px';
        buttonsDiv.appendChild(confirmButton);
        buttonsDiv.appendChild(cancelButton);

        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(buttonsDiv);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        confirmButton.focus();
    }

    function showBankTransactionModal(items, itemName, itemPrice, isDirectBuy) {
        const existingModal = document.getElementById('bankTransactionModal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.id = 'bankTransactionModal';
         Object.assign(modal.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: '1010',
            fontFamily: 'Arial, sans-serif'
        });

        const formContent = document.createElement('form');
        formContent.id = 'bankForm';
        Object.assign(formContent.style, {
            backgroundColor: 'var(--bg-color, white)', color: 'var(--text-color, #333)',
            padding: '30px 40px', borderRadius: '10px', textAlign: 'left',
            minWidth: '350px', maxWidth: '500px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
        });
        formContent.addEventListener('submit', (e) => e.preventDefault());

        const title = document.createElement('h2');
        title.textContent = 'Detalles de Pago';
        title.style.textAlign = 'center';
        title.style.marginBottom = '25px';
        title.style.fontSize = '1.6rem';
        title.style.color = 'var(--accent-color, #0969da)';

        // Input fields
        const fields = [
            { label: 'Nombre del Titular:', id: 'cardHolderName', type: 'text', placeholder: 'Juan Pérez' },
            { label: 'Número de Tarjeta:', id: 'cardNumber', type: 'text', placeholder: '0000 0000 0000 0000', maxLength: 19 },
            { label: 'Fecha de Expiración (MM/AA):', id: 'expiryDate', type: 'text', placeholder: 'MM/AA', maxLength: 5 },
            { label: 'CVV:', id: 'cardCVV', type: 'text', placeholder: '123', maxLength: 3 }
        ];

        fields.forEach(fieldData => {
            const group = document.createElement('div');
            group.style.marginBottom = '18px';

            const label = document.createElement('label');
            label.htmlFor = fieldData.id;
            label.textContent = fieldData.label;
            label.style.display = 'block';
            label.style.marginBottom = '6px';
            label.style.fontWeight = 'bold';
            label.style.fontSize = '0.95rem';

            const input = document.createElement('input');
            input.type = fieldData.type;
            input.id = fieldData.id;
            input.name = fieldData.id;
            input.placeholder = fieldData.placeholder;
            if (fieldData.maxLength) input.maxLength = fieldData.maxLength;
            input.required = true;
            Object.assign(input.style, {
                width: '100%', padding: '10px 12px', borderRadius: '5px',
                border: '1px solid var(--border-color, #ccc)', fontSize: '1rem',
                boxSizing: 'border-box', backgroundColor: 'var(--input-bg, #f9f9f9)',
                color: 'var(--input-text-color, #333)'
            });
            group.appendChild(label);
            group.appendChild(input);
            formContent.appendChild(group);
        });
        
        // Card number formatting
        const cardNumberInput = formContent.querySelector('#cardNumber');
        if(cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/[^\dA-Z]/g, '').replace(/(.{4})/g, '$1 ').trim();
            });
        }
        // Expiry date formatting
        const expiryDateInput = formContent.querySelector('#expiryDate');
        if(expiryDateInput) {
            expiryDateInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value.length > 2) {
                    value = value.substring(0,2) + '/' + value.substring(2,4);
                }
                e.target.value = value;
            });
        }

        const buttonStyles = {
            padding: '12px 24px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontSize: '1rem', fontWeight: '600', margin: '0 8px', minWidth: '120px',
            transition: 'background-color 0.3s ease, transform 0.2s ease'
        };

        const payButton = document.createElement('button');
        payButton.type = 'submit';
        payButton.textContent = 'Pagar Ahora';
        Object.assign(payButton.style, buttonStyles, {
            backgroundColor: 'var(--btn-compra-bg, #D74B4B)', color: 'white'
        });
         payButton.onmouseover = () => payButton.style.backgroundColor = 'var(--btn-compra-hover, #e67b7b)';
         payButton.onmouseout = () => payButton.style.backgroundColor = 'var(--btn-compra-bg, #D74B4B)';

        const cancelBankButton = document.createElement('button');
        cancelBankButton.type = 'button';
        cancelBankButton.textContent = 'Cancelar';
        Object.assign(cancelBankButton.style, buttonStyles, {
            backgroundColor: 'var(--border-color, #6c757d)', color: 'var(--text-color, #333)'
        });
        cancelBankButton.onmouseover = () => cancelBankButton.style.backgroundColor = '#5a6268';
        cancelBankButton.onmouseout = () => cancelBankButton.style.backgroundColor = 'var(--border-color, #6c757d)';

        payButton.addEventListener('click', () => {
            // Basic validation
            let isValid = true;
            formContent.querySelectorAll('input[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red';
                } else {
                    input.style.borderColor = 'var(--border-color, #ccc)';
                }
            });

            if (!isValid) {
                showNotification('Por favor, completa todos los campos de pago.', 'error');
                return;
            }

            // Vaciar carrito después del pago exitoso
            clearCart();
            modal.remove(); 
            showNotification('¡Pago Exitoso! Tu compra ha sido completada y tu carrito ha sido vaciado.', 'success');
            if (quantityInput) {
                quantityInput.value = 1; 
                updateTotalProductPrice(); 
            }
        });

        cancelBankButton.addEventListener('click', () => {
            modal.remove();
            showNotification('Pago cancelado.', 'info');
        });

        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.marginTop = '30px';
        buttonsDiv.style.textAlign = 'center';
        buttonsDiv.appendChild(payButton);
        buttonsDiv.appendChild(cancelBankButton);
        
        formContent.appendChild(title);
        formContent.appendChild(buttonsDiv);
        modal.appendChild(formContent);
        document.body.appendChild(modal);
        formContent.querySelector('#cardHolderName').focus();
    }

    // --- Initial Setup ---
    updateCartCount(); 
    
    const initialThumbnail = document.querySelector('.thumbnail.active') || thumbnails[0];
    if (initialThumbnail) {
         updateProductDetails(
            initialThumbnail.dataset.name,
            initialThumbnail.dataset.price,
            initialThumbnail.dataset.image
        );
        if (selectJugo) selectJugo.value = initialThumbnail.dataset.image;
    } else if (selectJugo && selectJugo.options.length > 0) { 
        const defaultOption = selectJugo.options[selectJugo.selectedIndex || 0];
         updateProductDetails(
            defaultOption.dataset.name,
            defaultOption.dataset.price,
            defaultOption.value
        );
    }
    if(quantityInput && parseInt(quantityInput.value) < 1) quantityInput.value = 1;
    updateTotalProductPrice();

    // --- FUNCIONES GLOBALES PARA USAR EN OTROS ARCHIVOS ---
    window.pennyJuiceCart = {
        addToCart: addToCart,
        removeFromCart: removeFromCart,
        updateCartItemQuantity: updateCartItemQuantity,
        clearCart: clearCart,
        getCartTotal: getCartTotal,
        getCartItemCount: getCartItemCount,
        getCart: () => [...cart],
        openCartModal: createCartModal
    };
});

// Función de validación de sesión
function validarSesion(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    if (!currentUser) {
        alert('Por favor, inicia sesión para continuar.');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para agregar productos al carrito desde otras páginas
function agregarAlCarritoDesdeOtraPagina(productoImagen, nombre, precio, cantidad = 1) {
    // Verificar si ya existe el carrito en localStorage
    let cart = JSON.parse(localStorage.getItem('pennyJuiceCart')) || [];
    
    const product = {
        id: productoImagen,
        name: nombre,
        price: parseFloat(precio),
        image: productoImagen,
        quantity: parseInt(cantidad)
    };
    
    // Buscar si el producto ya existe
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += product.quantity;
    } else {
        cart.push(product);
    }
    
    // Guardar en localStorage
    localStorage.setItem('pennyJuiceCart', JSON.stringify(cart));
    
    // Mostrar notificación si existe la función
    if (typeof showNotification === 'function') {
        showNotification(`${product.quantity} unidad(es) de ${product.name} añadidas al carrito`, 'success');
    }
    
    // Actualizar contador si existe
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        if (totalItems > 0) {
            cartCountElement.style.display = 'flex';
            cartCountElement.classList.add('bounce');
        }
    }
    
    return true;
}

// Función para obtener información del carrito desde otras páginas
function obtenerInfoCarrito() {
    const cart = JSON.parse(localStorage.getItem('pennyJuiceCart')) || [];
    return {
        items: cart,
        totalItems: cart.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
}