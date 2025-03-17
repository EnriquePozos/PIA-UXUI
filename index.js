// Obtén el ícono del menú y el aside del menú
document.querySelector('.menu').addEventListener('click', function() {
    // Abre el menú lateral
    console.log('le dio click al menu');
    document.getElementById('popupMenu').style.left = '0';
});

// Cierra el menú cuando se haga clic en el fondo (fuera del aside)
document.querySelector('#popupMenu').addEventListener('click', function(e) {
    // Verifica si el clic fue fuera del contenido del menú
    if (e.target === this) {
        document.getElementById('popupMenu').style.left = '-100%';
    }
});
