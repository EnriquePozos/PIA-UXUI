document.addEventListener('DOMContentLoaded', function () {
    const screenReaderToggle = document.getElementById('screenReaderToggle');

    // Leer estado guardado
    const lectorGuardado = localStorage.getItem('lectorActivo') === 'true';
    screenReaderToggle.setAttribute('aria-pressed', lectorGuardado);
    screenReaderToggle.textContent = lectorGuardado ? 'Desactivar modo lector de pantalla' : 'Activar modo lector de pantalla';

    screenReaderToggle.addEventListener('click', function () {
        const isActive = this.getAttribute('aria-pressed') === 'true';
        const nuevoEstado = !isActive;

        // Guardar en localStorage
        localStorage.setItem('lectorActivo', nuevoEstado);

        // Cambiar estado visual
        this.setAttribute('aria-pressed', nuevoEstado);
        this.textContent = nuevoEstado ? 'Desactivar modo lector de pantalla' : 'Activar modo lector de pantalla';

        if (nuevoEstado) {
            leerTexto("Modo lector de pantalla activado");
        } else {
            desactivado("Modo lector de pantalla desactivado");
            //window.speechSynthesis.cancel(); // Por si hay algo hablando
        }
    });
});

//Lector en pantalla
function leerTexto(texto) {
    const lectorActivo = localStorage.getItem('lectorActivo') === 'true';
    if (!lectorActivo) return;
  
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-ES";
    window.speechSynthesis.speak(speech); 
}

function desactivado(texto) {
    const speech = new SpeechSynthesisUtterance(texto);
    speech.lang = "es-ES";
    window.speechSynthesis.speak(speech); // Por si hay algo hablando
}