// Función para leer texto si el lector está activo
function leerTexto(texto) {
  const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
  if (!lectorActivo || !texto) return; // Añadida verificación de texto no vacío

  // Detener cualquier lectura anterior para evitar superposiciones
  window.speechSynthesis.cancel(); 
  
  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-ES";
  window.speechSynthesis.speak(speech);
}

// Event listener para que se ejecute cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
  let isLoggedIn = currentUser !== null;

  const userButton = document.getElementById('userButton');

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

              const logoutBtnElement = document.getElementById('logoutBtn');
              if (logoutBtnElement) {
                  logoutBtnElement.style.display = 'none';
              }
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
              window.location.href = 'index.html';
          }, 1500);
      }

  // Lector del header (si existe un elemento con clase .menu dentro del header)
  const menuHeader = document.querySelector("header .menu"); // Más específico
  if (menuHeader) {
    menuHeader.addEventListener("click", () => {
      leerTexto("Menu de opciones");
    });
  }

  // Leer texto del popupmenu (asumiendo que son enlaces <a> dentro de una lista <ul>)
  // Es más robusto seleccionar los elementos por su ID si están disponibles y son únicos.
  // Los IDs que proporcionaste parecen ser para los elementos del menú.

  const homeLink = document.getElementById("Home");
  if (homeLink) {
    homeLink.addEventListener("focus", () => {
      leerTexto(homeLink.innerText || homeLink.textContent);
    });
  }

  const compraLink = document.getElementById("Compra");
  if (compraLink) {
    compraLink.addEventListener("focus", () => {
      leerTexto(compraLink.innerText || compraLink.textContent);
    });
  }

  const infoNutrimentalLink = document.getElementById("Informacion_Nutrimental");
  if (infoNutrimentalLink) {
    infoNutrimentalLink.addEventListener("focus", () => {
      leerTexto(infoNutrimentalLink.innerText || infoNutrimentalLink.textContent);
    });
  }
  
  // Comprar Header
  const btnCompraHeader = document.getElementById("btnCompraHeader");
  if (btnCompraHeader) {
    btnCompraHeader.addEventListener("focus", () => {
      // Si el botón solo tiene un icono, es mejor darle un texto descriptivo.
      // Podrías usar el 'aria-label' o un 'title' si el innerText no es adecuado.
      leerTexto(btnCompraHeader.innerText || btnCompraHeader.title || "Comprar");
    });
  }

  // Lectura en footer
  // Es mejor ser más específico con el selector o lo que se quiere leer del footer.
  // Leer todo el innerText del footer puede ser muy verboso.
  const footerElement = document.getElementById("footer"); // Asumiendo que tu footer tiene id="footer"
  if (footerElement) {
    // Ejemplo: Leer solo enlaces importantes o un resumen.
    // Aquí mantenemos la lógica original de leer todo el texto, pero considera refinarlo.
    footerElement.addEventListener("click", () => { // Considera 'focusin' para elementos dentro del footer
      const textoFooter = footerElement.innerText || footerElement.textContent;
      leerTexto("Pié de página: " + textoFooter.substring(0, 100) + "..."); // Limitar longitud para brevedad
    });
  }

  // Lectura Comprar YA
  const btnCompraYa = document.getElementById("btn-compra");
  if (btnCompraYa) {
    btnCompraYa.addEventListener("focus", () => {
      leerTexto(btnCompraYa.innerText || btnCompraYa.textContent || "Comprar ya");
    });
  }

  // --- Funcionalidad para tarjetas Flip (Información Nutrimental) ---
  // La funcionalidad de flip ya está en el HTML: onclick="this.classList.toggle('flipped')"
  // No se necesita JavaScript adicional para el *efecto de volteo* en sí.

  // PERO, si quieres que el lector de pantalla anuncie algo al voltear la tarjeta,
  // necesitaríamos añadir lógica aquí.
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', function() {
      // Pequeño retraso para permitir que la animación comience
      setTimeout(() => {
        const isFlipped = this.classList.contains('flipped');
        const frontTitleElement = this.querySelector('.flip-card-front .card-title-overlay');
        const backImage = this.querySelector('.flip-card-back img');
        
        let textToRead = "";

        if (isFlipped) {
          // La tarjeta se ha volteado para mostrar el reverso (info nutrimental)
          const altTextBack = backImage ? backImage.alt : 'Información detallada';
          textToRead = `Mostrando ${altTextBack}.`;
          if (frontTitleElement) {
            textToRead = `${frontTitleElement.textContent}. ${textToRead}`;
          }
        } else {
          // La tarjeta ha vuelto al anverso (imagen del jugo)
          if (frontTitleElement) {
            textToRead = `Mostrando ${frontTitleElement.textContent}. Haz clic para ver información nutrimental.`;
          } else {
            textToRead = "Mostrando portada del jugo. Haz clic para ver información nutrimental.";
          }
        }
        leerTexto(textToRead);
      }, 300); // Ajusta el tiempo si es necesario para que coincida con tu transición
    });

    // Opcional: Leer al enfocar la tarjeta (antes de hacer clic)
    card.addEventListener('focus', function() {
        const frontTitleElement = this.querySelector('.flip-card-front .card-title-overlay');
        let textToRead = "Tarjeta de jugo. ";
        if (frontTitleElement) {
            textToRead += `${frontTitleElement.textContent}. `;
        }
        textToRead += "Haz clic o presiona Enter para voltear y ver detalles.";
        leerTexto(textToRead);
    });

    // Para que las tarjetas sean enfocables y se puedan activar con el teclado:
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); // Prevenir scroll en caso de la barra espaciadora
            this.click(); // Simular clic para activar el volteo y la lectura por clic
        }
    });

  });

  setupUserInterface();
  updateUserInterface();
}); // Fin del DOMContentLoaded