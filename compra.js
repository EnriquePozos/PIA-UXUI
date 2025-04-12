
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
document.querySelector(".menu").addEventListener("click", () => {
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

//Configuración
document.getElementById("Configuración").addEventListener("focus", () => {
  const popupMenu = document.getElementById("Configuración");
  const textoPopup = popupMenu.innerText;
  leerTexto(textoPopup);
});

//Comprar Header
document.getElementById("btnCompraHeader").addEventListener("focus", () => {
  leerTexto("Comprar");
});
//Seleccionar Jugo(Texto)
document.getElementById("selectJugo").addEventListener("focus", () => {
  leerTexto("Seleccione su jugo");
});
//Seleccionar jugo(Opción)
document.getElementById("selectJugo").addEventListener("change", () => {
  leerTexto("Seleccionó " + selectJugo.value);
});
//Añadir al carrito
document.getElementById("btn-compra").addEventListener("focus", () => {
  leerTexto("Añadir al carrito");
});
//Seleccionar cantidad(Texto)
document.getElementById("selectCantidad").addEventListener("focus", () => {
  leerTexto("Seleccione la cantidad");
});
//Seleccionar cantidad(Opción)
document.getElementById("selectCantidad").addEventListener("change", () => {
  leerTexto("Seleccionó " + selectCantidad.value);
});
//Boton de compra
document.getElementById("btnCompra").addEventListener("focus", () => {
  leerTexto("Comprar");
});
//Lectura en footer
document.getElementById("footer").addEventListener("click", () => {
  const footer = document.getElementById("footer");
  const texto = footer.innerText;
  leerTexto(texto);
});