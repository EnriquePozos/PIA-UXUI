// Seleccionar el elemento de entrada de texto
function leerTexto(texto) {
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-ES";
    window.speechSynthesis.speak(speech);
}
  
  // Ejemplo de uso:
document.getElementById("btnCompraHeader").addEventListener("click", () => {
    leerTexto("Botón de compra");
});