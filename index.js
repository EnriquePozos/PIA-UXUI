// Seleccionar el elemento de entrada de texto
function leerTexto(texto) {
  const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
  if (!lectorActivo) return;
  
  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-ES";
  window.speechSynthesis.speak(speech);
}

//Lector del header      
//Lector de Menu
// document.querySelector(".menu").addEventListener("click", () => {
//   leerTexto("Menu de opciones");
// });
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
//Comprar Header
document.getElementById("btnCompraHeader").addEventListener("focus", () => {
  leerTexto("Comprar");
});

//Lectura en footer
document.getElementById("footer").addEventListener("click", () => {
  const footer = document.getElementById("footer");
  const texto = footer.innerText;
  leerTexto(texto);
});
//Lectura Comprar YA
document.getElementById("btn-compra").addEventListener("focus", () => {
  leerTexto("Comprar ya");
});



// Asegúrate de que este script se ejecute después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Selecciona el contenedor donde se mostrarán los productos
    const productosContainer = document.querySelector('section.featured-products ul.productos');

    // URL de tu controlador PHP
    // Ajusta la ruta según dónde hayas guardado tu archivo PHP.
    // Si está en una carpeta 'api' en la raíz de tu proyecto:
    const API_URL_PRODUCTOS = 'api/productos_controller.php'; 

    // Verificar si el contenedor de productos existe en la página
    if (!productosContainer) {
        console.error('Error: No se encontró el contenedor de productos (ul.productos) en esta página.');
        return; // No continuar si el contenedor no está
    }

    async function cargarProductosDestacados() {
        try {
            // Realizar la petición fetch al controlador PHP
            const response = await fetch(API_URL_PRODUCTOS);

            // Verificar si la respuesta de la red fue exitosa
            if (!response.ok) {
                // Intentar obtener más detalles del error si el servidor los envió en JSON
                let errorData = { message: `Error HTTP: ${response.status} - ${response.statusText}` };
                try {
                    const errorJson = await response.json();
                    if (errorJson && errorJson.message) {
                        errorData.message = errorJson.message;
                    }
                } catch (e) {
                    // No hacer nada si el cuerpo del error no es JSON
                }
                throw new Error(errorData.message);
            }

            // Convertir la respuesta a JSON
            const productos = await response.json();

            // Limpiar el contenedor de productos por si había contenido estático
            productosContainer.innerHTML = '';

            // Verificar si se recibieron productos
            if (productos && productos.length > 0) {
                productos.forEach(producto => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('producto'); // Clase de tu HTML original

                    // Asegurarse de que los campos existen en el objeto producto
                    const nombreProducto = producto.nombreProducto || "Nombre no disponible";
                    const multimedia = producto.multimedia || "default.png"; // Imagen por defecto si no hay
                    const descripcion = producto.descripcion || `Descubre más sobre ${nombreProducto}`;
                    const altText = `${nombreProducto} - ${descripcion}`;

                    // Crear el HTML interno para cada tarjeta de producto
                    listItem.innerHTML = `
                        <article class="product-card">
                            <div class="product-image-wrapper">
                                <img src="imagenes/${multimedia}" alt="${altText}" loading="lazy" width="300" height="300">
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
                    // Añadir el nuevo elemento a la lista de productos
                    productosContainer.appendChild(listItem);
                });
            } else {
                // Mostrar un mensaje si no hay productos
                productosContainer.innerHTML = '<li><p>No hay productos destacados disponibles en este momento.</p></li>';
            }

        } catch (error) {
            console.error('Error al cargar los productos destacados:', error);
            // Mostrar un mensaje de error en la página
            productosContainer.innerHTML = `<li><p>Ocurrió un error al cargar los productos: ${error.message}. Por favor, inténtalo más tarde.</p></li>`;
        }
    }

    // Llamar a la función para cargar los productos cuando la página esté lista
    cargarProductosDestacados();
});
