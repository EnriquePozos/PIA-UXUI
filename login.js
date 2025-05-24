// login.js - Sistema completo de autenticación
document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // Referencias a elementos del DOM
    // ===================================
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginPanel = document.getElementById('loginPanel');
    const registerPanel = document.getElementById('registerPanel');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    
    // Elementos del header y dropdown del usuario
    const userButton = document.getElementById('userButton');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownHeader = document.getElementById('userDropdownHeader');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Elementos de los formularios
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const registerEmail = document.getElementById('registerEmail');
    const registerPassword = document.getElementById('registerPassword');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    
    // Configuración de la API
    const API_BASE_URL = 'api/'; // Ajusta según tu estructura
    
    // ===================================
    // Estado del usuario
    // ===================================
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let isLoggedIn = currentUser !== null;
    
    // ===================================
    // Inicialización
    // ===================================
    function init() {
        setupTabNavigation();
        setupFormSubmission();
        setupPasswordToggles();
        setupPasswordStrength();
        setupUserInterface();
        updateUserInterface();
    }
    
    // ===================================
    // Navegación entre tabs (Login/Registro)
    // ===================================
    function setupTabNavigation() {
        loginTab.addEventListener('click', () => switchTab('login'));
        registerTab.addEventListener('click', () => switchTab('register'));
        showRegisterBtn.addEventListener('click', () => switchTab('register'));
        showLoginBtn.addEventListener('click', () => switchTab('login'));
    }
    
    function switchTab(tab) {
        if (tab === 'login') {
            // Activar tab de login
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginTab.setAttribute('aria-selected', 'true');
            registerTab.setAttribute('aria-selected', 'false');
            
            // Mostrar panel de login
            loginPanel.classList.add('active');
            registerPanel.classList.remove('active');
            
            // Focus en primer campo
            loginEmail.focus();
            
            announceToScreenReader('Formulario de inicio de sesión seleccionado');
        } else {
            // Activar tab de registro
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerTab.setAttribute('aria-selected', 'true');
            loginTab.setAttribute('aria-selected', 'false');
            
            // Mostrar panel de registro
            registerPanel.classList.add('active');
            loginPanel.classList.remove('active');
            
            // Focus en primer campo
            firstName.focus();
            
            announceToScreenReader('Formulario de registro seleccionado');
        }
    }
    
    // ===================================
    // Manejo de formularios
    // ===================================
    function setupFormSubmission() {
        loginForm.addEventListener('submit', handleLogin);
        registerForm.addEventListener('submit', handleRegister);
        
        // Validación en tiempo real para el email de registro
        if (registerEmail) {
            let validationTimeout;
            registerEmail.addEventListener('input', function() {
                const email = this.value.trim();
                
                // Limpiar timeout anterior
                clearTimeout(validationTimeout);
                
                // Solo validar si el email tiene formato válido
                if (email && isValidEmail(email)) {
                    // Esperar 800ms después de que el usuario deje de escribir
                    validationTimeout = setTimeout(() => {
                        checkEmailAvailability(email);
                    }, 800);
                } else {
                    // Limpiar mensaje de disponibilidad si el email no es válido
                    clearEmailAvailabilityMessage();
                }
            });
        }
    }
    
    // ===================================
    // Validación de disponibilidad de email
    // ===================================
    async function checkEmailAvailability(email) {
        try {
            const response = await fetch(`${API_BASE_URL}verificar_usuario_controller.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: email
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                if (data.exists) {
                    showEmailUnavailable();
                } else {
                    showEmailAvailable();
                }
            }
        } catch (error) {
            console.error('Error verificando disponibilidad:', error);
            // No mostrar error al usuario para no interrumpir la experiencia
        }
    }
    
    function showEmailAvailable() {
        clearError('registerEmailError');
        const emailInput = registerEmail.parentElement;
        emailInput.classList.add('available');
        emailInput.classList.remove('unavailable');
        
        // Crear o actualizar mensaje de disponibilidad
        let availabilityMsg = document.querySelector('.email-availability');
        if (!availabilityMsg) {
            availabilityMsg = document.createElement('span');
            availabilityMsg.className = 'email-availability';
            registerEmail.parentElement.parentElement.appendChild(availabilityMsg);
        }
        
        availabilityMsg.textContent = '✓ Email disponible';
        availabilityMsg.className = 'email-availability available';
    }
    
    function showEmailUnavailable() {
        const emailInput = registerEmail.parentElement;
        emailInput.classList.add('unavailable');
        emailInput.classList.remove('available');
        
        // Crear o actualizar mensaje de disponibilidad
        let availabilityMsg = document.querySelector('.email-availability');
        if (!availabilityMsg) {
            availabilityMsg = document.createElement('span');
            availabilityMsg.className = 'email-availability';
            registerEmail.parentElement.parentElement.appendChild(availabilityMsg);
        }
        
        availabilityMsg.textContent = '✗ Este email ya está registrado';
        availabilityMsg.className = 'email-availability unavailable';
    }
    
    function clearEmailAvailabilityMessage() {
        const availabilityMsg = document.querySelector('.email-availability');
        if (availabilityMsg) {
            availabilityMsg.remove();
        }
        
        const emailInput = registerEmail.parentElement;
        emailInput.classList.remove('available', 'unavailable');
    }
    
    async function handleLogin(e) {
        e.preventDefault();
        
        const submitBtn = loginForm.querySelector('.submit-button');
        const email = loginEmail.value.trim();
        const password = loginPassword.value;
        
        // Validación básica
        if (!email || !password) {
            showError('emailError', 'Por favor completa todos los campos');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('emailError', 'Por favor ingresa un email válido');
            return;
        }
        
        // Limpiar errores previos
        clearErrors();
        
        // Mostrar estado de carga
        setLoadingState(submitBtn, true);
        
        try {
            const response = await fetch(`${API_BASE_URL}iniciar_sesion_controller.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: email,
                    contraseña: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Login exitoso
                currentUser = {
                    idUsuario: data.data.idUsuario,
                    usuario: data.data.usuario,
                    email: email,
                    displayName: data.data.usuario // Usar el usuario de la BD como nombre a mostrar
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                isLoggedIn = true;
                
                announceToScreenReader(`Bienvenido ${currentUser.displayName}`);
                showSuccess('Inicio de sesión exitoso. Redirigiendo...');
                
                updateUserInterface();
                
                // Redirigir después de un breve delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } else {
                // Error en login
                showError('passwordError', data.message || 'Credenciales incorrectas');
                announceToScreenReader('Error en el inicio de sesión');
            }
            
        } catch (error) {
            console.error('Error en login:', error);
            showError('passwordError', 'Error de conexión. Intenta nuevamente.');
            announceToScreenReader('Error de conexión');
        } finally {
            setLoadingState(submitBtn, false);
        }
    }
    
    async function handleRegister(e) {
        e.preventDefault();
        
        const submitBtn = registerForm.querySelector('.submit-button');
        const name = firstName.value.trim();
        const surname = lastName.value.trim();
        const email = registerEmail.value.trim();
        const password = registerPassword.value;
        const acceptTerms = document.getElementById('acceptTerms').checked;
        
        // Validación
        if (!validateRegistrationForm(name, surname, email, password, acceptTerms)) {
            return;
        }
        
        // Limpiar errores previos
        clearErrors();
        
        // Mostrar estado de carga
        setLoadingState(submitBtn, true);
        
        try {
            // Crear usuario completo (usando email como usuario)
            const fullUser = `${name} ${surname}`;
            
            const response = await fetch(`${API_BASE_URL}registrar_usuario_controller.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: email, // Usamos email como usuario único
                    contraseña: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                announceToScreenReader('Registro exitoso. Iniciando sesión automáticamente...');
                showSuccess('¡Registro exitoso! Iniciando sesión...');
                
                // Esperar un momento antes de hacer login automático
                setTimeout(async () => {
                    await autoLogin(email, password, fullUser);
                }, 1000);
                
            } else {
                showError('registerEmailError', data.message || 'Error en el registro');
                announceToScreenReader('Error en el registro');
            }
            
        } catch (error) {
            console.error('Error en registro:', error);
            showError('registerEmailError', 'Error de conexión. Intenta nuevamente.');
            announceToScreenReader('Error de conexión');
        } finally {
            setLoadingState(submitBtn, false);
        }
    }
    
    // ===================================
    // Login automático después del registro
    // ===================================
    async function autoLogin(email, password, fullName) {
        try {
            const response = await fetch(`${API_BASE_URL}iniciar_sesion_controller.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    usuario: email,
                    contraseña: password
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                currentUser = {
                    idUsuario: data.data.idUsuario,
                    usuario: data.data.usuario,
                    email: email,
                    fullName: fullName
                };
                
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                isLoggedIn = true;
                
                announceToScreenReader(`¡Bienvenido ${fullName}!`);
                showSuccess('¡Bienvenido! Redirigiendo...');
                
                updateUserInterface();
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            }
        } catch (error) {
            console.error('Error en auto-login:', error);
            showSuccess('Registro exitoso. Por favor inicia sesión manualmente.');
            switchTab('login');
        }
    }
    
    // ===================================
    // Validaciones
    // ===================================
    function validateRegistrationForm(name, surname, email, password, acceptTerms) {
        let isValid = true;
        
        if (!name) {
            showError('firstNameError', 'El nombre es requerido');
            isValid = false;
        }
        
        if (!surname) {
            showError('lastNameError', 'El apellido es requerido');
            isValid = false;
        }
        
        if (!email) {
            showError('registerEmailError', 'El email es requerido');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('registerEmailError', 'Por favor ingresa un email válido');
            isValid = false;
        } else {
            // Verificar si hay mensaje de email no disponible
            const unavailableMsg = document.querySelector('.email-availability.unavailable');
            if (unavailableMsg) {
                showError('registerEmailError', 'Este email ya está registrado');
                isValid = false;
            }
        }
        
        if (!password) {
            showError('registerPasswordError', 'La contraseña es requerida');
            isValid = false;
        } else if (password.length < 6) {
            showError('registerPasswordError', 'La contraseña debe tener al menos 6 caracteres');
            isValid = false;
        }
        
        if (!acceptTerms) {
            showError('termsError', 'Debes aceptar los términos y condiciones');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // ===================================
    // Gestión de errores y mensajes
    // ===================================
    function showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    function clearError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    function clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.textContent = '';
            element.classList.remove('show');
        });
        
        // También limpiar mensajes de disponibilidad
        clearEmailAvailabilityMessage();
    }
    
    function showSuccess(message) {
        // Crear elemento de éxito temporal
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    function setLoadingState(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
    
    // ===================================
    // Interfaz de usuario
    // ===================================
    function setupUserInterface() {
        // Dropdown del usuario
        if (userButton) {
            userButton.addEventListener('click', toggleUserDropdown);
        }
        
        // Cerrar dropdown al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
                closeUserDropdown();
            }
        });
        
        // Logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
    
    function updateUserInterface() {
        if (isLoggedIn && currentUser) {
            // Usuario logueado - mostrar nombre del usuario
            const displayName = currentUser.displayName || currentUser.usuario || 'Usuario';
            userName.textContent = displayName;
            userDropdownHeader.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>¡Hola, ${displayName}!</span>
            `;
            
            // Mostrar elementos para usuario logueado
            document.querySelectorAll('.user-only').forEach(el => {
                el.style.display = 'flex';
            });
            
            // Ocultar elementos para invitados
            document.querySelectorAll('.guest-only').forEach(el => {
                el.style.display = 'none';
            });
            
        } else {
            // Usuario no logueado
            userName.textContent = 'Iniciar sesión';
            userDropdownHeader.innerHTML = `
                <i class="fas fa-user-circle"></i>
                <span>¡Hola!</span>
            `;
            
            // Ocultar elementos para usuario logueado
            document.querySelectorAll('.user-only').forEach(el => {
                el.style.display = 'none';
            });
            
            // Mostrar elementos para invitados
            document.querySelectorAll('.guest-only').forEach(el => {
                el.style.display = 'flex';
            });
        }
    }
    
    function toggleUserDropdown() {
        const isOpen = userDropdown.classList.contains('show');
        
        if (isOpen) {
            closeUserDropdown();
        } else {
            openUserDropdown();
        }
    }
    
    function openUserDropdown() {
        userDropdown.classList.add('show');
        userButton.setAttribute('aria-expanded', 'true');
        announceToScreenReader('Menú de usuario abierto');
    }
    
    function closeUserDropdown() {
        userDropdown.classList.remove('show');
        userButton.setAttribute('aria-expanded', 'false');
    }
    
    function handleLogout() {
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('currentUser');
        
        announceToScreenReader('Sesión cerrada correctamente');
        showSuccess('Sesión cerrada correctamente');
        
        updateUserInterface();
        closeUserDropdown();
        
        // Redirigir al inicio
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
    
    // ===================================
    // Funcionalidades adicionales
    // ===================================
    function setupPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('bi-eye');
                    icon.classList.add('bi-eye-slash');
                    this.setAttribute('aria-label', 'Ocultar contraseña');
                } else {
                    input.type = 'password';
                    icon.classList.remove('bi-eye-slash');
                    icon.classList.add('bi-eye');
                    this.setAttribute('aria-label', 'Mostrar contraseña');
                }
            });
        });
    }
    
    function setupPasswordStrength() {
        if (registerPassword) {
            registerPassword.addEventListener('input', function() {
                const password = this.value;
                const strengthBar = document.querySelector('.strength-bar');
                
                if (strengthBar) {
                    const strength = getPasswordStrength(password);
                    
                    strengthBar.className = 'strength-bar';
                    if (strength.score >= 3) {
                        strengthBar.classList.add('strong');
                    } else if (strength.score >= 2) {
                        strengthBar.classList.add('medium');
                    } else if (strength.score >= 1) {
                        strengthBar.classList.add('weak');
                    }
                }
            });
        }
    }
    
    function getPasswordStrength(password) {
        let score = 0;
        
        if (password.length >= 8) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        return { score };
    }
    
    // ===================================
    // Función para anuncios del lector de pantalla
    // ===================================
    function announceToScreenReader(texto) {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (!lectorActivo) return;
        
        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = "es-ES";
        window.speechSynthesis.speak(speech);
    }
    
    // ===================================
    // Redirección automática si ya está logueado
    // ===================================
    function checkAutoRedirect() {
        // Si el usuario ya está logueado y está en la página de login, redirigir
        if (isLoggedIn && window.location.pathname.includes('login.html')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }
    
    // ===================================
    // CSS adicional para animaciones y validaciones
    // ===================================
    const additionalStyles = `
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
        
        .success-message {
            animation: slideInRight 0.3s ease !important;
        }
        
        .error-message.show {
            display: block;
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        }
        
        .user-only {
            display: none;
        }
        
        .guest-only {
            display: none;
        }
        
        /* Estilos para validación de email */
        .email-availability {
            font-size: 0.8125rem;
            margin-top: 0.25rem;
            font-weight: 500;
            display: block;
        }
        
        .email-availability.available {
            color: var(--success-color, #2da44e);
        }
        
        .email-availability.unavailable {
            color: var(--error-color, #cf222e);
        }
        
        .input-wrapper.available .form-input {
            border-color: var(--success-color, #2da44e);
        }
        
        .input-wrapper.unavailable .form-input {
            border-color: var(--error-color, #cf222e);
        }
        
        .input-wrapper.available .form-input:focus {
            box-shadow: 0 0 0 3px rgba(45, 164, 78, 0.1);
        }
        
        .input-wrapper.unavailable .form-input:focus {
            box-shadow: 0 0 0 3px rgba(207, 34, 46, 0.1);
        }
    `;
    
    // Añadir estilos al documento
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    // ===================================
    // Inicializar todo
    // ===================================
    init();
    checkAutoRedirect();
});