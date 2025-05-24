
const selectJugo = document.getElementById('selectJugo');
const imagenJugo = document.getElementById('imagenJugo');

selectJugo.addEventListener('change', function () {
  const nombreImagen = selectJugo.value;
  imagenJugo.src = 'imagenes/' + nombreImagen;
});

//Lector en pantalla
function leerTexto(texto) {
  const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
  if (!lectorActivo) return;

  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-ES";
  window.speechSynthesis.speak(speech);
}
//Lector de Menu
document.querySelector(".menu-button").addEventListener("click", () => {
  leerTexto("Menu de opciones");
});
//Leer texto del popupmenu
//Home
document.getElementById("Home").addEventListener("focus", () => {
  const popupMenu = document.getElementById("Home");
  const textoPopup = popupMenu.innerText;
  leerTexto(textoPopup);
});
//Compra
document.getElementById("Compra").addEventListener("focus", () => {
  const popupMenu = document.getElementById("Compra");
  const textoPopup = popupMenu.innerText;
  leerTexto(textoPopup);
});
//Informacion nutrimental
document.getElementById("Informacion_Nutrimental").addEventListener("focus", () => {
  const popupMenu = document.getElementById("Informacion_Nutrimental");
  const textoPopup = popupMenu.innerText;
  leerTexto(textoPopup);
});

// //Comprar Header
// document.getElementById("btnCompraHeader").addEventListener("focus", () => {
//   leerTexto("Comprar");
// });
// //Seleccionar Jugo(Texto)
// document.getElementById("selectJugo").addEventListener("focus", () => {
//   leerTexto("Seleccione su jugo");
// });
// //Seleccionar jugo(Opción)
// document.getElementById("selectJugo").addEventListener("change", () => {
//   leerTexto("Seleccionó " + selectJugo.value);
// });
// //Añadir al carrito
// document.getElementById("btn-compra").addEventListener("focus", () => {
//   leerTexto("Añadir al carrito");
// });
// //Seleccionar cantidad(Texto)
// document.getElementById("selectCantidad").addEventListener("focus", () => {
//   leerTexto("Seleccione la cantidad");
// });
// //Seleccionar cantidad(Opción)
// document.getElementById("selectCantidad").addEventListener("change", () => {
//   leerTexto("Seleccionó " + selectCantidad.value);
// });
// //Boton de compra
// document.getElementById("btnCompra").addEventListener("focus", () => {
//   leerTexto("Comprar");
// });
//Lectura en footer
document.getElementById("footer").addEventListener("click", () => {
  const footer = document.getElementById("footer");
  const texto = footer.innerText;
  leerTexto(texto);
});


function validarSesion() {
  const usuarioRaw = localStorage.getItem('currentUser');
  const usuario = usuarioRaw ? JSON.parse(usuarioRaw) : null;

  if (!usuario || !usuario.idUsuario) {
    // Usuario no válido o no logueado
    window.location.href = 'login.html';
  }
}

document.addEventListener('DOMContentLoaded', function () {

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
          //announceToScreenReader('Menú de usuario abierto');
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

  //validarSesion();
  setupUserInterface();
  updateUserInterface();
});