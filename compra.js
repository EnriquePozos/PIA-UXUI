// Agregar este código al final del DOMContentLoaded en compra.html

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
    // ... tu código existente de temas ...
    
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
  // --- User State and Authentication (Example) ---
    // This part should align with your actual user authentication logic
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let isLoggedIn = currentUser !== null;

    // DOM Elements for User Dropdown
    const userButton = document.getElementById('userButton');
    const userNameElement = document.getElementById('userName'); // Renamed to avoid conflict
    const userDropdownElement = document.getElementById('userDropdown'); // Renamed
    const userDropdownHeader = document.getElementById('userDropdownHeader');
    const logoutBtn = document.getElementById('logoutBtn');
    // const successMessage = document.getElementById('successMessage'); // If you have a dedicated success message element

    function announceToScreenReader(message) {
        // Basic implementation for screen reader announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only'; // Make sure this class is defined in your CSS
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    }

    function showSuccess(message) { // General success message display
        // This can be a more sophisticated notification if you have one
        // For now, using a simple alert or a custom notification like in compra.js
        // To reuse compra.js showNotification, you'd need to expose it globally or duplicate
        console.log("Success: ", message); // Placeholder
        // Example: if (typeof window.showGlobalNotification === 'function') window.showGlobalNotification(message, 'success');
        // else alert(message);
        announceToScreenReader(message); // Announce it
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
        if (!userNameElement || !userDropdownHeader) return; // Elements not found

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
            if (logoutBtn) logoutBtn.style.display = 'flex'; // Ensure logout button is visible
            
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
        // announceToScreenReader('Menú de usuario cerrado'); // Optional: announce on close
    }
      
    function handleLogout() {
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('currentUser');
        
        showSuccess('Sesión cerrada correctamente'); // This will also announce
        
        updateUserInterface();
        closeUserDropdown();
        
        // Optional: Redirect to home or login page
        setTimeout(() => {
            if (window.location.pathname.includes('compra.html') || window.location.pathname.includes('InfoNutrimental.html')) {
                 // window.location.href = 'index.html'; // Or login.html
            }
        }, 1500);
    }

    // Initialize User Interface parts
    if (document.getElementById('userButton')) { // Check if user elements are on the current page
        setupUserInterface();
        updateUserInterface();
    }  
  
  // DOM Elements from compra.html
    const cartCountElement = document.getElementById('cartCount');
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

    let cartItemCount = 0;
    let currentProductPrice = 0;

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
        } else { // info
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
    function updateCartNotification() {
        if (cartCountElement) {
            cartCountElement.textContent = cartItemCount;
            if (cartItemCount > 0) {
                cartCountElement.style.display = 'flex';
                cartCountElement.classList.remove('bounce');
                void cartCountElement.offsetWidth; 
                cartCountElement.classList.add('bounce');
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

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
                cartItemCount += quantityToAdd;
                updateCartNotification();
                const productName = productNameElement.textContent || "Producto seleccionado";
                showNotification(`${quantityToAdd} unidad(es) de ${productName} añadidas al carrito. Total: ${cartItemCount}`, 'success');
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

            if (cartItemCount === 0) { 
                if (currentProductQuantity <= 0) {
                    showNotification('Por favor, selecciona una cantidad para el artículo que deseas comprar.', 'info');
                    return;
                }
                showPurchaseModal(currentProductQuantity, currentProductName, currentItemTotalValue, true);
            } else { 
                showPurchaseModal(cartItemCount, "artículos en tu carrito", null, false);
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
             message.textContent = `Estás a punto de comprar ${items} unidad(es) de "${itemName}" por un total de $${itemPrice.toFixed(2)} MXN.`;
        } else {
             message.textContent = `Estás a punto de comprar ${items} artículo(s) de tu carrito. ¿Continuar?`;
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
        // Hover/active effects could be added via CSS classes for cleaner JS
        confirmButton.onmouseover = () => confirmButton.style.backgroundColor = 'var(--btn-compra-hover, #e67b7b)';
        confirmButton.onmouseout = () => confirmButton.style.backgroundColor = 'var(--btn-compra-bg, #D74B4B)';


        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
         Object.assign(cancelButton.style, buttonStyles, {
            backgroundColor: 'var(--border-color, #6c757d)', color: 'var(--text-color, #333)' // Ensuring text is visible on themed background
        });
        cancelButton.onmouseover = () => cancelButton.style.backgroundColor = '#5a6268'; // Darken gray
        cancelButton.onmouseout = () => cancelButton.style.backgroundColor = 'var(--border-color, #6c757d)';


        confirmButton.addEventListener('click', () => {
            modal.remove(); // Remove this initial purchase modal
            showBankTransactionModal(items, itemName, itemPrice, isDirectBuy); // Show bank modal
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
        // Basic modal styling (similar to purchaseModal)
         Object.assign(modal.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: '1010', // Higher z-index
            fontFamily: 'Arial, sans-serif'
        });

        const formContent = document.createElement('form');
        formContent.id = 'bankForm';
        Object.assign(formContent.style, {
            backgroundColor: 'var(--bg-color, white)', color: 'var(--text-color, #333)',
            padding: '30px 40px', borderRadius: '10px', textAlign: 'left',
            minWidth: '350px', maxWidth: '500px', boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
        });
        formContent.addEventListener('submit', (e) => e.preventDefault()); // Prevent actual submission

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
        
        // Card number formatting (simple version)
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
            // Basic validation: check if all fields are filled
            let isValid = true;
            formContent.querySelectorAll('input[required]').forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'red'; // Highlight empty fields
                } else {
                    input.style.borderColor = 'var(--border-color, #ccc)';
                }
            });

            if (!isValid) {
                showNotification('Por favor, completa todos los campos de pago.', 'error');
                return;
            }

            cartItemCount = 0; 
            updateCartNotification();
            modal.remove(); 
            showNotification('¡Pago Exitoso! Tu compra ha sido completada y tu carrito vaciado.', 'success');
            quantityInput.value = 1; 
            updateTotalProductPrice(); 
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
        formContent.appendChild(buttonsDiv); // Add buttons before this line if you want them above form fields
        modal.appendChild(formContent);
        document.body.appendChild(modal);
        formContent.querySelector('#cardHolderName').focus(); // Focus on the first input field
    }

    // --- Initial Setup ---
    updateCartNotification(); 
    
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
});


function validarSesion(){
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    if (!currentUser) {
        alert('Por favor, inicia sesión para continuar.');
        window.location.href = 'login.html'; // Redirigir a la página de inicio de sesión
        return false;
    }
    return true;
}
