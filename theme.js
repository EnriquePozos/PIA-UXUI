// Sistema completo de gestión de temas, menú y accesibilidad
document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Sistema de Menú Hamburguesa
    // ===================================
    const menuButton = document.getElementById('menuButton');
    const popupMenu = document.getElementById('popupMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const menuLinks = popupMenu.querySelectorAll('a');
    let menuOpen = false;

    // Función para abrir menú
    function openMenu() {
        menuOpen = true;
        popupMenu.classList.add('active');
        menuButton.setAttribute('aria-expanded', 'true');
        closeMenuBtn.focus();
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        // Añadir listener para cerrar con click fuera
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);
        
        // Anunciar para lectores de pantalla
        announceToScreenReader('Menú de navegación abierto');
    }

    // Función para cerrar menú
    function closeMenu() {
        menuOpen = false;
        popupMenu.classList.remove('active');
        menuButton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        
        // Remover listener de click fuera
        document.removeEventListener('click', handleClickOutside);
        
        // Devolver focus al botón del menú
        menuButton.focus();
        
        // Anunciar para lectores de pantalla
        announceToScreenReader('Menú de navegación cerrado');
    }

    // Toggle menú
    function toggleMenu() {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Manejar click fuera del menú
    function handleClickOutside(e) {
        if (!popupMenu.contains(e.target) && !menuButton.contains(e.target)) {
            closeMenu();
        }
    }

    // Event listeners para el menú
    menuButton.addEventListener('click', toggleMenu);
    closeMenuBtn.addEventListener('click', closeMenu);

    // Cerrar menú con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });

    // Navegación con teclado en el menú
    menuLinks.forEach((link, index) => {
        link.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (index + 1) % menuLinks.length;
                menuLinks[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (index - 1 + menuLinks.length) % menuLinks.length;
                menuLinks[prevIndex].focus();
            }
        });
    });

    // ===================================
    // Sistema de Lector de Pantalla
    // ===================================
    let speechQueue = [];
    let isSpeaking = false;

    function announceToScreenReader(texto) {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (!lectorActivo) return;

        // Añadir a la cola
        speechQueue.push(texto);
        processSpeechQueue();
    }

    function processSpeechQueue() {
        if (isSpeaking || speechQueue.length === 0) return;

        isSpeaking = true;
        const texto = speechQueue.shift();
        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = "es-ES";
        speech.rate = 1.1; // Velocidad ligeramente más rápida
        
        speech.onend = () => {
            isSpeaking = false;
            processSpeechQueue(); // Procesar siguiente en la cola
        };

        window.speechSynthesis.speak(speech);
    }

    function stopSpeaking() {
        speechQueue = [];
        isSpeaking = false;
        window.speechSynthesis.cancel();
    }

    // Configuración del toggle de lector de pantalla
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    if (screenReaderToggle) {
        const lectorGuardado = localStorage.getItem('lectorActivo') === 'true';
        screenReaderToggle.setAttribute('aria-checked', lectorGuardado);
        
        if (lectorGuardado) {
            screenReaderToggle.classList.add('active');
            document.body.setAttribute('data-screen-reader', 'true');
        }

        screenReaderToggle.addEventListener('click', function () {
            const isActive = this.getAttribute('aria-checked') === 'true';
            const nuevoEstado = !isActive;

            localStorage.setItem('lectorActivo', nuevoEstado);
            this.setAttribute('aria-checked', nuevoEstado);
            
            if (nuevoEstado) {
                this.classList.add('active');
                document.body.setAttribute('data-screen-reader', 'true');
                announceToScreenReader("Modo lector de pantalla activado");
            } else {
                this.classList.remove('active');
                document.body.removeAttribute('data-screen-reader');
                stopSpeaking();
                // Usar una instancia separada para el mensaje de desactivación
                const farewell = new SpeechSynthesisUtterance("Modo lector de pantalla desactivado");
                farewell.lang = "es-ES";
                window.speechSynthesis.speak(farewell);
            }
        });

        // Soporte para activación con teclado
        screenReaderToggle.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // ===================================
    // Modal de Configuración
    // ===================================
    const openBtn = document.getElementById('openSettingsBtn');
    const modal = document.getElementById('settingsModal');
    const closeBtn = document.getElementById('closeSettingsBtn');
    let previousFocusElement = null;

    function openModal() {
        previousFocusElement = document.activeElement;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            modal.classList.add('show');
            closeBtn.focus();
            announceToScreenReader('Ventana de configuración abierta');
        }, 10);

        // Trap focus dentro del modal
        modal.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modal.classList.add('hidden');
            if (previousFocusElement) {
                previousFocusElement.focus();
            }
            announceToScreenReader('Ventana de configuración cerrada');
        }, 400);

        modal.removeEventListener('keydown', trapFocus);
    }

    // Trap focus dentro del modal
    function trapFocus(e) {
        if (e.key !== 'Tab') return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Cerrar modal con Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ===================================
    // Sistema de Temas Mejorado
    // ===================================
    const htmlElement = document.documentElement;
    const syncOption = document.getElementById('syncOption');
    const themeOptions = {
        light: document.getElementById('lightTheme'),
        dark: document.getElementById('darkTheme'),
        grayscale: document.getElementById('grayTheme'),
        colorblind: document.getElementById('daltonTheme')
    };
    const syncDescription = document.getElementById('syncDescription');
    
    let currentTheme = localStorage.getItem('theme') || 'light';
    let syncWithSystem = localStorage.getItem('syncWithSystem') === 'true';

    // Función para detectar preferencia del sistema
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    // Función para aplicar tema
    function applyTheme(theme) {
        // Remover tema anterior
        htmlElement.removeAttribute('data-theme');
        
        // Aplicar nuevo tema
        if (theme !== 'light') {
            htmlElement.setAttribute('data-theme', theme);
        }
        
        // Actualizar UI
        Object.keys(themeOptions).forEach(key => {
            if (themeOptions[key]) {
                const isSelected = key === theme;
                themeOptions[key].setAttribute('aria-checked', isSelected);
                if (isSelected) {
                    themeOptions[key].classList.add('selected');
                } else {
                    themeOptions[key].classList.remove('selected');
                }
            }
        });
        
        currentTheme = theme;
        announceToScreenReader(`Tema ${getThemeName(theme)} aplicado`);
    }

    // Obtener nombre legible del tema
    function getThemeName(theme) {
        const names = {
            light: 'claro',
            dark: 'oscuro',
            grayscale: 'escala de grises',
            colorblind: 'optimizado para daltonismo'
        };
        return names[theme] || theme;
    }

    // Función para actualizar sincronización
    function updateSyncState(enabled) {
        syncWithSystem = enabled;
        localStorage.setItem('syncWithSystem', enabled);
        
        if (syncOption) {
            syncOption.setAttribute('aria-checked', enabled);
            if (enabled) {
                syncOption.classList.add('active');
                syncDescription.textContent = 'Penny Juice se adaptará automáticamente a la configuración de tu sistema.';
                applyTheme(getSystemTheme());
            } else {
                syncOption.classList.remove('active');
                syncDescription.textContent = 'Selecciona manualmente tu tema preferido.';
            }
        }
    }

    // Inicializar tema
    if (syncWithSystem) {
        updateSyncState(true);
    } else {
        applyTheme(currentTheme);
    }

    // Event listener para sincronización
    if (syncOption) {
        syncOption.addEventListener('click', function() {
            updateSyncState(!syncWithSystem);
        });

        // Soporte para teclado
        syncOption.addEventListener('keydown', function(e) {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // Event listeners para opciones de tema
    Object.keys(themeOptions).forEach(theme => {
        const option = themeOptions[theme];
        if (option) {
            option.addEventListener('click', function() {
                if (syncWithSystem) {
                    updateSyncState(false);
                }
                localStorage.setItem('theme', theme);
                applyTheme(theme);
            });

            // Navegación con teclado
            option.addEventListener('keydown', function(e) {
                if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();
                    this.click();
                } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    focusNextTheme(theme);
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    focusPreviousTheme(theme);
                }
            });
        }
    });

    // Funciones de navegación de temas
    function focusNextTheme(currentTheme) {
        const themes = Object.keys(themeOptions);
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        themeOptions[themes[nextIndex]]?.focus();
    }

    function focusPreviousTheme(currentTheme) {
        const themes = Object.keys(themeOptions);
        const currentIndex = themes.indexOf(currentTheme);
        const prevIndex = (currentIndex - 1 + themes.length) % themes.length;
        themeOptions[themes[prevIndex]]?.focus();
    }

    // Detectar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        if (syncWithSystem) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // ===================================
    // Funcionalidad adicional para botones
    // ===================================
    
    // Botón de compra del header
    const btnCompraHeader = document.getElementById('btnCompraHeader');
    if (btnCompraHeader) {
        btnCompraHeader.addEventListener('click', function() {
            announceToScreenReader('Navegando a la página de compra');
            window.location.href = 'compra.html';
        });
    }

    // Botón de compra principal
    const btnCompra = document.getElementById('btn-compra');
    if (btnCompra) {
        btnCompra.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') {
                e.preventDefault();
                announceToScreenReader('Navegando a la página de compra');
                window.location.href = 'compra.html';
            }
        });
    }

    // ===================================
    // Mejorar accesibilidad de productos
    // ===================================
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        // Hacer las cards navegables con teclado
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const button = card.querySelector('.btn-view-more');
                if (button) button.click();
            }
        });

        // Anunciar producto al recibir focus
        card.addEventListener('focus', function() {
            const title = card.querySelector('.product-title')?.textContent;
            const description = card.querySelector('.product-description')?.textContent;
            if (title) {
                announceToScreenReader(`Producto ${index + 1} de ${productCards.length}: ${title}. ${description || ''}`);
            }
        });
    });

    // ===================================
    // Utilidades de depuración (solo en desarrollo)
    // ===================================
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Penny Juice - Sistema de temas y accesibilidad cargado');
        console.log('Tema actual:', currentTheme);
        console.log('Sincronización con sistema:', syncWithSystem);
        console.log('Lector de pantalla:', localStorage.getItem('lectorActivo') === 'true');
    }
});