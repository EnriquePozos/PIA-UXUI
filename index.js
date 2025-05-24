// index.js - Sistema completo de lector de pantalla para todos los elementos


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



document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // Sistema de Lector de Pantalla Base
    // ===================================
    function leerTexto(texto, opciones = {}) {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (!lectorActivo || !texto) return;
        
        // Cancelar lectura anterior si es prioritaria
        if (opciones.prioritario) {
            window.speechSynthesis.cancel();
        }
        
        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = "es-ES";
        speech.rate = opciones.velocidad || 1.0;
        speech.volume = opciones.volumen || 1.0;
        
        window.speechSynthesis.speak(speech);
    }

    // ===================================
    // Configuración de Lectores para Navegación Principal
    // ===================================
    
    // Skip link
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('focus', () => {
            leerTexto('Enlace para saltar al contenido principal. Presiona Enter para saltar');
        });
    }

    // Botón de menú
    const menuButton = document.getElementById('menuButton');
    if (menuButton) {
        menuButton.addEventListener('focus', () => {
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
            leerTexto(`Botón de menú de navegación. ${isExpanded ? 'Menú abierto' : 'Menú cerrado'}. Presiona Enter o Espacio para ${isExpanded ? 'cerrar' : 'abrir'} el menú`);
        });

        menuButton.addEventListener('click', () => {
            setTimeout(() => {
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                leerTexto(isExpanded ? 'Menú de navegación abierto' : 'Menú de navegación cerrado', { prioritario: true });
            }, 100);
        });
    }

    // Logo
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('focus', () => {
            leerTexto('Logo de Penny Juice. Enlace a la página de inicio. Presiona Enter para ir al inicio');
        });
    }

    // ===================================
    // Menú Lateral (Popup Menu)
    // ===================================
    const popupMenu = document.getElementById('popupMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    
    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('focus', () => {
            leerTexto('Botón cerrar menú. Presiona Enter o Escape para cerrar');
        });
    }

    // Items del menú
    const menuItems = {
        'Home': 'Página de inicio. Estás aquí',
        'Compra': 'Página de compra de jugos',
        'Informacion_Nutrimental': 'Información nutrimental de los productos'
    };

    Object.entries(menuItems).forEach(([id, descripcion]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('focus', function() {
                const texto = this.querySelector('span')?.textContent || this.textContent;
                const esActivo = this.classList.contains('active');
                leerTexto(`${texto}. ${descripcion}${esActivo ? '. Página actual' : ''}. Presiona Enter para navegar`);
            });

            elemento.addEventListener('click', function() {
                const texto = this.querySelector('span')?.textContent || this.textContent;
                leerTexto(`Navegando a ${texto}`, { prioritario: true });
            });
        }
    });

    // ===================================
    // Sección de Usuario
    // ===================================
    const userButton = document.getElementById('userButton');
    const userName = document.getElementById('userName');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userButton) {
        userButton.addEventListener('focus', () => {
            const isExpanded = userButton.getAttribute('aria-expanded') === 'true';
            const userText = userName?.textContent || 'Usuario';
            leerTexto(`Menú de cuenta de usuario: ${userText}. ${isExpanded ? 'Menú abierto' : 'Menú cerrado'}. Presiona Enter para ${isExpanded ? 'cerrar' : 'abrir'} el menú`);
        });

        userButton.addEventListener('click', () => {
            setTimeout(() => {
                const isExpanded = userButton.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    leerTexto('Menú de usuario abierto. Usa Tab o las flechas para navegar por las opciones', { prioritario: true });
                    
                    // Enfocar el primer elemento del menú
                    const firstMenuItem = userDropdown.querySelector('[role="menuitem"]:not([style*="display: none"])');
                    if (firstMenuItem) {
                        setTimeout(() => firstMenuItem.focus(), 100);
                    }
                } else {
                    leerTexto('Menú de usuario cerrado', { prioritario: true });
                }
            }, 100);
        });
    }

    // Items del dropdown de usuario
    const userDropdownItems = userDropdown?.querySelectorAll('[role="menuitem"]');
    userDropdownItems?.forEach(item => {
        item.addEventListener('focus', function() {
            const texto = this.textContent.trim();
            const icono = this.querySelector('i');
            
            if (icono?.classList.contains('fa-sign-in-alt')) {
                leerTexto(`${texto}. Presiona Enter para ir a la página de inicio de sesión`);
            } else if (icono?.classList.contains('fa-user-plus')) {
                leerTexto(`${texto}. Presiona Enter para crear una cuenta nueva`);
            } else if (icono?.classList.contains('fa-sign-out-alt')) {
                leerTexto(`${texto}. Presiona Enter para cerrar tu sesión actual`);
            }
        });
    });

    // Botón de compra del header
    const btnCompraHeader = document.getElementById('btnCompraHeader');
    if (btnCompraHeader) {
        btnCompraHeader.addEventListener('focus', () => {
            leerTexto('Botón Comprar. Presiona Enter para ir a la página de compra');
        });

        btnCompraHeader.addEventListener('click', () => {
            leerTexto('Navegando a la página de compra', { prioritario: true });
        });
    }

    // Botón de configuración
    const openSettingsBtn = document.getElementById('openSettingsBtn');
    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('focus', () => {
            leerTexto('Botón de configuración. Presiona Enter para abrir las preferencias de apariencia y accesibilidad');
        });

        openSettingsBtn.addEventListener('click', () => {
            leerTexto('Abriendo configuración', { prioritario: true });
        });
    }

    // ===================================
    // Contenido Principal - Productos
    // ===================================
    const featuredTitle = document.getElementById('featured-title');
    if (featuredTitle) {
        // Anunciar cuando se carga la página
        setTimeout(() => {
            leerTexto('Bienvenido a Penny Juice. Página de inicio con productos destacados');
        }, 500);
    }

    // Configurar productos existentes (estáticos)
    function configurarProductos() {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach((card, index) => {
            // Hacer la tarjeta enfocable si no lo es
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            const titulo = card.querySelector('.product-title')?.textContent;
            const descripcion = card.querySelector('.product-description')?.textContent;
            const botonMas = card.querySelector('.btn-view-more');
            
            card.addEventListener('focus', () => {
                leerTexto(`Producto ${index + 1} de ${productCards.length}: ${titulo}. ${descripcion}. Presiona Enter para ver más información`);
            });

            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    botonMas?.click();
                }
            });

            if (botonMas) {
                botonMas.addEventListener('click', () => {
                    leerTexto(`Abriendo información detallada de ${titulo}`, { prioritario: true });
                });

                botonMas.addEventListener('focus', () => {
                    leerTexto(`Botón ver más información sobre ${titulo}`);
                });
            }
        });
    }

    // Configurar productos iniciales
    configurarProductos();

    // Botón principal COMPRA YA
    const btnCompraYa = document.getElementById('btn-compra');
    if (btnCompraYa) {
        btnCompraYa.addEventListener('focus', () => {
            leerTexto('Botón principal ¡Compra Ya!. Presiona Enter para ir a la página de compra y ver todos nuestros jugos');
        });

        btnCompraYa.addEventListener('click', (e) => {
            if (e.currentTarget === btnCompraYa) {
                leerTexto('Navegando a la página de compra', { prioritario: true });
            }
        });
    }

    // ===================================
    // Footer
    // ===================================
    const footerTitle = document.querySelector('.footer-title');
    if (footerTitle) {
        footerTitle.addEventListener('focus', () => {
            leerTexto('Sección de pie de página');
        });
    }

    // Enlaces del footer
    const footerLinks = document.querySelectorAll('#footer a');
    footerLinks.forEach(link => {
        link.addEventListener('focus', function() {
            const texto = this.querySelector('span')?.textContent || this.textContent;
            const icono = this.querySelector('i');
            
            if (icono?.classList.contains('fa-phone')) {
                leerTexto(`Teléfono de contacto: ${texto}. Presiona Enter para llamar`);
            } else if (icono?.classList.contains('fa-envelope')) {
                leerTexto(`Correo electrónico: ${texto}. Presiona Enter para enviar un correo`);
            } else if (icono?.classList.contains('fa-map-marker-alt')) {
                leerTexto(`Enlace de ubicación. Presiona Enter para ver la dirección en Google Maps`);
            } else if (icono?.classList.contains('fab')) {
                const redSocial = texto || 'red social';
                leerTexto(`Síguenos en ${redSocial}. Presiona Enter para abrir en una nueva ventana`);
            }
        });
    });

    // ===================================
    // Modal de Configuración
    // ===================================
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('focus', () => {
            leerTexto('Botón cerrar configuración. Presiona Enter o Escape para cerrar');
        });
    }

    // Sincronización con sistema
    const syncOption = document.getElementById('syncOption');
    if (syncOption) {
        syncOption.addEventListener('focus', () => {
            const isChecked = syncOption.getAttribute('aria-checked') === 'true';
            leerTexto(`Sincronizar con sistema. ${isChecked ? 'Activado' : 'Desactivado'}. Presiona Espacio para ${isChecked ? 'desactivar' : 'activar'}`);
        });

        syncOption.addEventListener('click', () => {
            setTimeout(() => {
                const isChecked = syncOption.getAttribute('aria-checked') === 'true';
                leerTexto(isChecked ? 'Sincronización con sistema activada' : 'Sincronización con sistema desactivada', { prioritario: true });
            }, 100);
        });
    }

    // Opciones de tema
    const themeOptions = {
        'lightTheme': 'Tema claro',
        'darkTheme': 'Tema oscuro',
        'grayTheme': 'Escala de grises para mejor contraste',
        'daltonTheme': 'Tema optimizado para daltonismo'
    };

    Object.entries(themeOptions).forEach(([id, nombre]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.addEventListener('focus', function() {
                const isSelected = this.getAttribute('aria-checked') === 'true';
                leerTexto(`${nombre}. ${isSelected ? 'Seleccionado' : 'No seleccionado'}. Presiona Enter o Espacio para seleccionar este tema`);
            });

            elemento.addEventListener('click', () => {
                setTimeout(() => {
                    leerTexto(`${nombre} aplicado`, { prioritario: true });
                }, 100);
            });
        }
    });

    // Toggle de lector de pantalla
    const screenReaderToggle = document.getElementById('screenReaderToggle');
    if (screenReaderToggle) {
        screenReaderToggle.addEventListener('focus', () => {
            const isActive = screenReaderToggle.getAttribute('aria-checked') === 'true';
            leerTexto(`Modo lector de pantalla. ${isActive ? 'Activado' : 'Desactivado'}. Presiona Espacio para ${isActive ? 'desactivar' : 'activar'}`);
        });

        screenReaderToggle.addEventListener('click', function() {
            setTimeout(() => {
                const isActive = this.getAttribute('aria-checked') === 'true';
                if (isActive) {
                    leerTexto('Modo lector de pantalla activado. Todos los elementos de la página serán anunciados', { prioritario: true });
                } else {
                    // Este mensaje se lee antes de desactivarse
                    const speech = new SpeechSynthesisUtterance('Modo lector de pantalla desactivado');
                    speech.lang = "es-ES";
                    window.speechSynthesis.speak(speech);
                }
            }, 100);
        });
    }

    // ===================================
    // Navegación con teclado mejorada
    // ===================================
    
    // Detectar navegación con Tab
    let ultimoElementoEnfocado = null;
    
    document.addEventListener('focusin', (e) => {
        const elemento = e.target;
        
        // Evitar anuncios duplicados
        if (elemento === ultimoElementoEnfocado) return;
        ultimoElementoEnfocado = elemento;
        
        // Anunciar elementos sin manejadores específicos
        if (!elemento.hasAttribute('data-lector-configurado')) {
            const role = elemento.getAttribute('role');
            const ariaLabel = elemento.getAttribute('aria-label');
            const texto = elemento.textContent?.trim();
            
            if (ariaLabel) {
                leerTexto(ariaLabel);
            } else if (texto && texto.length < 100) {
                if (elemento.tagName === 'BUTTON') {
                    leerTexto(`Botón: ${texto}. Presiona Enter para activar`);
                } else if (elemento.tagName === 'A') {
                    leerTexto(`Enlace: ${texto}. Presiona Enter para seguir`);
                }
            }
        }
    });

    // ===================================
    // Atajos de teclado
    // ===================================
    document.addEventListener('keydown', (e) => {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (!lectorActivo) return;
        
        // Ctrl + Alt + H: Leer encabezados
        if (e.ctrlKey && e.altKey && e.key === 'h') {
            e.preventDefault();
            const encabezados = document.querySelectorAll('h1, h2, h3');
            let textoEncabezados = 'Encabezados en la página: ';
            encabezados.forEach((h, i) => {
                textoEncabezados += `${h.tagName}: ${h.textContent}. `;
            });
            leerTexto(textoEncabezados, { prioritario: true });
        }
        
        // Ctrl + Alt + L: Leer enlaces
        if (e.ctrlKey && e.altKey && e.key === 'l') {
            e.preventDefault();
            const enlaces = document.querySelectorAll('a:not([aria-hidden="true"])');
            leerTexto(`Hay ${enlaces.length} enlaces en la página`, { prioritario: true });
        }
        
        // Escape: Detener lectura
        if (e.key === 'Escape') {
            window.speechSynthesis.cancel();
        }
    });

    // ===================================
    // Anunciar cuando la página está lista
    // ===================================
    window.addEventListener('load', () => {
        const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
        if (lectorActivo) {
            setTimeout(() => {
                leerTexto('Página de inicio de Penny Juice cargada completamente. Usa Tab para navegar por los elementos');
            }, 1000);
        }
    });

    // ===================================
    // Gestión de estado del usuario (heredado)
    // ===================================
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    let isLoggedIn = currentUser !== null;

    function setupUserInterface() {
        if (userButton) {
            userButton.addEventListener('click', toggleUserDropdown);
        }
        
        document.addEventListener('click', (e) => {
            if (userButton && userDropdown && 
                !userButton.contains(e.target) && 
                !userDropdown.contains(e.target)) {
                closeUserDropdown();
            }
        });
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
      
    function updateUserInterface() {
        if (!userName || !userDropdown) return;

        const userDropdownHeader = document.getElementById('userDropdownHeader');
        
        if (isLoggedIn && currentUser) {
            const displayName = currentUser.displayName || currentUser.usuario || 'Usuario';
            userName.textContent = displayName;
            if (userDropdownHeader) {
                userDropdownHeader.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>¡Hola, ${displayName}!</span>
                `;
            }
            
            document.querySelectorAll('.user-only').forEach(el => el.style.display = 'flex');
            document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'none');
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) logoutBtn.style.display = 'flex';
            
        } else {
            userName.textContent = 'Iniciar sesión';
            if (userDropdownHeader) {
                userDropdownHeader.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>¡Hola!</span>
                `;
            }
            
            document.querySelectorAll('.user-only').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.guest-only').forEach(el => el.style.display = 'flex');
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) logoutBtn.style.display = 'none';
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
    }
      
    function closeUserDropdown() {
        userDropdown.classList.remove('show');
        userButton.setAttribute('aria-expanded', 'false');
    }
      
    function handleLogout() {
        currentUser = null;
        isLoggedIn = false;
        localStorage.removeItem('currentUser');
        
        leerTexto('Sesión cerrada correctamente', { prioritario: true });
        
        updateUserInterface();
        closeUserDropdown();
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // ===================================
    // Carga dinámica de productos (si se implementa)
    // ===================================
    const productosContainer = document.querySelector('section.featured-products ul.productos');
    const API_URL_PRODUCTOS = 'api/productos_controller.php';

    async function cargarProductosDestacados() {
        try {
            leerTexto('Cargando productos destacados');
            
            const response = await fetch(API_URL_PRODUCTOS);
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const productos = await response.json();
            
            if (productos && productos.length > 0) {
                productosContainer.innerHTML = '';
                
                productos.forEach((producto, index) => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('producto');
                    
                    const nombreProducto = producto.nombreProducto || "Producto";
                    const descripcion = producto.descripcion || "";
                    const multimedia = producto.multimedia || "default.png";
                    
                    listItem.innerHTML = `
                        <article class="product-card" tabindex="0">
                            <div class="product-image-wrapper">
                                <img src="imagenes/${multimedia}" alt="${nombreProducto} - ${descripcion}" loading="lazy" width="300" height="300">
                                <div class="product-overlay">
                                    <button class="btn-view-more" aria-label="Ver más información sobre ${nombreProducto}">
                                        <i class="fas fa-plus" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="product-info">
                                <h3 class="product-title">${nombreProducto}</h3>
                                <p class="product-description">${descripcion}</p>
                            </div>
                        </article>
                    `;
                    
                    productosContainer.appendChild(listItem);
                });
                
                // Reconfigurar lectores para los nuevos productos
                configurarProductos();
                
                leerTexto(`Se cargaron ${productos.length} productos destacados`);
            }
        } catch (error) {
            console.error('Error al cargar productos:', error);
            // Si falla la carga dinámica, mantener los productos estáticos
        }
    }

    // ===================================
    // Inicialización
    // ===================================
    if (document.getElementById('userButton')) {
        setupUserInterface();
        updateUserInterface();
    }
    
    // Intentar cargar productos dinámicamente (comentado por defecto)
    // cargarProductosDestacados();
});