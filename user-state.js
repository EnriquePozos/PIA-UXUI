// user-state.js - Gestión global del estado del usuario (simplificado)
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Estado global del usuario
    // ===================================
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let isLoggedIn = currentUser !== null;
    
    // ===================================
    // Referencias a elementos del DOM
    // ===================================
    const userButton = document.getElementById('userButton');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownHeader = document.getElementById('userDropdownHeader');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // ===================================
    // Inicialización
    // ===================================
    function initUserState() {
        if (userButton && userName && userDropdownHeader) {
            setupUserInterface();
            updateUserInterface();
        }
    }
    
    // ===================================
    // Configuración de la interfaz de usuario
    // ===================================
    function setupUserInterface() {
        // Event listener para el botón de usuario
        userButton.addEventListener('click', toggleUserDropdown);
        
        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (userButton && userDropdown && 
                !userButton.contains(e.target) && 
                !userDropdown.contains(e.target)) {
                closeUserDropdown();
            }
        });
        
        // Event listener para logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Cerrar dropdown con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && userDropdown && userDropdown.classList.contains('show')) {
                closeUserDropdown();
                userButton.focus();
            }
        });
        
        // Navegación con teclado en el dropdown
        setupKeyboardNavigation();
    }
    
    function setupKeyboardNavigation() {
        if (!userDropdown) return;
        
        const menuItems = userDropdown.querySelectorAll('[role="menuitem"]');
        
        userButton.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openUserDropdown();
                if (menuItems.length > 0) {
                    menuItems[0].focus();
                }
            }
        });
        
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % menuItems.length;
                        menuItems[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
                        menuItems[prevIndex].focus();
                        break;
                    case 'Escape':
                        closeUserDropdown();
                        userButton.focus();
                        break;
                }
            });
        });
    }
    
    // ===================================
    // Gestión del dropdown
    // ===================================
    function toggleUserDropdown() {
        if (!userDropdown) return;
        
        const isOpen = userDropdown.classList.contains('show');
        
        if (isOpen) {
            closeUserDropdown();
        } else {
            openUserDropdown();
        }
    }
    
    function openUserDropdown() {
        if (!userDropdown) return;
        
        userDropdown.classList.add('show');
        userButton.setAttribute('aria-expanded', 'true');
        announceToScreenReader('Menú de usuario abierto');
    }
    
    function closeUserDropdown() {
        if (!userDropdown) return;
        
        userDropdown.classList.remove('show');
        userButton.setAttribute('aria-expanded', 'false');
    }
    
    // ===================================
    // Actualización de la interfaz
    // ===================================
    function updateUserInterface() {
        if (!userName || !userDropdownHeader) return;
        
        if (isLoggedIn && currentUser) {
            // Usuario logueado - usar el nombre guardado en la base de datos
            const displayName = currentUser.displayName || currentUser.usuario || 'Usuario';
            userName.textContent = displayName;
            userDropdownHeader.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>¡Hola, ${displayName}!</span>
            `;
            
            // Mostrar elementos para usuario logueado
            showUserElements();
            
        } else {
            // Usuario no logueado
            userName.textContent = 'Iniciar sesión';
            userDropdownHeader.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>¡Hola!</span>
            `;
            
            // Mostrar elementos para invitados
            showGuestElements();
        }
    }
    
    function showUserElements() {
        // Mostrar elementos para usuarios logueados
        document.querySelectorAll('.user-only').forEach(el => {
            el.style.display = 'flex';
        });
        
        // Ocultar elementos para invitados
        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    function showGuestElements() {
        // Ocultar elementos para usuarios logueados
        document.querySelectorAll('.user-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Mostrar elementos para invitados
        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = 'flex';
        });
    }
    
    // ===================================
    // Manejo del logout
    // ===================================
    function handleLogout() {
        // Confirmar logout
        const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmed.valueOf() === false) {
            return;
        }
        
        // Limpiar estado
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('currentUser');
        
        // Anunciar acción
        announceToScreenReader('Sesión cerrada correctamente');
        showSuccessMessage('Sesión cerrada correctamente');
        
        // Actualizar interfaz
        updateUserInterface();
        closeUserDropdown();
        
        // Redirigir al inicio después de un delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
    
    // ===================================
    // Utilidades
    // ===================================
    function announceToScreenReader(texto) {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (!lectorActivo) return;
        
        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = "es-ES";
        window.speechSynthesis.speak(speech);
    }
    
    function showSuccessMessage(message) {
        // Crear elemento de éxito temporal
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color, #2da44e);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(successDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // ===================================
    // Funciones para otros scripts
    // ===================================
    function getUserId() {
        return currentUser ? currentUser.idUsuario : null;
    }
    
    function isUserLoggedIn() {
        return isLoggedIn;
    }
    
    // ===================================
    // Actualizar automáticamente cuando cambie el localStorage
    // ===================================
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser') {
            currentUser = e.newValue ? JSON.parse(e.newValue) : null;
            isLoggedIn = currentUser !== null;
            updateUserInterface();
        }
    });
    
    // ===================================
    // Exponer funciones globalmente para otros scripts
    // ===================================
    window.PennyJuiceAuth = {
        getCurrentUser: () => currentUser,
        isLoggedIn: () => isLoggedIn,
        getUserId: getUserId,
        logout: handleLogout,
        updateUI: updateUserInterface
    };
    
    // ===================================
    // CSS adicional para las notificaciones
    // ===================================
    const notificationStyles = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
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
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .success-notification {
            font-family: inherit;
            user-select: none;
            pointer-events: none;
        }
        
        .guest-only {
            display: none;
        }
        
        .user-only {
            display: none;
        }
        
        /* Mejoras en el dropdown del usuario */
        .user-dropdown {
            min-width: 220px;
            max-width: 280px;
        }
        
        .user-dropdown-header {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .user-dropdown-links a,
        .user-dropdown-links button {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        /* Estado de focus mejorado */
        .user-button:focus-visible {
            outline: 3px solid var(--accent-color);
            outline-offset: 2px;
        }
        
        .user-dropdown [role="menuitem"]:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: -2px;
        }
        
        /* Responsive para el dropdown */
        @media (max-width: 768px) {
            .user-dropdown {
                right: -10px;
                min-width: 200px;
            }
            
            .user-name {
                max-width: 80px;
            }
        }
        
        @media (max-width: 480px) {
            .user-dropdown {
                right: -20px;
                left: auto;
                min-width: 180px;
            }
        }
    `;
    
    // Añadir estilos al documento si no existen
    if (!document.querySelector('#user-state-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'user-state-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // ===================================
    // Inicializar
    // ===================================
    initUserState();
    
    // Debug info en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('PennyJuice Auth System loaded');
        console.log('Current user:', currentUser);
        console.log('Is logged in:', isLoggedIn);
    }
});// user-state.js - Gestión global del estado del usuario
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Estado global del usuario
    // ===================================
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let isLoggedIn = currentUser !== null;
    
    // ===================================
    // Referencias a elementos del DOM
    // ===================================
    const userButton = document.getElementById('userButton');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownHeader = document.getElementById('userDropdownHeader');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // ===================================
    // Inicialización
    // ===================================
    function initUserState() {
        if (userButton) {
            setupUserInterface();
            updateUserInterface();
        }
    }
    
    // ===================================
    // Configuración de la interfaz de usuario
    // ===================================
    function setupUserInterface() {
        // Event listener para el botón de usuario
        userButton.addEventListener('click', toggleUserDropdown);
        
        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (userButton && userDropdown && 
                !userButton.contains(e.target) && 
                !userDropdown.contains(e.target)) {
                closeUserDropdown();
            }
        });
        
        // Event listener para logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
        
        // Navegación con teclado en el dropdown
        setupKeyboardNavigation();
    }
    
    function setupKeyboardNavigation() {
        if (!userDropdown) return;
        
        const menuItems = userDropdown.querySelectorAll('[role="menuitem"]');
        
        userButton.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openUserDropdown();
                if (menuItems.length > 0) {
                    menuItems[0].focus();
                }
            }
        });
        
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        const nextIndex = (index + 1) % menuItems.length;
                        menuItems[nextIndex].focus();
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        const prevIndex = (index - 1 + menuItems.length) % menuItems.length;
                        menuItems[prevIndex].focus();
                        break;
                    case 'Escape':
                        closeUserDropdown();
                        userButton.focus();
                        break;
                }
            });
        });
    }
    
    // ===================================
    // Gestión del dropdown
    // ===================================
    function toggleUserDropdown() {
        if (!userDropdown) return;
        
        const isOpen = userDropdown.classList.contains('show');
        
        if (isOpen) {
            closeUserDropdown();
        } else {
            openUserDropdown();
        }
    }
    
    function openUserDropdown() {
        if (!userDropdown) return;
        
        userDropdown.classList.add('show');
        userButton.setAttribute('aria-expanded', 'true');
        announceToScreenReader('Menú de usuario abierto');
    }
    
    function closeUserDropdown() {
        if (!userDropdown) return;
        
        userDropdown.classList.remove('show');
        userButton.setAttribute('aria-expanded', 'false');
    }
    
    // ===================================
    // Actualización de la interfaz
    // ===================================
    function updateUserInterface() {
        if (!userName || !userDropdownHeader) return;
        
        if (isLoggedIn && currentUser) {
            // Usuario logueado
            const displayName = getDisplayName(currentUser);
            userName.textContent = displayName;
            userDropdownHeader.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>¡Hola, ${displayName}!</span>
            `;
            
            // Mostrar elementos para usuario logueado
            showUserElements();
            
        } else {
            // Usuario no logueado
            userName.textContent = 'Iniciar sesión';
            userDropdownHeader.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>¡Hola!</span>
            `;
            
            // Mostrar elementos para invitados
            showGuestElements();
        }
    }
    
    function getDisplayName(user) {
        if (user.fullName) {
            return user.fullName.split(' ')[0]; // Solo primer nombre
        } else if (user.usuario) {
            // Si es email, extraer la parte antes del @
            if (user.usuario.includes('@')) {
                return user.usuario.split('@')[0];
            }
            return user.usuario;
        }
        return 'Usuario';
    }
    
    function showUserElements() {
        // Mostrar elementos para usuarios logueados
        document.querySelectorAll('.user-only').forEach(el => {
            el.style.display = 'flex';
        });
        
        // Ocultar elementos para invitados
        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = 'none';
        });
    }
    
    function showGuestElements() {
        // Ocultar elementos para usuarios logueados
        document.querySelectorAll('.user-only').forEach(el => {
            el.style.display = 'none';
        });
        
        // Mostrar elementos para invitados
        document.querySelectorAll('.guest-only').forEach(el => {
            el.style.display = 'flex';
        });
    }
    
    // ===================================
    // Manejo del logout
    // ===================================
    function handleLogout() {
        // Limpiar estado
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('currentUser');
        
        // Anunciar acción
        announceToScreenReader('Sesión cerrada correctamente');
        showSuccessMessage('Sesión cerrada correctamente');
        
        // Actualizar interfaz
        updateUserInterface();
        closeUserDropdown();
        
        // Redirigir al inicio después de un delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
    
    // ===================================
    // Utilidades
    // ===================================
    function announceToScreenReader(texto) {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (!lectorActivo) return;
        
        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = "es-ES";
        window.speechSynthesis.speak(speech);
    }
    
    function showSuccessMessage(message) {
        // Crear elemento de éxito temporal
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color, #2da44e);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(successDiv);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            successDiv.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // ===================================
    // Verificación de autenticación para páginas protegidas
    // ===================================
    function checkAuthRequired() {
        const protectedPages = ['mi-cuenta.html', 'mis-pedidos.html', 'favoritos.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !isLoggedIn) {
            announceToScreenReader('Esta página requiere iniciar sesión');
            showSuccessMessage('Debes iniciar sesión para acceder a esta página');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }
    
    // ===================================
    // Manejo de carrito (si el usuario está logueado)
    // ===================================
    function getUserId() {
        return currentUser ? currentUser.idUsuario : null;
    }
    
    function isUserLoggedIn() {
        return isLoggedIn;
    }
    
    // ===================================
    // Actualizar automáticamente cuando cambie el localStorage
    // ===================================
    window.addEventListener('storage', function(e) {
        if (e.key === 'currentUser') {
            currentUser = e.newValue ? JSON.parse(e.newValue) : null;
            isLoggedIn = currentUser !== null;
            updateUserInterface();
        }
    });
    
    // ===================================
    // Exponer funciones globalmente para otros scripts
    // ===================================
    window.PennyJuiceAuth = {
        getCurrentUser: () => currentUser,
        isLoggedIn: () => isLoggedIn,
        getUserId: getUserId,
        logout: handleLogout,
        updateUI: updateUserInterface
    };
    
    // ===================================
    // CSS adicional para las notificaciones
    // ===================================
    const notificationStyles = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
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
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .success-notification {
            font-family: inherit;
            user-select: none;
            pointer-events: none;
        }
        
        .guest-only {
            display: none;
        }
        
        .user-only {
            display: none;
        }
        
        /* Mejoras en el dropdown del usuario */
        .user-dropdown {
            min-width: 220px;
            max-width: 280px;
        }
        
        .user-dropdown-header {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .user-dropdown-links a,
        .user-dropdown-links button {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        /* Estado de focus mejorado */
        .user-button:focus-visible {
            outline: 3px solid var(--accent-color);
            outline-offset: 2px;
        }
        
        .user-dropdown [role="menuitem"]:focus {
            outline: 2px solid var(--accent-color);
            outline-offset: -2px;
        }
        
        /* Responsive para el dropdown */
        @media (max-width: 768px) {
            .user-dropdown {
                right: -10px;
                min-width: 200px;
            }
            
            .user-name {
                max-width: 80px;
            }
        }
        
        @media (max-width: 480px) {
            .user-dropdown {
                right: -20px;
                left: auto;
                min-width: 180px;
            }
        }
    `;
    
    // Añadir estilos al documento si no existen
    if (!document.querySelector('#user-state-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'user-state-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // ===================================
    // Inicializar
    // ===================================
    initUserState();
    checkAuthRequired();
    
    // Debug info en desarrollo
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('PennyJuice Auth System loaded');
        console.log('Current user:', currentUser);
        console.log('Is logged in:', isLoggedIn);
    }
});