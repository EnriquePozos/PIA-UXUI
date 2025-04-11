
    const selectJugo = document.getElementById('selectJugo');
    const imagenJugo = document.getElementById('imagenJugo');

    selectJugo.addEventListener('change', function () {
        const nombreImagen = selectJugo.value;
        imagenJugo.src = 'imagenes/' + nombreImagen;
    });

    function leerTexto(texto) {
        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = "es-ES";
        window.speechSynthesis.speak(speech);
      }
      
      // Ejemplo de uso:
    //   document.getElementById("btn-compra").addEventListener("mouseover", () => {
    //     leerTexto("Añadir al carrito");
    //   });