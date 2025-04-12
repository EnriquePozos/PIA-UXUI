// Seleccionar el elemento de entrada de texto
function leerTexto(texto) {
  const speech = new SpeechSynthesisUtterance(texto);
  speech.lang = "es-ES";
  window.speechSynthesis.speak(speech);
}

//Lector del header      
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
